import React from 'react';
import Login from "./Login";
import {AppName, HeaderBackground, HeaderContainer} from "./HeaderStyles";
import {Link} from "react-router-dom";

const Header: React.FC = () => {
  return (
      <header>
        <HeaderBackground>
          <HeaderContainer>
            <Link to={"/"}>
              <AppName>Lakieditori</AppName>
            </Link>
            <Login/>
          </HeaderContainer>
        </HeaderBackground>
      </header>
  );
};

export default Header;
