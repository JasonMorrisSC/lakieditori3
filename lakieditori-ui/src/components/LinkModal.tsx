/** @jsx jsx */
import {jsx} from '@emotion/core'
import React, {useEffect} from "react";
import {Editor, Range} from 'slate'
import {useSlate} from 'slate-react'
import axios from "axios";
import Modal from 'react-modal';
import {Button, Heading, Icon, suomifiDesignTokens as tokens} from "suomifi-ui-components";
import {insertLink, unwrapLink} from "./RichTextEditorFunctions";
import {inputStyle} from "./inputStyle";
import {horizontalLabeledInputCss, TableSmall} from "./CommonComponents";
import {parseXml, queryFirstText} from "../utils/xmlUtils";

enum Tab {
  CONCEPT,
  WEB,
}

const LinkModal = ({modalIsOpen, closeModal, selection}: Props) => {
  const editor = useSlate();

  const [linkText, setLinkText] = React.useState<string>('');
  const [linkUrl, setLinkUrl] = React.useState<string>('');
  const [tab, setTab] = React.useState<Tab>(Tab.CONCEPT);

  useEffect(() => {
    // when modal is opened, read selected text and possible existing link URL
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
      // if text is changed, remove old text before inserting a link
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
    setTab(Tab.CONCEPT);
    closeModal();
  }

  return (
      <Modal isOpen={modalIsOpen} contentLabel="Lisää linkki" style={{
        content: {
          display: "flex",
          flexDirection: "column",
          height: "80%",
          marginLeft: "auto",
          marginRight: "auto",
          right: "-820px",
          maxWidth: 400,
          padding: `${tokens.spacing.l}`,
        }
      }}>
        <div style={{flex: "0", width: "100%"}}>
          <Heading.h1>
            Lisää linkki
          </Heading.h1>
          <div style={{marginTop: tokens.spacing.xs, color: tokens.colors.depthBase}}>
            <a onClick={() => setTab(Tab.CONCEPT)} style={{
              color: tab === Tab.CONCEPT ? tokens.colors.blackBase : ''
            }}>
              Käsite-linkki
            </a> | <a onClick={() => setTab(Tab.WEB)} style={{
            color: tab === Tab.WEB ? tokens.colors.blackBase : ''
          }}>
            Web-linkki
          </a>
          </div>
          <hr style={{marginTop: tokens.spacing.xs}}/>
        </div>

        <div style={{flex: "1", overflowY: "scroll", width: "100%",}}>
          {tab === Tab.CONCEPT
              ? <ConceptLink linkUrl={linkUrl} setLinkUrl={setLinkUrl}
                             linkText={linkText} setLinkText={setLinkText}/>
              : <WebLink linkUrl={linkUrl} setLinkUrl={setLinkUrl}
                         linkText={linkText} setLinkText={setLinkText}/>}
        </div>

        <div style={{flex: "0", marginTop: tokens.spacing.s, width: "100%",}}>

          <div css={horizontalLabeledInputCss}>
            <label htmlFor="linkUrlInput">
              Linkin osoite (URL)
            </label>
            <input name="linkUrlInput" type="text" style={{...inputStyle}}
                   value={linkUrl} onChange={(e) => setLinkUrl(e.currentTarget.value)}/>
          </div>

          <div css={horizontalLabeledInputCss}>
            <label htmlFor="linkTextInput">
              Linkin teksti
            </label>
            <input name="linkTextInput" type="text" style={{...inputStyle}}
                   value={linkText} onChange={(e) => setLinkText(e.currentTarget.value)}/>
          </div>

          <hr style={{margin: `${tokens.spacing.s} 0`}}/>

          <Button onClick={insertLinkAndClose}>
            Lisää
          </Button>
          <Button.secondaryNoborder onClick={close} style={{marginLeft: tokens.spacing.xs}}>
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
        <label htmlFor="linkUrlInput">Linkin osoite (URL)</label>
        <input type="text" name="linkUrlInput" style={inputStyle}
               value={linkUrl} onChange={(e) => setLinkUrl(e.currentTarget.value)}/>
      </div>
  );
};

const ConceptLink: React.FC<LinkViewProps> = ({linkUrl, setLinkUrl, linkText, setLinkText}) => {
  const [query, setQuery] = React.useState<string>('');
  const [concepts, setConcepts] = React.useState<Document>(parseXml("<concepts/>"));

  useEffect(() => {
    let text = linkText.toLowerCase().trim();

    axios.get('/api/lemma', {
      params: {word: text},
      responseType: 'text'
    }).then(res => {
      setQuery(res.data ? res.data : text);
    });
  }, [linkText]);

  useEffect(() => {
    if (query) {
      axios.get('/api/concepts', {
        params: {query},
        responseType: 'document'
      }).then(res => {
        setConcepts(res.data);
      });
    }
  }, [query]);

  return (
      <div>
        <div style={{position: "relative"}}>
          <input type="text" style={inputStyle} placeholder={"Etsi käsitettä"}
                 value={query} onChange={(e) => setQuery(e.currentTarget.value)}/>
          <Icon icon={"search"}
                style={{
                  top: "50%",
                  position: "absolute",
                  right: tokens.spacing.m,
                  marginTop: "-0.5em"
                }}/>
        </div>
        <TableSmall style={{marginTop: tokens.spacing.s}}>
          <thead>
          <tr>
            <th>Käsitteet ({concepts.documentElement.childNodes.length})</th>
          </tr>
          </thead>
          <tbody>
          {Array.from(concepts.documentElement.childNodes)
          .map(n => n as Element)
          .map((e, i) => {
            const uri = e.getAttribute('uri') || '';
            const label = queryFirstText(e, "label");

            return <tr key={i} onClick={() => {
              setLinkUrl(uri);
              setLinkText(!linkText ? label : linkText);
            }} style={{
              background: uri === linkUrl
                  ? tokens.colors.highlightLight50
                  : tokens.colors.whiteBase
            }}>
              <td>
                <span style={{color: tokens.colors.depthDark27}}>
                  {queryFirstText(e, "terminology/label")}
                </span>
                <br/>
                <span style={{
                  color: tokens.colors.highlightBase,
                  fontSize: tokens.values.typography.heading4.fontSize.value,
                  fontWeight: tokens.values.typography.heading4.fontWeight
                }}>
                  {queryFirstText(e, "label")}
                </span>
                {uri === linkUrl ?
                    <div>
                      <div>{queryFirstText(e, "definition")}</div>
                      <div>
                        <a href={uri} target={"_blank"}>
                          Katso lisätiedot sanastopalvelusta...
                        </a>
                      </div>
                    </div>
                    : ''}
              </td>
            </tr>;
          })}
          </tbody>
        </TableSmall>
      </div>
  );
};

interface LinkViewProps {
  linkUrl: string,
  setLinkUrl: (url: string) => void,
  linkText: string,
  setLinkText: (text: string) => void,
}

export default LinkModal;
