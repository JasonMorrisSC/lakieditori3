import React from "react";
import {Heading, suomifiDesignTokens as tokens} from "suomifi-ui-components";
import {queryFirstText} from "../../../utils/xmlUtils";
import {Panel} from "../../common/StyledComponents";
import {useDocument} from "../useDocument";
import DocumentConnectionsToolbar from "./DocumentConnectionsToolbar";

interface Props {
  schemaName: string,
  id: string,
}

const DocumentConnections: React.FC<Props> = ({schemaName, id}) => {
  const {document} = useDocument(schemaName, id);

  const element = document.documentElement;
  const title = queryFirstText(element, "title");

  return (
      <main>
        <DocumentConnectionsToolbar schemaName={schemaName} id={id} title={title}/>

        <Panel style={{padding: tokens.spacing.xl}}>
          <Heading.h1hero>
            <small style={{color: tokens.colors.depthDark27}}>Tietomalliyhteydet</small>
            <br/>
            {title}
          </Heading.h1hero>

        </Panel>
      </main>
  );
};

export default DocumentConnections;
