import React from "react";
import {suomifiDesignTokens as sdt} from "suomifi-ui-components";
import {queryElements, queryFirstElement} from "../utils/xml-utils";
import {XmlEditorProperties} from "./XmlEditorProperties";
import SanitizedHtml from "./SanitizedHtml";
import Subparagraph from "./Subparagraph";

const Paragraph: React.FC<XmlEditorProperties> = ({document, currentElement, currentPath, updateDocument}) => {
  const content = queryFirstElement(document, currentElement, "content");

  return (
      <div className="subsection" style={{color: sdt.colors.blackBase}}>
        <p>
          <SanitizedHtml element={content}/>
        </p>

        <ul style={{padding: 0}}>
          {queryElements(document, currentElement, 'subparagraph').map((subparagraph, i) => {
            return <li key={i} style={{color: sdt.colors.highlightLight45}}>
              <Subparagraph document={document}
                            currentElement={subparagraph}
                            currentPath={currentPath + "/subparagraph[" + (i + 1) + "]"}
                            updateDocument={updateDocument}/>
            </li>
          })}
        </ul>
      </div>
  );
};

export default Paragraph;
