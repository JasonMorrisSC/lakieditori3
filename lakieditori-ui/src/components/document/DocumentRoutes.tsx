import React from "react";
import {Route, Switch, useParams, useRouteMatch} from "react-router-dom";
import DocumentView from "./view/DocumentView";
import DocumentInfo from "./info/DocumentInfo";

const DocumentRoutes: React.FC = () => {
  const match = useRouteMatch();
  const {documentId} = useParams();

  return (
      <Switch>
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
