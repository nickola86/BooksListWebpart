import { WebPartContext } from "@microsoft/sp-webpart-base";
import { graphfi, SPFx, GraphFI} from "@pnp/graph";

export default class GraphContextHelper {
    
    private static _graph: GraphFI;

    public static graph = () => {return GraphContextHelper._graph}

    public static init(spfxContext: WebPartContext): void{
        try{
            if(!!spfxContext) {
                GraphContextHelper._graph = graphfi().using(SPFx(spfxContext));
            }
        }catch(e){
            console.error(e)
        }
    }

}