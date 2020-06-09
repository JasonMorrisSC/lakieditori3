import React from "react";
import {Dropdown} from "suomifi-ui-components";
import {countNodes, queryElements, queryFirstText} from "../../../utils/xmlUtils";
import {Table} from "../../common/StyledComponents";
import {useUsers} from "./useUsers";
import {usePermissions} from "./usePermissions";

interface Props {
  schemaName: string,
  id: string
}

const UserPermissions: React.FC<Props> = ({schemaName, id}) => {
  const {users} = useUsers();
  const {permissions, togglePermission} = usePermissions(schemaName, id);

  const permissionsExistsFor = (username: string) => {
    return countNodes(permissions, '/permissions/permission[@username="' + username + '"]') > 0;
  };

  const usernameComparator = (a: Element, b: Element): number => {
    const aName = queryFirstText(a, '@username') || '';
    const bName = queryFirstText(b, '@username') || '';
    return aName < bName ? -1 : (aName > bName ? 1 : 0);
  };

  return (
      <div>
        <Table>
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
          .sort(usernameComparator)
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

export default UserPermissions;
