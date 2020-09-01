import {useContext, useEffect, useState} from "react";
import axios, {AxiosRequestConfig} from "axios";
import {AuthenticationContext} from "../../App";
import {parseXml, toString} from "../../utils/xmlUtils";

const getConfig: AxiosRequestConfig = {responseType: 'document'};
const putConfig: AxiosRequestConfig = {headers: {'Content-Type': 'text/xml'}};

export function useDocumentComments(schemaName: string, id: string) {
  const [user] = useContext(AuthenticationContext);
  const [comments, setComments] = useState<Document>(parseXml(`<comments/>`));

  useEffect(() => {
    axios
    .get(`/api/schemas/${schemaName}/documents/${id}/comments`, getConfig)
    .then(res => setComments(res.data));
  }, [schemaName, id, user]);

  const saveComments = (comments: string | Document): Promise<any> => {
    const xmlData = typeof comments === "string" ? comments : toString(comments);

    return axios
    .put(`/api/schemas/${schemaName}/documents/${id}/comments`, xmlData, putConfig)
    .then(() => axios.get(`/api/schemas/${schemaName}/documents/${id}/comments`, getConfig))
    .then((res) => setComments(res.data));
  };

  return {comments, setComments, saveComments};
}
