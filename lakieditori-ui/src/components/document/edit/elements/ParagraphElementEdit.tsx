import React from "react";
import {suomifiDesignTokens as tokens} from "suomifi-ui-components";
import {
  cloneDocument,
  countNodes,
  ensureElementAndUpdate,
  queryElements,
  queryFirstElement,
  queryFirstNode,
  queryFirstText
} from "../../../../utils/xmlUtils";
import TextEditor from "../richtext/TextEditor";
import {StyledToolbarButton} from "../richtext/TextEditorToolbar";
import {ElementEditProps} from "./ElementEditProps";
import SubparagraphElementEdit from "./SubparagraphElementEdit";
import {splitIfTruthy} from "../../../../utils/arrayUtils";

const ParagraphElementEdit: React.FC<ElementEditProps> = ({document, setDocument, documentProperties, currentPath, currentElement}) => {
  const number = queryFirstText(currentElement, "@number");
  const content = queryFirstElement(currentElement, "content");
  const terminologyUris = splitIfTruthy(documentProperties["terminologies"], ",");

  function updateContent(newValue: string) {
    setDocument((prevDocument) => {
      return ensureElementAndUpdate(cloneDocument(prevDocument), currentPath,
          "content", ["subparagraph"], (el) => el.innerHTML = newValue);
    });
  }

  function addSubparagraph() {
    setDocument((prevDocument) => {
      const newDocument = cloneDocument(prevDocument);
      const newCurrentElement = queryFirstNode(newDocument, currentPath);

      if (newCurrentElement) {
        const subparagraphs = countNodes(newCurrentElement, "subparagraph")
        const newSubparagraph = newDocument.createElement("subparagraph");
        newSubparagraph.setAttribute("number", `${subparagraphs + 1}`);

        newCurrentElement.appendChild(newSubparagraph);
      }

      return newDocument;
    });
  }

  function removeParagraph() {
    setDocument((prevDocument) => {
      const newDocument = cloneDocument(prevDocument);
      const newCurrentElement = queryFirstNode(newDocument, currentPath);
      newCurrentElement?.parentNode?.removeChild(newCurrentElement);
      return newDocument;
    });
  }

  const customTools = (
      <div>
        <StyledToolbarButton icon={"plus"} style={{marginRight: tokens.spacing.m}}
                             onClick={addSubparagraph}>
          Lisää alakohta
        </StyledToolbarButton>
        <StyledToolbarButton icon={"close"} style={{marginRight: 0}} onClick={removeParagraph}>
          Poista
        </StyledToolbarButton>
      </div>
  );

  return (
      <li className="paragraph" style={{color: tokens.colors.highlightLight45}}>
        <TextEditor
            label={`Kohta ${number}`}
            value={content}
            setValue={updateContent}
            terminologyUris={terminologyUris}
            style={{color: tokens.colors.blackBase}}
            customTools={customTools}/>

        <ul>
          {queryElements(currentElement, 'subparagraph').map((paragraph, i) => (
              <SubparagraphElementEdit
                  key={i}
                  document={document}
                  currentElement={paragraph}
                  documentProperties={documentProperties}
                  currentPath={currentPath + "/subparagraph[" + (i + 1) + "]"}
                  setDocument={setDocument}/>
          ))}
        </ul>
      </li>
  );
};

export default ParagraphElementEdit;
