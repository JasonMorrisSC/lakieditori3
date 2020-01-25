import React, {SyntheticEvent} from "react";
import {Button, Heading, suomifiDesignTokens as sdt} from "suomifi-ui-components";
import {
  cloneDocument,
  countNodes,
  ensureElementAndUpdate,
  queryElements,
  queryFirstNode,
  queryFirstText,
  updateElement
} from "../utils/xml-utils";
import {XmlEditorProperties} from "./XmlEditorProperties";
import SectionEdit from "./SectionEdit";
import {inputStyle} from "./inputStyle";
import TextArea from "./TextArea";

const ChapterEdit: React.FC<XmlEditorProperties> = ({document, currentElement, currentPath, updateDocument}) => {
  let number = queryFirstText(document, currentElement, "@number");
  let title = queryFirstText(document, currentElement, "title").replace(/\s+/g, ' ').trimLeft();
  let content = queryFirstText(document, currentElement, "content").replace(/\s+/g, ' ').trimLeft();

  function updateNumber(e: SyntheticEvent<HTMLInputElement>) {
    const newValue = e.currentTarget.value;
    updateDocument((prevDocument) => {
      return updateElement(cloneDocument(prevDocument), currentPath,
          (el) => el.setAttribute('number', newValue));
    });
  }

  function updateTitle(e: SyntheticEvent<HTMLTextAreaElement>) {
    const newValue = e.currentTarget.value;
    updateDocument((prevDocument) => {
      return updateElement(cloneDocument(prevDocument), currentPath + "/title",
          (el) => el.textContent = newValue);
    });
  }

  function updateContent(e: SyntheticEvent<HTMLTextAreaElement>) {
    const newValue = e.currentTarget.value;
    updateDocument((prevDocument) => {
      return ensureElementAndUpdate(cloneDocument(prevDocument), currentPath,
          "content", ["section"], (el) => el.textContent = newValue);
    });
  }

  function appendNewSection() {
    updateDocument((prevDocument) => {
      const newDocument = cloneDocument(prevDocument);
      const sectionCount = countNodes(newDocument, currentPath + '/section');

      const sectionElement = newDocument.createElement("section");
      sectionElement.setAttribute('number', (sectionCount + 1) + "");
      sectionElement.appendChild(newDocument.createElement("title"));

      queryFirstNode(newDocument, null, currentPath)?.appendChild(sectionElement);
      return newDocument;
    });
  }

  return (
      <div className="chapter" style={{margin: `${sdt.spacing.xl} 0`}}>
        <Heading.h2>
          <input type="text" value={number}
                 onChange={updateNumber}
                 style={{
                   ...inputStyle,
                   color: sdt.colors.highlightBase,
                   fontSize: sdt.values.typography.heading2.fontSize.value,
                   fontWeight: sdt.values.typography.heading2.fontWeight,
                   marginRight: sdt.spacing.xs,
                   width: `${(number.length + 1) * 18}px`
                 }}/>
          <span style={{color: sdt.colors.highlightBase}}>
            luku
          </span>

          <TextArea value={title}
                    placeholder={`Luvun ${number} pakollinen otsikko`}
                    onChange={updateTitle}
                    style={{
                      ...inputStyle,
                      fontSize: sdt.values.typography.heading2.fontSize.value,
                      fontWeight: sdt.values.typography.heading2.fontWeight,
                    }}/>
        </Heading.h2>

        <TextArea value={content}
                  placeholder={`Luvun ${number} tekstisisältö`}
                  onChange={updateContent}
                  rows={1}/>

        {queryElements(document, currentElement, 'section').map((section, i) => {
          return <div key={i} id={`chapter-${number}-section-${section.getAttribute('number')}`}>
            <SectionEdit document={document}
                         currentElement={section}
                         currentPath={currentPath + "/section[" + (i + 1) + "]"}
                         updateDocument={updateDocument}/>
          </div>
        })}

        <Button icon="plus" onClick={appendNewSection} style={{marginTop: sdt.spacing.m}}>
          Lisää uusi pykälä lukuun {number}
        </Button>
      </div>
  );
};

export default ChapterEdit;
