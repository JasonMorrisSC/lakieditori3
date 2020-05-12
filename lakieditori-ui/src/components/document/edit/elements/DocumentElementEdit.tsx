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
  queryTexts,
  updateElement
} from "../../../../utils/xmlUtils";
import {ElementEditProps} from "./ElementEditProps";
import TextEditor from "../richtext/TextEditor";
import {DocumentState, documentStateLabelFi, parseDocumentState} from "../../DocumentTypes";
import ChapterElementEdit from "./ChapterElementEdit";
import SectionElementEdit from "./SectionElementEdit";

const DocumentElementEdit: React.FC<ElementEditProps> = ({document, setDocument, currentPath, currentElement}) => {
  const number = queryFirstText(currentElement, "@number");
  const state = parseDocumentState(queryFirstText(currentElement, "@state"));
  const title = queryFirstElement(currentElement, "title");
  const intro = queryFirstElement(currentElement, "intro");
  const terminologyUris = queryTexts(document.documentElement, "/document/settings/vocabulary");

  const chapterCount = countNodes(currentElement, "chapter");
  const sectionCount = countNodes(currentElement, "section");

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

  function appendNewChapter() {
    setDocument((prevDocument) => {
      const newDocument = cloneDocument(prevDocument);

      const chapterElement = newDocument.createElement("chapter");
      chapterElement.setAttribute("number", (chapterCount + 1) + "");
      chapterElement.appendChild(newDocument.createElement("title"));

      queryFirstNode(newDocument, currentPath)?.appendChild(chapterElement);
      return newDocument;
    });
  }

  function appendNewSection() {
    setDocument((prevDocument) => {
      const newDocument = cloneDocument(prevDocument);

      const sectionElement = newDocument.createElement("section");
      sectionElement.setAttribute("number", (sectionCount + 1) + "");
      sectionElement.appendChild(newDocument.createElement("title"));

      queryFirstNode(newDocument, currentPath)?.appendChild(sectionElement);
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

        {queryElements(currentElement, 'chapter').map((chapter, i) => {
          return <div key={i} id={`chapter-${chapter.getAttribute('number')}`}>
            <ChapterElementEdit document={document}
                                currentElement={chapter}
                                currentPath={currentPath + "/chapter[" + (i + 1) + "]"}
                                setDocument={setDocument}/>
          </div>
        })}

        {queryElements(currentElement, 'section').map((section, i) => {
          return <div key={i} id={`section-${section.getAttribute('number')}`}>
            <SectionElementEdit document={document}
                                currentElement={section}
                                currentPath={currentPath + "/section[" + (i + 1) + "]"}
                                setDocument={setDocument}/>
          </div>
        })}

        {sectionCount === 0 &&
        <Button.secondaryNoborder
            icon="plus"
            onClick={appendNewChapter}
            style={{marginTop: tokens.spacing.l, marginRight: tokens.spacing.s}}>
          Lisää uusi luku
        </Button.secondaryNoborder>}
        {chapterCount === 0 &&
        <Button.secondaryNoborder
            icon="plus" onClick={appendNewSection}
            style={{marginTop: tokens.spacing.l}}>
          Lisää uusi pykälä
        </Button.secondaryNoborder>}
      </article>
  );
};

export default DocumentElementEdit;
