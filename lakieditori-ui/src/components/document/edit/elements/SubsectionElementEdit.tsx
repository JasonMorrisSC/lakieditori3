import React from "react";
import {suomifiDesignTokens as sdt} from "suomifi-ui-components";
import {
  cloneDocument,
  ensureElementAndUpdate,
  queryFirstElement,
  queryFirstText
} from "../../../../utils/xmlUtils";
import {ElementEditProps} from "./ElementEditProps";
import TextEditor from "../richtext/TextEditor";
import {inputStyle} from "../../../common/inputStyle";

const SubsectionElementEdit: React.FC<ElementEditProps> = ({document, setDocument, currentPath, currentElement}) => {
  const number = queryFirstText(currentElement, "@number");
  const content = queryFirstElement(currentElement, "content");

  function updateContent(newValue: string) {
    setDocument((prevDocument) => {
      return ensureElementAndUpdate(cloneDocument(prevDocument), currentPath,
          "content", ["subsection"], (el) => el.innerHTML = newValue);
    });
  }

  return (
      <div className="subsection">
        <TextEditor
            value={content}
            placeholder={`Momentti ${number}`}
            onChange={updateContent}
            style={{
              ...inputStyle,
              color: sdt.colors.blackBase
            }}/>
        {/*
        <ul style={{padding: 0}}>
          {queryElements(document, currentElement, 'paragraph').map((paragraph, i) => {
            return <ParagraphElement key={i} paragraph={paragraph}/>
          })}
        </ul>
        */}
      </div>
  );
};

export default SubsectionElementEdit;
