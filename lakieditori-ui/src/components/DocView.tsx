import React from "react";
import {Link} from "react-router-dom";
import {Button, Heading, suomifiDesignTokens as sdt, Text} from "suomifi-ui-components";
import {queryElements, queryFirstText} from "../utils/xml-utils";
import {XmlEditorProperties} from "./XmlEditorProperties";
import LayoutWithRightBar from "./LayoutWithRightBar";
import NavItemProps from "./NavItemProps";
import Chapter from "./Chapter";
import Section from "./Section";
import Toc from "./Toc";
import {encodeIdForUrl} from "../utils/id-utils";

const DocView: React.FC<XmlEditorProperties> = ({document, currentElement, currentPath, updateDocument}) => {
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
  const title = queryFirstText(document, currentElement, "title");
  const intro = queryFirstText(document, currentElement, "intro");
  const content = queryFirstText(document, currentElement, "content");

  const topBar = <div style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end"
  }}>
    <Text style={{maxWidth: "600px"}}>{title}</Text>
    <div>
      <Link to={`/documents/${encodeIdForUrl(number)}/source`}>
        <Button.secondaryNoborder
            icon={"registers"}
            style={{
              background: "none",
              marginRight: sdt.spacing.xs
            }}>
          XML
        </Button.secondaryNoborder>
      </Link>
      {/*
      <Link to={`/documents/${encodeIdForUrl(number)}/info`}>
        <Button.secondary icon={"info"} style={{marginRight: sdt.spacing.xs}}>
          Lisätietoja
        </Button.secondary>
      </Link>
      <Link to={`/documents/${encodeIdForUrl(number)}/edit`}>
        <Button.secondary icon={"edit"}>
          Muokkaa
        </Button.secondary>
      </Link>
      */}
    </div>
  </div>;

  const toc = <div style={{margin: `${sdt.spacing.xl} ${sdt.spacing.m}`,}}>
    <Toc tocTitle={title} tocItems={navTree}/>
  </div>;

  return (
      <LayoutWithRightBar topContent={topBar} rhsContent={toc}>
        <div className="document" style={{margin: sdt.spacing.xl}}>
          <Heading.h1hero>
            <small style={{color: sdt.colors.accentBase}}>{number}</small>
            <br/>
            {title}
          </Heading.h1hero>

          <p>
            <Text.lead>
              {intro}
            </Text.lead>
          </p>

          <p>{content}</p>

          {queryElements(document, currentElement, 'section').map((section, i) => {
            return <div key={i} id={`section-${section.getAttribute('number')}`}>
              <Section section={section}/>
            </div>
          })}

          {queryElements(document, currentElement, 'chapter').map((chapter, i) => {
            return <div key={i} id={`chapter-${chapter.getAttribute('number')}`}>
              <Chapter document={document}
                       currentElement={chapter}
                       currentPath={currentPath + "/chapter[" + (i + 1) + "]"}
                       updateDocument={updateDocument}/>
            </div>
          })}

          <br/>
        </div>
      </LayoutWithRightBar>
  );
};

export default DocView;
