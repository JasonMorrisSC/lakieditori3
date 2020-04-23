import React, {useState} from 'react';
import {Button} from 'suomifi-ui-components';
import {NULL_USER} from "../../utils/User";
import {useAuthentication} from "./useAuthentication";
import LoginModal from "./LoginModal";
import {ButtonLinkSmall} from "../common/StyledInputComponents";

const Login: React.FC = () => {
  const {user, login, logout} = useAuthentication();
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);

  const renderLoginLink = () => (
      <Button icon={"login"} onClick={() => setLoginModalOpen(true)}>
        Kirjaudu
      </Button>
  );

  const renderUsernameAndLogoutLink = () => (
      <span>
        {user.firstName && user.lastName
            ? user.firstName + " " + user.lastName
            : user.username}
        <br/>
        <ButtonLinkSmall
            style={{textTransform: "uppercase", lineHeight: 1.2}}
            onClick={() => logout()}>
          Kirjaudu ulos
        </ButtonLinkSmall>
      </span>
  );

  return (
      <div style={{textAlign: "right", lineHeight: 1}}>
        {user === NULL_USER
            ? renderLoginLink()
            : renderUsernameAndLogoutLink()}
        <LoginModal
            isOpen={isLoginModalOpen}
            setOpen={setLoginModalOpen}
            login={login}/>
      </div>
  );
};

export default Login;
