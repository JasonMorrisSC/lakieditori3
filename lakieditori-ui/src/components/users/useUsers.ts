import {useContext, useEffect, useState} from "react";
import axios from "axios";
import {parseXml, toString} from "../../utils/xmlUtils";
import {AuthenticationContext} from "../../App";

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

  const saveUser = (newUser: Document) => {
    return axios.post('/api/users', toString(newUser), {
      headers: {'Content-Type': 'text/xml'}
    }).then(() => {
      return axios.get('/api/users', {responseType: 'document'})
    }).then(res => {
      setUsers(res.data);
    });
  };

  return {users, saveUser};
}
