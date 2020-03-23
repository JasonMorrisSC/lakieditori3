import React, {useContext, useEffect, useState} from 'react';
import {Button, Heading, suomifiDesignTokens as tokens} from 'suomifi-ui-components';
import {AuthenticationContext} from "../../App";
import {NULL_USER} from "../../utils/User";
import {LinkButtonSmall} from "./StyledComponents";
import axios from "axios";
import {queryFirstText} from "../../utils/xmlUtils";
import {nilUuid} from "../../utils/uuidUtils";
import Modal from "react-modal";
import {inputStyle} from "./inputStyle";

const Header: React.FC = () => {
  const [user, setUser] = useContext(AuthenticationContext);

  const [loginModalIsOpen, setLoginModalIsOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    axios.get('/api/users/whoami', {
      responseType: 'document'
    }).then(res => {
      const id = queryFirstText(res.data, '/user/@id');
      setUser(id === nilUuid ? NULL_USER : {
        username: queryFirstText(res.data, '/user/username')
      });
    });
  }, [setUser]);

  const login = () => {
    const data = new FormData();

    data.set("username", username);
    data.set("password", password);

    setUsername('');
    setPassword('');

    axios.post('/api/login', data, {
      headers: {'Content-Type': 'multipart/form-data'}
    })
    .then(() => {
      setUser({username});
      setLoginModalIsOpen(false);
    })
    .catch(() => {
      console.warn("Login failed");
    });
  };

  const logout = () => {
    axios.post('/api/logout')
    .catch(() => {
      console.warn("Logout failed");
    })
    .finally(() => {
      setUser(NULL_USER);
      setLoginModalIsOpen(false);
    });
  };

  return (
      <header>
        <div style={{
          display: 'flex',
          fontWeight: 600,
          justifyContent: "space-between",
        }}>
          <div style={{
            color: tokens.colors.brandBase,
            fontSize: '28px',
          }}>
            Lakieditori
          </div>

          <div style={{
            textAlign: "right",
            lineHeight: 1
          }}>
            {user === NULL_USER
                ? <Button
                    icon={"login"}
                    onClick={() => setLoginModalIsOpen(true)}>
                  Kirjaudu
                </Button>
                : <span>
                  {user.username}
                  <br/>
                  <LinkButtonSmall
                      style={{textTransform: "uppercase", lineHeight: 1.2}}
                      onClick={() => logout()}>
                    Kirjaudu ulos
                  </LinkButtonSmall>
                </span>
            }
          </div>
        </div>

        <Modal isOpen={loginModalIsOpen} contentLabel="Kirjaudu" style={{
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
            Kirjaudu
          </Heading.h1>

          <hr/>

          <div style={{marginTop: tokens.spacing.m}}>
            <label htmlFor="usernameInput">Käyttäjätunnus</label>
            <input type="text" name="usernameInput" style={inputStyle}
                   value={username}
                   onChange={(e) => setUsername(e.currentTarget.value)}/>
          </div>

          <div style={{flex: 1, marginTop: tokens.spacing.m}}>
            <label htmlFor="passwordInput">Salasana</label>
            <input type="password" name="passwordInput" style={inputStyle}
                   value={password}
                   onChange={(e) => setPassword(e.currentTarget.value)}/>
          </div>

          <div style={{flex: "0", marginTop: tokens.spacing.m}}>
            <Button icon={"login"} onClick={login}>
              Kirjaudu
            </Button>
            <Button.secondaryNoborder
                icon={"close"}
                onClick={() => {
                  setUsername('');
                  setPassword('');
                  setLoginModalIsOpen(false)
                }}
                style={{marginLeft: tokens.spacing.xs}}>
              Peruuta
            </Button.secondaryNoborder>
          </div>
        </Modal>
      </header>
  );
};

export default Header;
