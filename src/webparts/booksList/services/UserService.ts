import GraphContextHelper from '../helpers/GraphContextHelper';
import '@pnp/graph/users'

export interface IUserService {
    me(): Promise<IUser>;
}
interface IUser {
    cognome: string;
    nome: string;
    email: string;
    dataDiNascita: string;
    immagine: string;
  }
  
export class UserService extends GraphContextHelper implements IUserService {
    
    public me = async ():Promise<IUser> => {
        try{
            const {surname:cognome,givenName:nome,mail:email,birthday:dataDiNascita, photo} = await GraphContextHelper.graph().me()
            const user = {
                cognome,
                nome,
                email,
                dataDiNascita,
                immagine: photo?.id
            }
            console.log("UserService.me",user)
            return user 
        }catch(e){
            console.error("UserService.me",e)
        }
    }

}

const userService = new UserService()
export default userService