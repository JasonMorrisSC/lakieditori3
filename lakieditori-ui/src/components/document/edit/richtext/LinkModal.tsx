/** @jsx jsx */
import {jsx} from '@emotion/core'
import styled from '@emotion/styled'
import React, {useEffect, useState} from "react";
import {Editor, Location, Transforms} from "slate"
import {useSlate} from "slate-react"
import Modal from "react-modal";
import {queryElements, queryFirstText} from "../../../../utils/xmlUtils";
import {FlexColExtraTight, FlexColTight, TableSmall} from "../../../common/StyledComponents";
import {
  ButtonLink,
  Input,
  InputSmall,
  Select,
  TextArea
} from "../../../common/StyledInputComponents";
import {Button, Heading, Icon, suomifiDesignTokens as tokens} from "suomifi-ui-components";
import {insertLink, unwrapLink} from "./slateUtils";
import {useLemma} from "./useLemma";
import {useConcepts} from "./useConcepts";
import {useTerminologies} from "./useTerminologies";
import {ErrorPanel} from "../../DocumentStyles";

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
    flex: 3;
  }
`;

const InputIcon = styled(Icon)`
  top: 50%;
  position: absolute;
  right: ${tokens.spacing.m};
  margin-top: -0.5em;
  pointer-events: none;
`;

enum LinkView {
  CONCEPT_LIST,
  CONCEPT_SUGGEST,
  WEB,
}

interface Props {
  isOpen: boolean,
  close: () => void,
  selection: Location,
}

const LinkModal = ({isOpen, close, selection}: Props) => {
  const editor = useSlate();

  const [linkText, setLinkText] = useState<string>('');
  const [linkUrl, setLinkUrl] = useState<string>('');
  const [linkView, setLinkView] = useState<LinkView>(LinkView.CONCEPT_LIST);

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
    setLinkView(LinkView.CONCEPT_LIST);
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
          <div style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
          }}>
            <Heading.h1>
              Lisää linkki
            </Heading.h1>

            <div>
              <ButtonLink
                  onClick={() => setLinkView(LinkView.CONCEPT_LIST)}
                  active={linkView === LinkView.CONCEPT_LIST}>
                Käsitelinkki
              </ButtonLink>

              &nbsp;<span style={{color: tokens.colors.depthBase}}>|</span>&nbsp;

              <ButtonLink
                  onClick={() => setLinkView(LinkView.WEB)}
                  active={linkView === LinkView.WEB}>
                Web-linkki
              </ButtonLink>
            </div>
          </div>

          <hr/>

          <div style={{flex: "1", overflowY: "scroll"}}>
            {linkView === LinkView.CONCEPT_LIST &&
            <ConceptLink
                linkUrl={linkUrl} setLinkUrl={setLinkUrl}
                linkText={linkText} setLinkText={setLinkText}
                suggest={() => setLinkView(LinkView.CONCEPT_SUGGEST)}/>}
            {linkView === LinkView.CONCEPT_SUGGEST &&
            <ConceptSuggestModal
                linkUrl={linkUrl} setLinkUrl={setLinkUrl}
                linkText={linkText} setLinkText={setLinkText}
                isOpen={linkView === LinkView.CONCEPT_SUGGEST}
                close={() => setLinkView(LinkView.CONCEPT_LIST)}/>}
            {linkView === LinkView.WEB &&
            <WebLink
                linkUrl={linkUrl} setLinkUrl={setLinkUrl}
                linkText={linkText} setLinkText={setLinkText}/>}
          </div>

          <div>
            <LabeledInput>
              <label htmlFor="url">
                Linkin osoite
              </label>
              <InputSmall name="url" value={linkUrl}
                          onChange={(e) => setLinkUrl(e.currentTarget.value)}/>
            </LabeledInput>

            <LabeledInput>
              <label htmlFor="text">
                Linkin teksti
              </label>
              <InputSmall name="text" value={linkText}
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

interface ConceptLinkProps extends LinkViewProps {
  suggest: () => void
}

const ConceptLink: React.FC<ConceptLinkProps> = ({linkUrl, setLinkUrl, linkText, setLinkText, suggest}) => {
  const [query, setQuery] = useState('');
  const {concepts} = useConcepts(query);
  const {lemma} = useLemma(linkText);

  useEffect(() => {
    setQuery(lemma);
  }, [lemma]);

  return (
      <div>
        <div style={{
          display: "flex",
          alignItems: "flex-end",
          marginBottom: tokens.spacing.s
        }}>
          <label style={{width: "100%", marginRight: tokens.spacing.m}}>
            Etsi käsitettä
            <div style={{position: "relative"}}>
              <Input value={query} onChange={(e) => setQuery(e.currentTarget.value)}/>
              <InputIcon icon={"search"}/>
            </div>
          </label>
          <Button.tertiary onClick={() => suggest()} style={{padding: tokens.spacing.s}}>
            Uusi käsite-ehdotus...
          </Button.tertiary>
        </div>

        <ConceptTable
            concepts={concepts}
            linkUrl={linkUrl} setLinkUrl={setLinkUrl}
            linkText={linkText} setLinkText={setLinkText}/>
      </div>
  );
};

interface ConceptTableProps extends LinkViewProps {
  concepts: Document,
}

const ConceptTable: React.FC<ConceptTableProps> = ({concepts, linkUrl, setLinkUrl, linkText, setLinkText}) => {
  return (
      <TableSmall>
        <thead>
        <tr>
          <th>Hakutulokset ({concepts.documentElement.childNodes.length})</th>
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
              <ConceptRow concept={e} expanded={uri === linkUrl}/>
            </td>
          </tr>;
        })}
        </tbody>
      </TableSmall>
  );
};

interface ConceptRowProps {
  concept: Element
  expanded: boolean,
}

const ConceptRow: React.FC<ConceptRowProps> = ({concept, expanded}) => {
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
};

interface ConceptSuggestModalProps extends LinkViewProps {
  isOpen: boolean,
  close: () => void,
}

const ConceptSuggestModal: React.FC<ConceptSuggestModalProps> = ({linkUrl, setLinkUrl, linkText, setLinkText, isOpen, close}) => {
  const {terminologies, suggestConcept} = useTerminologies();
  const [terminology, setTerminology] = useState("http://uri.suomi.fi/terminology/jhs/");
  const [label, setLabel] = useState(linkText);
  const [definition, setDefinition] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const labelComparator = (a: Element, b: Element): number => {
    const aLabel = queryFirstText(a, 'label');
    const bLabel = queryFirstText(b, 'label');
    return aLabel > bLabel ? 1 : (aLabel < bLabel ? -1 : 0);
  };

  return (
      <Modal isOpen={isOpen} contentLabel="Tee käsite-ehdotus" style={{
        overlay: {
          // ConceptSuggest can be triggered only from
          // link modal so no need for another overlay
          background: "none",
        },
        content: {
          height: "80%",
          marginRight: "0",
          marginLeft: "auto",
          maxWidth: 400,
          padding: tokens.spacing.l,
        }
      }}>
        <FlexColTight style={{height: "100%"}}>
          <Heading.h1>Tee käsite-ehdotus</Heading.h1>

          {errorMessage &&
          <ErrorPanel>
            Virhe lähetyksessä:<br/>
            {errorMessage ? errorMessage : ''}<br/>
          </ErrorPanel>}

          <label>
            Sanasto
            <div style={{position: "relative", width: "100%"}}>
              <Select value={terminology} onChange={(e) => setTerminology(e.currentTarget.value)}>
                {queryElements(terminologies.documentElement, 'terminology')
                .sort(labelComparator)
                .map((t, i) => (
                    <option key={i} value={queryFirstText(t, '@uri')}>
                      {queryFirstText(t, 'label')}
                    </option>
                ))}
              </Select>
              <InputIcon icon={"arrowheadDown"}/>
            </div>
          </label>

          <label>
            Nimike
            <Input value={label} onChange={(e) => setLabel(e.currentTarget.value)}/>
          </label>

          <label>
            Määritelmä
            <TextArea value={definition} onChange={(e) => setDefinition(e.currentTarget.value)}/>
          </label>

          <div style={{marginTop: "auto"}}>
            <Button icon={"mailSend"}
                    onClick={() => {
                      suggestConcept(terminology, label, definition).then((res) => {
                        setLinkUrl(res.data.documentElement.getAttribute("uri"));
                        setLinkText(label);
                        close();
                      }).catch((error) => {
                        setErrorMessage(error.response.data.message);
                      });
                    }}
                    style={{
                      marginRight: tokens.spacing.s,
                      background: tokens.colors.successBase,
                    }}>
              Lähetä ehdotus
            </Button>
            <Button.secondaryNoborder
                icon={"close"}
                onClick={() => close()}>
              Peruuta
            </Button.secondaryNoborder>
          </div>
        </FlexColTight>
      </Modal>
  );
};


export default LinkModal;
