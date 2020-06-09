import {useContext, useEffect, useState} from "react";
import axios from "axios";
import {AuthenticationContext} from "../../../App";
import {parseXml} from "../../../utils/xmlUtils";

export function useVersions(id: string) {
  const [user] = useContext(AuthenticationContext);
  const [versions, setVersions] = useState<Document>(parseXml('<documents></documents>'));

  useEffect(() => {
    axios.get('/api/schemas/statute/documents/' + id + '/versions', {
      responseType: 'document'
    }).then(res => {
      setVersions(res.data);
    });
  }, [id, user]);

  return {versions};
}
