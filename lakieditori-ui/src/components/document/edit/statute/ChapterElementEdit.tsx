/** @jsx jsx */
import {jsx} from '@emotion/core'
import React from "react";
import {Button, Heading, suomifiDesignTokens as sdt} from "suomifi-ui-components";
import {
  childElements,
  cloneDocument,
  countNodes,
  ensureElementAndUpdate,
  queryFirstElement,
  queryFirstNode,
  queryFirstText,
  updateElement
} from "../../../../utils/xmlUtils";
import {ElementEditProps} from "../ElementEditProps";
import SectionElementEdit from "./SectionElementEdit";
import TextEditor from "../richtext/TextEditor";
import {Input} from "../../../common/StyledInputComponents";
import SubheadingElementEdit from "./SubheadingElementEdit";
import {splitIfTruthy} from "../../../../utils/arrayUtils";
import {suomifiDesignTokens as tokens} from "suomifi-design-tokens";
import {FlexRow} from "../../../common/StyledComponents";

const ChapterElementEdit: React.FC<ElementEditProps> = ({document, setDocument, documentProperties, currentPath, currentElement, showComments}) => {
  const number = queryFirstText(currentElement, "@number");
  const heading = queryFirstElement(currentElement, "heading");
  const headingComments = queryFirstElement(currentElement, "headingComments");
  const terminologyUris = splitIfTruthy(documentProperties["terminologies"], ",");

  function updateNumber(newValue: string) {
    setDocument((prevDocument) => updateElement(cloneDocument(prevDocument), currentPath,
        (el) => el.setAttribute('number', newValue)));
  }

  function updateHeading(newValue: string) {
    setDocument((prevDocument) => updateElement(cloneDocument(prevDocument), currentPath + "/heading",
        (el) => el.innerHTML = newValue));
  }

  function updateHeadingComments(newValue: string) {
    setDocument((prevDocument) => {
      return ensureElementAndUpdate(cloneDocument(prevDocument), currentPath,
          "headingComments", ["section", "subheading"], (el) => el.innerHTML = newValue);
    });
  }

  function appendNewSection() {
    setDocument((prevDocument) => {
      const newDocument = cloneDocument(prevDocument);
      const sectionCount = countNodes(newDocument, currentPath + '/section');

      const sectionElement = newDocument.createElement("section");
      sectionElement.setAttribute('number', (sectionCount + 1) + "");
      sectionElement.appendChild(newDocument.createElement("heading"));

      queryFirstNode(newDocument, currentPath)?.appendChild(sectionElement);
      return newDocument;
    });
  }

  function appendNewSubheading() {
    setDocument((prevDocument) => {
      const newDocument = cloneDocument(prevDocument);
      const subheadingCount = countNodes(newDocument, currentPath + '/subheading');

      const sectionElement = newDocument.createElement("subheading");
      sectionElement.setAttribute("number", (subheadingCount + 1) + "");

      queryFirstNode(newDocument, currentPath)?.appendChild(sectionElement);
      return newDocument;
    });
  }

  function removeChapter() {
    setDocument((prevDocument) => {
      const newDocument = cloneDocument(prevDocument);
      const newCurrentElement = queryFirstNode(newDocument, currentPath);
      newCurrentElement?.parentNode?.removeChild(newCurrentElement);
      return newDocument;
    });
  }

  const renderChapterChildElements = (chNumber: string, element: Element) => {
    let sectionCounter = 1;
    let subheadingCounter = 1;

    return childElements(element).map((e, i) => {
      switch (e.tagName) {
        case "section":
          return <div key={i} id={`chapter-${chNumber}-section-${e.getAttribute('number')}`}>
            <SectionElementEdit
                document={document}
                currentElement={e}
                documentProperties={documentProperties}
                currentPath={currentPath + "/section[" + (sectionCounter++) + "]"}
                setDocument={setDocument}
                showComments={showComments}/>
          </div>;
        case "subheading":
          return <div key={i} id={`chapter-${chNumber}-subheading-${e.getAttribute('number')}`}>
            <SubheadingElementEdit
                document={document}
                currentElement={e}
                documentProperties={documentProperties}
                currentPath={currentPath + "/subheading[" + (subheadingCounter++) + "]"}
                setDocument={setDocument}
                showComments={showComments}/>
          </div>;
        default:
          return "";
      }
    });
  }

  return (
      <div className="chapter" style={{margin: `${sdt.spacing.xl} 0`}}>
        <Heading.h2>
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
            <span style={{color: sdt.colors.highlightBase}}>luku</span>
            <div style={{marginLeft: "auto"}}>
              <Button.secondaryNoborder icon={"close"} onClick={() => removeChapter()}>
                Poista
              </Button.secondaryNoborder>
            </div>
          </div>

          <FlexRow>
            <TextEditor
                document={document}
                label={`Luvun ${number} otsikko`}
                value={heading}
                setValue={updateHeading}
                terminologyUris={terminologyUris}
                style={{
                  flex: 5,
                  fontSize: sdt.values.typography.heading2.fontSize.value,
                  fontWeight: sdt.values.typography.heading2.fontWeight,
                }}/>

            {showComments &&
            <TextEditor
                document={document}
                label={`Kommentit`}
                value={headingComments}
                setValue={updateHeadingComments}
                terminologyUris={terminologyUris}
                inline={false}
                style={{
                  flex: 3,
                  fontSize: tokens.values.typography.bodyText.fontSize.value,
                  fontWeight: tokens.values.typography.bodyText.fontWeight,
                  lineHeight: tokens.values.typography.bodyText.lineHeight.value,
                }}/>}
          </FlexRow>
        </Heading.h2>

        {renderChapterChildElements(number, currentElement)}

        <Button.secondaryNoborder icon="plus" onClick={appendNewSection}
                                  style={{marginTop: sdt.spacing.l}}>
          Lisää uusi pykälä lukuun {number}
        </Button.secondaryNoborder>

        <Button.secondaryNoborder icon="plus" onClick={appendNewSubheading}
                                  style={{marginTop: sdt.spacing.l}}>
          Lisää uusi väliotsikko lukuun {number}
        </Button.secondaryNoborder>

        <hr style={{border: 0, borderBottom: `1px solid ${sdt.colors.depthLight13}`}}/>
      </div>
  );
};

export default ChapterElementEdit;
