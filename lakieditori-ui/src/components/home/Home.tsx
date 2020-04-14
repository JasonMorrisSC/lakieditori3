import React, {useContext} from "react";
import {AuthenticationContext} from "../../App";
import {FlexColTight, PageHeading, PanelWithShadow} from "../common/StyledComponents";
import DocumentList from "../document/list/DocumentList";
import UserList from "../users/UserList";

const Home: React.FC = () => {
  const [user] = useContext(AuthenticationContext);

  return (
      <main>
        <div>
          <PageHeading>
            Lakieditori
          </PageHeading>
        </div>
        <FlexColTight>
          <PanelWithShadow>
            <DocumentList/>
          </PanelWithShadow>
          {user.superuser &&
          <PanelWithShadow>
            <UserList/>
          </PanelWithShadow>}
        </FlexColTight>

        <br/>
        <br/>
      </main>
  );
};

export default Home;
