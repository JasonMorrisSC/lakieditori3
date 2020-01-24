import React from "react";
import {suomifiDesignTokens as sdt} from "suomifi-ui-components";
import {firstChildByTagName, toElementsArr} from "../utils/xml-utils";
import Paragraph from "./Paragraph";

const Subsection: React.FC<Props> = ({subsection}: Props) => {
  return (
      <li className="subsection" style={{color: sdt.colors.highlightLight45}}>
        <p style={{color: sdt.colors.blackBase}}>
          {firstChildByTagName(subsection, 'content')?.textContent}
        </p>

        <ul style={{padding: 0}}>
          {toElementsArr(subsection.childNodes, e => e.tagName === 'paragraph').map((paragraph, i) => {
            return <Paragraph key={i} paragraph={paragraph}/>
          })}
        </ul>
      </li>
  );
};

interface Props {
  subsection: Element;
}

export default Subsection;
