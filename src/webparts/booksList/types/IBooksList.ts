import { IColumn } from "office-ui-fabric-react"

export interface IBooksList {
    items: IBook[],
    columns: IColumn[],
    announcedMessage: string,
    selectionDetails:string,
    isReady: boolean,
    isHexMode:boolean,
}
export interface IBook{
    titolo: string,
    autoreLibro: string,
    annoPubblicazione: number | string,
    pagineLibro: number | string,
    concatAll?: () => string
}