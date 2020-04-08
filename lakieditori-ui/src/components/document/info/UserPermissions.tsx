import React, {useEffect, useState} from "react";
import axios from "axios";
import {
  cloneDocument,
  countNodes,
  parseXml,
  queryElements,
  queryFirstElement,
  queryFirstText,
  toString
} from "../../../utils/xmlUtils";
import {Table} from "../../common/StyledComponents";
import {suomifiDesignTokens as sdt} from "suomifi-design-tokens";
import {Dropdown} from "suomifi-ui-components";

const UserPermissions: React.FC<Props> = ({id}) => {
  const [users, setUsers] = useState<Document>(parseXml('<users></users>'));
  const [permissions, setPermissions] = useState<Document>(parseXml('<permissions></permissions>'));
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [reload, setReload] = useState<boolean>(false);

  useEffect(() => {
    axios.get('/api/users/', {
      responseType: 'document'
    }).then(res => {
      setUsers(res.data);
    }).catch((error) => {
      setErrorMessage(error.response.data.message);
    });
  }, []);

  useEffect(() => {
    if (id || reload) {
      setReload(false);
      axios.get('/api/documents/' + id + '/permissions', {
        responseType: 'document'
      }).then(res => {
        setPermissions(res.data);
      }).catch((error) => {
        setErrorMessage(error.response.data.message);
      });
    }
  }, [id, reload]);

  const permissionsExistsFor = (username: string) => {
    return countNodes(permissions, '/permissions/permission[@username="' + username + '"]') > 0;
  };

  const togglePermission = (username: string, permission: string) => {
    setPermissions((oldPermissions) => {
      const newPermissions = cloneDocument(oldPermissions);

      let permissionElement =
          queryFirstElement(newPermissions, '/permissions/permission[@username="' + username + '"]');

      if (!permissionElement) {
        permissionElement = newPermissions.createElement('permission');
        permissionElement.setAttribute('username', username);
        newPermissions.documentElement.appendChild(permissionElement);
      }

      let permissions: string[] = permissionElement.getAttribute('value')?.split(',') || [];

      if (permissions.includes(permission)) {
        permissions.splice(permissions.indexOf(permission), 1);
      } else {
        permissions.push(permission);
      }

      permissionElement.setAttribute('value', permissions.join(','));

      axios.post('/api/documents/' + id + '/permissions', toString(newPermissions), {
        headers: {'Content-Type': 'text/xml'}
      }).catch((error) => {
        setErrorMessage(error.response.data.message);
        setReload(true);
      });

      return newPermissions;
    });
  };

  return (
      <div>
        {errorMessage ?
            <div style={{
              backgroundColor: sdt.colors.alertLight47,
              margin: `${sdt.spacing.s} 0`,
              padding: sdt.spacing.m,
            }}>
              Virhe: {errorMessage ? errorMessage : ''}<br/>
            </div> : ''}
        <Table style={{tableLayout: 'fixed'}}>
          <thead>
          <tr>
            <th>Käyttäjätunnus</th>
            <th className="center">Luku</th>
            <th className="center">Muokkaus</th>
            <th className="center">Poisto</th>
          </tr>
          </thead>
          <tbody>
          {queryElements(permissions.documentElement, 'permission')
          .sort((a, b) => {
            const aName = a.getAttribute('username') || '';
            const bName = b.getAttribute('username') || '';
            return aName < bName ? -1 : (aName > bName ? 1 : 0);
          })
          .map((permission, i) => {
            const username = permission.getAttribute('username') || '';
            return <tr key={i}>
              <th>{username}</th>
              <td className="center">
                <input type="checkbox"
                       checked={permission.getAttribute('value')?.includes('READ')}
                       onChange={() => togglePermission(username, 'READ')}/>
              </td>
              <td className="center">
                <input type="checkbox"
                       checked={permission.getAttribute('value')?.includes('UPDATE')}
                       onChange={() => togglePermission(username, 'UPDATE')}/>
              </td>
              <td className="center">
                <input type="checkbox"
                       checked={permission.getAttribute('value')?.includes('DELETE')}
                       onChange={() => togglePermission(username, 'DELETE')}/>
              </td>
            </tr>
          })}
          </tbody>
        </Table>
        <br/>
        <Dropdown name="Lisää käyttöoikeus" changeNameToSelection={false}>
          {queryElements(users.documentElement, 'user')
          .filter(user => !permissionsExistsFor(queryFirstText(user, 'username')))
          .map((user, i) => {
            const username = queryFirstText(user, 'username');
            return <Dropdown.item key={i} onSelect={() => {
              togglePermission(username, 'READ');
              togglePermission(username, 'UPDATE');
            }}>
              {username}
            </Dropdown.item>
          })}
        </Dropdown>
      </div>
  );
};

interface Props {
  id: string
}

export default UserPermissions;
