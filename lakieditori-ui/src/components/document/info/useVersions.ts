import {useContext, useEffect, useState} from "react";
import axios from "axios";
import {AuthenticationContext} from "../../../App";
import {parseXml} from "../../../utils/xmlUtils";

export function useVersions(schemaName: string, id: string) {
  const [user] = useContext(AuthenticationContext);
  const [versions, setVersions] = useState<Document>(parseXml(`<documents/>`));

  useEffect(() => {
    axios.get(`/api/schemas/${schemaName}/documents/${id}/versions`, {
      responseType: 'document'
    }).then(res => {
      setVersions(res.data);
    });
  }, [schemaName, id, user]);

  return {versions};
}
