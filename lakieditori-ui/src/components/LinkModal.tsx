import React, {useEffect} from "react";
import {Editor, Range} from 'slate'
import {useSlate} from 'slate-react'
import Modal from 'react-modal';
import {Button, Heading, suomifiDesignTokens as sdt, TextInput} from "suomifi-ui-components";
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
                 display: "grid",
                 gridTemplateRows: `100px auto 40px`,
                 height: "80%",
                 marginLeft: "auto",
                 marginRight: "auto",
                 maxWidth: 1000,
                 padding: `${sdt.spacing.l}`,
               }
             }}>

        <div>
          <Heading.h1>
            Lisää linkki
          </Heading.h1>
          <hr style={{
            border: 0,
            borderBottom: `1px solid ${sdt.colors.depthLight13}`,
            marginBottom: sdt.spacing.l
          }}/>
        </div>

        <div style={{overflowY: "auto"}}>

          <TextInput labelText={"Linkin osoite (URL)"}
                     value={linkUrl}
                     style={{width: "100%"}}
                     onChange={(e) => setLinkUrl(e.currentTarget.value)}/>

          <br/>

          <TextInput labelText={"Linkin teksti"}
                     value={linkText}
                     style={{width: "100%"}}
                     onChange={(e) => setLinkText(e.currentTarget.value)}/>

        </div>

        <div>
          <Button onClick={insertLinkAndCloseModal}>
            Lisää
          </Button>
        </div>
      </Modal>
  )
};

interface Props {
  modalIsOpen: boolean,
  closeModal: () => void,
  selection: Range | null,
}

export default LinkModal;
