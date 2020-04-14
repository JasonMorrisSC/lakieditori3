import {useContext, useEffect, useState} from "react";
import axios, {AxiosResponse} from "axios";
import {AuthenticationContext} from "../../App";
import {parseXml, toString} from "../../utils/xmlUtils";

export function useDocument(id: string) {
  const [user] = useContext(AuthenticationContext);
  const [document, setDocument] = useState<Document>(parseXml("<document/>"));

  useEffect(() => {
    axios.get(`/api/documents/${id}`, {
      responseType: 'document'
    }).then(res => {
      setDocument(res.data);
    });
  }, [id, user]);

  const saveDocument = (document: string | Document): Promise<AxiosResponse> => {
    setDocument(typeof document === "string" ? parseXml(document) : document);
    return axios.put('/api/documents/' + id,
        typeof document === "string" ? document : toString(document), {
          headers: {'Content-Type': 'text/xml'}
        });
  };

  return {document, setDocument, saveDocument};
}
