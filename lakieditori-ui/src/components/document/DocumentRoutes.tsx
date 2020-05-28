import React, {useEffect} from "react";
import {Route, Switch, useLocation, useParams, useRouteMatch} from "react-router-dom";
import DocumentView from "./view/DocumentView";
import DocumentInfo from "./info/DocumentInfo";
import DocumentSourceEdit from "./source/DocumentSourceEdit";
import DocumentEdit from "./edit/DocumentEdit";
import {useDocumentLock} from "./useDocumentLock";

const DocumentRoutes: React.FC = () => {
  const match = useRouteMatch();
  const location = useLocation();
  const {documentId} = useParams();
  const {lock, acquireDocumentLock, releaseDocumentLock} = useDocumentLock(documentId || null);

  useEffect(() => {
    if (location.pathname.endsWith("edit") || location.pathname.endsWith("source")) {
      acquireDocumentLock().catch(error => console.error(error));
    } else {
      releaseDocumentLock().catch(error => console.error(error));
    }
  }, [location.pathname, match.path, acquireDocumentLock, releaseDocumentLock]);

  return (
      <Switch>
        <Route path={`${match.path}/edit`}>
          {documentId && <DocumentEdit id={documentId} lock={lock}/>}
        </Route>
        <Route path={`${match.path}/source`}>
          {documentId && <DocumentSourceEdit id={documentId} lock={lock}/>}
        </Route>
        <Route path={`${match.path}/info`}>
          {documentId && <DocumentInfo id={documentId}/>}
        </Route>
        <Route path={match.path}>
          {documentId && <DocumentView id={documentId}/>}
        </Route>
      </Switch>
  );
};

export default DocumentRoutes;
