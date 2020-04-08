import {useContext, useEffect, useState} from "react";
import axios from "axios";
import {AuthenticationContext} from "../../App";
import {parseXml} from "../../utils/xmlUtils";

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

  return {document};
}
