import React from "react";
import {queryFirstElement} from "../../../utils/xmlUtils";
import SanitizedHtml from "../../common/SanitizedHtml";
import {suomifiDesignTokens as sdt} from "suomifi-design-tokens";
import {XmlViewProperties} from "./XmlViewProperties";
import {assertEquals} from "../../../utils/assertUtils";

const Subparagraph: React.FC<XmlViewProperties> = ({currentElement}) => {
  assertEquals("subparagraph", currentElement.tagName);

  const content = queryFirstElement(currentElement, "content");

  return (
      <p className="subparagraph" style={{color: sdt.colors.blackBase}}>
        <SanitizedHtml element={content}/>
      </p>
  );
};

export default Subparagraph;
