import React, {useState} from "react";
import {Button, Heading, suomifiDesignTokens as tokens} from "suomifi-ui-components";
import {Table} from "../common/StyledComponents";
import {queryElements, queryFirstText} from "../../utils/xmlUtils";
import {useUsers} from "./useUsers";
import AddUserModal from "./AddUserModal";

const UserList: React.FC = () => {
  const {users, saveUser} = useUsers();
  const [isModalOpen, setModalOpen] = useState(false);

  const usernameComparator = (a: Element, b: Element): number => {
    const aName = queryFirstText(a, 'username') || '';
    const bName = queryFirstText(b, 'username') || '';
    return aName < bName ? -1 : (aName > bName ? 1 : 0);
  };

  const renderUserRow = (user: Element, i: number) => {
    const username = queryFirstText(user, 'username');
    const superuser = queryFirstText(user, 'superuser') === 'true';

    return (
        <tr key={i}>
          <td>{username} {superuser ? '(pääkäyttäjä)' : ''}</td>
        </tr>
    );
  };

  return (
      <div>
        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
          <Heading.h2 style={{marginBottom: tokens.spacing.m}}>
            Käyttäjät
          </Heading.h2>

          <Button icon={'plus'} onClick={() => setModalOpen(true)}>
            Lisää uusi käyttäjä
          </Button>
        </div>

        <Table style={{margin: `${tokens.spacing.s} 0 ${tokens.spacing.m} 0`}}>
          <tbody>
          {queryElements(users.documentElement, 'user')
          .sort(usernameComparator)
          .map(renderUserRow)}
          </tbody>
        </Table>

        <AddUserModal
            isModalOpen={isModalOpen}
            setModalOpen={setModalOpen}
            saveUser={saveUser}/>
      </div>
  );
};

export default UserList;
