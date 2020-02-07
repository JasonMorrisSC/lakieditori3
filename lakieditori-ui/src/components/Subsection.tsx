import React from "react";
import {suomifiDesignTokens as sdt} from "suomifi-ui-components";
import {queryElements, queryFirstElement} from "../utils/xml-utils";
import Paragraph from "./Paragraph";
import {XmlEditorProperties} from "./XmlEditorProperties";
import SanitizedHtml from "./SanitizedHtml";

const Subsection: React.FC<XmlEditorProperties> = ({document, currentElement, currentPath, updateDocument}) => {
  const content = queryFirstElement(document, currentElement, "content");

  return (
      <div className="subsection">
        <p style={{color: sdt.colors.blackBase}}>
          <SanitizedHtml element={content}/>
        </p>

        <ul style={{padding: 0}}>
          {queryElements(document, currentElement, 'paragraph').map((paragraph, i) => {
            return <li key={i} style={{color: sdt.colors.highlightLight45}}>
              <Paragraph document={document}
                         currentElement={paragraph}
                         currentPath={currentPath + "/paragraph[" + (i + 1) + "]"}
                         updateDocument={updateDocument}/>
            </li>
          })}
        </ul>
      </div>
  );
};

export default Subsection;
