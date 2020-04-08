import React, {useState} from "react";
import Modal from "react-modal";
import {Button, Heading, suomifiDesignTokens as tokens} from "suomifi-ui-components";
import {parseXml, updateElement} from "../../utils/xmlUtils";
import {FlexColTight} from "../common/StyledComponents";
import {Input} from "../common/InputStyles";

interface UserModalProps {
  isModalOpen: boolean,
  setModalOpen: (isModalOpen: boolean) => void,
  saveUser: (user: Document) => Promise<any>,
}

const AddUserModal: React.FC<UserModalProps> = ({isModalOpen, setModalOpen, saveUser}) => {
  const [newUserUsername, setNewUserUsername] = useState<string>('');
  const [newUserPassword, setNewUserPassword] = useState<string>('');
  const [newUserFirstName, setNewUserFirstName] = useState<string>('');
  const [newUserLastName, setNewUserLastName] = useState<string>('');

  function addNewUser() {
    let newUser = parseXml('<user><username/><password/><firstName/><lastName/></user>');

    updateElement(newUser, "/user/username", (e) => e.textContent = newUserUsername);
    updateElement(newUser, "/user/password", (e) => e.textContent = newUserPassword);
    updateElement(newUser, "/user/firstName", (e) => e.textContent = newUserFirstName);
    updateElement(newUser, "/user/lastName", (e) => e.textContent = newUserLastName);

    saveUser(newUser).then(() => {
      setNewUserFirstName('');
      setNewUserLastName('');
      setNewUserUsername('');
      setNewUserPassword('');
      setModalOpen(false);
    });
  }

  return (
      <Modal isOpen={isModalOpen} contentLabel="Lisää uusi käyttäjä" style={{
        content: {
          height: "60%",
          marginLeft: "auto",
          marginRight: "auto",
          maxWidth: 800,
          padding: tokens.spacing.l,
        }
      }}>
        <FlexColTight style={{height: "100%"}}>
          <Heading.h1>
            Lisää uusi käyttäjä
          </Heading.h1>

          <hr/>

          <label>
            Etunimi
            <Input value={newUserFirstName}
                   onChange={(e) => setNewUserFirstName(e.currentTarget.value)}/>
          </label>

          <label>
            Sukunimi
            <Input value={newUserLastName}
                   onChange={(e) => setNewUserLastName(e.currentTarget.value)}/>
          </label>

          <label>
            Käyttäjätunnus
            <Input value={newUserUsername}
                   onChange={(e) => setNewUserUsername(e.currentTarget.value)}/>
          </label>

          <label>
            Salasana
            <Input type="password" value={newUserPassword}
                   onChange={(e) => setNewUserPassword(e.currentTarget.value)}/>
          </label>

          <div style={{marginTop: "auto"}}>
            <Button icon={"plus"}
                    onClick={addNewUser}
                    style={{marginRight: tokens.spacing.s}}>
              Lisää
            </Button>
            <Button.secondaryNoborder
                icon={"close"}
                onClick={() => setModalOpen(false)}>
              Peruuta
            </Button.secondaryNoborder>
          </div>

        </FlexColTight>
      </Modal>
  );
};

export default AddUserModal;
