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
        {label}
        <div style={{color: tokens.colors.depthDark27}}>
          {definition}
        </div>
        <a href={uri} target={"_blank"} style={{
          alignItems: "center",
          color: tokens.colors.accentSecondary,
          display: "inline-flex",
          verticalAlign: "middle",
        }}>
          <span>{terminologyLabel}&nbsp;</span>
          <span className={"material-icons"} style={{
            fontSize: tokens.values.typography.bodyTextSmall.fontSize.value,
            marginBottom: -1,
          }}>
            launch
          </span>
        </a>
      </div>
  );
};

export default ConceptList;
