declare interface IBooksListWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  AppLocalEnvironmentSharePoint: string;
  AppLocalEnvironmentTeams: string;
  AppLocalEnvironmentOffice: string;
  AppLocalEnvironmentOutlook: string;
  AppSharePointEnvironment: string;
  AppTeamsTabEnvironment: string;
  AppOfficeEnvironment: string;
  AppOutlookEnvironment: string;

  name:string;
  autoreLibro:string;
  annoPubblicazione:string;
  pagineLibro:string;
  booksSelected:string;
  booksLoading:string;

  noItemsSelected:string;
  oneItemSelected:string;
  itemsSelected:string;

  filterByName:string;
  noData:string;
  hexModeLabel:string;
}

declare module 'BooksListWebPartStrings' {
  const strings: IBooksListWebPartStrings;
  export = strings;
}
