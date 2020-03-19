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
          <Button.secondaryNoborder
              icon={"close"}
              style={{background: "none"}}
              onClick={() => history.push(`/documents/${id}`)}>
            Sulje
          </Button.secondaryNoborder>
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

          <Table style={{tableLayout: 'fixed'}}>
            <tbody>
            <tr>
              <th>Muokattu</th>
              <td className={"right"}>{lastModifiedBy}</td>
              <td>{new Date(lastModifiedDate).toLocaleString('fi-FI', {timeZone: "UTC"})}</td>
            </tr>
            <tr>
              <th>Lisätty</th>
              <td className={"right"}>{createdBy}</td>
              <td>{new Date(createdDate).toLocaleString('fi-Fi', {timeZone: "UTC"})}</td>
            </tr>
            </tbody>
          </Table>

          <Heading.h2 style={{margin: `${sdt.spacing.xl} 0 ${sdt.spacing.m} 0`}}>
            Käyttöoikeudet
          </Heading.h2>

          <UserPermissions id={id}/>
        </div>
      </LayoutWithRightBar>
  );
};

export default DocumentInfo;
