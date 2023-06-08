import * as React from 'react';
import {useState} from 'react';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query'

import styles from './BooksList.module.scss';
import { IBook, IBookRecycled } from '../types/IBooksList';
import { MarqueeSelection } from '@fluentui/react/lib/MarqueeSelection';
import { CheckboxVisibility, DetailsList, IColumn, Selection } from '@fluentui/react/lib/DetailsList';
import * as strings from 'BooksListWebPartStrings';
import { CommandBar, DefaultButton, FontIcon, ICommandBarItemProps, ICommandBarStyles, IContextualMenuItem, Label, Spinner, TextField } from '@fluentui/react';

import booksService from '../services/BooksService';
import recycleBinService from '../services/RecycleBinService';

import { RecycledBook } from './RecycledBook';
import { BookModal } from './BookModal';
import { Clock } from './Clock';
import { User } from './User';

export interface IBooksListProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
}

function _copyAndSort<T>(items: T[], columnKey: string, isSortedDescending?: boolean): T[] {
  const key = columnKey as keyof T;
  return items.slice(0).sort((a: T, b: T) => ((isSortedDescending ? a[key] < b[key] : a[key] > b[key]) ? 1 : -1));
}

export const BooksListFunctional = (props:IBooksListProps): JSX.Element => {

  const queryClient = new QueryClient()

  //Init dello stato
  const _columns: IColumn[] = [
    { key: 'column1', name: strings.name, fieldName: 'titolo', minWidth: 100, maxWidth: 200, isResizable: true, isSorted:false},
    { key: 'column2', name: strings.autoreLibro, fieldName: 'autoreLibro', minWidth: 80, maxWidth: 200, isResizable: true, isSorted:false },
    { key: 'column3', name: strings.annoPubblicazione, fieldName: 'annoPubblicazione', minWidth: 50, maxWidth: 100, isResizable: true, isSorted:false },
    { key: 'column4', name: strings.pagineLibro, fieldName: 'pagineLibro', minWidth: 150, maxWidth: 200, isResizable: true, isSorted:false },
    { key: 'actions', name: strings.actions, minWidth: 40, maxWidth: 40, isResizable: false, isSorted:false },
  ];
  const _getSelectionMessage = (selectionCount:number): string => {
    let message
    switch (selectionCount) {
      case 0:
        message = strings.noItemsSelected;
        break;
      case 1:
        message = strings.oneItemSelected;
        break;
      default:
        message = `${selectionCount} ${strings.itemsSelected}`;
    }
    console.log("_getSelectionMessage",message)
    return message
  }

  const [items,setItems] = useState<IBook[]>([])
  const [allItems,setAllItems] = useState<IBook[]>([])
  const [isReady,setIsReady] = useState<boolean>(false)
  const [columns, setColumns] = useState<IColumn[]>(_columns)
  const [,setAnnouncedMessage] = useState<string>("")
  const [recycledItems,setRecycledItems] = useState<IBookRecycled[]>([])
  const [selectionMessage,setSelectionMessage] = useState<string>(_getSelectionMessage(0))
  const [isBookModalOpen,setIsBookModalOpen] = useState<boolean>(false)
  const [currentBook,setCurrentBook] = useState<IBook>(null)
  const [selection] = useState<Selection>(new Selection<IBook>({
    onSelectionChanged: () => {
      setSelectionMessage(_getSelectionMessage(selection.getSelectedCount()))
    },getKey: (b:IBook)=>b.id
  }))

  const [isLoading,setIsLoading] = useState<boolean>(true)

  const fetchData = async (): Promise<void> => {
    setIsLoading(true)
    //Carico i libri
    const books = await booksService.getAll()    
    //Carico i libri nel cestino
    const recycled = await recycleBinService.getRecycledItems()
    
    //Setto la lista dei libri nello stato
    setItems(books)
    setRecycledItems(recycled)
    setCurrentBook(null)
    setIsBookModalOpen(false)
    //Setto la lista dei libri nella property interna (usata dal filtro)
    setAllItems(books)
    //Implemento un metodo custom "concatAll" che restituisce la concatenazione di tutte le properties interne di IBook
    allItems.forEach(i=>{i.concatAll = () => {
      return i.titolo+i.autoreLibro+i.annoPubblicazione+i.pagineLibro;
    }});
    setIsLoading(false)
    setIsReady(true)
  }
  const _onAddRow = (ev?: React.MouseEvent<HTMLElement, MouseEvent> | React.KeyboardEvent<HTMLElement>, item?: IContextualMenuItem): void => {
    setIsBookModalOpen(true)
    return;
  }
  const _onDeleteRow = (): void => {
    if (selection.getSelectedCount() > 0) {
      //Cancello tutti i libri selezionati
      try{
        Promise.all(selection.getSelection().map((book:IBook)=>{
          return booksService.deleteItem(book.id)
        })).then(async ()=>{
          //ricarico i dati della pagina
          await fetchData()
        }).catch((e)=>{
          console.error(e)
        })
      }catch(e){
        console.error(e)
      }
    }
  }

  const _getCommandItems = (): ICommandBarItemProps[] => {
    return [
      {
        key: 'addRow',
        text: strings.addRow,
        iconProps: { iconName: 'Add' },
        onClick: _onAddRow,
      },
      {
        key: 'deleteRow',
        text: strings.deleteRow,
        iconProps: { iconName: 'Delete' },
        onClick: _onDeleteRow,
        disabled: selection.getSelectedCount()===0
      }
    ]
  }

  const _onCleanRecycle = async():Promise<void> => {
    await recycleBinService.cleanRecycleBin()
    await fetchData()
  }

  const _onBookModalClose = async (book:IBook,save:boolean):Promise<void> => {
    if(save && !!book.id) {
      //Se l'elemento ha già un ID, lo sto aggiornando
      await booksService.updateItem(book)
    }else if(save && !book.id){
      //Se l'elemento non ha già un ID, lo sto creando
      await booksService.createItem(book)
    }
    //Ricarico i dati in pagina
    await fetchData()
  }

  const _onRestoreFromRecycle = async (id:string): Promise<void> => {
    await recycleBinService.restoreFromRecycle(id)
    await fetchData()
  }

  const _onRenderItemColumn = (item: any, index: number, column: IColumn): JSX.Element => {
    const fieldContent = item[column.fieldName];
    switch (column.key) {
        case 'actions':
            return  <FontIcon aria-label="Edit" iconName="Edit" style={{cursor:'pointer'}} onClick={()=>{
              setCurrentBook(item as IBook)
              setIsBookModalOpen(true)
            }} />
        default:
            return <span>{fieldContent}</span>;
    }
  }

  const _onColumnClick = (ev: React.MouseEvent<HTMLElement>, column: IColumn): void => {
    const newColumns: IColumn[] = columns.slice();
    const currColumn: IColumn = newColumns.filter(currCol => column.key === currCol.key)[0];
    newColumns.forEach((newCol: IColumn) => {
      if (newCol === currColumn) {
        currColumn.isSortedDescending = !currColumn.isSortedDescending;
        currColumn.isSorted = true;
        setAnnouncedMessage(`${currColumn.name} is sorted ${currColumn.isSortedDescending ? 'descending' : 'ascending'}`)
      } else {
        newCol.isSorted = false;
        newCol.isSortedDescending = true;
      }
    });
    const newItems = _copyAndSort(items, currColumn.fieldName, currColumn.isSortedDescending);
    setColumns(newColumns)
    setItems(newItems)
  }

  const _onChangeText = (ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, text: string): void => {
    //Aggiorno lo stato con la lista allItems filtrata
    setItems(text ? allItems.filter(i => i.concatAll().toLowerCase().indexOf(text.toLowerCase()) > -1) : allItems)
  
  }

  const {
    hasTeamsContext
  } = props;

  const commandBarStyles: Partial<ICommandBarStyles> = { root: { marginLeft:'0px', paddingLeft:'0px', marginBottom: '10px' } };

  React.useEffect(():void=> {
    fetchData()
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <section className={`${styles.booksList} ${hasTeamsContext ? styles.teams : ''}`}>
        <Clock></Clock>
        <User />
        {
          isLoading && <>
            <Spinner label={strings.booksLoading} className={styles.overlay} />
          </>
        }
        {
          isReady && <>
            <MarqueeSelection selection={selection}>
              <CommandBar styles={commandBarStyles} items={_getCommandItems()} />
              <TextField label={strings.filterByName} onChange={_onChangeText} />
              <DetailsList
                checkboxVisibility={CheckboxVisibility.always}
                items={items}
                columns={columns}
                selection={selection}
                onColumnHeaderClick={_onColumnClick}
                onRenderRow={(props, defaultRender) => defaultRender({...props, className: styles.row})}    
                onRenderItemColumn={_onRenderItemColumn}
              />
            </MarqueeSelection>
            <BookModal 
              isModalOpen={isBookModalOpen} 
              isEditMode={!!currentBook?.id} 
              book={currentBook} 
              onCloseCallback={_onBookModalClose}
            />
          </>
        }
        {
          isReady && items.length>0 &&
            <p style={{marginTop:'2em',textAlign:"center", fontStyle:'italic'}}>{selectionMessage}</p>          
        }
        {
          isReady && items.length===0 &&
            <p style={{marginTop:'2em',textAlign:"center", fontStyle:'italic'}}>{strings.noData}</p>
        }
        {
          isReady && !!recycledItems && recycledItems.length>0 && <div style={{marginTop:'1em'}}>
            <Label>{strings.booksInTheRecycleBin} ({recycledItems.length})</Label>
            {
              recycledItems.map(i=><RecycledBook key={i.guid} guid={i.guid} value={i.value} onRestoreClick={async ()=>{await _onRestoreFromRecycle(i.guid)}}/>)
            }
            <DefaultButton style={{display:'block'}} onClick={_onCleanRecycle}>{strings.cleanRecycleBin}</DefaultButton>
          </div>
        }
      </section>
    </QueryClientProvider>
  );
}