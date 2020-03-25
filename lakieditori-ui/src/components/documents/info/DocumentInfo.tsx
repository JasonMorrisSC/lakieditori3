import React from "react";
import {Button, Heading, suomifiDesignTokens as sdt, Text} from "suomifi-ui-components";
import {useHistory} from "react-router-dom";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/theme/eclipse.css";
import "codemirror/mode/xml/xml";
import {queryFirstText} from "../../../utils/xmlUtils";
import LayoutWithRightBar from "../../common/LayoutWithRightBar";
import {XmlViewProperties} from "../view/XmlViewProperties";
import UserPermissions from "./UserPermissions";
import {Table} from "../../common/StyledComponents";
import VersionHistory from "./VersionHistory";

const DocumentInfo: React.FC<XmlViewProperties> = ({currentElement}) => {
  const history = useHistory();

  const id = queryFirstText(currentElement, "@id");
  const title = queryFirstText(currentElement, "title");

  const createdBy = queryFirstText(currentElement, "@createdBy");
  const createdDate = queryFirstText(currentElement, "@createdDate");
  const lastModifiedBy = queryFirstText(currentElement, "@lastModifiedBy");
  const lastModifiedDate = queryFirstText(currentElement, "@lastModifiedDate");

  const topBar =
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end"
      }}>
        <Text style={{maxWidth: "600px"}}>
          {title} / Lisätietoja
        </Text>
        <div>
          <Button.secondary
              icon={"close"}
              onClick={() => history.push(`/documents/${id}`)}>
            Sulje
          </Button.secondary>
        </div>
      </div>;

  return (
      <LayoutWithRightBar topContent={topBar}>
        <div style={{margin: sdt.spacing.xl}}>
          <Heading.h1hero style={{margin: `${sdt.spacing.l} 0`}}>
            <small style={{color: sdt.colors.depthDark27}}>Lisätietoja</small>
            <br/>
            {title}
          </Heading.h1hero>

          <Table>
            <tbody>
            <tr>
              <th style={{width: "15%"}}>Muokattu</th>
              <td style={{width: "15%"}}>{lastModifiedBy}</td>
              <td>{new Date(lastModifiedDate).toLocaleString('fi-FI', {timeZone: "UTC"})}</td>
            </tr>
            <tr>
              <th style={{width: "15%"}}>Lisätty</th>
              <td style={{width: "15%"}}>{createdBy}</td>
              <td>{new Date(createdDate).toLocaleString('fi-Fi', {timeZone: "UTC"})}</td>
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
        </div>
      </LayoutWithRightBar>
  );
};

export default DocumentInfo;
