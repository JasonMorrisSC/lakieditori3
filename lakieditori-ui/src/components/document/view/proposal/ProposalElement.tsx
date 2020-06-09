import React from "react";
import {Heading, suomifiDesignTokens as tokens, Text} from "suomifi-ui-components";
import {queryFirstElement, queryFirstText} from "../../../../utils/xmlUtils";
import SanitizedInlineHtml from "../../../common/SanitizedInlineHtml";
import {ElementViewProps} from "../ElementViewProps";
import {checkArgument} from "../../../../utils/checkUtils";
import SanitizedBlockHtml from "../../../common/SanitizedBlockHtml";

const ProposalElement: React.FC<ElementViewProps> = ({element}) => {
  checkArgument(element.tagName === "proposal");

  const number = queryFirstText(element, "@number");
  const title = queryFirstElement(element, "title");
  const abstract = queryFirstElement(element, "abstract");

  return (
      <article>
        <Heading.h1hero>
          <small style={{color: tokens.colors.accentBase}}>{number}</small>
          <br/>
          <SanitizedInlineHtml element={title}/>
        </Heading.h1hero>

        <p>
          <Text.lead>
            <SanitizedBlockHtml element={abstract}/>
          </Text.lead>
        </p>

        {/*childElements(element).map((e, i) => {
          switch (e.tagName) {
            case "section":
              return <div key={i} id={`section-${e.getAttribute('number')}`}>
                <SectionElement element={e}/>
              </div>;
            case "subheading":
              return <div key={i} id={`subheading-${e.getAttribute('number')}`}>
                <SubheadingElement element={e}/>
              </div>;
            case "chapter":
              return <div key={i} id={`chapter-${e.getAttribute('number')}`}>
                <ChapterElement element={e}/>
              </div>;
            case "part":
              return <div key={i} id={`part-${e.getAttribute('number')}`}>
                <PartElement element={e}/>
              </div>;
            default:
              return "";
          }
        })*/}
      </article>
  );
};

export default ProposalElement;
