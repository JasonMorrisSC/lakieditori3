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
import {ElementEditProps} from "../ElementEditProps";
import ParagraphElementEdit from "./ParagraphElementEdit";
import {splitIfTruthy} from "../../../../utils/arrayUtils";
import {FlexRow} from "../../../common/StyledComponents";

const SubsectionElementEdit: React.FC<ElementEditProps> = ({document, setDocument, documentProperties, currentPath, currentElement, showComments}) => {
  const number = queryFirstText(currentElement, "@number");
  const content = queryFirstElement(currentElement, "content");
  const contentComments = queryFirstElement(currentElement, "contentComments");
  const terminologyUris = splitIfTruthy(documentProperties["terminologies"], ",");

  function updateContent(newValue: string) {
    setDocument((prevDocument) => {
      return ensureElementAndUpdate(cloneDocument(prevDocument), currentPath,
          "content", ["contentComments", "paragraph"], (el) => el.innerHTML = newValue);
    });
  }

  function updateContentComments(newValue: string) {
    setDocument((prevDocument) => {
      return ensureElementAndUpdate(cloneDocument(prevDocument), currentPath,
          "contentComments", ["paragraph"], (el) => el.innerHTML = newValue);
    });
  }

  function addParagraph() {
    setDocument((prevDocument) => {
      const newDocument = cloneDocument(prevDocument);
      const newCurrentElement = queryFirstNode(newDocument, currentPath);

      if (newCurrentElement) {
        const paragraphs = countNodes(newCurrentElement, "paragraph")
        const newParagraph = newDocument.createElement("paragraph");
        newParagraph.setAttribute("number", `${paragraphs + 1}`);

        newCurrentElement.appendChild(newParagraph);
      }

      return newDocument;
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

  const customTools = (
      <div>
        <StyledToolbarButton icon={"plus"} style={{marginRight: tokens.spacing.m}}
                             onClick={addParagraph}>
          Lisää kohta
        </StyledToolbarButton>
        <StyledToolbarButton icon={"close"} style={{marginRight: 0}} onClick={removeSubsection}>
          Poista
        </StyledToolbarButton>
      </div>
  );

  return (
      <div className="subsection">

        <FlexRow>
          <TextEditor
              document={document}
              label={`Momentti ${number}`}
              value={content}
              setValue={updateContent}
              terminologyUris={terminologyUris}
              customTools={customTools}
              style={{flex: 5}}/>

          {showComments &&
          <TextEditor
              document={document}
              label={`Kommentit`}
              value={contentComments}
              setValue={updateContentComments}
              terminologyUris={terminologyUris}
              inline={false}
              style={{
                flex: 3,
                fontSize: tokens.values.typography.bodyText.fontSize.value,
                fontWeight: tokens.values.typography.bodyText.fontWeight,
                lineHeight: tokens.values.typography.bodyText.lineHeight.value,
              }}/>}
        </FlexRow>

        <ul>
          {queryElements(currentElement, 'paragraph').map((paragraph, i) => (
              <ParagraphElementEdit key={i}
                                    document={document}
                                    currentElement={paragraph}
                                    documentProperties={documentProperties}
                                    currentPath={currentPath + "/paragraph[" + (i + 1) + "]"}
                                    setDocument={setDocument}/>
          ))}
        </ul>
      </div>
  );
};

export default SubsectionElementEdit;
