import GraphContextHelper from '../helpers/GraphContextHelper';
import '@pnp/graph/users'
import "@pnp/graph/photos"

export interface IUserService {
    me(): Promise<IUser>;
}
export interface IUser {
    cognome: string;
    nome: string;
    email: string;
    telefono: string;
    dataDiNascita: string;
    immagine: string;
}
  
export class UserService extends GraphContextHelper implements IUserService {
    
    public me = async ():Promise<IUser> => {
        try{
            const user = await GraphContextHelper.graph().me()
            console.log("UserService.me > User from Graph",user)
            const photoValue = await GraphContextHelper.graph().me.photo.getBlob();
            const url = window.URL || window.webkitURL;
            const immagine = url.createObjectURL(photoValue);
            
            return {
                cognome: user.surname,
                nome: user.givenName,
                email: user.mail,
                telefono: user.businessPhones[0],
                dataDiNascita: user.birthday,
                immagine
            } 
        }catch(e){
            console.error("UserService.me",e)
        }
    }

}

const userService = new UserService()
export default userService