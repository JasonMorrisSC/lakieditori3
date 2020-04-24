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

  const insertUser = (user: Document) => {
    return axios.post('/api/users', toString(user), {
      headers: {'Content-Type': 'text/xml'}
    })
    .then(() => axios.get('/api/users', {responseType: 'document'}))
    .then(res => setUsers(res.data));
  }

  const updateUser = (user: Document) => {
    return axios.put('/api/users/' + user.documentElement.getAttribute("id"), toString(user), {
      headers: {'Content-Type': 'text/xml'}
    })
    .then(() => axios.get('/api/users', {responseType: 'document'}))
    .then(res => setUsers(res.data));
  }

  const saveUser = (user: Document) => {
    return user.documentElement.getAttribute('id')
        ? updateUser(user)
        : insertUser(user);
  };

  return {users, saveUser};
}
