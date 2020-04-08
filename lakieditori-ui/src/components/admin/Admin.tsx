import React, {useState} from "react";
import {Button, Heading, suomifiDesignTokens as tokens} from "suomifi-ui-components";
import {PageHeading, Panel, Table} from "../common/StyledComponents";
import {queryElements, queryFirstText} from "../../utils/xmlUtils";
import {useUsers} from "./useUsers";
import AddUserModal from "./AddUserModal";

const Admin: React.FC = () => {
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
      <main>
        <PageHeading>
          Ylläpito
        </PageHeading>
        <Panel>
          <Heading.h2>Käyttäjät</Heading.h2>

          <Table style={{margin: `${tokens.spacing.m} 0 ${tokens.spacing.l}`}}>
            <tbody>
            {queryElements(users.documentElement, 'user')
            .sort(usernameComparator)
            .map(renderUserRow)}
            </tbody>
          </Table>

          <Button icon={'plus'} onClick={() => setModalOpen(true)}>
            Lisää käyttäjä
          </Button>

          <AddUserModal
              isModalOpen={isModalOpen}
              setModalOpen={setModalOpen}
              saveUser={saveUser}/>
        </Panel>
      </main>
  );
};

export default Admin;
