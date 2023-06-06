import * as React from 'react';
import styles from './RecycledBook.module.scss';
import { IconButton } from '@fluentui/react/lib/Button';

interface IRecycledBookProps{
    guid:string,
    value:string,
    onRestoreClick:()=>void
}

export const RecycledBook = (props:IRecycledBookProps): JSX.Element => {
    return (<p className={styles.recycledBook}>
        {props.value}
        <IconButton
            className={styles.cancelIcon}
            iconProps={{ iconName: 'Cancel' }}
            title="Cancel"
            ariaLabel="Cancel"
            onClick={props.onRestoreClick}
        />
        </p>)
}