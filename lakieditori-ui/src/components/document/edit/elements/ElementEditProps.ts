import {Dispatch, SetStateAction} from "react";

export interface ElementEditProps {
  document: Document,
  setDocument: Dispatch<SetStateAction<Document>>,
  currentPath: string,
  currentElement: Element,
}
