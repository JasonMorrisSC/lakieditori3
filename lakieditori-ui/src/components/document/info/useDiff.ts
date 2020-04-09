import {useContext, useEffect, useState} from "react";
import axios from "axios";
import {AuthenticationContext} from "../../../App";
import {parseXml} from "../../../utils/xmlUtils";

export function useDiff(id: string, leftVersion: number, rightVersion: number) {
  const [user] = useContext(AuthenticationContext);
  const [diff, setDiff] = useState<Document>(parseXml('<documents></documents>'));

  useEffect(() => {
    axios.get('/api/documents/' + id + '/diff', {
      params: {leftVersion, rightVersion},
      responseType: 'document'
    }).then(res => {
      setDiff(res.data);
    });
  }, [user, id, leftVersion, rightVersion]);

  return {diff};
}
