import React, {useContext, useState} from "react";
import {Link, useHistory} from "react-router-dom";
import {Button, suomifiDesignTokens as tokens} from "suomifi-ui-components";
import {ErrorPanel, Toolbar} from "../DocumentStyles";
import {AuthenticationContext} from "../../../App";

interface Props {
  schemaName: string,
  id: string,
  title: string,
  lock: null | string,
  saveDocument: () => Promise<any>,
}

const DocumentEditToolbar: React.FC<Props> = ({schemaName, id, title, lock, saveDocument}) => {
  const [user] = useContext(AuthenticationContext);
  const history = useHistory();
  const [errorMessage, setErrorMessage] = useState("");

  function saveAndClose() {
    saveDocument().then(() => {
      history.push(`/${schemaName}/documents/${id}`);
    }).catch((error) => {
      setErrorMessage(error.response.data.message);
    });
  }

  return (
      <Toolbar>
        <div>
          <Link to={"/"}>Etusivu</Link>&nbsp;/&nbsp;
          <Link to={`/${schemaName}/documents/${id}`}>{title}</Link>&nbsp;/&nbsp;
          Muokkaa
        </div>
        <div>
          <Button.secondaryNoborder
              icon={"close"}
              style={{marginRight: tokens.spacing.s, background: "none"}}
              onClick={() => history.push(`/documents/${id}`)}>
            Peruuta
          </Button.secondaryNoborder>
          <Button
              icon={"save"}
              onClick={() => saveAndClose()}>
            Tallenna
          </Button>
        </div>
        {errorMessage &&
        <ErrorPanel>
          XML dokumentissa on virhe:<br/>
          {errorMessage ? errorMessage : ''}<br/>
        </ErrorPanel>}
        {lock && (lock !== user.username) &&
        <ErrorPanel>
          Dokumentti on lukittu käyttäjälle: {lock}
        </ErrorPanel>}
      </Toolbar>
  );
};

export default DocumentEditToolbar;
