import {Dispatch, SetStateAction} from "react";

export interface ElementEditProps {
  document: Document,
  setDocument: Dispatch<SetStateAction<Document>>,
  documentProperties: { [name: string]: string },
  currentPath: string,
  currentElement: Element,
  showComments?: boolean,
}
