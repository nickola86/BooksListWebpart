import { IBook } from '../types/IBooksList';
import _books from './mock/books.json';

const BooksService = {
    fetch: ():Promise<IBook[]> => {
        return new Promise((resolve)=>{
            //Restituisco i libri "risolvendo" la promessa dopo un timeout di 5 secondi
            setTimeout(()=>{
                resolve(_books)
            },5000)
        });
    }
}

export default BooksService;