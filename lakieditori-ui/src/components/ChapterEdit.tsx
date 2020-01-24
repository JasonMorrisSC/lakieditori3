import React, {CSSProperties, SyntheticEvent} from "react";
import {Button, Heading, suomifiDesignTokens as sdt} from "suomifi-ui-components";
import {
  cloneDocument,
  ensureElementAndUpdate,
  queryElements,
  queryFirstText,
  updateElement
} from "../utils/xml-utils";
import {XmlEditorProperties} from "./XmlEditorProperties";
import SectionEdit from "./SectionEdit";

const ChapterEdit: React.FC<XmlEditorProperties> = ({document, currentElement, currentPath, updateDocument}) => {
  let number = queryFirstText(document, currentElement, "@number");
  let title = queryFirstText(document, currentElement, "title").replace(/\s+/g, ' ').trimLeft();
  let content = queryFirstText(document, currentElement, "content").replace(/\s+/g, ' ').trimLeft();

  const inputStyle: CSSProperties = {
    backgroundColor: sdt.colors.highlightLight53,
    border: 0,
    boxSizing: 'border-box',
    fontFamily: sdt.values.typography.bodyText.fontFamily,
    fontSize: sdt.values.typography.bodyText.fontSize.value,
    fontWeight: sdt.values.typography.bodyText.fontWeight,
    lineHeight: sdt.values.typography.bodyText.lineHeight.value,
    margin: 0,
    padding: sdt.spacing.s,
    width: '100%',
  };

  function updateNumber(e: SyntheticEvent<HTMLInputElement>) {
    const newValue = e.currentTarget.value;
    updateDocument((prevDocument) => {
      return updateElement(cloneDocument(prevDocument), currentPath,
          (el) => el.setAttribute('number', newValue));
    });
  }

  function updateTitle(e: SyntheticEvent<HTMLInputElement>) {
    const newValue = e.currentTarget.value;
    updateDocument((prevDocument) => {
      // title element is expected to be in the document
      return updateElement(cloneDocument(prevDocument), currentPath + "/title",
          (el) => el.textContent = newValue);
    });
  }

  function resizeContent(e: SyntheticEvent<HTMLTextAreaElement>) {
    e.currentTarget.style.height = e.currentTarget.scrollHeight + "px";
  }

  function updateContent(e: SyntheticEvent<HTMLTextAreaElement>) {
    const newValue = e.currentTarget.value;
    updateDocument((prevDocument) => {
      return ensureElementAndUpdate(cloneDocument(prevDocument), currentPath,
          "content", ["section"], (el) => el.textContent = newValue);
    });
    resizeContent(e);
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

          <input type="text" value={title}
                 placeholder={`Luvun ${number} pakollinen otsikko`}
                 onChange={updateTitle}
                 style={{
                   ...inputStyle,
                   fontSize: sdt.values.typography.heading2.fontSize.value,
                   fontWeight: sdt.values.typography.heading2.fontWeight,
                   marginTop: sdt.spacing.xs
                 }}/>
        </Heading.h2>

        <textarea value={content}
                  placeholder={`Luvun ${number} tekstisisältö`}
                  onChange={updateContent}
                  onSelect={resizeContent}
                  style={{...inputStyle, marginTop: sdt.spacing.xs}}
                  rows={1}/>

        {queryElements(document, currentElement, 'section').map((section, i) => {
          return <div key={i} id={`chapter-${number}-section-${section.getAttribute('number')}`}>
            <SectionEdit document={document}
                         currentElement={section}
                         currentPath={currentPath + "/section[" + (i + 1) + "]"}
                         updateDocument={updateDocument}/>
          </div>
        })}

        <Button icon="plus" style={{marginTop: sdt.spacing.m}}>
          Lisää uusi pykälä lukuun {number}
        </Button>
      </div>
  );
};

export default ChapterEdit;
