import React from "react";
import {Heading, suomifiDesignTokens as sdt} from "suomifi-ui-components";
import {queryElements, queryFirstElement, queryFirstText} from "../../../../utils/xmlUtils";
import SectionElement from "./SectionElement";
import SanitizedHtml from "../../../common/SanitizedHtml";
import {ElementViewProps} from "./ElementViewProps";
import {checkArgument} from "../../../../utils/checkUtils";

const ChapterElement: React.FC<ElementViewProps> = ({element}) => {
  checkArgument(element.tagName === "chapter");

  let number = queryFirstText(element, "@number");
  const title = queryFirstElement(element, "title");

  return (
      <div className="chapter" style={{margin: `${sdt.spacing.xl} 0`}}>
        <Heading.h2>
          <span style={{color: sdt.colors.highlightBase}}>
            {number} luku
          </span>
          <br/>
          <SanitizedHtml element={title}/>
        </Heading.h2>

        {queryElements(element, 'section').map((section, i) => {
          return <div key={i} id={`chapter-${number}-section-${section.getAttribute('number')}`}>
            <SectionElement element={section}/>
          </div>
        })}
      </div>
  );
};

export default ChapterElement;
