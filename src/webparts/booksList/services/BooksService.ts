import SPContextHelper from '../helpers/SPContextHelper';
import { IBook } from '../types/IBooksList';

import m from '../helpers/Mappings';
import { IItemAddResult, IItemUpdateResult } from '@pnp/sp/items';
import { toNumber } from 'lodash';

export interface IBooksService {
    getAll(): Promise<IBook[]>;
    deleteItem(id:number): Promise<any>;
    createItem(book:IBook): Promise<IBook>;
    updateItem(book:IBook): Promise<IBook>;
}

export class BooksService extends SPContextHelper implements IBooksService {
    
    public getAll = async ():Promise<IBook[]> => {
        try{
            const result = await SPContextHelper.getContext().web.lists.getByTitle(m.spListBooksList).items()
            return result.map<IBook>(i=>{
                return {
                    id: i[m.spFieldId],
                    titolo: i[m.spFieldTitolo],
                    annoPubblicazione: i[m.spFieldAnnoPubblicazione],
                    pagineLibro: i[m.spFieldPagineLibro],
                    autoreLibro: i[m.spFieldAutoreLibro],
                    asString:i[m.spFieldAsString]
                }
            })
        }catch(e){
            console.error(e)
        }
    }

    public deleteItem = async(id:number): Promise<void> => {
        try{
            await SPContextHelper.getContext().web.lists.getByTitle(m.spListBooksList).items.getById(id).recycle()
        }catch(e){
            console.error(e)
        }
    }
    
    public createItem = async(book:IBook): Promise<any> => {
        try{
            const b = {
                [m.spFieldTitolo]: book.titolo,
                [m.spFieldAutoreLibro] : book.autoreLibro,
                [m.spFieldPagineLibro] : toNumber(book.pagineLibro),
                [m.spFieldAnnoPubblicazione] : toNumber(book.annoPubblicazione),
                [m.spFieldAsString] : book.asString
            }
            const result:IItemAddResult = await SPContextHelper.getContext().web.lists.getByTitle(m.spListBooksList).items.add(b)
            return result.item
        }catch(e){
            console.error(e)
        }
    }
    
    public updateItem = async(book:IBook): Promise<any> => {
        try{
            const result:IItemUpdateResult = await SPContextHelper.getContext().web.lists.getByTitle(m.spListBooksList).items.getById(book.id).update({
                [m.spFieldTitolo]: book.titolo,
                [m.spFieldAutoreLibro] : book.autoreLibro,
                [m.spFieldPagineLibro] : toNumber(book.pagineLibro),
                [m.spFieldAnnoPubblicazione] : toNumber(book.annoPubblicazione),
                [m.spFieldAsString] : book.asString
            })
            return result.item
        }catch(e){
            console.error(e)
        }
    }
    
}

const booksService = new BooksService()
export default booksService