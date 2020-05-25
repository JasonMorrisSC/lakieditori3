import React from "react";
import {Heading, suomifiDesignTokens as tokens, Text} from "suomifi-ui-components";
import {childElements, queryFirstElement, queryFirstText} from "../../../../utils/xmlUtils";
import SanitizedHtml from "../../../common/SanitizedHtml";
import ChapterElement from "./ChapterElement";
import SectionElement from "./SectionElement";
import {ElementViewProps} from "./ElementViewProps";
import {checkArgument} from "../../../../utils/checkUtils";
import SubheadingElement from "./SubheadingElement";
import PartElement from "./PartElement";

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

        {childElements(element).map((e, i) => {
          switch (e.tagName) {
            case "section":
              return <div key={i} id={`section-${e.getAttribute('number')}`}>
                <SectionElement element={e}/>
              </div>;
            case "subheading":
              return <div key={i} id={`subheading-${e.getAttribute('number')}`}>
                <SubheadingElement element={e}/>
              </div>;
            case "chapter":
              return <div key={i} id={`chapter-${e.getAttribute('number')}`}>
                <ChapterElement element={e}/>
              </div>;
            case "part":
              return <div key={i} id={`part-${e.getAttribute('number')}`}>
                <PartElement element={e}/>
              </div>;
            default:
              return "";
          }
        })}
      </article>
  );
};

export default DocumentElement;
