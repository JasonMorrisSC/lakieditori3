import React from "react";
import {Heading, suomifiDesignTokens as sdt} from "suomifi-ui-components";
import {firstChildByTagName, toElementsArr} from "../utils/xml-utils";
import Subsection from "./Subsection";

const Section: React.FC<Props> = ({section}: Props) => {
  return (
      <div className="section" style={{marginTop: sdt.spacing.l}}>
        <Heading.h3>
          <span style={{color: sdt.colors.highlightBase}}>
            {section.getAttribute('number')} §
          </span>
          <br/>
          {firstChildByTagName(section, 'title')?.textContent}
        </Heading.h3>

        <ul style={{padding: 0}}>
          {toElementsArr(section.childNodes, e => e.tagName === 'subsection').map((subsection, i) => {
            return <Subsection key={i} subsection={subsection}/>
          })}
        </ul>
      </div>
  );
};

interface Props {
  section: Element;
}

export default Section;
