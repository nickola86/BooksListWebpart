import { IColumn, IObjectWithKey } from "office-ui-fabric-react"

export interface IBooksList {
    items: IBook[],
    columns: IColumn[],
    announcedMessage: string,
    selectionDetails:string,
    isReady: boolean,
    isHexMode:boolean,
    recycledItems:IBookRecycled[],
    isBookModalOpen:boolean,
    currentBook?:IBook
}
export interface IBook extends IObjectWithKey{
    id?: number,
    asString?: string
    titolo: string,
    autoreLibro: string,
    annoPubblicazione: number,
    pagineLibro: number,
    concatAll?: () => string,
}
export interface IBookRecycled{
    guid?: string,
    value?: string
}