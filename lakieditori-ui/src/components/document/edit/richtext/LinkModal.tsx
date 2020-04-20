/** @jsx jsx */
import {jsx} from '@emotion/core'
import styled from '@emotion/styled'
import React, {useEffect, useState} from "react";
import {Editor, Location, Transforms} from "slate"
import {useSlate} from "slate-react"
import Modal from "react-modal";
import {queryElements, queryFirstText} from "../../../../utils/xmlUtils";
import {FlexColExtraTight, TableSmall} from "../../../common/StyledComponents";
import {ButtonLink, Input} from "../../../common/InputStyles";
import {Button, Heading, Icon, suomifiDesignTokens as tokens} from "suomifi-ui-components";
import {insertLink, unwrapLink} from "./slateUtils";
import {useLemma} from "./useLemma";
import {useConcepts} from "./useConcepts";

const LabeledInput = styled.div`
  display: flex;
  align-items: center;
  & > label {
    flex: 1;
    font-family: ${tokens.values.typography.bodyTextSmall.fontFamily};
    font-size: ${tokens.values.typography.bodyTextSmall.fontSize.value}${tokens.values.typography.bodyTextSmall.fontSize.unit};
    line-height: 1;
    margin-right: ${tokens.spacing.m};
  }
  & > input {
    flex: 5;
  }
`;

enum Tab {
  CONCEPT,
  WEB,
}

interface Props {
  isOpen: boolean,
  close: () => void,
  selection: Location,
}

const LinkModal = ({isOpen, close, selection}: Props) => {
  const editor = useSlate();

  const [linkText, setLinkText] = React.useState<string>('');
  const [linkUrl, setLinkUrl] = React.useState<string>('');
  const [tab, setTab] = React.useState<Tab>(Tab.CONCEPT);

  useEffect(() => {
    // when modal is opened, read selected text and possible existing link URL
    if (isOpen) {
      setLinkText(Editor.string(editor, selection));
      const [link] = Editor.nodes(editor, {match: n => n.type === 'link', at: selection});
      setLinkUrl((link && link.length) > 0 ? link[0].url : '');
    }
  }, [isOpen, editor, selection]);

  function insertLinkAndClose() {
    Transforms.select(editor, selection);

    if (linkUrl) {
      if (Editor.string(editor, selection) !== linkText) {
        Transforms.delete(editor);
      }
      insertLink(editor, linkUrl, linkText);
    } else {
      unwrapLink(editor);
    }

    closeModal();
  }

  function closeModal() {
    setLinkText('');
    setLinkUrl('');
    setTab(Tab.CONCEPT);
    close();
  }

  return (
      <Modal isOpen={isOpen} contentLabel="Lisää linkki" style={{
        content: {
          height: "80%",
          marginRight: "0",
          marginLeft: "auto",
          maxWidth: 400,
          padding: tokens.spacing.l,
        }
      }}>
        <FlexColExtraTight style={{height: "100%"}}>
          <Heading.h1>
            Lisää linkki
          </Heading.h1>

          <div>
            <ButtonLink onClick={() => setTab(Tab.CONCEPT)} active={tab === Tab.CONCEPT}>
              Käsitelinkki
            </ButtonLink>

            &nbsp;<span style={{color: tokens.colors.depthBase}}>|</span>&nbsp;

            <ButtonLink onClick={() => setTab(Tab.WEB)} active={tab === Tab.WEB}>
              Web-linkki
            </ButtonLink>
          </div>

          <hr/>

          <div style={{flex: "1", overflowY: "scroll"}}>
            {tab === Tab.CONCEPT
                ? <ConceptLink
                    linkUrl={linkUrl} setLinkUrl={setLinkUrl}
                    linkText={linkText} setLinkText={setLinkText}/>
                : <WebLink
                    linkUrl={linkUrl} setLinkUrl={setLinkUrl}
                    linkText={linkText} setLinkText={setLinkText}/>}
          </div>

          <div>
            <LabeledInput>
              <label htmlFor="url">
                Linkin osoite (URL)
              </label>
              <Input name="url" value={linkUrl}
                     onChange={(e) => setLinkUrl(e.currentTarget.value)}/>
            </LabeledInput>

            <LabeledInput>
              <label htmlFor="text">
                Linkin teksti
              </label>
              <Input name="text" value={linkText}
                     onChange={(e) => setLinkText(e.currentTarget.value)}/>
            </LabeledInput>

            <hr style={{margin: `${tokens.spacing.s} 0`}}/>
          </div>

          <div>
            <Button
                icon={"plus"}
                onClick={insertLinkAndClose}
                style={{marginRight: tokens.spacing.s}}>
              Lisää
            </Button>
            <Button.secondaryNoborder
                icon={"close"}
                onClick={closeModal}>
              Peruuta
            </Button.secondaryNoborder>
          </div>

        </FlexColExtraTight>
      </Modal>
  )
};

interface LinkViewProps {
  linkUrl: string,
  setLinkUrl: (url: string) => void,
  linkText: string,
  setLinkText: (text: string) => void,
}

const WebLink: React.FC<LinkViewProps> = ({linkUrl, setLinkUrl}) => {
  return (
      <div>
        <label>
          Linkin osoite (URL)
          <Input value={linkUrl} onChange={(e) => setLinkUrl(e.currentTarget.value)}/>
        </label>
      </div>
  );
};

const ConceptLink: React.FC<LinkViewProps> = ({linkUrl, setLinkUrl, linkText, setLinkText}) => {
  const [query, setQuery] = useState('');
  const {concepts} = useConcepts(query);
  const {lemma} = useLemma(linkText);

  useEffect(() => {
    setQuery(lemma);
  }, [lemma]);

  return (
      <div>
        <div style={{position: "relative"}}>
          <Input placeholder={"Etsi käsitettä"} value={query}
                 onChange={(e) => setQuery(e.currentTarget.value)}/>
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
          {queryElements(concepts.documentElement, "/concepts/concept").map((e, i) => {
            const uri = queryFirstText(e, "@uri");
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
                <ConceptInfo concept={e} expanded={uri === linkUrl}/>
              </td>
            </tr>;
          })}
          </tbody>
        </TableSmall>
      </div>
  );
};

interface ConceptInfoProps {
  concept: Element
  expanded: boolean,
}

const ConceptInfo: React.FC<ConceptInfoProps> = ({concept, expanded}) => {
  const uri = queryFirstText(concept, "@uri");
  const label = queryFirstText(concept, "label");
  const definition = queryFirstText(concept, "definition");
  const terminologyLabel = queryFirstText(concept, "terminology/label");

  return (
      <div>
        <span style={{color: tokens.colors.depthDark27}}>
          {terminologyLabel}
        </span>
        <br/>
        <span style={{
          color: tokens.colors.highlightBase,
          fontSize: tokens.values.typography.heading4.fontSize.value,
          fontWeight: tokens.values.typography.heading4.fontWeight
        }}>
          {label}
        </span>
        {expanded &&
        <div>
          <div>{definition}</div>
          <div>
            <a href={uri} target={"_blank"}>
              Katso lisätiedot sanastopalvelusta...
            </a>
          </div>
        </div>}
      </div>
  );
}


export default LinkModal;
