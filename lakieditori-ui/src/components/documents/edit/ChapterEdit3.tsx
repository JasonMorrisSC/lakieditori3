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
} from "../../../utils/xmlUtils";
import {XmlEditorProperties} from "./XmlEditorProperties";
import SectionEdit from "./SectionEdit";
import {inputStyle} from "../../common/inputStyle";
import RichTextEditor from "./richtext/RichTextEditor";
import SanitizedHtml from "../../common/SanitizedHtml";
import {FlexRowTight} from "../../common/StyledComponents";

const ChapterEdit3: React.FC<XmlEditorProperties> = ({document, currentElement, currentPath, updateDocument}) => {
  let number = queryFirstText(currentElement, "@number");
  const title = queryFirstElement(currentElement, "title");

  function updateNumber(e: SyntheticEvent<HTMLInputElement>) {
    const newValue = e.currentTarget.value;
    updateDocument((prevDocument) => {
      return updateElement(cloneDocument(prevDocument), currentPath,
          (el) => el.setAttribute('number', newValue));
    });
  }

  function updateTitle(newValue: string) {
    updateDocument((prevDocument) => {
      return updateElement(cloneDocument(prevDocument), currentPath + "/title",
          (el) => el.innerHTML = newValue);
    });
  }

  function appendNewSection() {
    updateDocument((prevDocument) => {
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
      <div className="chapter" style={{margin: `${sdt.spacing.l} 0`}}>
        <FlexRowTight style={{
          alignItems: 'center',
          borderBottom: `1px dotted ${sdt.colors.depthLight26}`
        }}>
          <div>
            <Heading.h2>
              <span style={{color: sdt.colors.highlightBase}}>
                {number} luku
              </span>
              <br/>
              <SanitizedHtml element={title}/>
            </Heading.h2>
          </div>
          <div>
            <Heading.h2>
              <input type="text" value={number}
                     onChange={updateNumber}
                     style={{
                       ...inputStyle,
                       color: sdt.colors.highlightBase,
                       fontSize: sdt.values.typography.heading2.fontSize.value,
                       fontWeight: sdt.values.typography.heading2.fontWeight,
                       marginRight: sdt.spacing.xs,
                       width: `${(number.length + 1) * 18}px`
                     }}/>
              <span style={{color: sdt.colors.highlightBase}}>
                luku
              </span>
              <RichTextEditor
                  value={title}
                  placeholder={`Luvun ${number} otsikko`}
                  onChange={updateTitle}
                  showToolbar={false}
                  style={{
                    ...inputStyle,
                    fontSize: sdt.values.typography.heading2.fontSize.value,
                    fontWeight: sdt.values.typography.heading2.fontWeight,
                  }}/>
            </Heading.h2>
          </div>
        </FlexRowTight>

        {queryElements(currentElement, 'section').map((section, i) => {
          return <div key={i} id={`chapter-${number}-section-${section.getAttribute('number')}`}>
            <SectionEdit document={document}
                         currentElement={section}
                         currentPath={currentPath + "/section[" + (i + 1) + "]"}
                         updateDocument={updateDocument}/>
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

export default ChapterEdit3;
