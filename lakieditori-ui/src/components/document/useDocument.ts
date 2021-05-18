import {useContext, useEffect, useState} from "react";
import axios, {AxiosRequestConfig} from "axios";
import {AuthenticationContext} from "../../App";
import {parseXml, toString} from "../../utils/xmlUtils";

const getConfig: AxiosRequestConfig = {responseType: 'document'};
const putConfig: AxiosRequestConfig = {headers: {'Content-Type': 'text/xml'}};

export function useDocument(schemaName: string, id: string) {
  const [user] = useContext(AuthenticationContext);
  const [document, setDocument] = useState<Document>(parseXml(`<${schemaName}/>`));

  useEffect(() => {
    axios
    // JAVA: [api]/web/DocumentReadController.java:20
    .get(`/api/schemas/${schemaName}/documents/${id}`, getConfig)
    .then(res => setDocument(res.data));
  }, [schemaName, id, user]);

  const saveDocument = (document: string | Document): Promise<any> => {
    const xmlData = typeof document === "string" ? document : toString(document);

    return axios
    // JAVA: [api]/web/DocumentWriteController.java:20
    .put(`/api/schemas/${schemaName}/documents/${id}`, xmlData, putConfig)
    .then(() => axios.get(`/api/schemas/${schemaName}/documents/${id}`, getConfig))
    .then((res) => setDocument(res.data));
  };

  return {document, setDocument, saveDocument};
}
