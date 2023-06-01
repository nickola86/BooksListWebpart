import { WebPartContext } from "@microsoft/sp-webpart-base";
import { SPFI, SPFx, spfi } from "@pnp/sp";

import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { IBook } from "../types/IBooksList";

import m from "./Mappings";
const {spFieldAnnoPubblicazione,spFieldTitolo,spFieldPagineLibro,spFieldAutoreLibro, spListBooksList} = m;

export default class SPHelper {
    private static _sp: SPFI;
    
    public static init(spfxContext: WebPartContext): void{
        try{
            if(!!spfxContext) {
                SPHelper._sp = spfi().using(SPFx(spfxContext))
            }    
        }catch(e){
            console.error(e)
        }
    }

    public static getAllBooks = async ():Promise<IBook[]> => {
        try{
            const result = await SPHelper._sp.web.lists.getByTitle(spListBooksList).items()
            return result.map<IBook>(i=>{
                return {
                    titolo: i[spFieldTitolo],
                    annoPubblicazione: i[spFieldAnnoPubblicazione],
                    pagineLibro: i[spFieldPagineLibro],
                    autoreLibro: i[spFieldAutoreLibro]
                }
            })
        }catch(e){
            console.error(e)
        }
    }
}