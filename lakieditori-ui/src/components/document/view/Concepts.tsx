import React, {useEffect, useState} from "react";
import axios from "axios";
import {suomifiDesignTokens as tokens, Text} from "suomifi-ui-components";
import {queryFirstText, queryNodes} from "../../../utils/xmlUtils";
import {ElementViewProps} from "./elements/ElementViewProps";

interface Props {
  document: Document
}

const Concepts: React.FC<Props> = ({document}) => {
  const urls = queryNodes(document.documentElement, "//a/@href").map(n => n.textContent || "");
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
            <Concept element={concept}/>
          </div>
        })}
      </div>
  );
};

const Concept: React.FC<ElementViewProps> = ({element}) => {
  const uri = element.getAttribute("uri") || '';
  const label = queryFirstText(element, "label");
  const definition = queryFirstText(element, "definition");
  const terminologyLabel = queryFirstText(element, "terminology/label");

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

export default Concepts;
