import React from "react";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {suomifiDesignTokens as sdt} from "suomifi-ui-components";
import About from "./components/About";
import Home from "./components/Home";
import Docs from "./components/Docs";
import Header from "./components/Header";
import Navigation from "./components/Navigation";
import TwoWayBindTest from "./test/TwoWayBindTest";
import TwoWayBindTest2 from "./test/TwoWayBindTest2";
import LayoutTest from "./test/LayoutTest";

const App: React.FC = () => {
  return (
      <div style={{
        fontFamily: sdt.values.typography.bodyText.fontFamily,
        fontSize: sdt.values.typography.bodyText.fontSize.value,
        color: sdt.colors.blackBase,
        lineHeight: sdt.values.typography.bodyText.lineHeight.value
      }}>
        <Header/>

        <Router>
          <Navigation/>

          <Switch>
            <Route path="/documents">
              <Docs/>
            </Route>
            <Route path="/about">
              <About/>
            </Route>
            <Route path="/two-way-bind-test">
              <TwoWayBindTest/>
            </Route>
            <Route path="/two-way-bind-test-2">
              <TwoWayBindTest2/>
            </Route>
            <Route path="/layout-test">
              <LayoutTest/>
            </Route>
            <Route path="/">
              <Home/>
            </Route>
          </Switch>
        </Router>

      </div>
  );
};

export default App;
