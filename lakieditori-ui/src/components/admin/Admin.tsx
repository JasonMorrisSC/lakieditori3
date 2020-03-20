import React, {useEffect, useState} from "react";
import Layout from "../common/Layout";
import {Button, Heading, suomifiDesignTokens as tokens} from "suomifi-ui-components";
import {Table} from "../common/StyledComponents";
import axios from "axios";
import {
  parseXml,
  queryElements,
  queryFirstText,
  toString,
  updateElement
} from "../../utils/xmlUtils";
import Modal from "react-modal";
import {inputStyle} from "../common/inputStyle";

const Admin: React.FC = () => {
  const [load, setLoad] = useState<boolean>(true);
  const [users, setUsers] = useState<Document>(parseXml("<users/>"));

  const [isModalOpen, setModalOpen] = React.useState<boolean>(false);
  const [newUserUsername, setNewUserUsername] = useState<string>('');
  const [newUserPassword, setNewUserPassword] = useState<string>('');

  useEffect(() => {
    if (load) {
      setLoad(false);
      axios.get('/api/users/', {
        responseType: 'document'
      }).then(res => {
        setUsers(res.data);
      });
    }
  }, [load]);

  function addNewUser() {
    let newUser = parseXml('<user><username/><password/></user>');

    updateElement(newUser, "/user/username", (e) => e.textContent = newUserUsername);
    updateElement(newUser, "/user/password", (e) => e.textContent = newUserPassword);

    axios.post('/api/users', toString(newUser), {
      headers: {'Content-Type': 'text/xml'}
    }).then(() => {
      setNewUserUsername('');
      setNewUserPassword('');
      setModalOpen(false);
      setLoad(true);
    });
  }

  return <Layout title="Ylläpito">
    <Heading.h2>Käyttäjät</Heading.h2>
    <Table style={{margin: `${tokens.spacing.m} 0 ${tokens.spacing.l}`}}>
      <tbody>
      {queryElements(users.documentElement, 'user')
      .sort((a, b) => {
        const aName = queryFirstText(a, 'username') || '';
        const bName = queryFirstText(b, 'username') || '';
        return aName < bName ? -1 : (aName > bName ? 1 : 0);
      })
      .map((user, i) => {
        const username = queryFirstText(user, 'username');
        const superuser = queryFirstText(user, 'superuser') === 'true';

        return (
            <tr key={i}>
              <td>{username} {superuser ? '(pääkäyttäjä)' : ''}</td>
            </tr>
        );
      })}
      </tbody>
    </Table>
    <Button icon={'plus'} onClick={() => setModalOpen(true)}>Lisää käyttäjä</Button>

    <Modal isOpen={isModalOpen} contentLabel="Lisää uusi käyttäjä" style={{
      content: {
        display: "flex",
        flexDirection: "column",
        height: "60%",
        marginLeft: "auto",
        marginRight: "auto",
        maxWidth: 800,
        padding: `${tokens.spacing.l}`,
      }
    }}>
      <Heading.h1>
        Lisää uusi käyttäjä
      </Heading.h1>

      <hr/>

      <div style={{marginTop: tokens.spacing.m}}>
        <label htmlFor="newUserUsernameInput">Käyttäjätunnus</label>
        <input type="text" name="newUserUsernameInput" style={inputStyle}
               value={newUserUsername}
               onChange={(e) => setNewUserUsername(e.currentTarget.value)}/>
      </div>

      <div style={{flex: 1, marginTop: tokens.spacing.m}}>
        <label htmlFor="newUserPasswordInput">Salasana</label>
        <input type="password" name="newUserPasswordInput" style={inputStyle}
               value={newUserPassword}
               onChange={(e) => setNewUserPassword(e.currentTarget.value)}/>
      </div>

      <div style={{flex: "0", marginTop: tokens.spacing.m}}>
        <Button icon={"plus"} onClick={addNewUser}>
          Lisää
        </Button>
        <Button.secondaryNoborder
            icon={"close"}
            onClick={() => setModalOpen(false)}
            style={{marginLeft: tokens.spacing.xs}}>
          Peruuta
        </Button.secondaryNoborder>
      </div>
    </Modal>
  </Layout>;
};

export default Admin;
