import React from "react";
import {Heading, suomifiDesignTokens as sdt} from "suomifi-ui-components";
import {queryFirstText} from "../../../utils/xmlUtils";
import UserPermissions from "./UserPermissions";
import {Panel, Table} from "../../common/StyledComponents";
import VersionHistory from "./VersionHistory";
import {useDocument} from "../useDocument";
import DocumentInfoToolbar from "./DocumentInfoToolbar";
import {suomifiDesignTokens as tokens} from "suomifi-design-tokens";
import {toFiDateTimeStringInUtc} from "../../../utils/dateUtils";

interface Props {
  id: string,
}

const DocumentInfo: React.FC<Props> = ({id}) => {
  const {document} = useDocument(id);

  const element = document.documentElement;
  const title = queryFirstText(element, "title");
  const createdBy = queryFirstText(element, "@createdBy");
  const createdDate = toFiDateTimeStringInUtc(queryFirstText(element, "@createdDate"));
  const lastModifiedBy = queryFirstText(element, "@lastModifiedBy");
  const lastModifiedDate = toFiDateTimeStringInUtc(queryFirstText(element, "@lastModifiedDate"));

  return (
      <main>
        <DocumentInfoToolbar id={id} title={title}/>

        <Panel style={{padding: tokens.spacing.xl}}>
          <Heading.h1hero>
            <small style={{color: sdt.colors.depthDark27}}>Lisätietoja</small>
            <br/>
            {title}
          </Heading.h1hero>

          <Table style={{marginTop: tokens.spacing.l}}>
            <tbody>
            <tr>
              <th style={{width: "15%"}}>Muokattu</th>
              <td style={{width: "15%"}}>{lastModifiedBy}</td>
              <td>{lastModifiedDate}</td>
            </tr>
            <tr>
              <th style={{width: "15%"}}>Lisätty</th>
              <td style={{width: "15%"}}>{createdBy}</td>
              <td>{createdDate}</td>
            </tr>
            </tbody>
          </Table>

          <Heading.h2 style={{margin: `${sdt.spacing.xl} 0 ${sdt.spacing.m} 0`}}>
            Käyttöoikeudet
          </Heading.h2>

          <UserPermissions id={id}/>

          <Heading.h2 style={{margin: `${sdt.spacing.xl} 0 ${sdt.spacing.m} 0`}}>
            Muutoshistoria
          </Heading.h2>

          <VersionHistory id={id}/>
        </Panel>
      </main>
  );
};

export default DocumentInfo;
