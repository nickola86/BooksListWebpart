import { WebPartContext } from "@microsoft/sp-webpart-base";
import { SPFI, SPFx, spfi } from "@pnp/sp";

import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

export default class SPContextHelper {
    
    private static _sp: SPFI;

    public static getContext = (): SPFI => {return SPContextHelper._sp}

    public static init(spfxContext: WebPartContext): void{
        try{
            if(!!spfxContext) {
                SPContextHelper._sp = spfi().using(SPFx(spfxContext))
            }    
        }catch(e){
            console.error(e)
        }
    }

}