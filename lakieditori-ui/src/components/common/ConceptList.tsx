import React from "react";
import {suomifiDesignTokens as tokens, Text} from "suomifi-ui-components";
import {countNodes, queryElements, queryFirstText} from "../../utils/xmlUtils";
import {XmlViewProperties} from "../documents/view/XmlViewProperties";

const ConceptList: React.FC<Props> = ({concepts}) => {
  const conceptCount = countNodes(concepts, 'concept');

  return (
      <div>
        <div style={{padding: `${tokens.spacing.xs} ${tokens.spacing.xs}`}}>
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
  const label = queryFirstText(currentElement, "label");
  const definition = queryFirstText(currentElement, "definition");

  return (
      <div style={{
        fontSize: tokens.values.typography.bodyTextSmall.fontSize.value,
        padding: tokens.spacing.xs,
      }}>
        {label}
        <div style={{color: tokens.colors.depthDark27}}>{definition}</div>
      </div>
  );
};

export default ConceptList;
