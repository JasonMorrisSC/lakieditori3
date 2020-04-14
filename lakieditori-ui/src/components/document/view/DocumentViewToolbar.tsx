import React, {useContext} from "react";
import {Link, useHistory} from "react-router-dom";
import {Button, suomifiDesignTokens as tokens, Text} from "suomifi-ui-components";
import {AuthenticationContext} from "../../../App";
import {NULL_USER} from "../../../utils/User";
import {Toolbar} from "../DocumentStyles";

interface Props {
  id: string,
  title: string,
}

const DocumentViewToolbar: React.FC<Props> = ({id, title}) => {
  const history = useHistory();
  const [user] = useContext(AuthenticationContext);
  return (
      <Toolbar>
        <div>
          <Link to={"/"}>Etusivu</Link> / <Text>{title}</Text>
        </div>
        {user !== NULL_USER &&
        <div>
          <Button.secondaryNoborder
              icon={"registers"}
              style={{marginRight: tokens.spacing.s, background: "none"}}
              onClick={() => history.push(`/documents/${id}/source`)}>
            XML
          </Button.secondaryNoborder>
          <Button.secondary
              icon={"info"}
              style={{marginRight: tokens.spacing.s}}
              onClick={() => history.push(`/documents/${id}/info`)}>
            Lisätietoja
          </Button.secondary>
          <Button
              icon={"edit"}
              onClick={() => history.push(`/documents/${id}/edit`)}>
            Muokkaa
          </Button>
        </div>}
      </Toolbar>
  );
};

export default DocumentViewToolbar;
