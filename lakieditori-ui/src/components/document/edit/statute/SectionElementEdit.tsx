import React from "react";
import {Button, Heading, suomifiDesignTokens as sdt} from "suomifi-ui-components";
import {
  cloneDocument,
  countNodes,
  ensureElementAndUpdate,
  queryElements,
  queryFirstElement,
  queryFirstNode,
  queryFirstText,
  updateElement
} from "../../../../utils/xmlUtils";
import {ElementEditProps} from "../ElementEditProps";
import SubsectionElementEdit from "./SubsectionElementEdit";
import TextEditor from "../richtext/TextEditor";
import {Input} from "../../../common/StyledInputComponents";
import {splitIfTruthy} from "../../../../utils/arrayUtils";
import {FlexRow} from "../../../common/StyledComponents";
import {suomifiDesignTokens as tokens} from "suomifi-design-tokens";

const SectionElementEdit: React.FC<ElementEditProps> = ({document, setDocument, documentProperties, currentPath, currentElement, showComments}) => {
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
          "headingComments", ["subsection"], (el) => el.innerHTML = newValue);
    });
  }

  function appendNewSubsection() {
    setDocument((prevDocument) => {
      const newDocument = cloneDocument(prevDocument);
      const subsectionCount = countNodes(newDocument, currentPath + '/subsection');

      const subsectionElement = newDocument.createElement("subsection");
      subsectionElement.setAttribute('number', (subsectionCount + 1) + "");
      subsectionElement.appendChild(newDocument.createElement("content"));

      queryFirstNode(newDocument, currentPath)?.appendChild(subsectionElement);
      return newDocument;
    });
  }

  function removeSection() {
    setDocument((prevDocument) => {
      const newDocument = cloneDocument(prevDocument);
      const newCurrentElement = queryFirstNode(newDocument, currentPath);
      newCurrentElement?.parentNode?.removeChild(newCurrentElement);
      return newDocument;
    });
  }

  return (
      <div className="section" style={{marginTop: sdt.spacing.l}}>
        <Heading.h3>
          <div style={{display: "flex", alignItems: "center"}}>
            <Input type="text" value={number}
                   onChange={(e) => updateNumber(e.currentTarget.value)}
                   style={{
                     color: sdt.colors.highlightBase,
                     fontSize: sdt.values.typography.heading3.fontSize.value,
                     fontWeight: sdt.values.typography.heading3.fontWeight,
                     marginRight: sdt.spacing.xs,
                     marginBottom: 0,
                     width: `${(number.length + 1) * 16}px`
                   }}/>
            <span style={{color: sdt.colors.highlightBase}}>
            §
          </span>
            <div style={{marginLeft: "auto"}}>
              <Button.secondaryNoborder icon={"close"} onClick={() => removeSection()}>
                Poista
              </Button.secondaryNoborder>
            </div>
          </div>

          <FlexRow>
            <TextEditor
                document={document}
                label={`Pykälän ${number} otsikko`}
                value={heading}
                setValue={updateHeading}
                terminologyUris={terminologyUris}
                style={{
                  flex: 5,
                  fontSize: sdt.values.typography.heading3.fontSize.value,
                  fontWeight: sdt.values.typography.heading3.fontWeight,
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
        </Heading.h3>

        {queryElements(currentElement, 'subsection').map((subsection, i) => {
          return <SubsectionElementEdit key={i}
                                        document={document}
                                        currentElement={subsection}
                                        documentProperties={documentProperties}
                                        currentPath={currentPath + "/subsection[" + (i + 1) + "]"}
                                        setDocument={setDocument}
                                        showComments={showComments}/>
        })}

        <Button.secondaryNoborder
            icon="plus"
            onClick={appendNewSubsection}
            style={{
              backgroundColor: sdt.colors.accentSecondaryLight40,
              margin: `${sdt.spacing.xxs} 0`
            }}>
          Lisää uusi momentti
        </Button.secondaryNoborder>
      </div>
  );
};

export default SectionElementEdit;
