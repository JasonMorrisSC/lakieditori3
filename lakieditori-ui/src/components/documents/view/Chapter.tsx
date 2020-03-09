import React from "react";
import {Heading, suomifiDesignTokens as sdt} from "suomifi-ui-components";
import {queryElements, queryFirstElement, queryFirstText} from "../../../utils/xmlUtils";
import Section from "./Section";
import SanitizedHtml from "../../common/SanitizedHtml";
import {XmlViewProperties} from "./XmlViewProperties";

const Chapter: React.FC<XmlViewProperties> = ({currentElement}) => {
  let number = queryFirstText(currentElement, "@number");
  const title = queryFirstElement(currentElement, "title");

  return (
      <div className="chapter" style={{margin: `${sdt.spacing.xl} 0`}}>
        <Heading.h2>
          <span style={{color: sdt.colors.highlightBase}}>
            {number} luku
          </span>
          <br/>
          <SanitizedHtml element={title}/>
        </Heading.h2>

        {queryElements(currentElement, 'section').map((section, i) => {
          return <div key={i} id={`chapter-${number}-section-${section.getAttribute('number')}`}>
            <Section currentElement={section}/>
          </div>
        })}
      </div>
  );
};

export default Chapter;
