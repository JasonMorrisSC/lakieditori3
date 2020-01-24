import React from "react";
import {Heading, suomifiDesignTokens as sdt} from "suomifi-ui-components";
import {queryElements, queryFirstText} from "../utils/xml-utils";
import {XmlEditorProperties} from "./XmlEditorProperties";
import Section from "./Section";

const Chapter: React.FC<XmlEditorProperties> = ({document, currentElement, currentPath, updateDocument}) => {
  let number = queryFirstText(document, currentElement, "@number");
  let title = queryFirstText(document, currentElement, "title");
  let content = queryFirstText(document, currentElement, "content");

  return (
      <div className="chapter" style={{margin: `${sdt.spacing.xl} 0`}}>
        <Heading.h2>
          <span style={{color: sdt.colors.highlightBase}}>
            {number} luku
          </span>
          <br/>
          {title}
        </Heading.h2>

        <p>
          {content}
        </p>

        {queryElements(document, currentElement, 'section').map((section, i) => {
          return <div key={i} id={`chapter-${number}-section-${section.getAttribute('number')}`}>
            <Section section={section}/>
          </div>
        })}
      </div>
  );
};

export default Chapter;
