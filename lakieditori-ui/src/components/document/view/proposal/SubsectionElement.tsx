import React from "react";
import {Heading, suomifiDesignTokens as sdt} from "suomifi-ui-components";
import {queryElements, queryFirstElement, queryFirstText} from "../../../../utils/xmlUtils";
import SanitizedInlineHtml from "../../../common/SanitizedInlineHtml";
import {ElementViewProps} from "../ElementViewProps";
import {checkArgument} from "../../../../utils/checkUtils";
import SanitizedBlockHtml from "../../../common/SanitizedBlockHtml";
import ParagraphElement from "./ParagraphElement";

const SubsectionElement: React.FC<ElementViewProps> = ({element}) => {
  checkArgument(element.tagName === "subsection");

  let number = queryFirstText(element, "@number");
  const heading = queryFirstElement(element, "heading");
  const content = queryFirstElement(element, "content");

  return (
      <div className="subsection">
        <Heading.h4 style={{margin: `${sdt.spacing.l} 0 ${sdt.spacing.m}`}}>
          {number}&nbsp;&nbsp;<SanitizedInlineHtml element={heading}/>
        </Heading.h4>

        <SanitizedBlockHtml element={content}/>

        {queryElements(element, 'paragraph').map((paragraph, i) => (
            <ParagraphElement key={i} element={paragraph}/>
        ))}
      </div>
  );
};

export default SubsectionElement;
