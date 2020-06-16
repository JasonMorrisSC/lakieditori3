import React from "react";
import {Heading, suomifiDesignTokens as tokens, Text} from "suomifi-ui-components";
import {queryElements, queryFirstElement, queryFirstText} from "../../../../utils/xmlUtils";
import SanitizedInlineHtml from "../../../common/SanitizedInlineHtml";
import {ElementViewProps} from "../ElementViewProps";
import {checkArgument} from "../../../../utils/checkUtils";
import SanitizedBlockHtml from "../../../common/SanitizedBlockHtml";
import ChapterElement from "./ChapterElement";
import styled from "@emotion/styled";

const PartHeading = styled(Heading.h2)`
  margin: ${tokens.spacing.xl} 0 ${tokens.spacing.l};
  text-transform: uppercase;
`;

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

        <PartHeading id={"abstract"}>
          Esityksen pääasiallinen sisältö
        </PartHeading>

        <Text.lead>
          <SanitizedBlockHtml element={abstract}/>
        </Text.lead>

        <PartHeading id={"proposal"}>
          Perustelut
        </PartHeading>

        {queryElements(element, 'chapter').map((chapter, i) => (
            <ChapterElement key={i} element={chapter}/>
        ))}
      </article>
  );
};

export default ProposalElement;
