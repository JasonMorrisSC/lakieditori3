import React from "react";
import {PageHeading, Panel} from "../common/StyledComponents";

const Home: React.FC = () => {
  return (
      <main>
        <PageHeading>
          Etusivu
        </PageHeading>
        <Panel>
          Verkkopalvelu lakiehdotusten työstämiseen.
        </Panel>
      </main>
  );
};

export default Home;
