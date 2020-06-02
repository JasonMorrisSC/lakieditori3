import React from "react";
import {Heading, suomifiDesignTokens as sdt} from "suomifi-ui-components";
import {queryElements, queryFirstElement, queryFirstText} from "../../../../utils/xmlUtils";
import SubsectionElement from "./SubsectionElement";
import SanitizedHtml from "../../../common/SanitizedHtml";
import {ElementViewProps} from "./ElementViewProps";
import {checkArgument} from "../../../../utils/checkUtils";

const SectionElement: React.FC<ElementViewProps> = ({element}) => {
  checkArgument(element.tagName === "section");

  let number = queryFirstText(element, "@number");
  const heading = queryFirstElement(element, "heading");

  return (
      <div className="section" style={{marginTop: sdt.spacing.l}}>
        <Heading.h3>
          <span style={{color: sdt.colors.highlightBase}}>
            {number} §
          </span>
          <br/>
          <SanitizedHtml element={heading}/>
        </Heading.h3>

        {queryElements(element, 'subsection').map((subsection, i) => {
          return <SubsectionElement key={i} element={subsection}/>
        })}
      </div>
  );
};

export default SectionElement;
