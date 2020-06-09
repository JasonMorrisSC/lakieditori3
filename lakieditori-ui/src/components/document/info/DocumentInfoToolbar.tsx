import React from "react";
import {Link, useHistory} from "react-router-dom";
import {Button, Text} from "suomifi-ui-components";
import {Toolbar} from "../DocumentStyles";

interface Props {
  schemaName: string,
  id: string,
  title: string,
}

const DocumentInfoToolbar: React.FC<Props> = ({schemaName, id, title}) => {
  const history = useHistory();
  return (
      <Toolbar>
        <div>
          <Text>
            <Link to={`/${schemaName}/documents`}>Etusivu</Link>&nbsp;/&nbsp;
            <Link to={`/${schemaName}/documents/${id}`}>{title}</Link>&nbsp;/&nbsp;
            Lisätietoja
          </Text>
        </div>
        <div>
          <Button.secondary
              icon={"close"}
              onClick={() => history.push(`/${schemaName}/documents/${id}`)}>
            Sulje
          </Button.secondary>
        </div>
      </Toolbar>
  );
};

export default DocumentInfoToolbar;
