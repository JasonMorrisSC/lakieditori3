import React, {useEffect} from "react";
import {Editor, Range} from 'slate'
import {useSlate} from 'slate-react'
import Modal from 'react-modal';
import {insertLink, unwrapLink} from "./RichTextEditorFunctions";

const LinkModal = ({modalIsOpen, closeModal, selection, selectedText, selectedUrl}: Props) => {
  const editor = useSlate();

  const [linkText, setLinkText] = React.useState<string>('');
  const [linkUrl, setLinkUrl] = React.useState<string>('');

  useEffect(() => {
    setLinkText(selectedText);
    setLinkUrl(selectedUrl);
  }, [selectedText, selectedUrl]);

  return (
      <Modal isOpen={modalIsOpen} contentLabel="Lisää linkki"
             style={{
               content: {
                 maxWidth: 1000,
                 marginLeft: "auto",
                 marginRight: "auto"
               }
             }}>

        <h1>Lisää linkki</h1>

        <hr/>

        <label htmlFor="linkText">Linkin teksti</label>
        <input name="linkText" type="text" value={linkText}
               onChange={(e) => setLinkText(e.currentTarget.value)}/>

        <br/>

        <label htmlFor="linkUrl">Linkin osoite</label>
        <input name="linkUrl" type="text" value={linkUrl}
               onChange={(e) => setLinkUrl(e.currentTarget.value)}/>

        <br/>

        <button onClick={() => {
          editor.selection = selection;

          if (linkUrl) {
            if (selection && Editor.string(editor, selection) !== linkText) {
              Editor.insertText(editor, '');
            }
            insertLink(editor, linkUrl, linkText);
          } else {
            unwrapLink(editor);
          }

          closeModal();
        }}>
          Sulje
        </button>
      </Modal>
  )
};

interface Props {
  modalIsOpen: boolean,
  closeModal: () => void,
  selection: Range | null,
  selectedText: string,
  selectedUrl: string,
}

export default LinkModal;
