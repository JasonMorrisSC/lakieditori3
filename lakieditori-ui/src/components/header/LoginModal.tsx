import React, {useState} from "react";
import Modal from "react-modal";
import {Button, Heading, suomifiDesignTokens as tokens} from "suomifi-ui-components";
import {FlexColTight} from "../common/StyledComponents";
import {Input} from "../common/StyledInputComponents";

interface LoginModalProps {
  isOpen: boolean,
  setOpen: (isOpen: boolean) => void,
  login: (username: string, password: string) => Promise<any>,
}

const LoginModal: React.FC<LoginModalProps> = ({isOpen, setOpen, login}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
      <Modal isOpen={isOpen} contentLabel="Kirjaudu" style={{
        overlay: {
          zIndex: 6,
        },
        content: {
          height: "60%",
          marginRight: "auto",
          marginLeft: "auto",
          maxWidth: 800,
          padding: tokens.spacing.l,
        }
      }}>
        <FlexColTight style={{height: "100%"}}>
          <Heading.h1>
            Kirjaudu
          </Heading.h1>

          <hr/>

          <label>
            Käyttäjätunnus
            <Input value={username} onChange={(e) => setUsername(e.currentTarget.value)}/>
          </label>

          <label>
            Salasana
            <Input type="password"
                   value={password} onChange={(e) => setPassword(e.currentTarget.value)}/>
          </label>

          <div style={{marginTop: "auto"}}>
            <Button icon={"login"}
                    onClick={() => login(username, password).then(() => {
                      setUsername('');
                      setPassword('');
                      setOpen(false);
                    })}
                    style={{marginRight: tokens.spacing.s}}>
              Kirjaudu
            </Button>
            <Button.secondaryNoborder
                icon={"close"}
                onClick={() => {
                  setUsername('');
                  setPassword('');
                  setOpen(false)
                }}>
              Peruuta
            </Button.secondaryNoborder>
          </div>
        </FlexColTight>
      </Modal>
  );
};

export default LoginModal;