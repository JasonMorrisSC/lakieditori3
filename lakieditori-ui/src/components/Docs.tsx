import React, {useEffect, useState} from "react";
import {Link, Route, Switch, useParams, useRouteMatch} from "react-router-dom";
import axios from 'axios';
import {suomifiDesignTokens as sdt} from "suomifi-ui-components";
import {encodeIdForUrl} from "../utils/id-utils";
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
        {Array.from(documents.childNodes).map((n, i) => {
          const e = n as Element;
          return <div key={i} style={{marginBottom: sdt.spacing.m}}>
            <Link to={`${match.url}/${encodeIdForUrl(e.getAttribute('number')!)}`}
                  style={{
                    color: sdt.colors.blackBase,
                    textDecoration: "none"
                  }}>
              <span style={{color: sdt.colors.highlightBase}}>
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
  const [document, updateDocument] = useState<Document>(
      new DOMParser().parseFromString("<document></document>", "text/xml"));

  useEffect(() => {
    axios.get('/api/documents/' + documentId, {
      responseType: 'document'
    }).then(res => {
      updateDocument(res.data);
    });
  }, [documentId]);

  return <Switch>
    <Route path={`${match.path}/source`}>
      <DocSource document={document}
                 currentElement={document.documentElement}
                 currentPath={"/document"}
                 updateDocument={updateDocument}/>
    </Route>
    <Route path={`${match.path}/info`}>
      <DocInfo document={document}
               currentElement={document.documentElement}
               currentPath={"/document"}
               updateDocument={updateDocument}/>
    </Route>
    <Route path={`${match.path}/edit`}>
      <DocEdit document={document}
               currentElement={document.documentElement}
               currentPath={"/document"}
               updateDocument={updateDocument}/>
    </Route>
    <Route path={match.path}>
      <DocView document={document}
               currentElement={document.documentElement}
               currentPath={"/document"}
               updateDocument={updateDocument}/>
    </Route>
  </Switch>;
};

export default Docs;
