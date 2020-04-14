import React, {useContext} from "react";
import {Link, useHistory} from "react-router-dom";
import {Button, suomifiDesignTokens as tokens} from "suomifi-ui-components";
import {AuthenticationContext} from "../../../App";
import {NULL_USER} from "../../../utils/User";
import {Toolbar} from "../DocumentStyles";

interface Props {
  id: string,
  title: string,
  saveDocument: () => Promise<any>,
}

const DocumentEditToolbar: React.FC<Props> = ({id, title, saveDocument}) => {
  const history = useHistory();
  const [user] = useContext(AuthenticationContext);

  return (
      <Toolbar>
        <div>
          <Link to={"/"}>Etusivu</Link> / <Link to={`/documents/${id}`}>{title}</Link> / Muokkaa
        </div>
        {user !== NULL_USER &&
        <div>
          <Button.secondaryNoborder
              icon={"close"}
              style={{marginRight: tokens.spacing.s, background: "none"}}
              onClick={() => history.push(`/documents/${id}`)}>
            Sulje
          </Button.secondaryNoborder>
          <Button
              icon={"save"}
              onClick={() => saveDocument().then(() => history.push(`/documents/${id}`))}>
            Tallenna
          </Button>
        </div>}
      </Toolbar>
  );
};

export default DocumentEditToolbar;
