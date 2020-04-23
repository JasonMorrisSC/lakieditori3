import {useEffect, useState} from "react";
import axios from "axios";
import {parseXml, toString, updateElement} from "../../../../utils/xmlUtils";

export function useTerminologies() {
  const [terminologies, setTerminologies] = useState<Document>(parseXml("<terminologies/>"));

  useEffect(() => {
    axios.get('/api/terminologies', {
      responseType: 'document'
    }).then(res => {
      setTerminologies(res.data);
    });
  }, []);

  const suggestConcept = (terminologyUri: string, label: string, definition: string): Promise<any> => {
    const concept = parseXml("<concept><label/><definition/><terminology/></concept>");
    updateElement(concept, "/concept/label", el => el.textContent = label);
    updateElement(concept, "/concept/definition", el => el.textContent = definition);
    updateElement(concept, "/concept/terminology", el => el.setAttribute("uri", terminologyUri));

    return axios.post('/api/concepts', toString(concept), {
      headers: {'Content-Type': 'text/xml'},
      responseType: 'document'
    });
  };

  return {terminologies, suggestConcept};
}
