/** @jsx jsx */
import {css, jsx} from '@emotion/core'
import React from "react";
import {Button, Dropdown, Heading, suomifiDesignTokens as sdt, Text} from "suomifi-ui-components";
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
  queryNodes,
  updateElement
} from "../../../utils/xmlUtils";
import LayoutWithRightBar from "../../common/LayoutWithRightBar";
import {XmlEditorProperties} from "./XmlEditorProperties";
import ChapterEdit from "./ChapterEdit";
import TableOfContents from "../../common/TableOfContents";
import {inputStyle} from "../../common/inputStyle";
import RichTextEditor from "./richtext/RichTextEditor";
import {useHistory} from "react-router-dom";
import {buildNavigationTree} from "../../common/TableOfContentsUtils";
import ConceptList from "../../common/ConceptList";
import {DocumentState, parseDocumentState} from "../DocumentStateEnum";

const DocumentEdit: React.FC<XmlEditorProperties> = ({document, currentElement, currentPath, updateDocument}) => {
  const history = useHistory();

  const id = queryFirstText(currentElement, "@id");
  const number = queryFirstText(currentElement, "@number");
  const state = queryFirstText(currentElement, "@state");
  const title = queryFirstElement(currentElement, "title");
  const titleText = title?.textContent || '';
  const note = queryFirstElement(currentElement, "note");
  const intro = queryFirstElement(currentElement, "intro");
  const linkUrls = queryNodes(currentElement, '//a/@href').map(n => n.textContent || "");

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

  const topBar =
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end"
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
      </div>;

  const toc = <div style={{margin: `${sdt.spacing.xl} ${sdt.spacing.m}`}}>
    <TableOfContents title={titleText} items={buildNavigationTree(currentElement)}/>
    <hr/>
    <ConceptList urls={linkUrls}/>
  </div>;

  return (
      <LayoutWithRightBar topContent={topBar} rhsContent={toc}>
        <article style={{margin: sdt.spacing.xl}}>
          <Heading.h1hero>
            <div style={{display: 'inline-flex', justifyContent: "space-between", width: "100%"}}>
              <small style={{color: sdt.colors.accentBase}}>{number}</small>
              <Dropdown name={"Tila: " + parseDocumentState(state)} changeNameToSelection={false}
                        css={css`button { margin: 0; }`}>
                <Dropdown.item onSelect={() => updateDocumentState('UNSTABLE')}>
                  {DocumentState.UNSTABLE}
                </Dropdown.item>
                <Dropdown.item onSelect={() => updateDocumentState('DRAFT')}>
                  {DocumentState.DRAFT}
                </Dropdown.item>
                <Dropdown.item onSelect={() => updateDocumentState('RECOMMENDATION')}>
                  {DocumentState.RECOMMENDATION}
                </Dropdown.item>
                <Dropdown.item onSelect={() => updateDocumentState('DEPRECATED')}>
                  {DocumentState.DEPRECATED}
                </Dropdown.item>
              </Dropdown>
            </div>
            <br/>
            <RichTextEditor
                value={title}
                placeholder="Otsikko (pakollinen)"
                onChange={updateTitle}
                style={{
                  ...inputStyle,
                  fontSize: sdt.values.typography.heading1Hero.fontSize.value,
                  fontWeight: sdt.values.typography.heading1Hero.fontWeight,
                }}/>
          </Heading.h1hero>

          <RichTextEditor
              value={note}
              placeholder="Huomautus"
              onChange={updateNote}
              style={inputStyle}/>

          <RichTextEditor
              value={intro}
              placeholder="Johtolause"
              onChange={updateIntro}
              style={{
                ...inputStyle,
                fontSize: sdt.values.typography.leadText.fontSize.value,
                fontWeight: sdt.values.typography.leadText.fontWeight,
              }}/>

          {queryElements(currentElement, 'chapter').map((chapter, i) => {
            return <div key={i} id={`chapter-${chapter.getAttribute('number')}`}>
              <ChapterEdit document={document}
                           currentElement={chapter}
                           currentPath={currentPath + "/chapter[" + (i + 1) + "]"}
                           updateDocument={updateDocument}/>
            </div>
          })}

          <Button.secondaryNoborder icon="plus" onClick={appendNewChapter}>
            Lisää uusi luku
          </Button.secondaryNoborder>
        </article>
      </LayoutWithRightBar>
  );
};

export default DocumentEdit;
