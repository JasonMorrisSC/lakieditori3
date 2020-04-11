import {useContext, useEffect} from "react";
import {AuthenticationContext} from "../../App";
import axios from "axios";
import {queryFirstText} from "../../utils/xmlUtils";
import {NIL_UUID} from "../../utils/uuidUtils";
import {NULL_USER} from "../../utils/User";
import { useHistory } from "react-router-dom";

export function useAuthentication() {
  const [user, setUser] = useContext(AuthenticationContext);
  const history = useHistory();

  useEffect(() => {
    axios.get('/api/whoami', {
      responseType: 'document'
    }).then(res => {
      const id = queryFirstText(res.data, '/user/@id');
      setUser(id === NIL_UUID ? NULL_USER : {
        username: queryFirstText(res.data, '/user/username'),
        firstName: queryFirstText(res.data, '/user/firstName'),
        lastName: queryFirstText(res.data, '/user/lastName'),
        superuser: queryFirstText(res.data, '/user/superuser') === 'true',
      });
    });
  }, [setUser]);

  const login = (username: string, password: string): Promise<any> => {
    const data = new FormData();

    data.set("username", username);
    data.set("password", password);

    return axios.post('/api/login', data, {
      headers: {'Content-Type': 'multipart/form-data'}
    })
    .then(() => {
      return axios.get('/api/whoami', {
        responseType: 'document'
      })
    })
    .then(res => {
      const id = queryFirstText(res.data, '/user/@id');
      setUser(id === NIL_UUID ? NULL_USER : {
        username: queryFirstText(res.data, '/user/username'),
        firstName: queryFirstText(res.data, '/user/firstName'),
        lastName: queryFirstText(res.data, '/user/lastName'),
        superuser: queryFirstText(res.data, '/user/superuser') === 'true',
      });
    });
  };

  const logout = (): Promise<any> => {
    return axios.post('/api/logout')
    .then(() => {
      return axios.get('/api/whoami', {
        responseType: 'document'
      });
    })
    .finally(() => {
      setUser(NULL_USER);
      history.push("/");
    });
  };

  return {user, login, logout};
}
