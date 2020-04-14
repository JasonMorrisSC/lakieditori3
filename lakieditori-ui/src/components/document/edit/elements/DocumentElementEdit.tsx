import React from "react";
import {Button, Dropdown, Heading, suomifiDesignTokens as sdt} from "suomifi-ui-components";
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
import {ElementEditProps} from "./ElementEditProps";
import {inputStyle} from "../../../common/inputStyle";
import RichTextEditor from "../richtext/RichTextEditor";
import {DocumentState, documentStateLabelFi, parseDocumentState} from "../../DocumentTypes";
import {css} from "@emotion/core";
import ChapterElementEdit from "./ChapterElementEdit";

const DocumentElementEdit: React.FC<ElementEditProps> = ({document, setDocument, currentPath, currentElement}) => {
  const number = queryFirstText(currentElement, "@number");
  const state = parseDocumentState(queryFirstText(currentElement, "@state"));
  const title = queryFirstElement(currentElement, "title");
  const note = queryFirstElement(currentElement, "note");
  const intro = queryFirstElement(currentElement, "intro");

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
      const chapterCount = countNodes(newDocument, currentPath + '/chapter');

      const chapterElement = newDocument.createElement("chapter");
      chapterElement.setAttribute('number', (chapterCount + 1) + "");
      chapterElement.appendChild(newDocument.createElement("title"));

      queryFirstNode(newDocument, currentPath)?.appendChild(chapterElement);
      return newDocument;
    });
  }

  return (
      <article>
        <Heading.h1hero>
          <div style={{display: 'inline-flex', justifyContent: "space-between", width: "100%"}}>
            <small style={{color: sdt.colors.accentBase}}>{number}</small>
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
          <RichTextEditor
              value={title}
              placeholder="Otsikko (pakollinen)"
              onChange={updateTitle}
              style={{
                ...inputStyle,
                fontSize: sdt.values.typography.heading1Hero.fontSize.value,
                fontWeight: sdt.values.typography.heading1Hero.fontWeight,
              }}/>
        </Heading.h1hero>

        <RichTextEditor
            value={intro}
            placeholder="Johtolause"
            onChange={updateIntro}
            style={{
              ...inputStyle,
              fontSize: sdt.values.typography.leadText.fontSize.value,
              fontWeight: sdt.values.typography.leadText.fontWeight,
            }}/>

        {queryElements(currentElement, 'chapter').map((chapter, i) => {
          return <div key={i} id={`chapter-${chapter.getAttribute('number')}`}>
            <ChapterElementEdit document={document}
                                currentElement={chapter}
                                currentPath={currentPath + "/chapter[" + (i + 1) + "]"}
                                setDocument={setDocument}/>
          </div>
        })}

        <Button.secondaryNoborder icon="plus" onClick={appendNewChapter}>
          Lisää uusi luku
        </Button.secondaryNoborder>
      </article>
  );
};

export default DocumentElementEdit;
