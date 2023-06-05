import { IColumn, IObjectWithKey } from "office-ui-fabric-react"

export interface IBooksList {
    items: IBook[],
    columns: IColumn[],
    announcedMessage: string,
    selectionDetails:string,
    isReady: boolean,
    isHexMode:boolean,
    recycledItems:string[],
    isBookModalOpen:boolean,
    currentBook?:IBook
}
export interface IBook extends IObjectWithKey{
    id?: number,
    titolo: string,
    autoreLibro: string,
    annoPubblicazione: number | string,
    pagineLibro: number | string,
    concatAll?: () => string,
    toString: () => string
}