import React, {useEffect} from "react";
import {Route, Switch, useLocation, useParams, useRouteMatch} from "react-router-dom";
import DocumentView from "./view/DocumentView";
import DocumentInfo from "./info/DocumentInfo";
import DocumentSourceEdit from "./source/DocumentSourceEdit";
import DocumentPseudoEdit from "./source/DocumentPseudoEdit";
import DocumentEdit from "./edit/DocumentEdit";
import {useDocumentLock} from "./useDocumentLock";
import DocumentConnections from "./connections/DocumentConnections";

const DocumentRoutes: React.FC = () => {
  const match = useRouteMatch();
  const location = useLocation();
  const {schemaName, documentId} = useParams();
  const {lock, acquireDocumentLock, releaseDocumentLock} =
      useDocumentLock(schemaName || null, documentId || null);

  useEffect(() => {
    if (location.pathname.endsWith("edit")
        || location.pathname.endsWith("source")
        ||┬álocation.pathname.endsWith("pseudo")) {
      acquireDocumentLock().catch(error => console.error(error));
    } else {
      releaseDocumentLock().catch(error => console.error(error));
    }
  }, [location.pathname, match.path, acquireDocumentLock, releaseDocumentLock]);

  return (
      <Switch>
        <Route path={`${match.path}/edit`}>
          {schemaName && documentId &&
          <DocumentEdit schemaName={schemaName} id={documentId} lock={lock}/>}
        </Route>
        <Route path={`${match.path}/source`}>
          {schemaName && documentId &&
          <DocumentSourceEdit schemaName={schemaName} id={documentId} lock={lock}/>}
        </Route>
        <Route path={`${match.path}/pseudo`}>
          {schemaName && documentId &&
          <DocumentPseudoEdit schemaName={schemaName} id={documentId} lock={lock}/>}
        </Route>
        <Route path={`${match.path}/info`}>
          {schemaName && documentId &&
          <DocumentInfo schemaName={schemaName} id={documentId}/>}
        </Route>
        <Route path={`${match.path}/connections`}>
          {schemaName && documentId &&
          <DocumentConnections schemaName={schemaName} id={documentId}/>}
        </Route>
        <Route path={match.path}>
          {schemaName && documentId &&
          <DocumentView schemaName={schemaName} id={documentId}/>}
        </Route>
      </Switch>
  );
};

export default DocumentRoutes;
