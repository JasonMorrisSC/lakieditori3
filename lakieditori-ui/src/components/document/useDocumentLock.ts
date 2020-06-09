import {useContext, useEffect, useState} from "react";
import axios from "axios";
import {AuthenticationContext} from "../../App";

export function useDocumentLock(id: null | string) {
  const [user] = useContext(AuthenticationContext);
  const [lock, setLock] = useState<null | string>(null);

  useEffect(() => {
    if (id) {
      axios
      .get(`/api/schemas/statute/documents/${id}/lock`)
      .then(response => setLock(response.data))
      .catch(error => {
        if (error.response.status === 404) {
          setLock(null);
          return Promise.resolve();
        } else {
          return Promise.reject(error);
        }
      });
    }
  }, [id, user]);

  const acquireDocumentLock = (): Promise<any> => {
    console.debug("acquire lock for: " + id);

    return axios
    .post(`/api/schemas/statute/documents/${id}/lock`)
    .then(() => setLock(user.username));
  };

  const releaseDocumentLock = (): Promise<any> => {
    console.debug("release lock for: " + id);

    return axios
    .delete(`/api/schemas/statute/documents/${id}/lock`)
    .then(() => {
      return axios.get(`/api/schemas/statute/documents/${id}/lock`)
      .then(response => setLock(response.data))
      .catch(error => {
        if (error.response.status === 404) {
          setLock(null);
          return Promise.resolve();
        } else {
          return Promise.reject(error);
        }
      });
    });
  };

  return {lock, acquireDocumentLock, releaseDocumentLock};
}
