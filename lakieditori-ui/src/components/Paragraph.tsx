import React from "react";
import {suomifiDesignTokens as sdt} from "suomifi-ui-components";
import {firstChildByTagName} from "../utils/xml-utils";

const Paragraph: React.FC<Props> = ({paragraph}: Props) => {
  return (
      <li className="paragraph" style={{color: sdt.colors.highlightLight45}}>
        <p style={{color: sdt.colors.blackBase}}>
          {firstChildByTagName(paragraph, 'content')?.textContent}
        </p>
      </li>
  );
};

interface Props {
  paragraph: Element;
}

export default Paragraph;
