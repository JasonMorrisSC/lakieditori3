import React from "react";
import {
  cloneDocument,
  ensureElementAndUpdate,
  queryFirstElement,
  queryFirstNode,
  queryFirstText
} from "../../../../utils/xmlUtils";
import {ElementEditProps} from "./ElementEditProps";
import TextEditor from "../richtext/TextEditor";
import {ToolbarButton} from "../richtext/TextEditorToolbar";

const SubsectionElementEdit: React.FC<ElementEditProps> = ({document, setDocument, currentPath, currentElement}) => {
  const number = queryFirstText(currentElement, "@number");
  const content = queryFirstElement(currentElement, "content");

  function updateContent(newValue: string) {
    setDocument((prevDocument) => {
      return ensureElementAndUpdate(cloneDocument(prevDocument), currentPath,
          "content", ["subsection"], (el) => el.innerHTML = newValue);
    });
  }

  function removeSubsection() {
    setDocument((prevDocument) => {
      const newDocument = cloneDocument(prevDocument);
      const newCurrentElement = queryFirstNode(newDocument, currentPath);
      newCurrentElement?.parentNode?.removeChild(newCurrentElement);
      return newDocument;
    });
  }

  const removeButton = (
      <ToolbarButton onMouseDown={removeSubsection}>
        <span className={"material-icons"}>close</span>
      </ToolbarButton>
  );

  return (
      <div className="subsection">
        <TextEditor
            label={`Momentti ${number}`}
            value={content}
            setValue={updateContent}
            customTools={removeButton}/>
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
