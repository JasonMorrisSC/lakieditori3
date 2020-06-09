import React, {useState} from "react";
import {Button, suomifiDesignTokens as tokens} from "suomifi-ui-components";
import {countNodes, queryFirstText} from "../../../utils/xmlUtils";
import {ElementViewProps} from "./ElementViewProps";
import styled from "@emotion/styled";
import {useDocumentConcepts} from "./useDocumentConcept";

const ConceptList = styled.div`
  position: sticky;
  top: 56px;
  height: 93vh;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  } 
`;

const ConceptLabelButton = styled(Button.secondaryNoborder)`
  font-size: ${tokens.values.typography.bodyTextSmall.fontSize.value}${tokens.values.typography.bodyTextSmall.fontSize.unit};
  font-weight: ${tokens.values.typography.bodyTextSmall.fontWeight};
  color: ${tokens.colors.blackBase} !important;
  background: none !important;
  min-height: 0;
  padding: ${tokens.spacing.xs} 0;
  text-align: left;
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
      <ConceptList>
        <div style={{
          fontWeight: tokens.values.typography.bodySemiBold.fontWeight,
          padding: `${tokens.spacing.s} 0 0`
        }}>
          {concepts.length > 0 ? 'Käsitteet' : ''}
        </div>

        {concepts.map((concept, i) => <Concept key={i} document={document} element={concept}/>)}
      </ConceptList>
  );
};

interface ConceptProps extends ElementViewProps {
  document: Document
}

const Concept: React.FC<ConceptProps> = ({document, element}) => {
  const [isExpanded, setExpanded] = useState<boolean>(false);

  const uri = element.getAttribute("uri") || '';
  const label = queryFirstText(element, "label");
  const definition = queryFirstText(element, "definition");
  const terminologyLabel = queryFirstText(element, "terminology/label");

  const usageCount = (uri: string): number => {
    return countNodes(document, `//a[@href = '${uri}']`);
  };

  return (
      <div style={{
        fontSize: tokens.values.typography.bodyTextSmall.fontSize.value,
        color: tokens.colors.blackBase,
        margin: `${tokens.spacing.s} 0`,
      }}>
        <ConceptLabelButton
            icon={isExpanded ? "expandableMinus" : "expandablePlus"}
            onClick={() => setExpanded(!isExpanded)}>
          {label} ({usageCount(uri)})
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
