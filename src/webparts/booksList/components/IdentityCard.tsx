import * as React from 'react'
import styles from './Card.module.scss'
import * as strings from 'BooksListWebPartStrings';
import { IUser } from '../services/UserService';

export interface IIdentityCardProps {
  user:IUser
}
  
export const IdentityCard = (props:IIdentityCardProps): JSX.Element => {
    return <section className={styles.identityCard}>
    <div className={styles.card}>
      <div className={styles.data}>
        <ul>
          <li>
            <span className={styles.bold}>{props?.user?.cognome} {props?.user?.nome}</span>
          </li>
          <hr/>
          <li>
            <span className={styles.bold}>{strings.EmailFieldLabel}:</span> <span>{props?.user?.email}</span>
          </li>
          <li>
            <span className={styles.bold}>{strings.PhoneFieldLabel}:</span> <span>{props?.user?.telefono}</span>
          </li>
        </ul>
      </div>
      <div className={styles.picture}>
        <img src={props?.user?.immagine || strings.DefaultUserPicture} />
      </div>
    </div>
  </section>
}
