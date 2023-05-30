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
      { key: 'column1', name: strings.name, fieldName: 'titolo', minWidth: 100, maxWidth: 200, isResizable: true },
      { key: 'column2', name: strings.autoreLibro, fieldName: 'autoreLibro', minWidth: 80, maxWidth: 200, isResizable: true },
      { key: 'column3', name: strings.annoPubblicazione, fieldName: 'annoPubblicazione', minWidth: 50, maxWidth: 100, isResizable: true },
      { key: 'column4', name: strings.pagineLibro, fieldName: 'pagineLibro', minWidth: 150, maxWidth: 200, isResizable: true },
    ];

    //Inizializzo la selezione
    this._selection = new Selection({
      onSelectionChanged: () => this.setState({ selectionDetails: this._getSelectionDetails()}),
    });

    this.state = {
      items: [],
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

    const { items, selectionDetails } = this.state;

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
                columns={this._columns}
                selection={this._selection}
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
}
