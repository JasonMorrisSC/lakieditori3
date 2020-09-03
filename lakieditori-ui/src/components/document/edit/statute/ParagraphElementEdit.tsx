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
import SubparagraphElementEdit from "./SubparagraphElementEdit";
import {splitIfTruthy} from "../../../../utils/arrayUtils";
import {FlexRowTight} from "../../../common/StyledComponents";
import ListComments from "../../comment/ListComments";
import AddCommentButton from "../../comment/AddCommentButton";
import {CommentableElementEditProps} from "../CommentableElementEditProps";

const ParagraphElementEdit: React.FC<CommentableElementEditProps> = ({document, setDocument, documentProperties, documentComments, setDocumentComments, currentPath, currentElement, showComments}) => {
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
        <FlexRowTight>
          <TextEditor
              document={document}
              label={`Kohta ${number}`}
              value={content}
              setValue={updateContent}
              terminologyUris={terminologyUris}
              style={{flex: 2, color: tokens.colors.blackBase}}
              customTools={customTools}/>

          {showComments &&
          <div style={{
            flex: 1,
            fontSize: tokens.values.typography.bodyText.fontSize.value,
            fontWeight: tokens.values.typography.bodyText.fontWeight,
            lineHeight: tokens.values.typography.bodyText.lineHeight.value,
          }}>
            <ListComments paths={[currentPath]}
                          comments={documentComments}
                          setComments={setDocumentComments}/>
            <AddCommentButton path={currentPath}
                              comments={documentComments}
                              setComments={setDocumentComments}/>
          </div>}
        </FlexRowTight>

        <ul>
          {queryElements(currentElement, 'subparagraph').map((paragraph, i) => (
              <SubparagraphElementEdit
                  key={i}
                  document={document}
                  currentElement={paragraph}
                  documentProperties={documentProperties}
                  documentComments={documentComments}
                  setDocumentComments={setDocumentComments}
                  currentPath={currentPath + "/subparagraph[" + (i + 1) + "]"}
                  setDocument={setDocument}
                  showComments={showComments}/>
          ))}
        </ul>
      </li>
  );
};

export default ParagraphElementEdit;
