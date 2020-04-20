import {useEffect, useState} from "react";
import axios from "axios";
import {parseXml} from "../../../../utils/xmlUtils";

export function useConcepts(query: string) {
  const [concepts, setConcepts] = useState<Document>(parseXml("<concepts/>"));

  useEffect(() => {
    if (query && query.length > 2) {
      axios.get('/api/concepts', {
        params: {query},
        responseType: 'document'
      }).then(res => {
        setConcepts(res.data);
      });
    }
  }, [query]);

  return {concepts};
}