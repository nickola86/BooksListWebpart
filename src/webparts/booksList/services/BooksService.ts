import SPContextHelper from '../helpers/SPContextHelper';
import { IBook } from '../types/IBooksList';

const LIST_NAME = "BooksList"

export interface IBooksService {
    getAll(): Promise<IBook[]>;
}

export class BooksService extends SPContextHelper implements IBooksService { 
    public getAll(): Promise<IBook[]> {
        try{
            return SPContextHelper.getContext().web.lists.getByTitle(LIST_NAME).items()
        }catch(e){
            console.error(e)
        }
    }
}

const booksService = new BooksService()
export default booksService