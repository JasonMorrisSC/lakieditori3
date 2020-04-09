import React from "react";
import {useHistory} from "react-router-dom";
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
        <Text>
          {title} / Lisätietoja
        </Text>
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
