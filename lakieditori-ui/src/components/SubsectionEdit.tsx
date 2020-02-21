import React from "react";
import {suomifiDesignTokens as sdt} from "suomifi-ui-components";
import {
  cloneDocument,
  ensureElementAndUpdate,
  queryFirstElement,
  queryFirstText
} from "../utils/xml-utils";
import {XmlEditorProperties} from "./XmlEditorProperties";
import RichTextEditor from "./RichTextEditor";
import {inputStyle} from "./inputStyle";

const SubsectionEdit: React.FC<XmlEditorProperties> = ({document, currentElement, currentPath, updateDocument}) => {
  const number = queryFirstText(currentElement, "@number");
  const content = queryFirstElement(currentElement, "content");

  function updateContent(newValue: string) {
    updateDocument((prevDocument) => {
      return ensureElementAndUpdate(cloneDocument(prevDocument), currentPath,
          "content", ["subsection"], (el) => el.innerHTML = newValue);
    });
  }

  return (
      <div className="subsection">
        <RichTextEditor
            value={content}
            placeholder={`Momentin ${number} pakollinen tekstisisältö`}
            onChange={updateContent}
            style={{
              ...inputStyle,
              color: sdt.colors.blackBase
            }}/>
        {/*
        <ul style={{padding: 0}}>
          {queryElements(document, currentElement, 'paragraph').map((paragraph, i) => {
            return <Paragraph key={i} paragraph={paragraph}/>
          })}
        </ul>
        */}
      </div>
  );
};

export default SubsectionEdit;
