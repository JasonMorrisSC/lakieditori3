import React, {useEffect, useState} from "react";
import {Link, Route, Switch, useParams, useRouteMatch} from "react-router-dom";
import axios from 'axios';
import {suomifiDesignTokens as tokens} from "suomifi-ui-components";
import Layout from "./Layout";
import DocView from "./DocView";
import DocSource from "./DocSource";
import DocInfo from "./DocInfo";
import DocEdit from "./DocEdit";
import {encodeIdForUrl} from "../utils/id-utils";
import {parseXml, toString} from "../utils/xml-utils";

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
  const [documents, setDocuments] = useState<Element>(document.createElement("documents"));
  const match = useRouteMatch();

  useEffect(() => {
    axios.get('/api/documents', {
      responseType: 'document'
    }).then(res => {
      setDocuments(res.data.documentElement);
    });
  }, []);

  return (
      <Layout title="Lakiluonnokset">
        {Array.from(documents.childNodes)
        .map(n => n as Element)
        .map((e, i) => {
          return <div key={i} style={{marginBottom: tokens.spacing.m}}>
            <Link to={`${match.url}/${encodeIdForUrl(e.getAttribute('number')!)}`}
                  style={{color: tokens.colors.blackBase, textDecoration: "none"}}>
              <span style={{color: tokens.colors.highlightBase}}>
                {e.getAttribute('number')}
              </span>
              <br/>
              {e.getElementsByTagName('title')[0]!.textContent}
            </Link>
          </div>
        })}
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
