import React from "react";
import {queryFirstElement} from "../../../../utils/xmlUtils";
import SanitizedInlineHtml from "../../../common/SanitizedInlineHtml";
import {suomifiDesignTokens as sdt} from "suomifi-design-tokens";
import {ElementViewProps} from "../ElementViewProps";
import {checkArgument} from "../../../../utils/checkUtils";

const SubparagraphElement: React.FC<ElementViewProps> = ({element}) => {
  checkArgument(element.tagName === "subparagraph");

  const content = queryFirstElement(element, "content");

  return (
      <li style={{color: sdt.colors.highlightLight45}}>
        <p className="subparagraph" style={{color: sdt.colors.blackBase}}>
          <SanitizedInlineHtml element={content}/>
        </p>
      </li>
  );
};

export default SubparagraphElement;
