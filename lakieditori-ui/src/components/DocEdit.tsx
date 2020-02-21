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
} from "../utils/xml-utils";
import {encodeIdForUrl} from "../utils/id-utils";
import LayoutWithRightBar from "./LayoutWithRightBar";
import {XmlEditorProperties} from "./XmlEditorProperties";
import ChapterEdit from "./ChapterEdit";
import Toc from "./Toc";
import NavItemProps from "./NavItemProps";
import {inputStyle} from "./inputStyle";
import RichTextEditor from "./RichTextEditor";
import {useHistory} from "react-router-dom";

const DocEdit: React.FC<XmlEditorProperties> = ({document, currentElement, currentPath, updateDocument}) => {
  const history = useHistory();

  const navTree: NavItemProps[] =
      queryElements(currentElement, 'chapter').map(chapter => {
        const chapterNumber = queryFirstText(chapter, "@number");
        const chapterTitle = queryFirstText(chapter, "title");
        return {
          to: `#chapter-${chapterNumber}`,
          label: `${chapterNumber} luku - ${chapterTitle}`,
          children: queryElements(chapter, 'section').map(section => {
            const sectionNumber = queryFirstText(section, "@number");
            const sectionTitle = queryFirstText(section, "title");
            return {
              to: `#chapter-${chapterNumber}-section-${sectionNumber}`,
              label: `${sectionNumber} § - ${sectionTitle}`
            };
          })
        };
      });

  const number = queryFirstText(currentElement, "@number");
  const title = queryFirstElement(currentElement, "title");
  const titleText = title?.textContent || '';
  const note = queryFirstElement(currentElement, "note");
  const intro = queryFirstElement(currentElement, "intro");

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
              onClick={() => history.push(`/documents/${encodeIdForUrl(number)}/source`)}>
            XML
          </Button.secondaryNoborder>
          <Button.secondary
              icon={"close"}
              onClick={() => history.push(`/documents/${encodeIdForUrl(number)}`)}>
            Sulje
          </Button.secondary>
        </div>
      </div>;

  const toc = <div style={{margin: `${sdt.spacing.xl} ${sdt.spacing.m}`}}>
    <Toc tocTitle={titleText} tocItems={navTree}/>
  </div>;

  return (
      <LayoutWithRightBar topContent={topBar} rhsContent={toc}>
        <article style={{margin: sdt.spacing.xl}}>
          <Heading.h1hero>
            <small style={{color: sdt.colors.accentBase}}>{number}</small>
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

export default DocEdit;
