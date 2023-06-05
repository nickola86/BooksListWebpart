import SPContextHelper from '../helpers/SPContextHelper';
import { IBook } from '../types/IBooksList';

import m from '../helpers/Mappings';
import { IItemAddResult, IItemUpdateResult } from '@pnp/sp/items';

export interface IBooksService {
    getAll(): Promise<IBook[]>;
    deleteItem(id:number): Promise<any>;
    getRecycledItems(): Promise<string[]>;
    createItem(book:IBook): Promise<IBook>;
    updateItem(book:IBook): Promise<IBook>;
    restoreFromRecycle(id:string): Promise<any>;
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
                    autoreLibro: i[m.spFieldAutoreLibro]
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
    
    public getRecycledItems = async ():Promise<string[]> => {
        try{
            return (await SPContextHelper.getContext().web.recycleBin()).map(r=>r.Id)
        }catch(e){
            console.error(e)
        }
    } 
    
    public createItem = async(book:IBook): Promise<any> => {
        try{
            const result:IItemAddResult = await SPContextHelper.getContext().web.lists.getByTitle(m.spListBooksList).items.add(book)
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
                [m.spFieldPagineLibro] : book.pagineLibro,
                [m.spFieldAnnoPubblicazione] : book.annoPubblicazione
            })
            return result.item
        }catch(e){
            console.error(e)
        }
    }
    public restoreFromRecycle = async(id: string): Promise<any> => {
        try{
            const rbItem = await SPContextHelper.getContext().web.recycleBin.getById(id);
            await rbItem.restore()
        }catch(e){
            console.error(e)
        }
    }
}

const booksService = new BooksService()
export default booksService