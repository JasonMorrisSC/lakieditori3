import React from "react";
import {Link, useHistory} from "react-router-dom";
import {Button, Text} from "suomifi-ui-components";
import {Toolbar} from "../DocumentStyles";

interface Props {
  id: string,
  title: string,
}

const DocumentInfoToolbar: React.FC<Props> = ({id, title}) => {
  const history = useHistory();
  return (
      <Toolbar>
        <div>
          <Text>
            <Link to={"/documents"}>Etusivu</Link> / <Link
              to={`/documents/${id}`}>{title}</Link> / Lisätietoja
          </Text>
        </div>
        <div>
          <Button.secondary
              icon={"close"}
              onClick={() => history.push(`/documents/${id}`)}>
            Sulje
          </Button.secondary>
        </div>
      </Toolbar>
  );
};

export default DocumentInfoToolbar;
