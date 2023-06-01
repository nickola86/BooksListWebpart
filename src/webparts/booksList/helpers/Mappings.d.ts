declare interface Mappings {
    spListBooksList: "BooksList";
    spFieldTitolo: "titolo",
    spFieldAutoreLibro: "autoreLibro",
    spFieldAnnoPubblicazione: "annoPubblicazione",
    spFieldPagineLibro: "pagineLibro"
}

declare module "Mappings" {
    const m: Mappings;
    export = m;
}