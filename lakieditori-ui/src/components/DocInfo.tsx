import React from "react";
import {Button, Heading, suomifiDesignTokens as sdt, Text} from "suomifi-ui-components";
import {useHistory} from "react-router-dom";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/theme/eclipse.css";
import "codemirror/mode/xml/xml";
import {queryFirstText} from "../utils/xml-utils";
import LayoutWithRightBar from "./LayoutWithRightBar";
import "./DocInfo.css";
import {XmlViewProperties} from "./XmlViewProperties";

const DocInfo: React.FC<XmlViewProperties> = ({currentElement}) => {
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
          <Heading.h1hero>
            <small style={{color: sdt.colors.depthDark27}}>Lisätietoja</small>
            <br/>
            {title}
          </Heading.h1hero>
          <br/>
          <table>
            <tbody>
            <tr>
              <th>Lisätty</th>
              <td>{new Date(createdDate).toLocaleString('fi-Fi', {timeZone: "UTC"})}</td>
              <td>{createdBy}</td>
            </tr>
            <tr>
              <th>Muokattu</th>
              <td>{new Date(lastModifiedDate).toLocaleString('fi-FI', {timeZone: "UTC"})}</td>
              <td>{lastModifiedBy}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </LayoutWithRightBar>
  );
};

export default DocInfo;
