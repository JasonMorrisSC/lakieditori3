import React, {useEffect, useState} from "react";
import {Link, Route, Switch, useHistory, useParams, useRouteMatch} from "react-router-dom";
import axios from 'axios';
import Modal from "react-modal";
import {Button, Heading, suomifiDesignTokens as tokens} from "suomifi-ui-components";
import {parseXml, toString, updateElement} from "../utils/xml-utils";
import {Table} from "./CommonComponents";
import {inputStyle} from "./inputStyle";
import Layout from "./Layout";
import DocView from "./DocView";
import DocSource from "./DocSource";
import DocInfo from "./DocInfo";
import DocEdit from "./DocEdit";

const Docs: React.FC = () => {
  const match = useRouteMatch();

  return (
      <Switch>
        <Route path={`${match.path}/:documentId`}>
          <DocSelected/>
        </Route>
        <Route path={match.path}>
          <ListAllDocs/>
        </Route>
      </Switch>
  );
};

const ListAllDocs: React.FC = () => {
  const history = useHistory();

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
  }, []);

  function addNewDocument() {
    let newDocument = parseXml(
        '<document><title/><chapter number="1"><title/></chapter></document>');

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
              Säädösnumero
            </th>
            <th>
              Nimi
            </th>
            <th style={{width: "20%"}}>
              Viimeksi muokattu
            </th>
            <th style={{width: "12%"}}/>
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
              <td style={{width: "20%"}}>
                {lastModifiedDate ? new Date(lastModifiedDate).toLocaleString("fi-FI", {timeZone: "UTC"}) : ''}
              </td>
              <td style={{width: "12%"}} className={"right"}>
                <Button.secondaryNoborder
                    icon={"remove"}
                    onClick={() => removeDocument(id)}>
                  Poista
                </Button.secondaryNoborder>
              </td>
            </tr>
          })}
          </tbody>
        </Table>

        <Button icon={"plus"} onClick={() => setModalIsOpen(true)}>
          Lisää uusi lakiluonnos
        </Button>

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

const DocSelected: React.FC = () => {
  const match = useRouteMatch();
  const {documentId} = useParams();
  const [document, setDocument] = useState<Document>(parseXml("<document/>"));
  const [lastSavedDocument, setLastSavedDocument] = useState<Document>(parseXml("<document/>"));

  useEffect(() => {
    axios.get('/api/documents/' + documentId, {
      responseType: 'document'
    }).then(res => {
      setDocument(res.data);
      setLastSavedDocument(res.data);
    });
  }, [documentId]);

  useEffect(() => {
    function saveDocument() {
      if (!lastSavedDocument.isEqualNode(document)) {
        axios.put('/api/documents/' + documentId, toString(document), {
          headers: {'Content-Type': 'text/xml'}
        }).then(() => {
          setLastSavedDocument(document);
        });
      }
    }

    const timer = setTimeout(() => saveDocument(), 1000);

    return () => clearTimeout(timer);
  }, [documentId, lastSavedDocument, document]);

  return <Switch>
    <Route path={`${match.path}/source`}>
      <DocSource document={document}
                 currentElement={document.documentElement}
                 currentPath={"/document"}
                 updateDocument={setDocument}/>
    </Route>
    <Route path={`${match.path}/edit`}>
      <DocEdit document={document}
               currentElement={document.documentElement}
               currentPath={"/document"}
               updateDocument={setDocument}/>
    </Route>
    <Route path={`${match.path}/info`}>
      <DocInfo currentElement={document.documentElement}/>
    </Route>
    <Route path={match.path}>
      <DocView currentElement={document.documentElement}/>
    </Route>
  </Switch>;
};

export default Docs;
