import React from "react";
import {suomifiDesignTokens as tokens} from "suomifi-ui-components";
import {
  cloneDocument,
  queryFirstElement,
  queryFirstNode,
  queryFirstText
} from "../../../../utils/xmlUtils";
import TextEditor from "../richtext/TextEditor";
import {StyledToolbarButton} from "../richtext/TextEditorToolbar";
import {ElementEditProps} from "../ElementEditProps";
import {suomifiDesignTokens as sdt} from "suomifi-design-tokens";
import {splitIfTruthy} from "../../../../utils/arrayUtils";

const SubheadingElementEdit: React.FC<ElementEditProps> = ({document, setDocument, documentProperties, currentPath, currentElement}) => {
  const number = queryFirstText(currentElement, "@number");
  const terminologyUris = splitIfTruthy(documentProperties["terminologies"], ",");

  function updateContent(newValue: string) {
    setDocument((prevDocument) => {
      const newDocument = cloneDocument(prevDocument);
      const newCurrentElement = queryFirstElement(newDocument, currentPath);
      if (newCurrentElement) {
        newCurrentElement.innerHTML = newValue;
      }
      return newDocument;
    });
  }

  function removeSubheading() {
    setDocument((prevDocument) => {
      const newDocument = cloneDocument(prevDocument);
      const newCurrentElement = queryFirstNode(newDocument, currentPath);
      newCurrentElement?.parentNode?.removeChild(newCurrentElement);
      return newDocument;
    });
  }

  const customTools = (
      <div>
        <StyledToolbarButton icon={"close"} style={{marginRight: 0}} onClick={removeSubheading}>
          Poista
        </StyledToolbarButton>
      </div>
  );

  return (
      <div className="subheading" style={{marginTop: sdt.spacing.l}}>
        <TextEditor
            label={`Väliotsikko ${number}`}
            value={currentElement}
            setValue={updateContent}
            terminologyUris={terminologyUris}
            style={{color: tokens.colors.blackBase}}
            customTools={customTools}/>
      </div>
  );
};

export default SubheadingElementEdit;
