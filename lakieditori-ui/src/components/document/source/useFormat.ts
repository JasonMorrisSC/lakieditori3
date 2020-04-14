import axios, {AxiosRequestConfig} from "axios";
import {toString} from "../../../utils/xmlUtils";
import {useEffect, useState} from "react";

const config: AxiosRequestConfig = {
  headers: {
    'Content-Type': 'text/xml',
    'Accept': 'text/xml',
  },
  responseType: 'document'
};

export function useFormat(document: string | Document) {
  const [formattedDocument, setFormattedDocument] = useState<null | Document>(null);

  useEffect(() => {
    axios.post(`/api/format`,
        typeof document === "string" ? document : toString(document),
        config)
    .then(res => setFormattedDocument(res.data));
  }, [document]);

  return {formattedDocument};
}
