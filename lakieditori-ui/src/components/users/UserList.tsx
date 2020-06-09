import React, {useState} from "react";
import {Button, Heading, suomifiDesignTokens as tokens} from "suomifi-ui-components";
import {Table} from "../common/StyledComponents";
import {parseXml, queryElements, queryFirstText, toString} from "../../utils/xmlUtils";
import {useUsers} from "./useUsers";
import EditUserModal from "./EditUserModal";
import {ButtonIconOnly} from "../common/StyledInputComponents";

const UserList: React.FC = () => {
  const createNewPerson = () => parseXml(
      "<user>" +
      "  <username/>" +
      "  <password/>" +
      "  <firstName/>" +
      "  <lastName/>" +
      "  <properties>" +
      "    <property key='SANASTOT_SUOMI_FI_API_TOKEN'/>" +
      "  </properties>" +
      "</user>");

  const {users, saveUser} = useUsers();
  const [modalUser, setModalUser] = useState<Document>(createNewPerson());
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
          <td className={"right"}>
            <ButtonIconOnly icon={"edit"} onClick={() => {
              setModalUser(parseXml(toString(user)));
              setModalOpen(true);
            }}/>
          </td>
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
            Uusi käyttäjä
          </Button>
        </div>

        <Table style={{margin: `${tokens.spacing.s} 0 ${tokens.spacing.m} 0`}}>
          <tbody>
          {queryElements(users.documentElement, 'user')
          .sort(usernameComparator)
          .map(renderUserRow)}
          </tbody>
        </Table>

        <EditUserModal
            isOpen={isModalOpen}
            user={modalUser}
            setUser={setModalUser}
            onClickSave={() => {
              saveUser(modalUser).then(() => {
                setModalOpen(false);
                setModalUser(createNewPerson());
              })
            }}
            onClickCancel={() => {
              setModalOpen(false);
              setModalUser(createNewPerson());
            }}
        />
      </div>
  );
};

export default UserList;
