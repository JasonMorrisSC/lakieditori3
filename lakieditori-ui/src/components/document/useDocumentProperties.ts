import {useContext, useEffect, useState} from "react";
import axios from "axios";
import {AuthenticationContext} from "../../App";

export function useDocumentProperties(id: string) {
  const [user] = useContext(AuthenticationContext);
  const [properties, setProperties] = useState<{ [name: string]: string }>({});

  useEffect(() => {
    axios
    .get(`/api/schemas/statute/documents/${id}/properties`)
    .then(res => setProperties(res.data));
  }, [id, user]);

  const saveProperties = (properties: { [name: string]: string }): Promise<any> => {
    return axios
    .post(`/api/schemas/statute/documents/${id}/properties`, properties)
    .then(() => axios.get(`/api/documents/${id}/properties`))
    .then((res) => setProperties(res.data));
  };

  return {properties, setProperties, saveProperties};
}
