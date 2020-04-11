import {useEffect, useState} from "react";
import axios, {AxiosRequestConfig} from "axios";
import {toString} from "../../../utils/xmlUtils";

const config: AxiosRequestConfig = {
  headers: {
    'Content-Type': 'text/xml',
    'Accept': 'text/xml',
  },
  responseType: 'document'
};

export function useLineNumberAnnotations(document: string | Document) {
  const [annotatedDocument, setAnnotatedDocument] = useState<Document | null>(null);

  useEffect(() => {
    const timer = setTimeout(() =>
            axios.post(
                '/api/annotateLineNumbers',
                typeof document === "string"
                    ? document
                    : toString(document),
                config)
            .then(res => setAnnotatedDocument(res.data)),
        1000);

    return () => clearTimeout(timer);
  }, [document]);

  return {annotatedDocument};
}
