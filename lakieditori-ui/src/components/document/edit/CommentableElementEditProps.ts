import {Dispatch, SetStateAction} from "react";
import {ElementEditProps} from "./ElementEditProps";

export interface CommentableElementEditProps extends ElementEditProps {
  documentComments: Document,
  setDocumentComments: Dispatch<SetStateAction<Document>>,
  showComments: boolean,
}
