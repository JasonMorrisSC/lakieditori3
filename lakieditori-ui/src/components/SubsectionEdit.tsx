import React, {CSSProperties, SyntheticEvent} from "react";
import {suomifiDesignTokens as sdt} from "suomifi-ui-components";
import {cloneDocument, ensureElementAndUpdate, queryFirstText} from "../utils/xml-utils";
import {XmlEditorProperties} from "./XmlEditorProperties";

const SubsectionEdit: React.FC<XmlEditorProperties> = ({document, currentElement, currentPath, updateDocument}) => {
  let number = queryFirstText(document, currentElement, "@number");
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
      <li className="subsection" style={{color: sdt.colors.highlightLight45}}>
        <textarea value={content}
                  placeholder={`Momentin ${number} pakollinen tekstisisältö`}
                  onChange={updateContent}
                  onSelect={resizeContent}
                  style={{...inputStyle, marginTop: sdt.spacing.xxs, verticalAlign: "middle"}}
                  rows={3}/>
        {/*
        <ul style={{padding: 0}}>
          {queryElements(document, currentElement, 'paragraph').map((paragraph, i) => {
            return <Paragraph key={i} paragraph={paragraph}/>
          })}
        </ul>
        */}
      </li>
  );
};

export default SubsectionEdit;
