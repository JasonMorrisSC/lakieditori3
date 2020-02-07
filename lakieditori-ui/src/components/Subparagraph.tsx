import React from "react";
import {queryFirstElement} from "../utils/xml-utils";
import {XmlEditorProperties} from "./XmlEditorProperties";
import SanitizedHtml from "./SanitizedHtml";
import {suomifiDesignTokens as sdt} from "suomifi-design-tokens";

const Subparagraph: React.FC<XmlEditorProperties> = ({document, currentElement, currentPath, updateDocument}) => {
  const content = queryFirstElement(document, currentElement, "content");

  return (
      <p className="subparagraph" style={{color: sdt.colors.blackBase}}>
        <SanitizedHtml element={content}/>
      </p>
  );
};

export default Subparagraph;
