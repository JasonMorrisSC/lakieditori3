import React, {useContext} from "react";
import {useHistory} from "react-router-dom";
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
        <Text>{title}</Text>
        {user !== NULL_USER &&
        <div>
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
