import React from "react";
import {Heading, suomifiDesignTokens as sdt} from "suomifi-ui-components";
import {queryElements, queryFirstElement, queryFirstText} from "../../../../utils/xmlUtils";
import SanitizedHtml from "../../../common/SanitizedHtml";
import {ElementViewProps} from "./ElementViewProps";
import {checkArgument} from "../../../../utils/checkUtils";
import ChapterElement from "./ChapterElement";

const PartElement: React.FC<ElementViewProps> = ({element}) => {
  checkArgument(element.tagName === "part");

  let number = queryFirstText(element, "@number");
  const heading = queryFirstElement(element, "heading");

  return (
      <div className="part" style={{margin: `${sdt.spacing.xl} 0`}}>
        <Heading.h2>
          <span style={{color: sdt.colors.highlightBase}}>
            {number} osa
          </span>
          <br/>
          <SanitizedHtml element={heading}/>
        </Heading.h2>

        {queryElements(element, 'chapter').map((e, i) => (
            <div key={i} id={`chapter-${e.getAttribute('number')}`}>
              <ChapterElement element={e}/>
            </div>
        ))}
      </div>
  );
};

export default PartElement;
