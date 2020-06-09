import {useEffect, useState} from "react";
import axios, {AxiosRequestConfig} from "axios";
import {toString} from "../../../utils/xmlUtils";

const config: AxiosRequestConfig = {
  headers: {
    'Content-Type': 'text/xml',
  }
};

export function useValidation(schemaName: string, document: string | Document) {
  const [validationErrorMessage, setValidationErrorMessage] = useState('');

  useEffect(() => {
    const timer = setTimeout(() =>
            axios.post(`/api/schemas/${schemaName}/validate`,
                typeof document === "string" ? document : toString(document),
                config)
            .then(() => setValidationErrorMessage(""))
            .catch((error) => setValidationErrorMessage(error.response.data.message)),
        1000);

    return () => clearTimeout(timer);

  }, [document]);

  return {validationErrorMessage};
}
