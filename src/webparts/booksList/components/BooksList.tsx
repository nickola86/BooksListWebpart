import * as React from 'react';
import styles from './BooksList.module.scss';
import { IBooksListProps } from './IBooksListProps';
import { IBook, IBooksList } from '../types/IBooksList';
import { MarqueeSelection } from '@fluentui/react/lib/MarqueeSelection';
import { DetailsList, IColumn, Selection } from '@fluentui/react/lib/DetailsList';
import * as strings from 'BooksListWebPartStrings';
import BooksService from '../services/BooksService';
import { Spinner } from '@fluentui/react';

export default class BooksList extends React.Component<IBooksListProps, IBooksList> {

  private _columns: IColumn[];
  private _selection: Selection;

  constructor(props:IBooksListProps){
    super(props);

    this._columns = [
      { key: 'column1', name: strings.name, fieldName: 'titolo', minWidth: 100, maxWidth: 200, isResizable: true, isSorted:false },
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
      columns: this._columns,
      announcedMessage:"",
      selectionDetails:this._getSelectionDetails()
    };
  }

  async componentDidMount(): Promise<void> {
    //Carico i libri
    const books: IBook[] = await BooksService.fetch();
    this.setState({items:books})
  }

  public render(): React.ReactElement<IBooksListProps> {
    const {
      hasTeamsContext
    } = this.props;

    const { items, columns, selectionDetails } = this.state;

    return (
      <section className={`${styles.booksList} ${hasTeamsContext ? styles.teams : ''}`}>
        {
          items.length===0 && <div>
            <Spinner label={strings.booksLoading} />
          </div>
        }
        {
          items.length>0 && <>
            <MarqueeSelection selection={this._selection}>
              <DetailsList
                items={items}
                columns={columns}
                selection={this._selection}
                onColumnHeaderClick={this._onColumnClick}
              />
            </MarqueeSelection>
            <p style={{marginTop:'2em',textAlign:"center", fontStyle:'italic'}}>{selectionDetails}</p>          
          </>
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
    const newItems = _copyAndSort(items, currColumn.fieldName!, currColumn.isSortedDescending);
    this.setState({
      columns: newColumns,
      items: newItems,
    });
  }
}

function _copyAndSort<T>(items: T[], columnKey: string, isSortedDescending?: boolean): T[] {
  const key = columnKey as keyof T;
  return items.slice(0).sort((a: T, b: T) => ((isSortedDescending ? a[key] < b[key] : a[key] > b[key]) ? 1 : -1));
}
