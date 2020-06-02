/** @jsx jsx */
import {jsx} from '@emotion/core'
import React from "react";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/theme/eclipse.css";
import "codemirror/mode/xml/xml";
import {queryFirstText} from "../../../utils/xmlUtils";
import {useDocument} from "../useDocument";
import {FlexRowPlain} from "../../common/StyledComponents";
import {suomifiDesignTokens as tokens} from "suomifi-design-tokens";
import TableOfContents from "../view/TableOfContents";
import StatuteElementEdit from "./elements/StatuteElementEdit";
import DocumentEditToolbar from "./DocumentEditToolbar";
import Concepts from "../view/Concepts";

interface Props {
  id: string,
  lock: null | string,
}

const DocumentEdit: React.FC<Props> = ({id, lock}) => {
  const {document, setDocument, saveDocument} = useDocument(id);

  const element = document.documentElement;
  const title = queryFirstText(element, "title");

  return (
      <main>
        <DocumentEditToolbar id={id} title={title} lock={lock}
                             saveDocument={() => saveDocument(document)}/>

        <FlexRowPlain style={{
          backgroundColor: tokens.colors.whiteBase,
          border: `1px solid ${tokens.colors.depthLight13}`,
        }}>

          <div style={{
            flex: 2,
            background: tokens.colors.highlightLight53,
            padding: `${tokens.spacing.xl} ${tokens.spacing.l}`
          }}>
            <TableOfContents document={document}/>
          </div>

          <div style={{
            flex: 8,
            padding: tokens.spacing.xl
          }}>
            <StatuteElementEdit document={document} setDocument={setDocument}
                                currentPath={"/statute"} currentElement={element}/>
          </div>

          <div style={{
            flex: 2,
            borderLeft: `1px solid ${tokens.colors.depthLight26}`,
            padding: `${tokens.spacing.xl} ${tokens.spacing.l}`
          }}>
            <Concepts document={document}/>
          </div>

        </FlexRowPlain>
      </main>
  );
};

export default DocumentEdit;
