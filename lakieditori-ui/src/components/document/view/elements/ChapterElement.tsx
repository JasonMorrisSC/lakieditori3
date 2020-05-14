import React from "react";
import {Heading, suomifiDesignTokens as sdt} from "suomifi-ui-components";
import {childElements, queryFirstElement, queryFirstText} from "../../../../utils/xmlUtils";
import SectionElement from "./SectionElement";
import SanitizedHtml from "../../../common/SanitizedHtml";
import {ElementViewProps} from "./ElementViewProps";
import {checkArgument} from "../../../../utils/checkUtils";
import SubheadingElement from "./SubheadingElement";

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

        {childElements(element).map((e, i) => {
          switch (e.tagName) {
            case "section":
              return <div key={i} id={`chapter-${number}-section-${e.getAttribute('number')}`}>
                <SectionElement element={e}/>
              </div>;
            case "subheading":
              return <div key={i} id={`chapter-${number}-subheading-${e.getAttribute('number')}`}>
                <SubheadingElement element={e}/>
              </div>;
            default:
              return "";
          }
        })}
      </div>
  );
};

export default ChapterElement;
