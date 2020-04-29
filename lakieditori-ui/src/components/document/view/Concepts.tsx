import React, {useState} from "react";
import {Button, suomifiDesignTokens as tokens} from "suomifi-ui-components";
import {queryFirstText} from "../../../utils/xmlUtils";
import {ElementViewProps} from "../view/elements/ElementViewProps";
import styled from "@emotion/styled";
import {useDocumentConcepts} from "./useDocumentConcept";

export const ConceptLabelButton = styled(Button.secondaryNoborder)`
  font-size: ${tokens.values.typography.bodyTextSmall.fontSize.value}${tokens.values.typography.bodyTextSmall.fontSize.unit};
  font-weight: ${tokens.values.typography.bodyTextSmall.fontWeight};
  color: ${tokens.colors.blackBase} !important;
  background: none !important;
  min-height: 0;
  padding: ${tokens.spacing.xs} 0;
  & > svg {
    height: 0.7em !important;
    width: 0.7em !important;
  };
`;

interface Props {
  document: Document
}

const Concepts: React.FC<Props> = ({document}) => {
  const {concepts} = useDocumentConcepts(document);

  return (
      <div>
        <div style={{
          fontWeight: tokens.values.typography.bodySemiBold.fontWeight,
          padding: `${tokens.spacing.xs} 0`
        }}>
          {concepts.length > 0 ? 'Käsitteet' : ''}
        </div>

        {concepts.map((concept, i) => <Concept key={i} element={concept}/>)}
      </div>
  );
};

const Concept: React.FC<ElementViewProps> = ({element}) => {
  const [isExpanded, setExpanded] = useState<boolean>(false);

  const uri = element.getAttribute("uri") || '';
  const label = queryFirstText(element, "label");
  const definition = queryFirstText(element, "definition");
  const terminologyLabel = queryFirstText(element, "terminology/label");

  return (
      <div style={{
        fontSize: tokens.values.typography.bodyTextSmall.fontSize.value,
        color: tokens.colors.blackBase,
        margin: `${tokens.spacing.s} 0`,
      }}>
        <ConceptLabelButton
            icon={isExpanded ? "expandableMinus" : "expandablePlus"}
            onClick={() => setExpanded(!isExpanded)}>
          {label}
        </ConceptLabelButton>
        {isExpanded &&
        <div>
          <div style={{color: tokens.colors.depthDark27, margin: `${tokens.spacing.xs} 0`}}>
            {definition}
          </div>
          <a href={uri} target={"_blank"}>
            {terminologyLabel}&nbsp;
            <span className={"material-icons"} style={{
              fontSize: tokens.values.typography.bodyTextSmall.fontSize.value,
              marginTop: -2,
              verticalAlign: "middle",
            }}>launch</span>
          </a>
        </div>}
      </div>
  );
};

export default Concepts;
