import {useEffect, useState} from "react";
import axios from "axios";
import {parseXml} from "../../../../utils/xmlUtils";

export function useConcepts(query: string, terminologyUris: string[]) {
  const [concepts, setConcepts] = useState<Document>(parseXml("<concepts/>"));

  useEffect(() => {
    if (query && query.length > 2) {
      axios.get('/api/concepts', {
        params: {
          query: query.toLowerCase(),
          terminologyUri: terminologyUris.join(",")
        },
        responseType: 'document'
      }).then(res => {
        setConcepts(res.data);
      });
    }
  }, [query, terminologyUris]);

  return {concepts};
}