import React from "react";
import {suomifiDesignTokens as sdt} from "suomifi-ui-components";
import {queryElements, queryFirstElement} from "../../../../utils/xmlUtils";
import ParagraphElement from "./ParagraphElement";
import SanitizedHtml from "../../../common/SanitizedHtml";
import {ElementViewProps} from "./ElementViewProps";
import {checkArgument} from "../../../../utils/checkUtils";

const SubsectionElement: React.FC<ElementViewProps> = ({element}) => {
  checkArgument(element.tagName === "subsection");

  const content = queryFirstElement(element, "content");

  return (
      <div className="subsection">
        <p style={{color: sdt.colors.blackBase}}>
          <SanitizedHtml element={content}/>
        </p>

        <ul>
          {queryElements(element, 'paragraph').map((paragraph, i) => (
              <ParagraphElement key={i} element={paragraph}/>
          ))}
        </ul>
      </div>
  );
};

export default SubsectionElement;
