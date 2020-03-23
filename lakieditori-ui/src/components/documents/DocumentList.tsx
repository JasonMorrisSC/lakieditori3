import React, {useContext, useEffect, useState} from "react";
import {Link, useHistory} from "react-router-dom";
import axios from "axios";
import Modal from "react-modal";
import {Button, Heading, suomifiDesignTokens as tokens} from "suomifi-ui-components";
import {parseXml, toString, updateElement} from "../../utils/xmlUtils";
import {Table} from "../common/StyledComponents";
import {inputStyle} from "../common/inputStyle";
import Layout from "../common/Layout";
import {parseDocumentState} from "./DocumentStateEnum";
import {AuthenticationContext} from "../../App";
import {NULL_USER} from "../../utils/User";

const DocumentList: React.FC = () => {
  const history = useHistory();
  const [user] = useContext(AuthenticationContext);

  const [documents, setDocuments] = useState<Element>(document.createElement("documents"));

  const [modalIsOpen, setModalIsOpen] = React.useState<boolean>(false);
  const [newDocumentNumber, setNewDocumentNumber] = useState<string>(`${new Date().getFullYear()}/???`);
  const [newDocumentTitle, setNewDocumentTitle] = useState<string>('Uusi lakiluonnos');

  useEffect(() => {
    axios.get('/api/documents', {
      responseType: 'document'
    }).then(res => {
      setDocuments(res.data.documentElement);
    });
  }, [user]);

  function addNewDocument() {
    let newDocument = parseXml('<document><title/></document>');

    updateElement(newDocument, "/document", (e) => e.setAttribute("number", newDocumentNumber));
    updateElement(newDocument, "/document/title", (e) => e.textContent = newDocumentTitle);

    axios.post('/api/documents', toString(newDocument), {
      headers: {'Content-Type': 'text/xml'}
    }).then((response) => {
      const location = response.headers.location;
      const createdId = location.substring(location.lastIndexOf('/') + 1);
      history.push(`/documents/${createdId}/edit`);
    });
  }

  function removeDocument(id: string) {
    axios.delete(`/api/documents/${id}`).then(() => {
      return axios.get('/api/documents', {responseType: 'document'});
    }).then(res => {
      setDocuments(res.data.documentElement);
    });
  }

  return (
      <Layout title="Lakiluonnokset">
        <Table style={{marginBottom: tokens.spacing.l}}>
          <thead>
          <tr>
            <th style={{width: "15%"}}>
              Numero
            </th>
            <th style={{width: "35%"}}>
              Nimi
            </th>
            <th>
              Tila
            </th>
            <th style={{width: "20%"}}>
              Viimeksi muokattu
            </th>
            {user === NULL_USER ? <th style={{width: 0}}/> : <th style={{width: "12%"}}/>}
          </tr>
          </thead>
          <tbody>
          {Array.from(documents.childNodes)
          .map(n => n as Element)
          .map((e, i) => {
            const id = e.getAttribute('id') || '';
            const number = e.getAttribute('number') || '';
            const lastModifiedDate = e.getAttribute("lastModifiedDate");
            return <tr key={i}>
              <td style={{color: tokens.colors.highlightBase, width: "15%"}}>
                <Link to={`/documents/${id}`}>{number}</Link>
              </td>
              <td>
                {e.getElementsByTagName('title')[0]!.textContent}
              </td>
              <td>
                {parseDocumentState(e.getAttribute('state') || '')}
              </td>
              <td>
                {lastModifiedDate ? new Date(lastModifiedDate).toLocaleString("fi-FI", {timeZone: "UTC"}) : ''}
              </td>
              {user === NULL_USER
                  ? <td style={{width: 0}}/>
                  : <td style={{width: "12%"}} className={"right"}>
                    <Button.secondaryNoborder
                        icon={"remove"}
                        onClick={() => removeDocument(id)}>
                      Poista
                    </Button.secondaryNoborder>
                  </td>
              }
            </tr>
          })}
          </tbody>
        </Table>

        {user === NULL_USER ? '' :
            <Button icon={"plus"} onClick={() => setModalIsOpen(true)}>
              Lisää uusi lakiluonnos
            </Button>
        }

        <Modal isOpen={modalIsOpen} contentLabel="Lisää uusi lakiluonnos" style={{
          content: {
            display: "flex",
            flexDirection: "column",
            height: "60%",
            marginLeft: "auto",
            marginRight: "auto",
            maxWidth: 800,
            padding: `${tokens.spacing.l}`,
          }
        }}>
          <Heading.h1>
            Lisää uusi lakiluonnos
          </Heading.h1>

          <hr/>

          <div style={{marginTop: tokens.spacing.m}}>
            <label htmlFor="documentNumberInput">Luonnoksen säädösnumero</label>
            <input type="text" name="documentNumberInput" style={inputStyle}
                   value={newDocumentNumber}
                   onChange={(e) => setNewDocumentNumber(e.currentTarget.value)}/>
          </div>

          <div style={{flex: 1, marginTop: tokens.spacing.m}}>
            <label htmlFor="documentTitleInput">Luonnoksen nimi</label>
            <input type="text" name="documentTitleInput" style={inputStyle}
                   value={newDocumentTitle}
                   onChange={(e) => setNewDocumentTitle(e.currentTarget.value)}/>
          </div>

          <div style={{flex: "0", marginTop: tokens.spacing.m}}>
            <Button icon={"plus"} onClick={addNewDocument}>
              Lisää
            </Button>
            <Button.secondaryNoborder
                icon={"close"}
                onClick={() => setModalIsOpen(false)}
                style={{marginLeft: tokens.spacing.xs}}>
              Peruuta
            </Button.secondaryNoborder>
          </div>
        </Modal>
      </Layout>
  );
};

export default DocumentList;
