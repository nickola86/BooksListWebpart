import * as React from 'react'
import {useState,useEffect} from 'react'
import { IUser, IdentityCard } from './IdentityCard'
import userService from '../services/UserService'

export const User = (): JSX.Element => {
    const [currentUser,setCurrentUser] = useState<IUser>({} as IUser)
    useEffect(()=>{
        userService.me().then((user:IUser)=>{
            console.log("User from graph:", user)
            setCurrentUser(user)
        })
    },[])
    return <div>
        {!!currentUser && <IdentityCard user={currentUser} />}
        {!currentUser && <p>Caricamento dati utente da graph non riuscito</p>}
    </div>
}