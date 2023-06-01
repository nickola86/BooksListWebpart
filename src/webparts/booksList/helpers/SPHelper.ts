import { WebPartContext } from "@microsoft/sp-webpart-base";
import { SPFI, SPFx, spfi } from "@pnp/sp";

import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import {Mappings} from "./Mappings";
import { IBook } from "../types/IBooksList";

export default class SPHelper {
    private static _sp: SPFI;
    
    public static init(spfxContext: WebPartContext){
        try{
            if(!!spfxContext) {
                SPHelper._sp = spfi().using(SPFx(spfxContext))
            }    
        }catch(e){
            console.error(e)
        }
    }

    public static getAll = async ():Promise<IBook[]> => {
        try{
            const result:any[] = await SPHelper._sp.web.lists.getByTitle(Mappings.spListBooksList).items()
            return result.map<IBook>((i:any)=>{
                return {
                    titolo: i[Mappings.spFieldTitolo],
                    annoPubblicazione: i[Mappings.spFieldAnnoPubblicazione],
                    pagineLibro: i[Mappings.spFieldPagineLibro],
                    autoreLibro: i[Mappings.spFieldAutoreLibro]
                }
            })
        }catch(e){
            console.error(e)
        }
    }
}