import React from "react";
import {Button, Heading, suomifiDesignTokens as sdt} from "suomifi-ui-components";
import {
  cloneDocument,
  countNodes,
  queryElements,
  queryFirstElement,
  queryFirstNode,
  queryFirstText,
  queryTexts,
  updateElement
} from "../../../../utils/xmlUtils";
import {ElementEditProps} from "./ElementEditProps";
import TextEditor from "../richtext/TextEditor";
import {Input} from "../../../common/StyledInputComponents";
import ChapterElementEdit from "./ChapterElementEdit";

const PartElementEdit: React.FC<ElementEditProps> = ({document, setDocument, currentPath, currentElement}) => {
  const number = queryFirstText(currentElement, "@number");
  const title = queryFirstElement(currentElement, "title");
  const terminologyUris = queryTexts(document.documentElement, "/document/settings/vocabulary");

  function updateNumber(newValue: string) {
    setDocument((prevDocument) => updateElement(cloneDocument(prevDocument), currentPath,
        (el) => el.setAttribute('number', newValue)));
  }

  function updateTitle(newValue: string) {
    setDocument((prevDocument) => updateElement(cloneDocument(prevDocument), currentPath + "/title",
        (el) => el.innerHTML = newValue));
  }

  function appendNewChapter() {
    setDocument((prevDocument) => {
      const newDocument = cloneDocument(prevDocument);
      const chapterCount = countNodes(newDocument, currentPath + '/chapter');

      const chapterElement = newDocument.createElement("chapter");
      chapterElement.setAttribute('number', (chapterCount + 1) + "");
      chapterElement.appendChild(newDocument.createElement("title"));

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

          <TextEditor
              label={`Osan ${number} otsikko`}
              value={title}
              setValue={updateTitle}
              terminologyUris={terminologyUris}
              style={{
                fontSize: sdt.values.typography.heading2.fontSize.value,
                fontWeight: sdt.values.typography.heading2.fontWeight,
              }}/>
        </Heading.h2>

        {queryElements(currentElement, 'chapter').map((chapter, i) => {
          return <ChapterElementEdit key={i}
                                     document={document}
                                     currentElement={chapter}
                                     currentPath={currentPath + "/chapter[" + (i + 1) + "]"}
                                     setDocument={setDocument}/>
        })}

        <Button.secondaryNoborder
            icon="plus"
            onClick={appendNewChapter}
            style={{
              backgroundColor: sdt.colors.accentSecondaryLight40,
              margin: `${sdt.spacing.xxs} 0`
            }}>
          Lisää uusi luku
        </Button.secondaryNoborder>
      </div>
  );
};

export default PartElementEdit;
