import React from "react";
import {suomifiDesignTokens as tokens} from "suomifi-ui-components";
import {
  cloneDocument,
  ensureElementAndUpdate,
  queryFirstElement,
  queryFirstNode,
  queryFirstText
} from "../../../../utils/xmlUtils";
import TextEditor from "../richtext/TextEditor";
import {StyledToolbarButton} from "../richtext/TextEditorToolbar";
import {ElementEditProps} from "../ElementEditProps";
import {splitIfTruthy} from "../../../../utils/arrayUtils";

const SubparagraphElementEdit: React.FC<ElementEditProps> = ({document, setDocument, documentProperties, currentPath, currentElement}) => {
  const number = queryFirstText(currentElement, "@number");
  const content = queryFirstElement(currentElement, "content");
  const terminologyUris = splitIfTruthy(documentProperties["terminologies"], ",");

  function updateContent(newValue: string) {
    setDocument((prevDocument) => {
      return ensureElementAndUpdate(cloneDocument(prevDocument), currentPath,
          "content", [], (el) => el.innerHTML = newValue);
    });
  }

  function removeSubparagraph() {
    setDocument((prevDocument) => {
      const newDocument = cloneDocument(prevDocument);
      const newCurrentElement = queryFirstNode(newDocument, currentPath);
      newCurrentElement?.parentNode?.removeChild(newCurrentElement);
      return newDocument;
    });
  }

  const customTools = (
      <div>
        <StyledToolbarButton icon={"close"} style={{marginRight: 0}} onClick={removeSubparagraph}>
          Poista
        </StyledToolbarButton>
      </div>
  );

  return (
      <li className="subparagraph" style={{color: tokens.colors.highlightLight45}}>
        <TextEditor
            document={document}
            label={`Alakohta ${number}`}
            value={content}
            setValue={updateContent}
            terminologyUris={terminologyUris}
            style={{color: tokens.colors.blackBase}}
            customTools={customTools}/>
      </li>
  );
};

export default SubparagraphElementEdit;
