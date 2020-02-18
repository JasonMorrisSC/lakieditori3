import React, {useEffect} from "react";
import {Editor, Range} from 'slate'
import {useSlate} from 'slate-react'
import axios from "axios";
import Modal from 'react-modal';
import {
  Button,
  Heading,
  SearchInput,
  suomifiDesignTokens as sdt,
  TextInput
} from "suomifi-ui-components";
import {insertLink, unwrapLink} from "./RichTextEditorFunctions";

enum Tab {
  CONCEPT,
  WEB,
}

const LinkModal = ({modalIsOpen, closeModal, selection}: Props) => {
  const editor = useSlate();

  const [linkText, setLinkText] = React.useState<string>('');
  const [linkUrl, setLinkUrl] = React.useState<string>('');
  const [tab, setTab] = React.useState<Tab>(Tab.WEB);

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

  function insertLinkAndClose() {
    editor.selection = selection;

    if (linkUrl) {
      // if text is changed, remove old
      if (selection && Editor.string(editor, selection) !== linkText) {
        Editor.insertText(editor, '');
      }
      insertLink(editor, linkUrl, linkText);
    } else {
      unwrapLink(editor);
    }

    close();
  }

  function close() {
    setLinkText('');
    setLinkUrl('');
    setTab(Tab.WEB);
    closeModal();
  }

  let linkView;

  switch (tab) {
    case Tab.CONCEPT:
      linkView = <ConceptLink linkUrl={linkUrl} setLinkUrl={setLinkUrl}/>;
      break;
    case Tab.WEB:
    default:
      linkView = <WebLink linkUrl={linkUrl} setLinkUrl={setLinkUrl}/>;
      break;
  }

  return (
      <Modal isOpen={modalIsOpen} contentLabel="Lisää linkki"
             style={{
               content: {
                 display: "grid",
                 gridTemplateRows: `130px auto 150px`,
                 height: "80%",
                 marginLeft: "auto",
                 marginRight: "auto",
                 maxWidth: 1000,
                 padding: `${sdt.spacing.l}`,
               }
             }}>
        <div style={{alignSelf: "start"}}>
          <Heading.h1>
            Lisää linkki
          </Heading.h1>

          <hr style={{
            border: 0,
            borderBottom: `1px solid ${sdt.colors.depthLight13}`,
            margin: `${sdt.spacing.s} 0`
          }}/>

          <div style={{marginBottom: sdt.spacing.m}}>
            <Button.secondary
                onClick={() => setTab(Tab.WEB)}
                style={{background: tab === Tab.WEB ? sdt.colors.depthLight26 : ''}}>
              Web-linkki
            </Button.secondary>
            <Button.secondary
                onClick={() => setTab(Tab.CONCEPT)}
                style={{
                  marginLeft: sdt.spacing.xs,
                  background: tab === Tab.CONCEPT ? sdt.colors.depthLight26 : ''
                }}>
              Käsite-linkki
            </Button.secondary>
          </div>
        </div>

        <div style={{
          alignSelf: "start",
          overflowY: "scroll",
          maxHeight: "100%",
        }}>
          {linkView}
        </div>

        <div style={{alignSelf: "end", marginTop: sdt.spacing.m}}>
          <TextInput labelText={"Linkin teksti"}
                     value={linkText}
                     style={{width: "100%", marginBottom: sdt.spacing.m}}
                     onChange={(e) => setLinkText(e.currentTarget.value)}/>

          <Button onClick={insertLinkAndClose}>
            Lisää
          </Button>
          <Button.secondaryNoborder
              onClick={close}
              style={{marginLeft: sdt.spacing.xs}}>
            Peruuta
          </Button.secondaryNoborder>
        </div>
      </Modal>
  )
};

interface Props {
  modalIsOpen: boolean,
  closeModal: () => void,
  selection: Range | null,
}

const WebLink: React.FC<LinkViewProps> = ({linkUrl, setLinkUrl}) => {
  return (
      <div>
        <TextInput labelText={"Linkin osoite (URL)"}
                   value={linkUrl}
                   style={{width: "100%"}}
                   onChange={(e) => setLinkUrl(e.currentTarget.value)}/>
      </div>
  );
};

const ConceptLink: React.FC<LinkViewProps> = ({linkUrl, setLinkUrl}) => {
  const [query, setQuery] = React.useState<string>('');
  const [concepts, setConcepts] = React.useState<Element>(document.createElement("concepts"));

  useEffect(() => {
    if (query) {
      axios.get('/api/concepts', {
        params: {query},
        responseType: 'document'
      }).then(res => {
        setConcepts(res.data.documentElement);
      });
    }
  }, [query]);

  return (
      <div>
        <SearchInput labelText="Etsi käsitettä" style={{width: "100%"}}
                     onChange={(e) => setQuery(e.currentTarget.value)}/>
        <div style={{marginTop: sdt.spacing.s}}>
          {Array.from(concepts.childNodes).map((n, i) => {
            const e = n as Element;
            return <div key={i} onClick={() => setLinkUrl(e.getAttribute('uri') || '')}>
              {e.getElementsByTagName('label')[0]!.textContent}
            </div>;
          })}
        </div>
      </div>
  );
};

interface LinkViewProps {
  linkUrl: string,
  setLinkUrl: (url: string) => void
}

export default LinkModal;
