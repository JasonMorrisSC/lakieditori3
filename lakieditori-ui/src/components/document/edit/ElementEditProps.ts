import {Dispatch, SetStateAction} from "react";

export interface ElementEditProps {
  document: Document,
  setDocument: Dispatch<SetStateAction<Document>>,
  documentProperties: { [name: string]: string },
  documentComments?: Document,
  setDocumentComments?: Dispatch<SetStateAction<Document>>,
  currentPath: string,
  currentElement: Element,
  showComments?: boolean,
}
