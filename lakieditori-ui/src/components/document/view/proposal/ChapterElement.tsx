import React from "react";
import {Heading, suomifiDesignTokens as sdt} from "suomifi-ui-components";
import {queryElements, queryFirstElement, queryFirstText} from "../../../../utils/xmlUtils";
import SanitizedInlineHtml from "../../../common/SanitizedInlineHtml";
import {ElementViewProps} from "../ElementViewProps";
import {checkArgument} from "../../../../utils/checkUtils";
import SanitizedBlockHtml from "../../../common/SanitizedBlockHtml";
import SectionElement from "./SectionElement";

const ChapterElement: React.FC<ElementViewProps> = ({element}) => {
  checkArgument(element.tagName === "chapter");

  let number = queryFirstText(element, "@number");
  const heading = queryFirstElement(element, "heading");
  const content = queryFirstElement(element, "content");

  return (
      <div className="chapter">
        <Heading.h2 style={{margin: `${sdt.spacing.l} 0 ${sdt.spacing.m}`}}>
          {number}&nbsp;&nbsp;<SanitizedInlineHtml element={heading}/>
        </Heading.h2>

        <SanitizedBlockHtml element={content}/>

        {queryElements(element, 'section').map((section, i) => (
            <SectionElement key={i} element={section}/>
        ))}
      </div>
  );
};

export default ChapterElement;
