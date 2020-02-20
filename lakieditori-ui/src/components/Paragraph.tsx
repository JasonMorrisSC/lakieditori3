import React from "react";
import {suomifiDesignTokens as sdt} from "suomifi-ui-components";
import {queryElements, queryFirstElement} from "../utils/xml-utils";
import SanitizedHtml from "./SanitizedHtml";
import Subparagraph from "./Subparagraph";
import {XmlViewProperties} from "./XmlViewProperties";

const Paragraph: React.FC<XmlViewProperties> = ({currentElement}) => {
  const content = queryFirstElement(currentElement, "content");

  return (
      <div className="subsection" style={{color: sdt.colors.blackBase}}>
        <p>
          <SanitizedHtml element={content}/>
        </p>

        <ul style={{padding: 0}}>
          {queryElements(currentElement, 'subparagraph').map((subparagraph, i) => {
            return <li key={i} style={{color: sdt.colors.highlightLight45}}>
              <Subparagraph currentElement={subparagraph}/>
            </li>
          })}
        </ul>
      </div>
  );
};

export default Paragraph;
