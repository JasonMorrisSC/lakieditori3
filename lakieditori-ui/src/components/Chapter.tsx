import React from "react";
import {Heading, suomifiDesignTokens as sdt} from "suomifi-ui-components";
import {queryElements, queryFirstElement, queryFirstText} from "../utils/xml-utils";
import {XmlEditorProperties} from "./XmlEditorProperties";
import Section from "./Section";
import SanitizedHtml from "./SanitizedHtml";

const Chapter: React.FC<XmlEditorProperties> = ({document, currentElement, currentPath, updateDocument}) => {
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
            <Section document={document}
                     currentElement={section}
                     currentPath={currentPath + "/section[" + (i + 1) + "]"}
                     updateDocument={updateDocument}/>
          </div>
        })}
      </div>
  );
};

export default Chapter;
