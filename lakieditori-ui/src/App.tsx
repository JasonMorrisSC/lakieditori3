import React from "react";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {css, Global} from '@emotion/core'
import {suomifiDesignTokens as tokens} from "suomifi-ui-components";
import {ContentContainer, HeaderBackground, TopNavigationBackground} from "./components/common/StyledComponents";
import About from "./components/about/About";
import Home from "./components/home/Home";
import Header from "./components/common/Header";
import Navigation from "./components/common/Navigation";
import DocumentList from "./components/documents/DocumentList";
import DocumentContainer from "./components/documents/DocumentContainer";

const App: React.FC = () => {
  const bodyText = tokens.values.typography.bodyText;

  return (
      <>
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
          `}
        />

        <Router>
          <HeaderBackground>
            <ContentContainer>
              <Header/>
            </ContentContainer>
          </HeaderBackground>

          <TopNavigationBackground>
            <ContentContainer>
              <Navigation/>
            </ContentContainer>
          </TopNavigationBackground>

          <ContentContainer>
            <Switch>
              <Route path="/documents/:documentId">
                <DocumentContainer/>
              </Route>
              <Route path="/documents">
                <DocumentList/>
              </Route>
              <Route path="/about">
                <About/>
              </Route>
              <Route path="/">
                <Home/>
              </Route>
            </Switch>
          </ContentContainer>
        </Router>
      </>
  );
};

export default App;
