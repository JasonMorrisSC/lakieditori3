import {useContext, useEffect, useState} from "react";
import axios from "axios";
import {parseXml, toString} from "../../../utils/xmlUtils";
import {AuthenticationContext} from "../../../App";

export function useDocuments() {
  const [user] = useContext(AuthenticationContext);
  const [documents, setDocuments] = useState<Document>(parseXml("<documents/>"));

  useEffect(() => {
    axios.get('/api/documents/', {
      responseType: 'document'
    }).then(res => {
      setDocuments(res.data);
    });
  }, [user]);

  const saveDocument = (document: Document) => {
    return axios.post('/api/documents', toString(document), {
      headers: {'Content-Type': 'text/xml'}
    });
  };

  const removeDocument = (id: string) => {
    return axios.delete(`/api/documents/${id}`).then(() => {
      return axios.get('/api/documents', {responseType: 'document'});
    }).then(res => {
      setDocuments(res.data);
    });
  };

  return {documents, saveDocument, removeDocument};
}
