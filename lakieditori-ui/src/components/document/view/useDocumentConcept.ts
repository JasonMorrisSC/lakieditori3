import {useEffect, useState} from "react";
import axios from "axios";
import {queryFirstText, queryNodes} from "../../../utils/xmlUtils";

export function useDocumentConcepts(document: Document) {
  const [concepts, setConcepts] = useState<Element[]>([]);

  const labelComparator = (a: Element, b: Element): number => {
    const aLabel = queryFirstText(a, 'label');
    const bLabel = queryFirstText(b, 'label');
    return aLabel > bLabel ? 1 : (aLabel < bLabel ? -1 : 0);
  };

  useEffect(() => {
    const urls = queryNodes(document.documentElement, "//a/@href")
    .map(href => href.textContent)
    .filter(url => url && url.startsWith("http://uri.suomi.fi"));

    const requests = urls.map(url =>
        axios
        .get(`/api/concepts?uri=${url}`, {responseType: 'document'})
        .then(res => res.data.documentElement));

    axios
    .all(requests)
    .then(concepts => {
      setConcepts(
          concepts
          .filter((concept, i, array) =>
              array.findIndex(c => concept.getAttribute("uri") === c.getAttribute("uri")) === i)
          .sort(labelComparator));
    });
  }, [document]);

  return {concepts};
}
