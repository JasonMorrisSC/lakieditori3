import React, {SyntheticEvent} from "react";
import {Button, Heading, suomifiDesignTokens as sdt, Text} from "suomifi-ui-components";
import {Link} from "react-router-dom";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/theme/eclipse.css";
import "codemirror/mode/xml/xml";
import {
  cloneDocument,
  countNodes,
  ensureElementAndUpdate,
  queryElements,
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
import TextArea from "./TextArea";

const DocEdit: React.FC<XmlEditorProperties> = ({document, currentElement, currentPath, updateDocument}) => {
  const navTree: NavItemProps[] =
      queryElements(document, currentElement, 'chapter').map(chapter => {
        const chapterNumber = queryFirstText(document, chapter, "@number");
        const chapterTitle = queryFirstText(document, chapter, "title");
        return {
          to: `#chapter-${chapterNumber}`,
          label: `${chapterNumber} luku - ${chapterTitle}`,
          children: queryElements(document, chapter, 'section').map(section => {
            const sectionNumber = queryFirstText(document, section, "@number");
            const sectionTitle = queryFirstText(document, section, "title");
            return {
              to: `#chapter-${chapterNumber}-section-${sectionNumber}`,
              label: `${sectionNumber} § - ${sectionTitle}`
            };
          })
        };
      });

  const number = queryFirstText(document, currentElement, "@number");
  const title = queryFirstText(document, currentElement, "title").replace(/\s+/g, ' ').trimLeft();
  const intro = queryFirstText(document, currentElement, "intro").replace(/\s+/g, ' ').trimLeft();
  const content = queryFirstText(document, currentElement, "content").replace(/\s+/g, ' ').trimLeft();

  function updateTitle(e: SyntheticEvent<HTMLTextAreaElement>) {
    const newValue = e.currentTarget.value;
    updateDocument((prevDocument) => {
      // title element is expected to be in the document
      return updateElement(cloneDocument(prevDocument), currentPath + "/title",
          (el) => el.textContent = newValue);
    });
  }

  function updateIntro(e: SyntheticEvent<HTMLTextAreaElement>) {
    const newValue = e.currentTarget.value;
    updateDocument((prevDocument) => {
      return ensureElementAndUpdate(cloneDocument(prevDocument), currentPath,
          "intro", ["content", "chapter", "section"], (el) => el.textContent = newValue);
    });
  }

  function resizeContent(e: SyntheticEvent<HTMLTextAreaElement>) {
    e.currentTarget.style.height = e.currentTarget.scrollHeight + "px";
  }

  function updateContent(e: SyntheticEvent<HTMLTextAreaElement>) {
    const newValue = e.currentTarget.value;
    updateDocument((prevDocument) => {
      return ensureElementAndUpdate(cloneDocument(prevDocument), currentPath,
          "content", ["chapter", "section"], (el) => el.textContent = newValue);
    });
    resizeContent(e);
  }

  function appendNewChapter() {
    updateDocument((prevDocument) => {
      const newDocument = cloneDocument(prevDocument);
      const chapterCount = countNodes(newDocument, currentPath + '/chapter');

      const chapterElement = newDocument.createElement("chapter");
      chapterElement.setAttribute('number', (chapterCount + 1) + "");
      chapterElement.appendChild(newDocument.createElement("title"));

      queryFirstNode(newDocument, null, currentPath)?.appendChild(chapterElement);
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
          {title} / Muokkaa
        </Text>
        <div>
          <Link to={`/documents/${encodeIdForUrl(number)}`}>
            <Button.secondaryNoborder
                icon={"close"}
                style={{background: "none", marginRight: sdt.spacing.s}}>
              Sulje
            </Button.secondaryNoborder>
          </Link>
        </div>
      </div>;

  const toc = <div style={{margin: `${sdt.spacing.xl} ${sdt.spacing.m}`}}>
    <Toc tocTitle={title} tocItems={navTree}/>
  </div>;

  return (
      <LayoutWithRightBar topContent={topBar} rhsContent={toc}>
        <div style={{margin: sdt.spacing.xl}}>
          <Heading.h1hero>
            <small style={{color: sdt.colors.accentBase}}>{number}</small>
            <br/>
            <TextArea value={title}
                      placeholder="Otsikko (pakollinen)"
                      onChange={updateTitle}
                      style={{
                        ...inputStyle,
                        fontSize: sdt.values.typography.heading1Hero.fontSize.value,
                        fontWeight: sdt.values.typography.heading1Hero.fontWeight,
                      }}/>
          </Heading.h1hero>

          <TextArea value={intro}
                    placeholder="Johtolause"
                    onChange={updateIntro}
                    style={{
                      ...inputStyle,
                      fontSize: sdt.values.typography.leadText.fontSize.value,
                      fontWeight: sdt.values.typography.leadText.fontWeight,
                    }}/>

          <TextArea value={content}
                    placeholder="Tekstisisältö"
                    onChange={updateContent}
                    rows={1}/>

          {queryElements(document, currentElement, 'chapter').map((chapter, i) => {
            return <div key={i} id={`chapter-${chapter.getAttribute('number')}`}>
              <ChapterEdit document={document}
                           currentElement={chapter}
                           currentPath={currentPath + "/chapter[" + (i + 1) + "]"}
                           updateDocument={updateDocument}/>
            </div>
          })}

          <Button icon="plus" onClick={appendNewChapter}>
            Lisää uusi luku
          </Button>
        </div>
      </LayoutWithRightBar>
  );
};

export default DocEdit;
