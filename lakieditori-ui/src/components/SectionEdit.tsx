import React, {SyntheticEvent} from "react";
import {Button, Heading, suomifiDesignTokens as sdt} from "suomifi-ui-components";
import {
  cloneDocument,
  countNodes,
  queryElements,
  queryFirstNode,
  queryFirstText,
  updateElement
} from "../utils/xml-utils";
import {XmlEditorProperties} from "./XmlEditorProperties";
import SubsectionEdit from "./SubsectionEdit";
import TextArea from "./TextArea";
import {inputStyle} from "./inputStyle";

const SectionEdit: React.FC<XmlEditorProperties> = ({document, currentElement, currentPath, updateDocument}) => {
  let number = queryFirstText(document, currentElement, "@number");
  let title = queryFirstText(document, currentElement, "title").replace(/\s+/g, ' ').trimLeft();

  function updateNumber(e: SyntheticEvent<HTMLInputElement>) {
    const newValue = e.currentTarget.value;
    updateDocument((prevDocument) => {
      return updateElement(cloneDocument(prevDocument), currentPath,
          (el) => el.setAttribute('number', newValue));
    });
  }

  function updateTitle(e: SyntheticEvent<HTMLTextAreaElement>) {
    const newValue = e.currentTarget.value;
    updateDocument((prevDocument) => {
      return updateElement(cloneDocument(prevDocument), currentPath + "/title",
          (el) => el.textContent = newValue);
    });
  }

  function appendNewSubsection() {
    updateDocument((prevDocument) => {
      const newDocument = cloneDocument(prevDocument);
      const subsectionCount = countNodes(newDocument, currentPath + '/subsection');

      const subsectionElement = newDocument.createElement("subsection");
      subsectionElement.setAttribute('number', (subsectionCount + 1) + "");
      subsectionElement.appendChild(newDocument.createElement("content"));

      queryFirstNode(newDocument, null, currentPath)?.appendChild(subsectionElement);
      return newDocument;
    });
  }

  return (
      <div className="section" style={{marginTop: sdt.spacing.l}}>
        <Heading.h3>
          <input type="text" value={number}
                 onChange={updateNumber}
                 style={{
                   ...inputStyle,
                   color: sdt.colors.highlightBase,
                   fontSize: sdt.values.typography.heading3.fontSize.value,
                   fontWeight: sdt.values.typography.heading3.fontWeight,
                   marginRight: sdt.spacing.xs,
                   width: `${(number.length + 1) * 16}px`
                 }}/>
          <span style={{color: sdt.colors.highlightBase}}>
            §
          </span>

          <TextArea value={title}
                    placeholder={`Pykälän ${number} pakollinen otsikko`}
                    onChange={updateTitle}
                    style={{
                      ...inputStyle,
                      fontSize: sdt.values.typography.heading3.fontSize.value,
                      fontWeight: sdt.values.typography.heading3.fontWeight,
                    }}/>
        </Heading.h3>

        <ul style={{padding: 0, margin: 0}}>
          {queryElements(document, currentElement, 'subsection').map((subsection, i) => {
            return <SubsectionEdit key={i}
                                   document={document}
                                   currentElement={subsection}
                                   currentPath={currentPath + "/subsection[" + (i + 1) + "]"}
                                   updateDocument={updateDocument}/>
          })}
        </ul>

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

export default SectionEdit;
