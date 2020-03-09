import React, {useState} from "react";
import {Button, suomifiDesignTokens as sdt, Text} from "suomifi-ui-components";
import {useHistory} from "react-router-dom";
import axios, {AxiosResponse} from "axios";
import {UnControlled as CodeMirror} from 'react-codemirror2';
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/theme/eclipse.css";
import "codemirror/mode/xml/xml";
import {queryFirstText} from "../../../utils/xmlUtils";
import LayoutWithRightBar from "../../common/LayoutWithRightBar";
import {XmlEditorProperties} from "./XmlEditorProperties";
import "./DocEditSource.css";

const DocEditSource: React.FC<XmlEditorProperties> = ({document, currentElement, updateDocument}) => {
  const [editorData, updateEditorData] = useState<string>(new XMLSerializer().serializeToString(document));
  const [errorMessage, setErrorMessage] = useState<string>('');
  const history = useHistory();

  const id = queryFirstText(currentElement, "@id");
  const title = queryFirstText(currentElement, "title");

  function validateDocument(data: string): Promise<AxiosResponse> {
    return axios.post('/api/validate', data, {
      headers: {'Content-Type': 'text/xml'}
    });
  }

  function updateDocumentAndCloseEditorIfValid() {
    validateDocument(editorData).then(() => {
      updateDocument(new DOMParser().parseFromString(editorData, 'text/xml'));
      history.push(`/documents/${id}/edit`);
    }).catch((error) => {
      setErrorMessage(error.response.data.message);
    });
  }

  const topBar = <div>
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-end"
    }}>
      <Text style={{maxWidth: "600px"}}>
        {title} / Muokkaa / XML
      </Text>
      <div>
        <Button.secondary
            icon={"close"}
            onClick={updateDocumentAndCloseEditorIfValid}>
          Sulje
        </Button.secondary>
      </div>
    </div>
    {errorMessage ?
        <div style={{
          backgroundColor: sdt.colors.alertLight47,
          padding: sdt.spacing.m,
        }}>
          XML dokumentissa on virhe:<br/>
          {errorMessage ? errorMessage : ''}<br/>
        </div> : ''}
  </div>;

  return (
      <LayoutWithRightBar topContent={topBar}>
        <article>
          <CodeMirror
              value={new XMLSerializer().serializeToString(document)}
              options={{
                mode: 'xml',
                theme: 'eclipse',
                lineNumbers: true,
                lineWrapping: true
              }}
              autoCursor={false}
              onChange={(editor, data, value) => {
                updateEditorData(value);
              }}
          />
        </article>
      </LayoutWithRightBar>
  );
};

export default DocEditSource;
