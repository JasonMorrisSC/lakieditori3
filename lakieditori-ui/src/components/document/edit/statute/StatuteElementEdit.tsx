/** @jsx jsx */
import {css, jsx} from '@emotion/core'
import React from "react";
import {Button, Dropdown, Heading, suomifiDesignTokens as tokens} from "suomifi-ui-components";
import {
  childElements,
  cloneDocument,
  countNodes,
  ensureElementAndUpdate,
  queryFirstElement,
  queryFirstNode,
  queryFirstText,
  updateElement
} from "../../../../utils/xmlUtils";
import TextEditor from "../richtext/TextEditor";
import {DocumentState, documentStateLabelFi, parseDocumentState} from "../../DocumentTypes";
import ChapterElementEdit from "./ChapterElementEdit";
import SectionElementEdit from "./SectionElementEdit";
import SubheadingElementEdit from "./SubheadingElementEdit";
import PartElementEdit from "./PartElementEdit";
import {splitIfTruthy} from "../../../../utils/arrayUtils";
import {FlexRowTight} from "../../../common/StyledComponents";
import ListComments from "../../comment/ListComments";
import AddCommentButton from "../../comment/AddCommentButton";
import {CommentableElementEditProps} from "../CommentableElementEditProps";

const StatuteElementEdit: React.FC<CommentableElementEditProps> = ({document, setDocument, documentProperties, documentComments, setDocumentComments, currentPath, currentElement, showComments}) => {
  const number = queryFirstText(currentElement, "@number");
  const state = parseDocumentState(queryFirstText(currentElement, "@state"));
  const title = queryFirstElement(currentElement, "title");
  const intro = queryFirstElement(currentElement, "intro");
  const terminologyUris = splitIfTruthy(documentProperties["terminologies"], ",");

  const partCount = countNodes(currentElement, "part");
  const chapterCount = countNodes(currentElement, "chapter");
  const sectionCount = countNodes(currentElement, "section");
  const subheadingCount = countNodes(currentElement, "subheading");

  function updateDocumentState(newValue: string) {
    setDocument((prevDocument) => {
      const newDocument = cloneDocument(prevDocument);
      newDocument.documentElement.setAttribute('state', newValue);
      return newDocument;
    });
  }

  function updateTitle(newValue: string) {
    setDocument((prevDocument) => {
      // title element is expected to be in the document
      return updateElement(cloneDocument(prevDocument), currentPath + "/title",
          (el) => el.innerHTML = newValue);
    });
  }

  function updateIntro(newValue: string) {
    setDocument((prevDocument) => {
      return ensureElementAndUpdate(cloneDocument(prevDocument), currentPath,
          "intro", ["chapter", "section"], (el) => el.innerHTML = newValue);
    });
  }

  function appendNewPart() {
    setDocument((prevDocument) => {
      const newDocument = cloneDocument(prevDocument);

      const partElement = newDocument.createElement("part");
      partElement.setAttribute("number", (partCount + 1) + "");
      partElement.appendChild(newDocument.createElement("heading"));

      queryFirstNode(newDocument, currentPath)?.appendChild(partElement);
      return newDocument;
    });
  }

  function appendNewChapter() {
    setDocument((prevDocument) => {
      const newDocument = cloneDocument(prevDocument);

      const chapterElement = newDocument.createElement("chapter");
      chapterElement.setAttribute("number", (chapterCount + 1) + "");
      chapterElement.appendChild(newDocument.createElement("heading"));

      queryFirstNode(newDocument, currentPath)?.appendChild(chapterElement);
      return newDocument;
    });
  }

  function appendNewSection() {
    setDocument((prevDocument) => {
      const newDocument = cloneDocument(prevDocument);

      const sectionElement = newDocument.createElement("section");
      sectionElement.setAttribute("number", (sectionCount + 1) + "");
      sectionElement.appendChild(newDocument.createElement("heading"));

      queryFirstNode(newDocument, currentPath)?.appendChild(sectionElement);
      return newDocument;
    });
  }

  function appendNewSubheading() {
    setDocument((prevDocument) => {
      const newDocument = cloneDocument(prevDocument);

      const subheadingElement = newDocument.createElement("subheading");
      subheadingElement.setAttribute("number", (subheadingCount + 1) + "");

      queryFirstNode(newDocument, currentPath)?.appendChild(subheadingElement);
      return newDocument;
    });
  }

  const renderDocumentChildElements = (element: Element) => {
    let chapterCounter = 1;
    let sectionCounter = 1;
    let subheadingCounter = 1;

    return childElements(element).map((e, i) => {
      switch (e.tagName) {
        case "section":
          return <div key={i} id={`section-${e.getAttribute('number')}`}>
            <SectionElementEdit
                document={document}
                currentElement={e}
                documentProperties={documentProperties}
                documentComments={documentComments}
                setDocumentComments={setDocumentComments}
                currentPath={currentPath + "/section[" + (sectionCounter++) + "]"}
                setDocument={setDocument}
                showComments={showComments}/>
          </div>;
        case "subheading":
          return <div key={i} id={`subheading-${e.getAttribute('number')}`}>
            <SubheadingElementEdit
                document={document}
                currentElement={e}
                documentProperties={documentProperties}
                documentComments={documentComments}
                setDocumentComments={setDocumentComments}
                currentPath={currentPath + "/subheading[" + (subheadingCounter++) + "]"}
                setDocument={setDocument}
                showComments={showComments}/>
          </div>;
        case "chapter":
          return <div key={i} id={`chapter-${e.getAttribute('number')}`}>
            <ChapterElementEdit
                document={document}
                currentElement={e}
                documentProperties={documentProperties}
                documentComments={documentComments}
                setDocumentComments={setDocumentComments}
                currentPath={currentPath + "/chapter[" + (chapterCounter++) + "]"}
                setDocument={setDocument}
                showComments={showComments}/>
          </div>;
        case "part":
          return <div key={i} id={`part-${e.getAttribute('number')}`}>
            <PartElementEdit
                document={document}
                currentElement={e}
                documentProperties={documentProperties}
                documentComments={documentComments}
                setDocumentComments={setDocumentComments}
                currentPath={currentPath + "/part[" + (chapterCounter++) + "]"}
                setDocument={setDocument}
                showComments={showComments}/>
          </div>;
        default:
          return "";
      }
    });
  }

  return (
      <article>

        <FlexRowTight>
          <div style={{
            flex: 2,
          }}>
            <div style={{display: 'inline-flex', justifyContent: "space-between", width: "100%"}}>
              <div style={{
                color: tokens.colors.accentBase,
                fontSize: tokens.values.typography.heading1SmallScreen.fontSize.value,
                fontWeight: tokens.values.typography.bodySemiBold.fontWeight,
                lineHeight: 1,
              }}>
                {number}
              </div>
              <Dropdown name={"Tila: " + documentStateLabelFi(state)} changeNameToSelection={false}
                        css={css`button { margin: 0; }`}>
                <Dropdown.item onSelect={() => updateDocumentState('UNSTABLE')}>
                  {documentStateLabelFi(DocumentState.UNSTABLE)}
                </Dropdown.item>
                <Dropdown.item onSelect={() => updateDocumentState('DRAFT')}>
                  {documentStateLabelFi(DocumentState.DRAFT)}
                </Dropdown.item>
                <Dropdown.item onSelect={() => updateDocumentState('RECOMMENDATION')}>
                  {documentStateLabelFi(DocumentState.RECOMMENDATION)}
                </Dropdown.item>
                <Dropdown.item onSelect={() => updateDocumentState('DEPRECATED')}>
                  {documentStateLabelFi(DocumentState.DEPRECATED)}
                </Dropdown.item>
              </Dropdown>
            </div>
          </div>
          {showComments &&
          <div style={{flex: 1}}/>}
        </FlexRowTight>

        <FlexRowTight>
          <div style={{
            flex: 2,
          }}>
            <Heading.h1hero>
              <TextEditor
                  document={document}
                  label="Otsikko"
                  value={title}
                  setValue={updateTitle}
                  terminologyUris={terminologyUris}
                  style={{
                    fontSize: tokens.values.typography.heading1Hero.fontSize.value,
                    fontWeight: tokens.values.typography.heading1Hero.fontWeight,
                  }}/>
            </Heading.h1hero>

            <TextEditor
                document={document}
                label="Johtolause"
                value={intro}
                setValue={updateIntro}
                terminologyUris={terminologyUris}
                style={{
                  fontSize: tokens.values.typography.leadText.fontSize.value,
                  fontWeight: tokens.values.typography.leadText.fontWeight,
                }}/>
          </div>
          {showComments &&
          <div style={{
            flex: 1,
            fontSize: tokens.values.typography.bodyText.fontSize.value,
            fontWeight: tokens.values.typography.bodyText.fontWeight,
            lineHeight: tokens.values.typography.bodyText.lineHeight.value,
          }}>
            <ListComments paths={["", "/", currentPath]}
                          comments={documentComments}
                          setComments={setDocumentComments}/>
            <AddCommentButton path={currentPath}
                              comments={documentComments}
                              setComments={setDocumentComments}/>
          </div>}
        </FlexRowTight>

        {renderDocumentChildElements(currentElement)}

        {(partCount === 0 && sectionCount === 0 && subheadingCount === 0) &&
        <Button.secondaryNoborder
            icon="plus"
            onClick={appendNewChapter}
            style={{marginTop: tokens.spacing.l, marginRight: tokens.spacing.s}}>
          Lisää uusi luku
        </Button.secondaryNoborder>}
        {(partCount === 0 && chapterCount === 0) &&
        <Button.secondaryNoborder
            icon="plus" onClick={appendNewSection}
            style={{marginTop: tokens.spacing.l}}>
          Lisää uusi pykälä
        </Button.secondaryNoborder>}
        {(partCount === 0 && chapterCount === 0) &&
        <Button.secondaryNoborder
            icon="plus"
            onClick={appendNewSubheading}
            style={{marginTop: tokens.spacing.l, marginRight: tokens.spacing.s}}>
          Lisää uusi väliotsikko
        </Button.secondaryNoborder>}
        {(sectionCount === 0 && subheadingCount === 0 && chapterCount === 0) &&
        <Button.secondaryNoborder
            icon="plus"
            onClick={appendNewPart}
            style={{marginTop: tokens.spacing.l, marginRight: tokens.spacing.s}}>
          Lisää uusi osa
        </Button.secondaryNoborder>}
      </article>
  );
};

export default StatuteElementEdit;
