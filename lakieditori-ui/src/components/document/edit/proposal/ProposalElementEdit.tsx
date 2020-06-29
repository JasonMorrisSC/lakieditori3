/** @jsx jsx */
import {css, jsx} from '@emotion/core'
import React from "react";
import {Button, Dropdown, Heading, suomifiDesignTokens as tokens} from "suomifi-ui-components";
import {
  cloneDocument,
  countNodes,
  ensureElementAndUpdate,
  queryElements,
  queryFirstElement,
  queryFirstNode,
  queryFirstText,
  updateElement
} from "../../../../utils/xmlUtils";
import {ElementEditProps} from "../ElementEditProps";
import TextEditor from "../richtext/TextEditor";
import {DocumentState, documentStateLabelFi, parseDocumentState} from "../../DocumentTypes";
import {splitIfTruthy} from "../../../../utils/arrayUtils";
import styled from "@emotion/styled";
import ChapterElementEdit from "./ChapterElementEdit";

const PartHeading = styled(Heading.h2)`
  margin: ${tokens.spacing.xl} 0 ${tokens.spacing.s};
  text-transform: uppercase;
`;

const ProposalElementEdit: React.FC<ElementEditProps> = ({document, setDocument, documentProperties, currentPath, currentElement}) => {
  const number = queryFirstText(currentElement, "@number");
  const state = parseDocumentState(queryFirstText(currentElement, "@state"));
  const title = queryFirstElement(currentElement, "title");
  const abstract = queryFirstElement(currentElement, "abstract");
  const terminologyUris = splitIfTruthy(documentProperties["terminologies"], ",");
  const chapterCount = countNodes(currentElement, "chapter");

  function updateDocumentState(newValue: string) {
    setDocument((prevDocument) => {
      const newDocument = cloneDocument(prevDocument);
      newDocument.documentElement.setAttribute('state', newValue);
      return newDocument;
    });
  }

  function updateTitle(newValue: string) {
    setDocument((prevDocument) => {
      // title element is expected to be in the document
      return updateElement(cloneDocument(prevDocument), currentPath + "/title",
          (el) => el.innerHTML = newValue);
    });
  }

  function updateAbstract(newValue: string) {
    setDocument((prevDocument) => {
      return ensureElementAndUpdate(cloneDocument(prevDocument), currentPath,
          "abstract", ["chapter"], (el) => el.innerHTML = newValue);
    });
  }

  function appendNewChapter() {
    setDocument((prevDocument) => {
      const newDocument = cloneDocument(prevDocument);

      const chapterElement = newDocument.createElement("chapter");
      chapterElement.setAttribute("number", (chapterCount + 1) + "");
      chapterElement.appendChild(newDocument.createElement("heading"));

      queryFirstNode(newDocument, currentPath)?.appendChild(chapterElement);
      return newDocument;
    });
  }

  return (
      <article>
        <Heading.h1hero>
          <div style={{display: 'inline-flex', justifyContent: "space-between", width: "100%"}}>
            <small style={{color: tokens.colors.accentBase}}>{number}</small>
            <Dropdown name={"Tila: " + documentStateLabelFi(state)} changeNameToSelection={false}
                      css={css`button { margin: 0; }`}>
              <Dropdown.item onSelect={() => updateDocumentState('UNSTABLE')}>
                {documentStateLabelFi(DocumentState.UNSTABLE)}
              </Dropdown.item>
              <Dropdown.item onSelect={() => updateDocumentState('DRAFT')}>
                {documentStateLabelFi(DocumentState.DRAFT)}
              </Dropdown.item>
              <Dropdown.item onSelect={() => updateDocumentState('RECOMMENDATION')}>
                {documentStateLabelFi(DocumentState.RECOMMENDATION)}
              </Dropdown.item>
              <Dropdown.item onSelect={() => updateDocumentState('DEPRECATED')}>
                {documentStateLabelFi(DocumentState.DEPRECATED)}
              </Dropdown.item>
            </Dropdown>
          </div>
          <br/>
          <TextEditor
              document={document}
              label="Otsikko"
              value={title}
              setValue={updateTitle}
              terminologyUris={terminologyUris}
              style={{
                fontSize: tokens.values.typography.heading1Hero.fontSize.value,
                fontWeight: tokens.values.typography.heading1Hero.fontWeight,
              }}/>
        </Heading.h1hero>

        <PartHeading>Esityksen pääasiallinen sisältö</PartHeading>

        <TextEditor
            document={document}
            label="Tiivistelmä"
            value={abstract}
            setValue={updateAbstract}
            inline={false}
            terminologyUris={terminologyUris}
            style={{
              fontSize: tokens.values.typography.leadText.fontSize.value,
              fontWeight: tokens.values.typography.leadText.fontWeight,
            }}/>

        <PartHeading>Perustelut</PartHeading>

        {queryElements(currentElement, 'chapter').map((chapter, i) => (
            <ChapterElementEdit key={i}
                                document={document}
                                currentElement={chapter}
                                documentProperties={documentProperties}
                                currentPath={currentPath + "/chapter[" + (i + 1) + "]"}
                                setDocument={setDocument}/>
        ))}

        <Button
            icon="plus"
            onClick={appendNewChapter}
            style={{marginTop: tokens.spacing.l}}>
          Lisää uusi luku
        </Button>

      </article>
  );
};

export default ProposalElementEdit;
