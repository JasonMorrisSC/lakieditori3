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
import {splitIfTruthy} from "../../../../utils/arrayUtils";
import {FlexRowTight} from "../../../common/StyledComponents";
import ListComments from "../../comment/ListComments";
import AddCommentButton from "../../comment/AddCommentButton";
import {CommentableElementEditProps} from "../CommentableElementEditProps";

const SubparagraphElementEdit: React.FC<CommentableElementEditProps> = ({document, setDocument, documentProperties, documentComments, setDocumentComments, currentPath, currentElement, showComments}) => {
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
        <FlexRowTight>
          <TextEditor
              document={document}
              label={`Alakohta ${number}`}
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
      </li>
  );
};

export default SubparagraphElementEdit;
