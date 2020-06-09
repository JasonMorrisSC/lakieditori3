import {useContext, useEffect, useState} from "react";
import axios from "axios";
import {parseXml, toString} from "../../../utils/xmlUtils";
import {AuthenticationContext} from "../../../App";

export function useDocuments() {
  const [user] = useContext(AuthenticationContext);
  const [documents, setDocuments] = useState<Document>(parseXml("<documents/>"));

  useEffect(() => {
    axios.get('/api/schemas/statute/documents/', {
      responseType: 'document'
    }).then(res => {
      setDocuments(res.data);
    });
  }, [user]);

  const saveDocument = (document: Document) => {
    return axios.post('/api/schemas/statute/documents', toString(document), {
      headers: {'Content-Type': 'text/xml'}
    });
  };

  const removeDocument = (id: string) => {
    return axios.delete(`/api/schemas/statute/documents/${id}`).then(() => {
      return axios.get('/api/schemas/statute/documents', {responseType: 'document'});
    }).then(res => {
      setDocuments(res.data);
    });
  };

  return {documents, saveDocument, removeDocument};
}
