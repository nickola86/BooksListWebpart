import { IColumn } from "office-ui-fabric-react"

export interface IBooksList {
    "isReady": boolean,
    "items": IBook[],
    "columns": IColumn[],
    "announcedMessage": string,
    "selectionDetails":string
}
export interface IBook{
    "titolo": string,
    "autoreLibro": string,
    "annoPubblicazione": number,
    "pagineLibro": number,
    "concatAll"?: () => string
}