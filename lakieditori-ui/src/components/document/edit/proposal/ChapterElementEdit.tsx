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
import SectionElementEdit from "./SectionElementEdit";

const ChapterElementEdit: React.FC<ElementEditProps> = ({document, setDocument, documentProperties, currentPath, currentElement}) => {
  const number = queryFirstText(currentElement, "@number");
  const heading = queryFirstElement(currentElement, "heading");
  const content = queryFirstElement(currentElement, "content");
  const terminologyUris = splitIfTruthy(documentProperties["terminologies"], ",");
  const sectionCount = countNodes(document, currentPath + '/section');

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
          "content", ["section"], (el) => el.innerHTML = newValue);
    });
  }

  function appendNewSection() {
    setDocument((prevDocument) => {
      const newDocument = cloneDocument(prevDocument);

      const sectionElement = newDocument.createElement("section");
      sectionElement.setAttribute('number', number + "." + (sectionCount + 1));
      sectionElement.appendChild(newDocument.createElement("heading"));

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

          <TextEditor
              document={document}
              label={`Luvun ${number} otsikko`}
              value={heading}
              setValue={updateHeading}
              terminologyUris={terminologyUris}
              style={{
                fontSize: sdt.values.typography.heading2.fontSize.value,
                fontWeight: sdt.values.typography.heading2.fontWeight,
              }}/>
        </Heading.h2>

        <TextEditor
            document={document}
            label={`Luvun ${number} tekstisisältö`}
            value={content}
            setValue={updateContent}
            inline={false}
            terminologyUris={terminologyUris}
            style={{
              fontSize: tokens.values.typography.bodyText.fontSize.value,
              fontWeight: tokens.values.typography.bodyText.fontWeight,
            }}/>

        {queryElements(currentElement, 'section').map((subsection, i) => {
          return <SectionElementEdit key={i}
                                     document={document}
                                     currentElement={subsection}
                                     documentProperties={documentProperties}
                                     currentPath={currentPath + "/section[" + (i + 1) + "]"}
                                     setDocument={setDocument}/>
        })}

        <Button.secondaryNoborder icon="plus" onClick={appendNewSection}
                                  style={{
                                    backgroundColor: sdt.colors.accentSecondaryLight40,
                                    margin: `${sdt.spacing.xxs} 0`
                                  }}>
          Lisää uusi alaluku lukuun {number}
        </Button.secondaryNoborder>

        <hr style={{border: 0, borderBottom: `1px solid ${sdt.colors.depthLight13}`}}/>
      </div>
  );
};

export default ChapterElementEdit;
