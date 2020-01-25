import React, {SyntheticEvent} from "react";
import {suomifiDesignTokens as sdt} from "suomifi-ui-components";
import {cloneDocument, ensureElementAndUpdate, queryFirstText} from "../utils/xml-utils";
import {XmlEditorProperties} from "./XmlEditorProperties";
import TextArea from "./TextArea";

const SubsectionEdit: React.FC<XmlEditorProperties> = ({document, currentElement, currentPath, updateDocument}) => {
  let number = queryFirstText(document, currentElement, "@number");
  let content = queryFirstText(document, currentElement, "content").replace(/\s+/g, ' ').trimLeft();

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
      <li className="subsection" style={{color: sdt.colors.depthBase}}>
        <TextArea value={content}
                  placeholder={`Momentin ${number} pakollinen tekstisisältö`}
                  onChange={updateContent}
                  style={{verticalAlign: "middle"}}/>
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
