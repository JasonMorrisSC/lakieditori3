import React from "react";
import {Heading, suomifiDesignTokens as sdt} from "suomifi-ui-components";
import {queryElements, queryFirstElement, queryFirstText} from "../utils/xml-utils";
import Subsection from "./Subsection";
import SanitizedHtml from "./SanitizedHtml";
import {XmlViewProperties} from "./XmlViewProperties";

const Section: React.FC<XmlViewProperties> = ({currentElement}) => {
  let number = queryFirstText(currentElement, "@number");
  const title = queryFirstElement(currentElement, "title");

  return (
      <div className="section" style={{marginTop: sdt.spacing.l}}>
        <Heading.h3>
          <span style={{color: sdt.colors.highlightBase}}>
            {number} §
          </span>
          <br/>
          <SanitizedHtml element={title}/>
        </Heading.h3>

        {queryElements(currentElement, 'subsection').map((subsection, i) => {
          return <Subsection key={i} currentElement={subsection}/>
        })}
      </div>
  );
};

export default Section;
