import * as React from 'react';
import styles from './BooksList.module.scss';
import { IBooksListProps } from './IBooksListProps';
import { IBook, IBookRecycled, IBooksList } from '../types/IBooksList';
import { MarqueeSelection } from '@fluentui/react/lib/MarqueeSelection';
import { CheckboxVisibility, DetailsList, IColumn, Selection } from '@fluentui/react/lib/DetailsList';
import * as strings from 'BooksListWebPartStrings';
import { CommandBar, DefaultButton, FontIcon, ICommandBarItemProps, ICommandBarStyles, IContextualMenuItem, Label, Spinner, TextField } from '@fluentui/react';

import booksService from '../services/BooksService';
import recycleBinService from '../services/RecycleBinService';

import { RecycledBook } from './RecycledBook';
import { BookModal } from './BookModal';

export default class BooksList extends React.Component<IBooksListProps, IBooksList> {

  private _columns: IColumn[];
  
  private _selection = new Selection<IBook>({
    onSelectionChanged: () => {
      this.setState({ selectionDetails: this._getSelectionDetails()})
    },getKey: (b:IBook)=>{
      return b.id
    }
  });
  private _allItems: IBook[];
  
  constructor(props:IBooksListProps){
    super(props);

    this._columns = [
      { key: 'column1', name: strings.name, fieldName: 'titolo', minWidth: 100, maxWidth: 200, isResizable: true, isSorted:false},
      { key: 'column2', name: strings.autoreLibro, fieldName: 'autoreLibro', minWidth: 80, maxWidth: 200, isResizable: true, isSorted:false },
      { key: 'column3', name: strings.annoPubblicazione, fieldName: 'annoPubblicazione', minWidth: 50, maxWidth: 100, isResizable: true, isSorted:false },
      { key: 'column4', name: strings.pagineLibro, fieldName: 'pagineLibro', minWidth: 150, maxWidth: 200, isResizable: true, isSorted:false },
      { key: 'actions', name: strings.actions, minWidth: 40, maxWidth: 40, isResizable: false, isSorted:false },
    ];

    this.state = {
      items: [],
      isReady:false,
      isHexMode:false,
      columns: this._columns,
      announcedMessage:"",
      recycledItems:[],
      selectionDetails:this._getSelectionDetails(),
      isBookModalOpen:false
    };
  }

  async componentDidMount(): Promise<void> {
    await this._reloadData()
  }

  public render(): React.ReactElement<IBooksListProps> {
    const {
      hasTeamsContext
    } = this.props;

    const { items, isReady, columns, selectionDetails,recycledItems,isBookModalOpen,currentBook } = this.state;

    return (
      <section className={`${styles.booksList} ${hasTeamsContext ? styles.teams : ''}`}>
        {
          !isReady && <>
            <Spinner label={strings.booksLoading} />
          </>
        }
        {
          isReady && <>
            <MarqueeSelection selection={this._selection}>
              <CommandBar styles={commandBarStyles} items={this._getCommandItems()} />
              <TextField label={strings.filterByName} onChange={this._onChangeText} />
              <DetailsList
                checkboxVisibility={CheckboxVisibility.always}
                items={items}
                columns={columns}
                selection={this._selection}
                onColumnHeaderClick={this._onColumnClick}
                onRenderRow={(props, defaultRender) => defaultRender({...props, className: styles.row})}    
                onRenderItemColumn={this._onRenderItemColumn}
              />
            </MarqueeSelection>
            <BookModal 
              isModalOpen={isBookModalOpen} 
              isEditMode={!!currentBook?.id} 
              book={currentBook} 
              onCloseCallback={this._onBookModalClose}
            />
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
        {
          !!recycledItems && recycledItems.length>0 && <div style={{marginTop:'1em'}}>
            <Label>{strings.booksInTheRecycleBin} ({recycledItems.length})</Label>
            {
              recycledItems.map(i=><RecycledBook guid={i.guid} value={i.value} onRestoreClick={()=>{this._onRestoreFromRecycle(i.guid)}}/>)
            }
            <DefaultButton style={{display:'block'}} onClick={this._onCleanRecycle}>{strings.cleanRecycleBin}</DefaultButton>
          </div>
        }
      </section>
    );
  }

  private _onCleanRecycle = async() => {
    await recycleBinService.cleanRecycleBin()
    this._reloadData()
  }
  //private onCloseBookModalHandler = (newBook:IBook,save:boolean) => {
  //  console.log("Modale chiusa! Save:", save)
  //}
private async _reloadData() {
  const data = await Promise.all([
    booksService.getAll(), //data[0]
    recycleBinService.getRecycledItems()//data[1]
  ])
  //Carico i libri
  const books = data[0] as IBook[]
  //Carico i libri nel cestino
  const recycled = data[1] as IBookRecycled[]
  //Setto la lista dei libri nello stato
  this.setState({items:books,isReady:true, recycledItems:recycled, currentBook:null, isBookModalOpen:false})
  //Setto la lista dei libri nella property interna (usata dal filtro)
  this._allItems = books;
  //Implemento un metodo custom "concatAll" che restituisce la concatenazione di tutte le properties interne di IBook
  this._allItems.forEach(i=>{i.concatAll = () => {
    return i.titolo+i.autoreLibro+i.annoPubblicazione+i.pagineLibro;
  }});
}

  private _getCommandItems(): ICommandBarItemProps[] {
    return [
      {
        key: 'addRow',
        text: strings.addRow,
        iconProps: { iconName: 'Add' },
        onClick: this._onAddRow,
      },
      {
        key: 'deleteRow',
        text: strings.deleteRow,
        iconProps: { iconName: 'Delete' },
        onClick: this._onDeleteRow,
        disabled: this._selection.getSelectedCount()===0
      }
    ]
  }

  private _onAddRow = (ev?: React.MouseEvent<HTMLElement, MouseEvent> | React.KeyboardEvent<HTMLElement>, item?: IContextualMenuItem): void => {
    this.setState({isBookModalOpen:true})
    return;
  }
  private _onBookModalClose = async (book:IBook,save:boolean) => {
    if(save && !!book.id) {
      //Se l'elemento ha già un ID, lo sto aggiornando
      await booksService.updateItem(book)
    }else if(save && !book.id){
      //Se l'elemento non ha già un ID, lo sto creando
      await booksService.createItem(book)
    }
    //Ricarico i dati in pagina
    this._reloadData()
  }

  private _onDeleteRow = (ev?: React.MouseEvent<HTMLElement, MouseEvent> | React.KeyboardEvent<HTMLElement>, item?: IContextualMenuItem): void => {
    if (this._selection.getSelectedCount() > 0) {
      //Cancello tutti i libri selezionati
      Promise.all(
        this._selection.getSelection().map((book:IBook)=>{
          return booksService.deleteItem(book.id)
        })
      ).then(()=>{
        //ricarico i dati della pagina
        this._reloadData()
      })
      return
    }
  }

  private _onRestoreFromRecycle = async (id:string) => {
    await recycleBinService.restoreFromRecycle(id)
    this._reloadData()
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
  private _onRenderItemColumn = (item: any, index: any, column: any) => {
    let fieldContent = item[column.fieldName];
    switch (column.key) {
        case 'actions':
            return  <FontIcon aria-label="Edit" iconName="Edit" style={{cursor:'pointer'}} onClick={()=>{
              this.setState({currentBook:item as IBook, isBookModalOpen:true})
            }} />
        default:
            return <span>{fieldContent}</span>;
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
  /*Section: Event Handlers - End*/
  
}


function _copyAndSort<T>(items: T[], columnKey: string, isSortedDescending?: boolean): T[] {
  const key = columnKey as keyof T;
  return items.slice(0).sort((a: T, b: T) => ((isSortedDescending ? a[key] < b[key] : a[key] > b[key]) ? 1 : -1));
}

const commandBarStyles: Partial<ICommandBarStyles> = { root: { marginLeft:'0px', paddingLeft:'0px', marginBottom: '10px' } };

