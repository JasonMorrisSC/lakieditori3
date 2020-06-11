/** @jsx jsx */
import {css, jsx} from '@emotion/core'
import React from "react";
import {Dropdown, Heading, suomifiDesignTokens as tokens} from "suomifi-ui-components";
import {
  cloneDocument,
  ensureElementAndUpdate,
  queryFirstElement,
  queryFirstText,
  updateElement
} from "../../../../utils/xmlUtils";
import {ElementEditProps} from "../ElementEditProps";
import TextEditor from "../richtext/TextEditor";
import {DocumentState, documentStateLabelFi, parseDocumentState} from "../../DocumentTypes";
import {splitIfTruthy} from "../../../../utils/arrayUtils";

const ProposalElementEdit: React.FC<ElementEditProps> = ({document, setDocument, documentProperties, currentPath, currentElement}) => {
  const number = queryFirstText(currentElement, "@number");
  const state = parseDocumentState(queryFirstText(currentElement, "@state"));
  const title = queryFirstElement(currentElement, "title");
  const abstract = queryFirstElement(currentElement, "abstract");
  const terminologyUris = splitIfTruthy(documentProperties["terminologies"], ",");

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
          "abstract", [], (el) => el.innerHTML = newValue);
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
              label="Otsikko"
              value={title}
              setValue={updateTitle}
              terminologyUris={terminologyUris}
              style={{
                fontSize: tokens.values.typography.heading1Hero.fontSize.value,
                fontWeight: tokens.values.typography.heading1Hero.fontWeight,
              }}/>
        </Heading.h1hero>

        <TextEditor
            label="Tiivistelmä"
            value={abstract}
            setValue={updateAbstract}
            inline={false}
            terminologyUris={terminologyUris}
            style={{
              fontSize: tokens.values.typography.leadText.fontSize.value,
              fontWeight: tokens.values.typography.leadText.fontWeight,
            }}/>

      </article>
  );
};

export default ProposalElementEdit;
