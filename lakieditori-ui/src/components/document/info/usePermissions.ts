import {useContext, useEffect, useState} from "react";
import axios from "axios";
import {AuthenticationContext} from "../../../App";
import {cloneDocument, parseXml, queryFirstElement, toString} from "../../../utils/xmlUtils";
import {toggle} from "../../../utils/arrayUtils";

export function usePermissions(id: string) {
  const [user] = useContext(AuthenticationContext);
  const [permissions, setPermissions] = useState<Document>(parseXml('<permissions></permissions>'));

  useEffect(() => {
    axios.get('/api/documents/' + id + '/permissions', {
      responseType: 'document'
    }).then(res => {
      setPermissions(res.data);
    });
  }, [id, user]);

  const savePermissions = (newPermissions: Document): Promise<any> => (
      axios.post('/api/documents/' + id + '/permissions', toString(newPermissions), {
        headers: {'Content-Type': 'text/xml'}
      }).then(() => axios.get('/api/documents/' + id + '/permissions', {
        responseType: 'document'
      })).then(res => {
        setPermissions(res.data);
      })
  );

  const togglePermission = (username: string, permission: string): Promise<any> => {
    const newPermissions = cloneDocument(permissions);
    const newPermissionsRoot = newPermissions.documentElement;

    let permissionElement =
        queryFirstElement(newPermissions, '/permissions/permission[@username="' + username + '"]');

    if (!permissionElement) {
      permissionElement = newPermissionsRoot.appendChild(newPermissions.createElement('permission'));
      permissionElement.setAttribute('username', username);
    }

    let userPermissions: string[] = permissionElement.getAttribute('value')?.split(',') || [];
    toggle(userPermissions, permission);
    permissionElement.setAttribute('value', userPermissions.join(','));

    return savePermissions(newPermissions);
  };

  return {permissions, savePermissions, togglePermission};
}
