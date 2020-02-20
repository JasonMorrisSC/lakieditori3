import React from "react";
import {suomifiDesignTokens as sdt} from "suomifi-ui-components";
import {queryElements, queryFirstElement} from "../utils/xml-utils";
import Paragraph from "./Paragraph";
import SanitizedHtml from "./SanitizedHtml";
import {XmlViewProperties} from "./XmlViewProperties";

const Subsection: React.FC<XmlViewProperties> = ({currentElement}) => {
  const content = queryFirstElement(currentElement, "content");

  return (
      <div className="subsection">
        <p style={{color: sdt.colors.blackBase}}>
          <SanitizedHtml element={content}/>
        </p>

        <ul style={{padding: 0}}>
          {queryElements(currentElement, 'paragraph').map((paragraph, i) => {
            return <li key={i} style={{color: sdt.colors.highlightLight45}}>
              <Paragraph currentElement={paragraph}/>
            </li>
          })}
        </ul>
      </div>
  );
};

export default Subsection;
