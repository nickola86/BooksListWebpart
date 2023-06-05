import * as React from 'react';
import styles from './RecycledBook.module.scss';
import { IconButton } from '@fluentui/react/lib/Button';

interface IRecycledBookProps{
    id:string,
    onRestoreClick:()=>void
}

export const RecycledBook = (props:IRecycledBookProps) => {
    return (<p className={styles.recycledBook}>
        {props.id}
        <IconButton
            className={styles.cancelIcon}
            iconProps={{ iconName: 'Cancel' }}
            title="Cancel"
            ariaLabel="Cancel"
            onClick={props.onRestoreClick}
        />
        </p>)
}