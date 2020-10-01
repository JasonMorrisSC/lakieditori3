import {useEffect, useState} from "react";
import axios, {AxiosRequestConfig} from "axios";
import {parseXml} from "../../../utils/xmlUtils";

const getConfig: AxiosRequestConfig = {responseType: 'document'};

export function useClassesAndAttributes(conceptUri: string) {
  const [classesAndAttributes, setClassesAndAttributes] = useState<Document>(parseXml("<classesAndAttributes/>"));

  useEffect(() => {
    if (conceptUri) {
      axios
      .get(`/api/classesAndAttributes?conceptUri=${conceptUri}`, getConfig)
      .then(res => setClassesAndAttributes(res.data))
    }
  }, [conceptUri]);

  return {classesAndAttributes};
}
