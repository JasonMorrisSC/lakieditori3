import React, {useEffect, useState} from "react";
import axios from "axios";
import {suomifiDesignTokens as tokens, Text} from "suomifi-ui-components";
import {queryFirstText} from "../../utils/xmlUtils";
import {XmlViewProperties} from "../documents/view/XmlViewProperties";

const ConceptList: React.FC<Props> = ({urls}) => {
  const [concepts, setConcepts] = useState<Element[]>([]);

  useEffect(() => {
    const conceptExists = (concepts: Element[], uri: string) => {
      return concepts.filter(concept => concept.getAttribute('uri') === uri).length > 0;
    };

    urls.forEach(url => {
      axios.get('/api/concepts?uri=' + url, {
        responseType: 'document'
      }).then(res => {
        const concept = res.data.documentElement;
        const conceptUri = concept.getAttribute('uri');
        setConcepts(prevConcepts => conceptExists(prevConcepts, conceptUri)
            ? prevConcepts
            : prevConcepts.concat(concept));
      });
    });
  }, [urls]);

  return (
      <div>
        <div style={{padding: `${tokens.spacing.xs} 0`}}>
          <Text.bold>{concepts.length > 0 ? 'Käsitteet' : ''}</Text.bold>
        </div>

        {concepts.map((concept, i) => {
          return <div key={i}>
            <Concept currentElement={concept}/>
          </div>
        })}
      </div>
  );
};

interface Props {
  urls: string[]
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
