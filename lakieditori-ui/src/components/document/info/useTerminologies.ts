import {useEffect, useState} from "react";
import axios from "axios";
import {parseXml} from "../../../utils/xmlUtils";

export function useTerminologies() {
  const [terminologies, setTerminologies] = useState<Document>(parseXml("<terminologies/>"));

  useEffect(() => {
    axios.get('/api/terminologies', {
      responseType: 'document'
    }).then(res => {
      setTerminologies(res.data);
    });
  }, []);

  return {terminologies};
}
