import React, {SyntheticEvent} from "react";
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
import {ElementEditProps} from "./ElementEditProps";
import SectionElementEdit from "./SectionElementEdit";
import TextEditor from "../richtext/TextEditor";
import {Input} from "../../../common/InputStyles";

const ChapterElementEdit: React.FC<ElementEditProps> = ({document, setDocument, currentPath, currentElement}) => {
  let number = queryFirstText(currentElement, "@number");
  const title = queryFirstElement(currentElement, "title");

  function updateNumber(e: SyntheticEvent<HTMLInputElement>) {
    const newValue = e.currentTarget.value;
    setDocument((prevDocument) => {
      return updateElement(cloneDocument(prevDocument), currentPath,
          (el) => el.setAttribute('number', newValue));
    });
  }

  function updateTitle(newValue: string) {
    setDocument((prevDocument) => {
      return updateElement(cloneDocument(prevDocument), currentPath + "/title",
          (el) => el.innerHTML = newValue);
    });
  }

  function appendNewSection() {
    setDocument((prevDocument) => {
      const newDocument = cloneDocument(prevDocument);
      const sectionCount = countNodes(newDocument, currentPath + '/section');

      const sectionElement = newDocument.createElement("section");
      sectionElement.setAttribute('number', (sectionCount + 1) + "");
      sectionElement.appendChild(newDocument.createElement("title"));

      queryFirstNode(newDocument, currentPath)?.appendChild(sectionElement);
      return newDocument;
    });
  }

  return (
      <div className="chapter" style={{margin: `${sdt.spacing.xl} 0`}}>
        <Heading.h2>
          <Input type="text" value={number}
                 onChange={updateNumber}
                 style={{
                   color: sdt.colors.highlightBase,
                   fontSize: sdt.values.typography.heading2.fontSize.value,
                   fontWeight: sdt.values.typography.heading2.fontWeight,
                   marginRight: sdt.spacing.xs,
                   marginBottom: 0,
                   width: `${(number.length + 1) * 18}px`
                 }}/>
          <span style={{color: sdt.colors.highlightBase}}>
            luku
          </span>

          <TextEditor
              value={title}
              placeholder={`Luvun ${number} otsikko`}
              onChange={updateTitle}
              style={{
                fontSize: sdt.values.typography.heading2.fontSize.value,
                fontWeight: sdt.values.typography.heading2.fontWeight,
              }}/>
        </Heading.h2>

        {queryElements(currentElement, 'section').map((section, i) => {
          return <div key={i} id={`chapter-${number}-section-${section.getAttribute('number')}`}>
            <SectionElementEdit document={document}
                                currentElement={section}
                                currentPath={currentPath + "/section[" + (i + 1) + "]"}
                                setDocument={setDocument}/>
          </div>
        })}

        <Button.secondaryNoborder icon="plus" onClick={appendNewSection}
                                  style={{marginTop: sdt.spacing.l}}>
          Lisää uusi pykälä lukuun {number}
        </Button.secondaryNoborder>

        <hr style={{border: 0, borderBottom: `1px solid ${sdt.colors.depthLight13}`}}/>
      </div>
  );
};

export default ChapterElementEdit;
