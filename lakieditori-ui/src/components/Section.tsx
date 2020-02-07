import React from "react";
import {Heading, suomifiDesignTokens as sdt} from "suomifi-ui-components";
import {queryElements, queryFirstElement, queryFirstText} from "../utils/xml-utils";
import Subsection from "./Subsection";
import {XmlEditorProperties} from "./XmlEditorProperties";
import SanitizedHtml from "./SanitizedHtml";

const Section: React.FC<XmlEditorProperties> = ({document, currentElement, currentPath, updateDocument}) => {
  let number = queryFirstText(document, currentElement, "@number");
  const title = queryFirstElement(document, currentElement, "title");

  return (
      <div className="section" style={{marginTop: sdt.spacing.l}}>
        <Heading.h3>
          <span style={{color: sdt.colors.highlightBase}}>
            {number} §
          </span>
          <br/>
          <SanitizedHtml element={title}/>
        </Heading.h3>

        <ul style={{padding: 0}}>
          {queryElements(document, currentElement, 'subsection').map((subsection, i) => {
            return <li key={i} style={{color: sdt.colors.highlightLight45}}>
              <Subsection document={document}
                          currentElement={subsection}
                          currentPath={currentPath + "/subsection[" + (i + 1) + "]"}
                          updateDocument={updateDocument}/>
            </li>
          })}
        </ul>
      </div>
  );
};

export default Section;
