/** @jsx jsx */
import {css, jsx} from '@emotion/core'
import React from "react";
import {Button, Dropdown, Heading, suomifiDesignTokens as tokens} from "suomifi-ui-components";
import {
  childElements,
  cloneDocument,
  countNodes,
  ensureElementAndUpdate,
  queryFirstElement,
  queryFirstNode,
  queryFirstText,
  queryTexts,
  updateElement
} from "../../../../utils/xmlUtils";
import {ElementEditProps} from "./ElementEditProps";
import TextEditor from "../richtext/TextEditor";
import {DocumentState, documentStateLabelFi, parseDocumentState} from "../../DocumentTypes";
import ChapterElementEdit from "./ChapterElementEdit";
import SectionElementEdit from "./SectionElementEdit";
import SubheadingElementEdit from "./SubheadingElementEdit";
import PartElementEdit from "./PartElementEdit";

const DocumentElementEdit: React.FC<ElementEditProps> = ({document, setDocument, currentPath, currentElement}) => {
  const number = queryFirstText(currentElement, "@number");
  const state = parseDocumentState(queryFirstText(currentElement, "@state"));
  const title = queryFirstElement(currentElement, "title");
  const intro = queryFirstElement(currentElement, "intro");
  const terminologyUris = queryTexts(document.documentElement, "/document/settings/vocabulary");

  const partCount = countNodes(currentElement, "part");
  const chapterCount = countNodes(currentElement, "chapter");
  const sectionCount = countNodes(currentElement, "section");
  const subheadingCount = countNodes(currentElement, "subheading");

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

  function updateIntro(newValue: string) {
    setDocument((prevDocument) => {
      return ensureElementAndUpdate(cloneDocument(prevDocument), currentPath,
          "intro", ["chapter", "section"], (el) => el.innerHTML = newValue);
    });
  }

  function appendNewPart() {
    setDocument((prevDocument) => {
      const newDocument = cloneDocument(prevDocument);

      const partElement = newDocument.createElement("part");
      partElement.setAttribute("number", (partCount + 1) + "");
      partElement.appendChild(newDocument.createElement("title"));

      queryFirstNode(newDocument, currentPath)?.insertBefore(partElement,
          queryFirstNode(newDocument, "/document/settings"));
      return newDocument;
    });
  }

  function appendNewChapter() {
    setDocument((prevDocument) => {
      const newDocument = cloneDocument(prevDocument);

      const chapterElement = newDocument.createElement("chapter");
      chapterElement.setAttribute("number", (chapterCount + 1) + "");
      chapterElement.appendChild(newDocument.createElement("title"));

      queryFirstNode(newDocument, currentPath)?.insertBefore(chapterElement,
          queryFirstNode(newDocument, "/document/settings"));
      return newDocument;
    });
  }

  function appendNewSection() {
    setDocument((prevDocument) => {
      const newDocument = cloneDocument(prevDocument);

      const sectionElement = newDocument.createElement("section");
      sectionElement.setAttribute("number", (sectionCount + 1) + "");
      sectionElement.appendChild(newDocument.createElement("title"));

      queryFirstNode(newDocument, currentPath)?.insertBefore(sectionElement,
          queryFirstNode(newDocument, "/document/settings"));
      return newDocument;
    });
  }

  function appendNewSubheading() {
    setDocument((prevDocument) => {
      const newDocument = cloneDocument(prevDocument);

      const sectionElement = newDocument.createElement("subheading");
      sectionElement.setAttribute("number", (subheadingCount + 1) + "");

      queryFirstNode(newDocument, currentPath)?.insertBefore(sectionElement,
          queryFirstNode(newDocument, "/document/settings"));
      return newDocument;
    });
  }

  const renderDocumentChildElements = (element: Element) => {
    let chapterCounter = 1;
    let sectionCounter = 1;
    let subheadingCounter = 1;

    return childElements(element).map((e, i) => {
      switch (e.tagName) {
        case "section":
          return <div key={i} id={`section-${e.getAttribute('number')}`}>
            <SectionElementEdit
                document={document}
                currentElement={e}
                currentPath={currentPath + "/section[" + (sectionCounter++) + "]"}
                setDocument={setDocument}/>
          </div>;
        case "subheading":
          return <div key={i} id={`subheading-${e.getAttribute('number')}`}>
            <SubheadingElementEdit
                document={document}
                currentElement={e}
                currentPath={currentPath + "/subheading[" + (subheadingCounter++) + "]"}
                setDocument={setDocument}/>
          </div>;
        case "chapter":
          return <div key={i} id={`chapter-${e.getAttribute('number')}`}>
            <ChapterElementEdit
                document={document}
                currentElement={e}
                currentPath={currentPath + "/chapter[" + (chapterCounter++) + "]"}
                setDocument={setDocument}/>
          </div>;
        case "part":
          return <div key={i} id={`part-${e.getAttribute('number')}`}>
            <PartElementEdit
                document={document}
                currentElement={e}
                currentPath={currentPath + "/part[" + (chapterCounter++) + "]"}
                setDocument={setDocument}/>
          </div>;
        default:
          return "";
      }
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
            label="Johtolause"
            value={intro}
            setValue={updateIntro}
            terminologyUris={terminologyUris}
            style={{
              fontSize: tokens.values.typography.leadText.fontSize.value,
              fontWeight: tokens.values.typography.leadText.fontWeight,
            }}/>

        {renderDocumentChildElements(currentElement)}

        {(partCount === 0 && sectionCount === 0 && subheadingCount === 0) &&
        <Button.secondaryNoborder
            icon="plus"
            onClick={appendNewChapter}
            style={{marginTop: tokens.spacing.l, marginRight: tokens.spacing.s}}>
          Lisää uusi luku
        </Button.secondaryNoborder>}
        {(partCount === 0 && chapterCount === 0) &&
        <Button.secondaryNoborder
            icon="plus" onClick={appendNewSection}
            style={{marginTop: tokens.spacing.l}}>
          Lisää uusi pykälä
        </Button.secondaryNoborder>}
        {(partCount === 0 && chapterCount === 0) &&
        <Button.secondaryNoborder
            icon="plus"
            onClick={appendNewSubheading}
            style={{marginTop: tokens.spacing.l, marginRight: tokens.spacing.s}}>
          Lisää uusi väliotsikko
        </Button.secondaryNoborder>}
        {(sectionCount === 0 && subheadingCount === 0 && chapterCount === 0) &&
        <Button.secondaryNoborder
            icon="plus"
            onClick={appendNewPart}
            style={{marginTop: tokens.spacing.l, marginRight: tokens.spacing.s}}>
          Lisää uusi osa
        </Button.secondaryNoborder>}
      </article>
  );
};

export default DocumentElementEdit;
