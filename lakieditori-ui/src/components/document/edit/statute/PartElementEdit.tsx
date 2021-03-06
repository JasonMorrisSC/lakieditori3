import React from "react";
import {Button, Heading, suomifiDesignTokens as sdt} from "suomifi-ui-components";
import {
  cloneDocument,
  countNodes,
  queryElements,
  queryFirstElement,
  queryFirstNode,
  queryFirstText,
  updateElement
} from "../../../../utils/xmlUtils";
import TextEditor from "../richtext/TextEditor";
import {Input} from "../../../common/StyledInputComponents";
import ChapterElementEdit from "./ChapterElementEdit";
import {splitIfTruthy} from "../../../../utils/arrayUtils";
import {FlexRowTight} from "../../../common/StyledComponents";
import {suomifiDesignTokens as tokens} from "suomifi-design-tokens";
import ListComments from "../../comment/ListComments";
import AddCommentButton from "../../comment/AddCommentButton";
import {CommentableElementEditProps} from "../CommentableElementEditProps";

const PartElementEdit: React.FC<CommentableElementEditProps> = ({document, setDocument, documentProperties, documentComments, setDocumentComments, currentPath, currentElement, showComments}) => {
  const number = queryFirstText(currentElement, "@number");
  const heading = queryFirstElement(currentElement, "heading");
  const terminologyUris = splitIfTruthy(documentProperties["terminologies"], ",");

  function updateNumber(newValue: string) {
    setDocument((prevDocument) => updateElement(cloneDocument(prevDocument), currentPath,
        (el) => el.setAttribute('number', newValue)));
  }

  function updateHeading(newValue: string) {
    setDocument((prevDocument) => updateElement(cloneDocument(prevDocument), currentPath + "/heading",
        (el) => el.innerHTML = newValue));
  }

  function appendNewChapter() {
    setDocument((prevDocument) => {
      const newDocument = cloneDocument(prevDocument);
      const chapterCount = countNodes(newDocument, currentPath + '/chapter');

      const chapterElement = newDocument.createElement("chapter");
      chapterElement.setAttribute('number', (chapterCount + 1) + "");
      chapterElement.appendChild(newDocument.createElement("heading"));

      queryFirstNode(newDocument, currentPath)?.appendChild(chapterElement);
      return newDocument;
    });
  }

  function removePart() {
    setDocument((prevDocument) => {
      const newDocument = cloneDocument(prevDocument);
      const newCurrentElement = queryFirstNode(newDocument, currentPath);
      newCurrentElement?.parentNode?.removeChild(newCurrentElement);
      return newDocument;
    });
  }

  return (
      <div className="part" style={{margin: `${sdt.spacing.xl} 0`}}>
        <Heading.h2>
          <FlexRowTight>
            <div style={{
              flex: 2,
            }}>
              <div style={{display: "flex", alignItems: "center"}}>
                <Input type="text" value={number}
                       onChange={(e) => updateNumber(e.currentTarget.value)}
                       style={{
                         color: sdt.colors.highlightBase,
                         fontSize: sdt.values.typography.heading2.fontSize.value,
                         fontWeight: sdt.values.typography.heading2.fontWeight,
                         lineHeight: 1,
                         marginRight: sdt.spacing.xs,
                         marginBottom: 0,
                         width: `${(number.length + 1) * 18}px`
                       }}/>
                <span style={{color: sdt.colors.highlightBase}}>osa</span>
                <div style={{marginLeft: "auto"}}>
                  <Button.secondaryNoborder icon={"close"} onClick={() => removePart()}>
                    Poista
                  </Button.secondaryNoborder>
                </div>
              </div>
            </div>
            {showComments &&
            <div style={{flex: 1}}/>}
          </FlexRowTight>

          <FlexRowTight>
            <TextEditor
                document={document}
                label={`Osan ${number} otsikko`}
                value={heading}
                setValue={updateHeading}
                terminologyUris={terminologyUris}
                style={{
                  flex: 2,
                  fontSize: sdt.values.typography.heading2.fontSize.value,
                  fontWeight: sdt.values.typography.heading2.fontWeight,
                }}/>
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
        </Heading.h2>

        {queryElements(currentElement, 'chapter').map((chapter, i) => {
          return <ChapterElementEdit key={i}
                                     document={document}
                                     currentElement={chapter}
                                     documentProperties={documentProperties}
                                     documentComments={documentComments}
                                     setDocumentComments={setDocumentComments}
                                     currentPath={currentPath + "/chapter[" + (i + 1) + "]"}
                                     setDocument={setDocument}
                                     showComments={showComments}/>
        })}

        <Button.secondaryNoborder
            icon="plus"
            onClick={appendNewChapter}
            style={{
              backgroundColor: sdt.colors.accentSecondaryLight40,
              margin: `${sdt.spacing.xxs} 0`
            }}>
          Lis???? uusi luku
        </Button.secondaryNoborder>
      </div>
  );
};

export default PartElementEdit;
