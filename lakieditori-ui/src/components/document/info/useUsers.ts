import {useContext, useEffect, useState} from "react";
import axios from "axios";
import {AuthenticationContext} from "../../../App";
import {parseXml} from "../../../utils/xmlUtils";

export function useUsers() {
  const [user] = useContext(AuthenticationContext);
  const [users, setUsers] = useState<Document>(parseXml("<users/>"));

  useEffect(() => {
    axios.get('/api/users/', {
      responseType: 'document'
    }).then(res => {
      setUsers(res.data);
    });
  }, [user]);

  return {users};
}
