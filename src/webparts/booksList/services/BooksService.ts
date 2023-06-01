import { IBook } from '../types/IBooksList';
import { spfi, SPFI, SPFx as spSPFx } from "@pnp/sp";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

const LIST_NAME = "BooksList"

export interface IBooksService {
    fetch(): Promise<IBook[]>;
}

export class BooksService implements IBooksService {
        
    private _sp: SPFI;

    constructor(webPartContext: WebPartContext){
        try{
            console.log("webPartContext", webPartContext)
            this._sp = spfi().using(spSPFx(webPartContext));
            console.log("this._sp", this._sp)
        }catch(e){
            console.error(e)
        }
    }

    public fetch(): Promise<IBook[]> {
        return this._sp.web.lists.getByTitle(LIST_NAME).items()
    }
}