import React from "react";
import {Heading, suomifiDesignTokens as sdt} from "suomifi-ui-components";
import {queryFirstElement, queryFirstText} from "../../../../utils/xmlUtils";
import SanitizedInlineHtml from "../../../common/SanitizedInlineHtml";
import {ElementViewProps} from "../ElementViewProps";
import {checkArgument} from "../../../../utils/checkUtils";
import SanitizedBlockHtml from "../../../common/SanitizedBlockHtml";

const ParagraphElement: React.FC<ElementViewProps> = ({element}) => {
  checkArgument(element.tagName === "paragraph");

  let number = queryFirstText(element, "@number");
  const heading = queryFirstElement(element, "heading");
  const content = queryFirstElement(element, "content");

  return (
      <div className="paragraph">
        <Heading.h5 style={{margin: `${sdt.spacing.l} 0 ${sdt.spacing.m}`}}>
          {number}&nbsp;&nbsp;<SanitizedInlineHtml element={heading}/>
        </Heading.h5>

        <SanitizedBlockHtml element={content}/>
      </div>
  );
};

export default ParagraphElement;
