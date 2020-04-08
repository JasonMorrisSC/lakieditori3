import React from "react";
import {Heading, suomifiDesignTokens as tokens, Text} from "suomifi-ui-components";
import {queryElements, queryFirstElement, queryFirstText} from "../../../../utils/xmlUtils";
import SanitizedHtml from "../../../common/SanitizedHtml";
import ChapterElement from "./ChapterElement";
import SectionElement from "./SectionElement";
import {ElementViewProps} from "./ElementViewProps";
import {checkArgument} from "../../../../utils/checkUtils";

const DocumentElement: React.FC<ElementViewProps> = ({element}) => {
  checkArgument(element.tagName === "document");

  const number = queryFirstText(element, "@number");
  const title = queryFirstElement(element, "title");
  const intro = queryFirstElement(element, "intro");

  return (
      <article>
        <Heading.h1hero>
          <small style={{color: tokens.colors.accentBase}}>{number}</small>
          <br/>
          <SanitizedHtml element={title}/>
        </Heading.h1hero>

        <p>
          <Text.lead>
            <SanitizedHtml element={intro}/>
          </Text.lead>
        </p>

        {queryElements(element, 'section').map((section, i) => {
          return <div key={i} id={`section-${section.getAttribute('number')}`}>
            <SectionElement element={section}/>
          </div>
        })}

        {queryElements(element, 'chapter').map((chapter, i) => {
          return <div key={i} id={`chapter-${chapter.getAttribute('number')}`}>
            <ChapterElement element={chapter}/>
          </div>
        })}
      </article>
  );
};

export default DocumentElement;
