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
import SubsectionEdit from "./SubsectionEdit";

const SectionEdit: React.FC<XmlEditorProperties> = ({document, currentElement, currentPath, updateDocument}) => {
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
          "content", ["subsection"], (el) => el.textContent = newValue);
    });
    resizeContent(e);
  }

  return (
      <div className="section" style={{marginTop: sdt.spacing.l}}>
        <Heading.h3>
          <input type="text" value={number}
                 onChange={updateNumber}
                 style={{
                   ...inputStyle,
                   color: sdt.colors.highlightBase,
                   fontSize: sdt.values.typography.heading3.fontSize.value,
                   fontWeight: sdt.values.typography.heading3.fontWeight,
                   marginRight: sdt.spacing.xs,
                   width: `${(number.length + 1) * 16}px`
                 }}/>
          <span style={{color: sdt.colors.highlightBase}}>
            §
          </span>

          <input type="text" value={title}
                 placeholder={`Pykälän ${number} pakollinen otsikko`}
                 onChange={updateTitle}
                 style={{
                   ...inputStyle,
                   fontSize: sdt.values.typography.heading3.fontSize.value,
                   fontWeight: sdt.values.typography.heading3.fontWeight,
                   marginTop: sdt.spacing.xs
                 }}/>
        </Heading.h3>
        <textarea value={content}
                  placeholder={`Pykälän ${number} tekstisisältö`}
                  onChange={updateContent}
                  onSelect={resizeContent}
                  style={{...inputStyle, marginTop: sdt.spacing.xs}}
                  rows={2}/>

        <ul style={{padding: 0, margin: `${sdt.spacing.s} 0 ${sdt.spacing.xs} 0`}}>
          {queryElements(document, currentElement, 'subsection').map((subsection, i) => {
            return <SubsectionEdit key={i}
                                   document={document}
                                   currentElement={subsection}
                                   currentPath={currentPath + "/subsection[" + (i + 1) + "]"}
                                   updateDocument={updateDocument}/>
          })}
        </ul>

        <Button.secondaryNoborder icon="plus"
                                  style={{backgroundColor: sdt.colors.highlightLight53}}>
          Lisää uusi momentti
        </Button.secondaryNoborder>
      </div>
  );
};

export default SectionEdit;
