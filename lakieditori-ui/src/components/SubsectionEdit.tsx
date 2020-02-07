import React from "react";
import {suomifiDesignTokens as sdt} from "suomifi-ui-components";
import {
  cloneDocument,
  ensureElementAndUpdate,
  queryFirstElement,
  queryFirstText
} from "../utils/xml-utils";
import {XmlEditorProperties} from "./XmlEditorProperties";
import FormattedTextEditor from "./FormattedTextEditor";
import {inputStyle} from "./inputStyle";

const SubsectionEdit: React.FC<XmlEditorProperties> = ({document, currentElement, currentPath, updateDocument}) => {
  const number = queryFirstText(document, currentElement, "@number");
  const content = queryFirstElement(document, currentElement, "content");

  function updateContent(newValue: string) {
    updateDocument((prevDocument) => {
      return ensureElementAndUpdate(cloneDocument(prevDocument), currentPath,
          "content", ["subsection"], (el) => el.innerHTML = newValue);
    });
  }

  return (
      <li className="subsection" style={{color: sdt.colors.depthBase}}>
        <FormattedTextEditor
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
      </li>
  );
};

export default SubsectionEdit;
