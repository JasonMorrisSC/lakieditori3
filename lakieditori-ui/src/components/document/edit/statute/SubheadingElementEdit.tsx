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
import {suomifiDesignTokens as sdt} from "suomifi-design-tokens";
import {splitIfTruthy} from "../../../../utils/arrayUtils";
import {FlexRowTight} from "../../../common/StyledComponents";
import ListComments from "../../comment/ListComments";
import AddCommentButton from "../../comment/AddCommentButton";
import {CommentableElementEditProps} from "../CommentableElementEditProps";

const SubheadingElementEdit: React.FC<CommentableElementEditProps> = ({document, setDocument, documentProperties, documentComments, setDocumentComments, currentPath, currentElement, showComments}) => {
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
        <FlexRowTight>
          <div style={{
            flex: 2,
          }}>
            <TextEditor
                document={document}
                label={`Väliotsikko ${number}`}
                value={currentElement}
                setValue={updateContent}
                terminologyUris={terminologyUris}
                style={{color: tokens.colors.blackBase}}
                customTools={customTools}/>
          </div>
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
      </div>
  );
};

export default SubheadingElementEdit;
