import React, {useState} from "react";
import Modal from "react-modal";
import {Button, Heading, suomifiDesignTokens as tokens} from "suomifi-ui-components";
import {parseXml, updateElement} from "../../utils/xmlUtils";
import {FlexColTight} from "../common/StyledComponents";
import {Input} from "../common/StyledInputComponents";

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
  const [newUserSuomiFiApiKey, setNewUserSuomiFiApiKey] = useState<string>('');

  function addNewUser() {
    let newUser = parseXml(
        "<user>" +
        "  <username/>" +
        "  <password/>" +
        "  <firstName/>" +
        "  <lastName/>" +
        "  <properties>" +
        "    <property key='SANASTOT_SUOMI_FI_API_TOKEN'/>" +
        "  </properties>" +
        "</user>");

    updateElement(newUser, "/user/username", (e) => e.textContent = newUserUsername);
    updateElement(newUser, "/user/password", (e) => e.textContent = newUserPassword);
    updateElement(newUser, "/user/firstName", (e) => e.textContent = newUserFirstName);
    updateElement(newUser, "/user/lastName", (e) => e.textContent = newUserLastName);
    updateElement(newUser, "/user/properties/property[@key='SANASTOT_SUOMI_FI_API_TOKEN']",
        (e) => e.textContent = newUserSuomiFiApiKey);

    saveUser(newUser).then(() => {
      setNewUserFirstName('');
      setNewUserLastName('');
      setNewUserUsername('');
      setNewUserPassword('');
      setNewUserSuomiFiApiKey('');
      setModalOpen(false);
    });
  }

  return (
      <Modal isOpen={isModalOpen} contentLabel="Lisää uusi käyttäjä" style={{
        content: {
          height: "80%",
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

          <label>
            sanasot.suomi.fi API-avain
            <Input value={newUserSuomiFiApiKey}
                   onChange={(e) => setNewUserSuomiFiApiKey(e.currentTarget.value)}/>
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
