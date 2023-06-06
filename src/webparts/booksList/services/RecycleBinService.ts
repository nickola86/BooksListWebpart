import SPContextHelper from '../helpers/SPContextHelper';
import { IBookRecycled } from '../types/IBooksList';

export interface IRecycleBinService {
    getRecycledItems(): Promise<IBookRecycled[]>;
    restoreFromRecycle(id:string): Promise<any>;
    cleanRecycleBin(): Promise<any>;
}

export class BooksService extends SPContextHelper implements IRecycleBinService {
        
    public getRecycledItems = async ():Promise<IBookRecycled[]> => {
        try{
            return (await SPContextHelper.getContext().web.recycleBin()).map<IBookRecycled>(r=>{
                const b: IBookRecycled = {
                    guid: r.Id,
                    value: r.Title
                }
                return b
            })
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
    public cleanRecycleBin = async(): Promise<any> => {
        try{
            await SPContextHelper.getContext().web.recycleBin.deleteAll();
        }catch(e){
            console.error(e)
        }
    }
    
}

const booksService = new BooksService()
export default booksService