export interface IBooksList {
    "items": Array<IBook>,
    "selectionDetails":string
}
export interface IBook{
    "titolo": string,
    "autoreLibro": string,
    "annoPubblicazione": number,
    "pagineLibro": number
}