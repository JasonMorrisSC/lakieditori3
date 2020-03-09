import {Dispatch, SetStateAction} from "react";

export interface XmlEditorProperties {
  document: Document,
  currentElement: Element,
  currentPath: string,
  updateDocument: Dispatch<SetStateAction<Document>>
}
