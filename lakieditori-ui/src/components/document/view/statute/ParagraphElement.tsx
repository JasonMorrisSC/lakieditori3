import React from "react";
import {suomifiDesignTokens as sdt} from "suomifi-ui-components";
import {queryElements, queryFirstElement} from "../../../../utils/xmlUtils";
import SanitizedInlineHtml from "../../../common/SanitizedInlineHtml";
import SubparagraphElement from "./SubparagraphElement";
import {ElementViewProps} from "../ElementViewProps";
import {checkArgument} from "../../../../utils/checkUtils";

const ParagraphElement: React.FC<ElementViewProps> = ({element}) => {
  checkArgument(element.tagName === "paragraph");

  const content = queryFirstElement(element, "content");

  return (
      <li className="paragraph" style={{color: sdt.colors.highlightLight45}}>
        <p style={{color: sdt.colors.blackBase}}>
          <SanitizedInlineHtml element={content}/>
        </p>

        <ul>
          {queryElements(element, 'subparagraph').map((subparagraph, i) => (
              <SubparagraphElement key={i} element={subparagraph}/>
          ))}
        </ul>
      </li>
  );
};

export default ParagraphElement;
