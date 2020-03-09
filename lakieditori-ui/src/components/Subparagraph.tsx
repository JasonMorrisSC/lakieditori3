import React from "react";
import {queryFirstElement} from "../utils/xmlUtils";
import SanitizedHtml from "./SanitizedHtml";
import {suomifiDesignTokens as sdt} from "suomifi-design-tokens";
import {XmlViewProperties} from "./XmlViewProperties";

const Subparagraph: React.FC<XmlViewProperties> = ({currentElement}) => {
  const content = queryFirstElement(currentElement, "content");

  return (
      <p className="subparagraph" style={{color: sdt.colors.blackBase}}>
        <SanitizedHtml element={content}/>
      </p>
  );
};

export default Subparagraph;
