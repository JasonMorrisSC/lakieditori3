import React, {useContext} from "react";
import {AuthenticationContext} from "../../App";
import {FlexColTight, PageHeading, PanelWithShadow} from "../common/StyledComponents";
import DocumentList from "../document/list/DocumentList";
import UserList from "../users/UserList";
import {proposalXmlTemplate} from "../document/list/proposalXmlTemplate";

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
            <DocumentList schemaName={"proposal"}
                          newDocumentTemplate={proposalXmlTemplate}
                          listLabel={"Hallituksen esitykset"}
                          addButtonLabel={"Uusi hallituksen esitys"}/>
          </PanelWithShadow>
          <PanelWithShadow>
            <DocumentList schemaName={"statute"}
                          newDocumentTemplate={"<statute><title/></statute>"}
                          listLabel={"Lakiehdotukset"}
                          addButtonLabel={"Uusi lakiehdotus"}/>
          </PanelWithShadow>
          <hr/>
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
