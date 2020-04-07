import {Dispatch, SetStateAction} from "react";

export interface XmlEditor3Properties {
  referenceCurrentElement: Element,
  document: Document,
  currentElement: Element,
  currentPath: string,
  updateDocument: Dispatch<SetStateAction<Document>>
}
