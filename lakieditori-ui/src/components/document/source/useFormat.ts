import axios, {AxiosRequestConfig} from "axios";
import {toString} from "../../../utils/xmlUtils";

const config: AxiosRequestConfig = {
  headers: {
    'Content-Type': 'text/xml',
    'Accept': 'text/xml',
  },
  responseType: 'document'
};

export function useFormat() {
  const formatXml = (document: string | Document): Promise<Document> => {
    return axios.post(`/api/format`,
        typeof document === "string" ? document : toString(document),
        config)
    .then(res => res.data);
  };

  return {formatXml};
}
