import React from "react";
import {Heading, suomifiDesignTokens as sdt} from "suomifi-ui-components";
import {queryElements, queryFirstElement, queryFirstText} from "../../../../utils/xmlUtils";
import SanitizedInlineHtml from "../../../common/SanitizedInlineHtml";
import {ElementViewProps} from "../ElementViewProps";
import {checkArgument} from "../../../../utils/checkUtils";
import SanitizedBlockHtml from "../../../common/SanitizedBlockHtml";
import SubsectionElement from "./SubsectionElement";

const SectionElement: React.FC<ElementViewProps> = ({element}) => {
  checkArgument(element.tagName === "section");

  let number = queryFirstText(element, "@number");
  const heading = queryFirstElement(element, "heading");
  const content = queryFirstElement(element, "content");

  return (
      <div className="section" id={`section-${number}`}>
        <Heading.h3 style={{margin: `${sdt.spacing.l} 0 ${sdt.spacing.m}`}}>
          {number}&nbsp;&nbsp;<SanitizedInlineHtml element={heading}/>
        </Heading.h3>

        <SanitizedBlockHtml element={content}/>

        {queryElements(element, 'subsection').map((subsection, i) => (
            <SubsectionElement key={i} element={subsection}/>
        ))}
      </div>
  );
};

export default SectionElement;
