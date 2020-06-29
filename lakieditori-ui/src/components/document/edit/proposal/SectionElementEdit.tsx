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
import SubsectionElementEdit from "./SubsectionElementEdit";

const SectionElementEdit: React.FC<ElementEditProps> = ({document, setDocument, documentProperties, currentPath, currentElement}) => {
  const number = queryFirstText(currentElement, "@number");
  const heading = queryFirstElement(currentElement, "heading");
  const content = queryFirstElement(currentElement, "content");
  const terminologyUris = splitIfTruthy(documentProperties["terminologies"], ",");
  const subsectionCount = countNodes(document, currentPath + '/subsection');


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
          "content", ["subsection"], (el) => el.innerHTML = newValue);
    });
  }

  function appendNewSubsection() {
    setDocument((prevDocument) => {
      const newDocument = cloneDocument(prevDocument);

      const subsectionElement = newDocument.createElement("subsection");
      subsectionElement.setAttribute('number', number + "." + (subsectionCount + 1));
      subsectionElement.appendChild(newDocument.createElement("heading"));

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
      <div className="section" style={{margin: `${sdt.spacing.l} 0`}}>
        <Heading.h3>
          <div style={{display: "flex", alignItems: "center"}}>
            <Input type="text" value={number}
                   onChange={(e) => updateNumber(e.currentTarget.value)}
                   style={{
                     color: sdt.colors.highlightBase,
                     fontSize: sdt.values.typography.heading3.fontSize.value,
                     fontWeight: sdt.values.typography.heading3.fontWeight,
                     lineHeight: 1,
                     marginRight: sdt.spacing.xs,
                     marginBottom: 0,
                     width: `${(number.length + 1) * 14}px`
                   }}/>
            <span style={{color: sdt.colors.highlightBase}}>luku</span>
            <div style={{marginLeft: "auto"}}>
              <Button.secondaryNoborder icon={"close"} onClick={() => removeSection()}>
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
                fontSize: sdt.values.typography.heading3.fontSize.value,
                fontWeight: sdt.values.typography.heading3.fontWeight,
              }}/>
        </Heading.h3>

        <TextEditor
            document={document}
            label={`Luvun ${number} tekstisisältö!`}
            value={content}
            setValue={updateContent}
            inline={false}
            terminologyUris={terminologyUris}
            style={{
              fontSize: tokens.values.typography.bodyText.fontSize.value,
              fontWeight: tokens.values.typography.bodyText.fontWeight,
            }}/>


        {queryElements(currentElement, 'subsection').map((subsection, i) => {
          return <SubsectionElementEdit key={i}
                                        document={document}
                                        currentElement={subsection}
                                        documentProperties={documentProperties}
                                        currentPath={currentPath + "/subsection[" + (i + 1) + "]"}
                                        setDocument={setDocument}/>
        })}

        <Button.secondaryNoborder icon="plus" onClick={appendNewSubsection}
                                  style={{
                                    backgroundColor: sdt.colors.accentSecondaryLight40,
                                    margin: `${sdt.spacing.xxs} 0`
                                  }}>
          Lisää uusi alaluku lukuun {number}
        </Button.secondaryNoborder>

      </div>
  );
};

export default SectionElementEdit;
