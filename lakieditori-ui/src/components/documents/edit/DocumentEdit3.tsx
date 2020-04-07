/** @jsx jsx */
import {jsx} from '@emotion/core'
import React from "react";
import {Button, Heading, suomifiDesignTokens as sdt, Text} from "suomifi-ui-components";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/theme/eclipse.css";
import "codemirror/mode/xml/xml";
import {
  cloneDocument,
  countNodes,
  ensureElementAndUpdate,
  queryElements,
  queryFirstElement,
  queryFirstNode,
  queryFirstText,
  updateElement
} from "../../../utils/xmlUtils";
import {inputStyle} from "../../common/inputStyle";
import RichTextEditor from "./richtext/RichTextEditor";
import {useHistory} from "react-router-dom";
import SanitizedHtml from "../../common/SanitizedHtml";
import {FlexRowTight} from "../../common/StyledComponents";
import ChapterEdit3 from "./ChapterEdit3";
import {XmlEditor3Properties} from "./XmlEditor3Properties";

const DocumentEdit3: React.FC<XmlEditor3Properties> = (
    {referenceCurrentElement, document, currentElement, currentPath, updateDocument}) => {

  const history = useHistory();

  const id = queryFirstText(currentElement, "@id");
  const number = queryFirstText(currentElement, "@number");
  const state = queryFirstText(currentElement, "@state");

  const referenceTitle = queryFirstElement(referenceCurrentElement, "title");
  const title = queryFirstElement(currentElement, "title");
  const titleText = title?.textContent || '';

  const referenceNote = queryFirstElement(referenceCurrentElement, "note");
  const note = queryFirstElement(currentElement, "note");

  const referenceIntro = queryFirstElement(referenceCurrentElement, "intro");
  const intro = queryFirstElement(currentElement, "intro");

  function updateDocumentState(newValue: string) {
    updateDocument((prevDocument) => {
      const newDocument = cloneDocument(prevDocument);
      newDocument.documentElement.setAttribute('state', newValue);
      return newDocument;
    });
  }

  function updateTitle(newValue: string) {
    updateDocument((prevDocument) => {
      // title element is expected to be in the document
      return updateElement(cloneDocument(prevDocument), currentPath + "/title",
          (el) => el.innerHTML = newValue);
    });
  }

  function updateNote(newValue: string) {
    updateDocument((prevDocument) => {
      return ensureElementAndUpdate(cloneDocument(prevDocument), currentPath,
          "note", ["intro", "chapter", "section"], (el) => el.innerHTML = newValue);
    });
  }

  function updateIntro(newValue: string) {
    updateDocument((prevDocument) => {
      return ensureElementAndUpdate(cloneDocument(prevDocument), currentPath,
          "intro", ["chapter", "section"], (el) => el.innerHTML = newValue);
    });
  }

  function appendNewChapter() {
    updateDocument((prevDocument) => {
      const newDocument = cloneDocument(prevDocument);
      const chapterCount = countNodes(newDocument, currentPath + '/chapter');

      const chapterElement = newDocument.createElement("chapter");
      chapterElement.setAttribute('number', (chapterCount + 1) + "");
      chapterElement.appendChild(newDocument.createElement("title"));

      queryFirstNode(newDocument, currentPath)?.appendChild(chapterElement);
      return newDocument;
    });
  }

  return (
      <div>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          margin: `${sdt.spacing.l} 0 ${sdt.spacing.s}`
        }}>
          <Text style={{maxWidth: "600px"}}>
            {titleText} / Muokkaa
          </Text>
          <div>
            <Button.secondaryNoborder
                icon={"registers"}
                style={{background: "none", marginRight: sdt.spacing.xs}}
                onClick={() => history.push(`/documents/${id}/source`)}>
              XML
            </Button.secondaryNoborder>
            <Button.secondary
                icon={"close"}
                onClick={() => history.push(`/documents/${id}`)}>
              Sulje
            </Button.secondary>
          </div>
        </div>

        <div style={{
          backgroundColor: sdt.colors.whiteBase,
          border: `1px solid ${sdt.colors.depthLight13}`,
          margin: `${sdt.spacing.s} 0`,
        }}>
          <div style={{margin: `${sdt.spacing.xl} ${sdt.spacing.l}`}}>
            <div style={{
              color: sdt.colors.accentBase,
              fontSize: sdt.values.typography.heading1Hero.fontSize.value,
              fontWeight: sdt.values.typography.heading1Hero.fontWeight,
            }}>
              <small>{number}</small>
            </div>

            <FlexRowTight style={{
              alignItems: 'center',
              borderTop: `1px dotted ${sdt.colors.depthLight26}`,
              borderBottom: `1px dotted ${sdt.colors.depthLight26}`
            }}>
              <div>
                <Heading.h1hero>
                  <SanitizedHtml element={referenceTitle}/>
                </Heading.h1hero>
              </div>
              <div>
                <Heading.h1hero>
                  <RichTextEditor
                      value={title}
                      placeholder="Otsikko"
                      onChange={updateTitle}
                      showToolbar={false}
                      style={{
                        ...inputStyle,
                        fontSize: sdt.values.typography.heading1Hero.fontSize.value,
                        fontWeight: sdt.values.typography.heading1Hero.fontWeight,
                      }}/>
                </Heading.h1hero>
              </div>
            </FlexRowTight>

            <FlexRowTight style={{
              alignItems: 'center',
              borderBottom: `1px dotted ${sdt.colors.depthLight26}`
            }}>
              <div>
                <SanitizedHtml element={referenceNote}/>
              </div>
              <div>
                <RichTextEditor
                    value={note}
                    placeholder="Huomautus"
                    onChange={updateNote}
                    showToolbar={false}
                    style={inputStyle}/>
              </div>
            </FlexRowTight>

            <FlexRowTight style={{
              alignItems: 'center',
              borderBottom: `1px dotted ${sdt.colors.depthLight26}`
            }}>
              <div>
                <Text.lead>
                  <SanitizedHtml element={referenceIntro}/>
                </Text.lead>
              </div>
              <div>
                <RichTextEditor
                    value={intro}
                    placeholder="Johtolause"
                    onChange={updateIntro}
                    showToolbar={false}
                    style={{
                      ...inputStyle,
                      fontSize: sdt.values.typography.leadText.fontSize.value,
                      fontWeight: sdt.values.typography.leadText.fontWeight,
                    }}/>
              </div>
            </FlexRowTight>

            {queryElements(currentElement, 'chapter').map((chapter, i) => {
              return <div key={i} id={`chapter-${chapter.getAttribute('number')}`}>
                <ChapterEdit3 document={document}
                              currentElement={chapter}
                              currentPath={currentPath + "/chapter[" + (i + 1) + "]"}
                              updateDocument={updateDocument}/>
              </div>
            })}

            <Button.secondaryNoborder icon="plus" onClick={appendNewChapter}>
              Lisää uusi luku
            </Button.secondaryNoborder>
          </div>
        </div>
      </div>
  );
};

export default DocumentEdit3;
