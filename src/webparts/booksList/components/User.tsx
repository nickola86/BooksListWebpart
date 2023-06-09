import * as React from 'react'
import {useState,useEffect} from 'react'
import { IdentityCard } from './IdentityCard'
import userService, { IUser } from '../services/UserService'

export const User = (): JSX.Element => {
    const [currentUser,setCurrentUser] = useState<IUser>({} as IUser)

    useEffect(()=>{
        myHandler()
    },[])

    const myHandler = async () => {
        const user:IUser = await userService.me()
        console.log("User from graph:", user)
        setCurrentUser(user)
    }

    return <div>
        {!!currentUser && <IdentityCard user={currentUser}  />}
        {!currentUser && <p>Caricamento dati utente da graph non riuscito</p>}
    </div>
}