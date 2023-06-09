declare interface IBooksListWebPartStrings {
  cleanRecycleBin: string | number | readonly string[];
  newBook: any;
  editBook: any;
  close: string;
  save: string;
  booksInTheRecycleBin: any;
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
  actions: string;
  deleteRow: string;
  addRow: string;
  DataDiNascitaFieldLabel: any;
  EmailFieldLabel: any;
  DefaultUserPicture:string;
  PhoneFieldLabel: any;
  LibraryCard: any;

}

declare module 'BooksListWebPartStrings' {
  const strings: IBooksListWebPartStrings;
  export = strings;
}
