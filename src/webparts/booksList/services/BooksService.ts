import SPContextHelper from '../helpers/SPContextHelper';
import { IBook } from '../types/IBooksList';

import m from '../helpers/Mappings';
import { IItemAddResult, IItemUpdateResult } from '@pnp/sp/items';

export interface IBooksService {
    getAll(): Promise<IBook[]>;
    deleteItem(id:number): Promise<void>;
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
                    autoreLibro: i[m.spFieldAutoreLibro],
                    annoPubblicazione: Number(i[m.spFieldAnnoPubblicazione]),
                    pagineLibro: Number(i[m.spFieldPagineLibro]),
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
    
    public createItem = async(book:IBook): Promise<IBook> => {
        try{
            const b = {
                [m.spFieldTitolo]: book.titolo,
                [m.spFieldAutoreLibro] : book.autoreLibro,
                [m.spFieldPagineLibro] : Number(book.pagineLibro),
                [m.spFieldAnnoPubblicazione] : Number(book.annoPubblicazione),
                [m.spFieldAsString] : book.asString
            }
            const result:IItemAddResult = await SPContextHelper.getContext().web.lists.getByTitle(m.spListBooksList).items.add(b)
            return result.item as unknown as IBook
        }catch(e){
            console.error(e)
        }
    }
    
    public updateItem = async(book:IBook): Promise<IBook> => {
        try{
            const result:IItemUpdateResult = await SPContextHelper.getContext().web.lists.getByTitle(m.spListBooksList).items.getById(book.id).update({
                [m.spFieldTitolo]: book.titolo,
                [m.spFieldAutoreLibro] : book.autoreLibro,
                [m.spFieldPagineLibro] : Number(book.pagineLibro),
                [m.spFieldAnnoPubblicazione] : Number(book.annoPubblicazione),
                [m.spFieldAsString] : book.asString
            })
            return result.item as unknown as IBook
        }catch(e){
            console.error(e)
        }
    }
    
}

const booksService = new BooksService()
export default booksService