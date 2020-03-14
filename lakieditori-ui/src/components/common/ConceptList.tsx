import React from "react";
import {suomifiDesignTokens as tokens, Text} from "suomifi-ui-components";
import {countNodes, queryElements, queryFirstText} from "../../utils/xmlUtils";
import {XmlViewProperties} from "../documents/view/XmlViewProperties";

const ConceptList: React.FC<Props> = ({concepts}) => {
  const conceptCount = countNodes(concepts, 'concept');

  return (
      <div>
        <div style={{padding: `${tokens.spacing.xs} 0`}}>
          <Text.bold>{conceptCount > 0 ? 'Käsitteet' : ''}</Text.bold>
        </div>

        {queryElements(concepts, 'concept').map((concept, i) => {
          return <div key={i}>
            <Concept currentElement={concept}/>
          </div>
        })}
      </div>
  );
};

interface Props {
  concepts: Element
}

const Concept: React.FC<XmlViewProperties> = ({currentElement}) => {
  const uri = currentElement.getAttribute("uri") || '';
  const label = queryFirstText(currentElement, "label");
  const definition = queryFirstText(currentElement, "definition");
  const terminologyLabel = queryFirstText(currentElement, "terminology/label");

  return (
      <div style={{
        fontSize: tokens.values.typography.bodyTextSmall.fontSize.value,
        padding: `${tokens.spacing.s} 0`,
      }}>
        <div style={{display: "flex", justifyContent: "space-between"}}>
          <span>
            {label}
          </span>
          <a href={uri} target={"_blank"} style={{color: tokens.colors.highlightLight4}}>
            {terminologyLabel}
            &nbsp;
            <span className={"material-icons"} style={{
              fontSize: tokens.values.typography.bodyTextSmall.fontSize.value,
              lineHeight: tokens.values.typography.bodyTextSmall.lineHeight.value,
              verticalAlign: "bottom",
            }}>
              launch
            </span>
          </a>
        </div>
        <div style={{
          color: tokens.colors.depthDark27,
        }}>
          {definition}
        </div>
      </div>
  );
};

export default ConceptList;
