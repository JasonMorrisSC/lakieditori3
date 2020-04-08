import React from 'react';
import Login from "./Login";
import {AppName, HeaderBackground, HeaderContainer, NavigationBackground} from "./HeaderStyles";
import {Container} from "../common/StyledComponents";
import Navigation from "./Navigation";

const Header: React.FC = () => {
  return (
      <header>
        <HeaderBackground>
          <HeaderContainer>
            <AppName>Lakieditori</AppName>
            <Login/>
          </HeaderContainer>
        </HeaderBackground>

        <NavigationBackground>
          <Container>
            <Navigation/>
          </Container>
        </NavigationBackground>
      </header>
  );
};

export default Header;
