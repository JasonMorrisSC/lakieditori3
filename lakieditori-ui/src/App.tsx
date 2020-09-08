import React, {Dispatch, SetStateAction, useState} from "react";
import {BrowserRouter as Router, Redirect, Route, Switch} from "react-router-dom";
import {css, Global} from '@emotion/core'
import {suomifiDesignTokens as tokens} from "suomifi-ui-components";
import Header from "./components/header/Header";
import {NULL_USER, User} from "./utils/User";
import {Container} from "./components/common/StyledComponents";
import DocumentRoutes from "./components/document/DocumentRoutes";
import Home from "./components/home/Home";

export const AuthenticationContext = React.createContext<[User, Dispatch<SetStateAction<User>>]>([NULL_USER, () => null]);

const App: React.FC = () => {
  const bodyText = tokens.values.typography.bodyText;

  return (
      <AuthenticationContext.Provider value={useState<User>(NULL_USER)}>
        <Global styles={css`
            body {
              background-color: ${tokens.colors.depthLight30};
              font-family: ${bodyText.fontFamily};
              font-size: ${bodyText.fontSize.value}${bodyText.fontSize.unit};
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
              line-height: ${bodyText.lineHeight.value}${bodyText.lineHeight.unit};
              margin: 0;
            }
            a {
              color: ${tokens.colors.highlightBase};
              text-decoration: none; 
            }
            a:visited {
              color: ${tokens.colors.accentTertiaryDark9}
            }
            code {
              white-space: pre-wrap !important;
            }
            hr {
              border: 0;
              border-bottom: 1px solid ${tokens.colors.depthLight26};
              margin: ${tokens.spacing.m} 0;
            }
            label {
              font-weight: ${tokens.values.typography.bodySemiBold.fontWeight}
            }
            ul, ol {
              margin: 0;
              padding: 0;
            }
            li {
              margin: 0;
              padding: 0;            
            }
            p {
              margin: ${tokens.spacing.m} 0;
            }
          `}
        />

        <Router>
          <Header/>
          <Container>
            <Switch>
              <Route path="/:schemaName/:documentId">
                <DocumentRoutes/>
              </Route>
              <Route path="/:schemaName">
                <Redirect to={"/"}/>
              </Route>
              <Route path="/">
                <Home/>
              </Route>
            </Switch>
          </Container>
        </Router>
      </AuthenticationContext.Provider>
  );
};

export default App;
