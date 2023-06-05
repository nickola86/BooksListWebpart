import { DefaultButton, Modal, TextField } from 'office-ui-fabric-react'
import * as React from 'react'
import {useState,useEffect} from 'react'
import { IBook } from '../types/IBooksList';
import strings from 'BooksListWebPartStrings';
import styles from './BookModal.module.scss';

export interface IBookProps {
  titleId?:string;
  isModalOpen?:boolean;
  book?:IBook;
  isEditMode:boolean;
  onCloseCallback?:(book:IBook,save:boolean)=>void;
}
export const BookModal = (props:IBookProps) => {
  const {book} = props

  const [titolo,setTitolo] = useState('')
  const [autoreLibro,setAutoreLibro] = useState('')
  const [pagineLibro,setPagineLibro] = useState(undefined)
  const [annoPubblicazione,setAnnoPubblicazione] = useState(undefined)
  const [id,setId] = useState(undefined)
  
  useEffect(()=>{
    setTitolo(book?.titolo || "")
    setAutoreLibro(book?.autoreLibro || "")
    setPagineLibro(book?.pagineLibro || "")
    setAnnoPubblicazione(book?.annoPubblicazione || "")
    setId(book?.id || null)
  },[book])

  const _book: IBook = {titolo,autoreLibro,pagineLibro,annoPubblicazione,id}

  return (<Modal
    isOpen={props.isModalOpen}
    onDismiss={()=>{props.onCloseCallback(book,false)}}
    isBlocking={true}
  >
    <div className={styles.bookModal}>
      <h1>{props.isEditMode ? strings.editBook : strings.newBook}</h1>
      <TextField label={strings.name} value={titolo} onChange={(e,v)=>setTitolo(v)}></TextField>
      <TextField label={strings.autoreLibro}value={autoreLibro} onChange={(e,v)=>setAutoreLibro(v)}></TextField>
      <TextField label={strings.pagineLibro} value={pagineLibro} onChange={(e,v)=>setPagineLibro(v)}></TextField>
      <TextField label={strings.annoPubblicazione} value={annoPubblicazione} onChange={(e,v)=>setAnnoPubblicazione(v)}></TextField>
      <div className={styles.buttons}>
        <DefaultButton onClick={()=>{props.onCloseCallback(_book,false)}}>{strings.close}</DefaultButton>
        <DefaultButton primary onClick={()=>{props.onCloseCallback(_book,true)}}>{strings.save}</DefaultButton>
      </div>
    </div>
  </Modal>)
}