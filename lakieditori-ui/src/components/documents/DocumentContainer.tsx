import React, {useEffect, useState} from "react";
import {Route, Switch, useParams, useRouteMatch} from "react-router-dom";
import axios from "axios";
import {parseXml, toString} from "../../utils/xmlUtils";
import DocumentEditSource from "./edit/DocumentEditSource";
import DocumentEdit from "./edit/DocumentEdit";
import DocumentInfo from "./info/DocumentInfo";
import Document from "./view/Document";

const DocumentContainer: React.FC = () => {
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
      <DocumentEditSource
          document={document}
          currentElement={document.documentElement}
          currentPath={"/document"}
          updateDocument={setDocument}/>
    </Route>
    <Route path={`${match.path}/edit`}>
      <DocumentEdit
          document={document}
          currentElement={document.documentElement}
          currentPath={"/document"}
          updateDocument={setDocument}/>
    </Route>
    <Route path={`${match.path}/info`}>
      <DocumentInfo currentElement={document.documentElement}/>
    </Route>
    <Route path={match.path}>
      <Document currentElement={document.documentElement}/>
    </Route>
  </Switch>;
};

export default DocumentContainer;