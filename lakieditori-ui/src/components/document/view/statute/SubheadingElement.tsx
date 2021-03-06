import React from "react";
import {Heading, suomifiDesignTokens as sdt} from "suomifi-ui-components";
import SanitizedInlineHtml from "../../../common/SanitizedInlineHtml";
import {ElementViewProps} from "../ElementViewProps";
import {checkArgument} from "../../../../utils/checkUtils";

const SubheadingElement: React.FC<ElementViewProps> = ({element}) => {
  checkArgument(element.tagName === "subheading");

  return (
      <div className="subheading" style={{marginTop: sdt.spacing.l}}>
        <Heading.h2>
          <SanitizedInlineHtml element={element}/>
        </Heading.h2>
      </div>
  );
};

export default SubheadingElement;
