import * as React from 'react';
import styles from './BooksList.module.scss';
import { IBooksListProps } from './IBooksListProps';
import { IBook, IBooksList } from '../types/IBooksList';
import { MarqueeSelection } from '@fluentui/react/lib/MarqueeSelection';
import { DetailsList, IColumn, Selection } from '@fluentui/react/lib/DetailsList';
import * as strings from 'BooksListWebPartStrings';
import { Spinner, TextField, Toggle } from '@fluentui/react';
import toHex from '../utils/HexUtils';

import booksService from '../services/BooksService';

export default class BooksList extends React.Component<IBooksListProps, IBooksList> {

  private _columns: IColumn[];
  private _selection: Selection;
  private _allItems: IBook[];

  constructor(props:IBooksListProps){
    super(props);

    this._columns = [
      { key: 'column1', name: strings.name, fieldName: 'titolo', minWidth: 100, maxWidth: 200, isResizable: true, isSorted:false},
      { key: 'column2', name: strings.autoreLibro, fieldName: 'autoreLibro', minWidth: 80, maxWidth: 200, isResizable: true, isSorted:false },
      { key: 'column3', name: strings.annoPubblicazione, fieldName: 'annoPubblicazione', minWidth: 50, maxWidth: 100, isResizable: true, isSorted:false },
      { key: 'column4', name: strings.pagineLibro, fieldName: 'pagineLibro', minWidth: 150, maxWidth: 200, isResizable: true, isSorted:false },
    ];

    //Inizializzo la selezione
    this._selection = new Selection({
      onSelectionChanged: () => this.setState({ selectionDetails: this._getSelectionDetails()}),
    });

    this.state = {
      items: [],
      isReady:false,
      isHexMode:false,
      columns: this._columns,
      announcedMessage:"",
      selectionDetails:this._getSelectionDetails()
    };
  }

  async componentDidMount(): Promise<void> {
    //Carico i libri
    const books: IBook[] = await booksService.getAll()
    //Setto la lista dei libri nello stato
    this.setState({items:books,isReady:true})
    //Setto la lista dei libri nella property interna (usata dal filtro)
    this._allItems = books;
    //Implemento un metodo custom "concatAll" che restituisce la concatenazione di tutte le properties interne di IBook
    this._allItems.forEach(i=>{i.concatAll = () => {
      return i.titolo+i.autoreLibro+i.annoPubblicazione+i.pagineLibro;
    }});
  }

  public render(): React.ReactElement<IBooksListProps> {
    const {
      hasTeamsContext
    } = this.props;

    const { items, isReady, columns, selectionDetails,isHexMode } = this.state;

    return (
      <section className={`${styles.booksList} ${hasTeamsContext ? styles.teams : ''}`}>
        {
          !isReady && <>
            <Spinner label={strings.booksLoading} />
          </>
        }
        {
          isReady && <>
            <Toggle
              label={strings.hexModeLabel}
              checked={isHexMode}
              onChange={this._onChangeHexMode}
              onText="Hex"
              offText="Normal"
            />
            <MarqueeSelection selection={this._selection}>
              <TextField label={strings.filterByName} onChange={this._onChangeText} />
              <DetailsList
                items={items}
                columns={columns}
                selection={this._selection}
                onColumnHeaderClick={this._onColumnClick}
                onRenderRow={(props, defaultRender) => defaultRender({...props, className: styles.row})}    
                /*onRenderItemColumn={...}*/
              />
            </MarqueeSelection>
          </>
        }
        {
          isReady && items.length>0 &&
            <p style={{marginTop:'2em',textAlign:"center", fontStyle:'italic'}}>{selectionDetails}</p>          
        }
        {
          isReady && items.length===0 &&
            <p style={{marginTop:'2em',textAlign:"center", fontStyle:'italic'}}>{strings.noData}</p>
        }
      </section>
    );
  }

  private _getSelectionDetails(): string {
    const selectionCount = this._selection.getSelectedCount();

    switch (selectionCount) {
      case 0:
        return strings.noItemsSelected;
      case 1:
        return strings.oneItemSelected;
      default:
        return `${selectionCount} ${strings.itemsSelected}`;
    }
  }

  /*Section: Event Handlers - Begin*/

  private _onColumnClick = (ev: React.MouseEvent<HTMLElement>, column: IColumn): void => {
    const { columns, items } = this.state;
    const newColumns: IColumn[] = columns.slice();
    const currColumn: IColumn = newColumns.filter(currCol => column.key === currCol.key)[0];
    newColumns.forEach((newCol: IColumn) => {
      if (newCol === currColumn) {
        currColumn.isSortedDescending = !currColumn.isSortedDescending;
        currColumn.isSorted = true;
        this.setState({
          announcedMessage: `${currColumn.name} is sorted ${
            currColumn.isSortedDescending ? 'descending' : 'ascending'
          }`,
        });
      } else {
        newCol.isSorted = false;
        newCol.isSortedDescending = true;
      }
    });
    const newItems = _copyAndSort(items, currColumn.fieldName, currColumn.isSortedDescending);
    this.setState({
      columns: newColumns,
      items: newItems,
    });
  }

  private _onChangeText = (ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, text: string): void => {
    //Aggiorno lo stato con la lista allItems filtrata
    this.setState({
      items: text ? this._allItems.filter(i => i.concatAll().toLowerCase().indexOf(text.toLowerCase()) > -1) : this._allItems,
    });
  };

  private _onChangeHexMode = (ev: React.MouseEvent<HTMLElement>, checked: boolean): void => {
    this.setState({ isHexMode: checked });
    if(checked){
      const newitems: IBook[] = this._allItems.map(i=>{
        return {
          "titolo": toHex(i.titolo),
          "autoreLibro": toHex(i.autoreLibro),
          "annoPubblicazione": toHex(i.annoPubblicazione.toString()),
          "pagineLibro": toHex(i.pagineLibro.toString())
        }
      }) 
      this.setState({
        items:newitems
      })   
    }else{
      this.setState({
        items:this._allItems
      })  
    }
  };

    /*Section: Event Handlers - End*/

}


function _copyAndSort<T>(items: T[], columnKey: string, isSortedDescending?: boolean): T[] {
  const key = columnKey as keyof T;
  return items.slice(0).sort((a: T, b: T) => ((isSortedDescending ? a[key] < b[key] : a[key] > b[key]) ? 1 : -1));
}
