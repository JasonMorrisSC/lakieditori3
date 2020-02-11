import React, {useEffect} from "react";
import {Editor, Range} from 'slate'
import {useSlate} from 'slate-react'
import Modal from 'react-modal';
import {insertLink, unwrapLink} from "./RichTextEditorFunctions";

const LinkModal = ({modalIsOpen, closeModal, selection}: Props) => {
  const editor = useSlate();

  const [linkText, setLinkText] = React.useState<string>('');
  const [linkUrl, setLinkUrl] = React.useState<string>('');

  useEffect(() => {
    if (modalIsOpen && selection) {
      setLinkText(Editor.string(editor, selection));
      const [link] = Array.from(Editor.nodes(editor, {
        match: n => n.type === 'link',
        at: selection
      }));
      setLinkUrl((link && link.length) > 0 ? link[0].url : '');
    }
  }, [modalIsOpen, selection, editor]);

  function insertLinkAndCloseModal() {
    editor.selection = selection;

    if (linkUrl) {
      if (selection && Editor.string(editor, selection) !== linkText) {
        Editor.insertText(editor, '');
      }
      insertLink(editor, linkUrl, linkText);
    } else {
      unwrapLink(editor);
    }

    setLinkText('');
    setLinkUrl('');

    closeModal();
  }

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

        <button onClick={insertLinkAndCloseModal}>
          Sulje
        </button>
      </Modal>
  )
};

interface Props {
  modalIsOpen: boolean,
  closeModal: () => void,
  selection: Range | null,
}

export default LinkModal;
