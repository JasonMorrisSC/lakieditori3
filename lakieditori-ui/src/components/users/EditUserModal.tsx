import React, {Dispatch, SetStateAction} from "react";
import Modal from "react-modal";
import {Button, Heading, suomifiDesignTokens as tokens} from "suomifi-ui-components";
import {
  cloneDocument,
  countNodes,
  ensureElementAndUpdate,
  queryFirstNode,
  queryFirstText,
  updateElement
} from "../../utils/xmlUtils";
import {FlexColTight} from "../common/StyledComponents";
import {Input} from "../common/StyledInputComponents";

interface Props {
  isOpen: boolean,
  user: Document,
  setUser: Dispatch<SetStateAction<Document>>,
  onClickSave: () => void,
  onClickCancel: () => void,
}

const EditUserModal: React.FC<Props> = ({isOpen, user, setUser, onClickSave, onClickCancel}) => {
  const element = user.documentElement;

  const username = queryFirstText(element, "username");
  const password = queryFirstText(element, "password");
  const firstName = queryFirstText(element, "firstName");
  const lastName = queryFirstText(element, "lastName");
  const apiKey = queryFirstText(element, "properties/property[@key='SANASTOT_SUOMI_FI_API_TOKEN']");

  function updateUsername(newValue: string) {
    setUser((prevUser) => updateElement(
        cloneDocument(prevUser), "/user/username", (el) => el.textContent = newValue)
    );
  }

  function updatePassword(newValue: string) {
    setUser((prevUser) => ensureElementAndUpdate(
        cloneDocument(prevUser), "/user", "password", ["firstName", "lastName", "properties"],
        (el) => el.textContent = newValue)
    );
  }

  function updateFirstName(newValue: string) {
    setUser((prevUser) => updateElement(
        cloneDocument(prevUser), "/user/firstName", (el) => el.textContent = newValue)
    );
  }

  function updateLastName(newValue: string) {
    setUser((prevUser) => updateElement(
        cloneDocument(prevUser), "/user/lastName", (el) => el.textContent = newValue)
    );
  }

  function updateApiKey(newValue: string) {
    setUser((prevPerson) => {
      const key = "SANASTOT_SUOMI_FI_API_TOKEN";
      const path = "/user/properties/property[@key='" + key + "']";
      const newUser = cloneDocument(prevPerson);

      if (countNodes(newUser, path) === 0) {
        const propertyElement = newUser.createElement("property");
        propertyElement.setAttribute("key", key);
        propertyElement.textContent = newValue;
        queryFirstNode(newUser, "/user/properties")?.appendChild(propertyElement);
      }

      return updateElement(
          newUser, "/user/properties/property[@key='SANASTOT_SUOMI_FI_API_TOKEN']",
          (el) => el.textContent = newValue);
    });
  }

  return (
      <Modal isOpen={isOpen} contentLabel="Lisää uusi käyttäjä" style={{
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
            Käyttäjä
          </Heading.h1>

          <hr/>

          <label>
            Etunimi
            <Input value={firstName} onChange={(e) => updateFirstName(e.currentTarget.value)}/>
          </label>

          <label>
            Sukunimi
            <Input value={lastName} onChange={(e) => updateLastName(e.currentTarget.value)}/>
          </label>

          <label>
            Käyttäjätunnus
            <Input value={username} onChange={(e) => updateUsername(e.currentTarget.value)}/>
          </label>

          <label>
            Salasana
            <Input type="password"
                   value={password}
                   onChange={(e) => updatePassword(e.currentTarget.value)}/>
          </label>

          <label>
            sanastot.suomi.fi API-avain
            <Input value={apiKey} onChange={(e) => updateApiKey(e.currentTarget.value)}/>
          </label>

          <div style={{marginTop: "auto"}}>
            <Button icon={"save"}
                    onClick={onClickSave}
                    style={{marginRight: tokens.spacing.s}}>
              Tallenna
            </Button>
            <Button.secondaryNoborder
                icon={"close"}
                onClick={onClickCancel}>
              Peruuta
            </Button.secondaryNoborder>
          </div>

        </FlexColTight>
      </Modal>
  );
};

export default EditUserModal;
