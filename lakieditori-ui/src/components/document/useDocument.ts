import {useContext, useEffect, useState} from "react";
import axios, {AxiosRequestConfig} from "axios";
import {AuthenticationContext} from "../../App";
import {parseXml, toString} from "../../utils/xmlUtils";

const getConfig: AxiosRequestConfig = {responseType: 'document'};
const putConfig: AxiosRequestConfig = {headers: {'Content-Type': 'text/xml'}};

export function useDocument(id: string) {
  const [user] = useContext(AuthenticationContext);
  const [document, setDocument] = useState<Document>(parseXml("<document/>"));

  useEffect(() => {
    axios
    .get(`/api/schemas/statute/documents/${id}`, getConfig)
    .then(res => setDocument(res.data));
  }, [id, user]);

  const saveDocument = (document: string | Document): Promise<any> => {
    const xmlData = typeof document === "string" ? document : toString(document);

    return axios
    .put(`/api/schemas/statute/documents/${id}`, xmlData, putConfig)
    .then(() => axios.get(`/api/schemas/statute/documents/${id}`, getConfig))
    .then((res) => setDocument(res.data));
  };

  return {document, setDocument, saveDocument};
}
