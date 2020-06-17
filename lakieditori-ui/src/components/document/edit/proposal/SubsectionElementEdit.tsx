/** @jsx jsx */
import {jsx} from '@emotion/core'
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
import TextEditor from "../richtext/TextEditor";
import {Input} from "../../../common/StyledInputComponents";
import {splitIfTruthy} from "../../../../utils/arrayUtils";
import {suomifiDesignTokens as tokens} from "suomifi-design-tokens";
import ParagraphElementEdit from "./ParagraphElementEdit";

const SubsectionElementEdit: React.FC<ElementEditProps> = ({document, setDocument, documentProperties, currentPath, currentElement}) => {
  const number = queryFirstText(currentElement, "@number");
  const heading = queryFirstElement(currentElement, "heading");
  const content = queryFirstElement(currentElement, "content");
  const terminologyUris = splitIfTruthy(documentProperties["terminologies"], ",");
  const paragraphCount = countNodes(document, currentPath + '/paragraph');

  function updateNumber(newValue: string) {
    setDocument((prevDocument) => updateElement(cloneDocument(prevDocument), currentPath,
        (el) => el.setAttribute('number', newValue)));
  }

  function updateHeading(newValue: string) {
    setDocument((prevDocument) => updateElement(cloneDocument(prevDocument), currentPath + "/heading",
        (el) => el.innerHTML = newValue));
  }

  function updateContent(newValue: string) {
    setDocument((prevDocument) => {
      return ensureElementAndUpdate(cloneDocument(prevDocument), currentPath,
          "content", ["paragraph"], (el) => el.innerHTML = newValue);
    });
  }

  function appendNewParagraph() {
    setDocument((prevDocument) => {
      const newDocument = cloneDocument(prevDocument);

      const paragraphElement = newDocument.createElement("paragraph");
      paragraphElement.setAttribute('number', number + "." + (paragraphCount + 1));
      paragraphElement.appendChild(newDocument.createElement("heading"));

      queryFirstNode(newDocument, currentPath)?.appendChild(paragraphElement);
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

  return (
      <div className="subsection" style={{margin: `${sdt.spacing.l} 0`}}>
        <Heading.h4>
          <div style={{display: "flex", alignItems: "center"}}>
            <Input type="text" value={number}
                   onChange={(e) => updateNumber(e.currentTarget.value)}
                   style={{
                     color: sdt.colors.highlightBase,
                     fontSize: sdt.values.typography.heading4.fontSize.value,
                     fontWeight: sdt.values.typography.heading4.fontWeight,
                     lineHeight: 1,
                     marginRight: sdt.spacing.xs,
                     marginBottom: 0,
                     width: `${(number.length + 1) * 10}px`
                   }}/>
            <span style={{color: sdt.colors.highlightBase}}>luku</span>
            <div style={{marginLeft: "auto"}}>
              <Button.secondaryNoborder icon={"close"} onClick={() => removeSubsection()}>
                Poista
              </Button.secondaryNoborder>
            </div>
          </div>

          <TextEditor
              label={`Luvun ${number} otsikko`}
              value={heading}
              setValue={updateHeading}
              terminologyUris={terminologyUris}
              style={{
                fontSize: sdt.values.typography.heading4.fontSize.value,
                fontWeight: sdt.values.typography.heading4.fontWeight,
              }}/>
        </Heading.h4>

        <TextEditor
            label={`Luvun ${number} tekstisisältö`}
            value={content}
            setValue={updateContent}
            inline={false}
            terminologyUris={terminologyUris}
            style={{
              fontSize: tokens.values.typography.bodyText.fontSize.value,
              fontWeight: tokens.values.typography.bodyText.fontWeight,
            }}/>


        {queryElements(currentElement, 'paragraph').map((paragraph, i) => {
          return <ParagraphElementEdit key={i}
                                       document={document}
                                       currentElement={paragraph}
                                       documentProperties={documentProperties}
                                       currentPath={currentPath + "/paragraph[" + (i + 1) + "]"}
                                       setDocument={setDocument}/>
        })}

        <Button.secondaryNoborder icon="plus" onClick={appendNewParagraph}
                                  style={{
                                    backgroundColor: sdt.colors.highlightLight53,
                                    margin: `${sdt.spacing.xxs} 0`
                                  }}>
          Lisää uusi alaluku lukuun {number}
        </Button.secondaryNoborder>

      </div>
  );
};

export default SubsectionElementEdit;
