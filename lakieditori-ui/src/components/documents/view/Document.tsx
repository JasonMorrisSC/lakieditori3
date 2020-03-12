import React from "react";
import {useHistory} from "react-router-dom";
import {Button, Heading, suomifiDesignTokens as sdt, Text} from "suomifi-ui-components";
import {queryElements, queryFirstElement, queryFirstText} from "../../../utils/xmlUtils";
import LayoutWithRightBar from "../../common/LayoutWithRightBar";
import {XmlViewProperties} from "./XmlViewProperties";
import SanitizedHtml from "../../common/SanitizedHtml";
import Chapter from "./Chapter";
import Section from "./Section";
import TableOfContents from "../../common/TableOfContents";
import {buildNavigationTree} from "../../common/TableOfContentsUtils";
import {assertEquals} from "../../../utils/assertUtils";

const Document: React.FC<XmlViewProperties> = ({currentElement}) => {
  assertEquals("document", currentElement.tagName);

  const history = useHistory();

  const id = queryFirstText(currentElement, "@id");
  const number = queryFirstText(currentElement, "@number");
  const title = queryFirstElement(currentElement, "title");
  const titleText = title?.textContent || '';
  const note = queryFirstElement(currentElement, "note");
  const intro = queryFirstElement(currentElement, "intro");

  const topBar = <div style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end"
  }}>
    <Text style={{maxWidth: "600px"}}>{titleText}</Text>
    <div>
      <Button.secondary
          icon={"info"}
          style={{marginRight: sdt.spacing.xs}}
          onClick={() => history.push(`/documents/${id}/info`)}>
        Lisätietoja
      </Button.secondary>
      <Button.secondary
          icon={"edit"}
          onClick={() => history.push(`/documents/${id}/edit`)}>
        Muokkaa
      </Button.secondary>
    </div>
  </div>;

  const toc = <div style={{margin: `${sdt.spacing.xl} ${sdt.spacing.m}`,}}>
    <TableOfContents title={titleText} items={buildNavigationTree(currentElement)}/>
  </div>;

  return (
      <LayoutWithRightBar topContent={topBar} rhsContent={toc}>
        <article className="document" style={{margin: sdt.spacing.xl}}>
          <Heading.h1hero>
            <small style={{color: sdt.colors.accentBase}}>{number}</small>
            <br/>
            <SanitizedHtml element={title}/>
          </Heading.h1hero>

          <p>
            <SanitizedHtml element={note}/>
          </p>

          <p>
            <Text.lead>
              <SanitizedHtml element={intro}/>
            </Text.lead>
          </p>

          {queryElements(currentElement, 'section').map((section, i) => {
            return <div key={i} id={`section-${section.getAttribute('number')}`}>
              <Section currentElement={section}/>
            </div>
          })}

          {queryElements(currentElement, 'chapter').map((chapter, i) => {
            return <div key={i} id={`chapter-${chapter.getAttribute('number')}`}>
              <Chapter currentElement={chapter}/>
            </div>
          })}

          <br/>
        </article>
      </LayoutWithRightBar>
  );
};

export default Document;
