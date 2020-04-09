import React from "react";
import {suomifiDesignTokens as tokens} from "suomifi-ui-components";
import {queryFirstText} from "../../../utils/xmlUtils";
import {FlexRowPlain} from "../../common/StyledComponents";
import TableOfContents from "./TableOfContents";
import Concepts from "./Concepts";
import {useDocument} from "../useDocument";
import DocumentViewToolbar from "./DocumentViewToolbar";
import DocumentElement from "./elements/DocumentElement";

interface DocumentViewProps {
  id: string
}

const DocumentView: React.FC<DocumentViewProps> = ({id}) => {
  const {document} = useDocument(id);

  const element = document.documentElement;
  const title = queryFirstText(element, "title");

  return (
      <main>
        <DocumentViewToolbar id={id} title={title}/>

        <FlexRowPlain style={{
          backgroundColor: tokens.colors.whiteBase,
          border: `1px solid ${tokens.colors.depthLight13}`,
        }}>

          <div style={{
            flex: 3,
            background: tokens.colors.highlightLight53,
            padding: `${tokens.spacing.xl} ${tokens.spacing.l}`
          }}>
            <TableOfContents document={document}/>
          </div>

          <div style={{
            flex: 7,
            padding: tokens.spacing.xl
          }}>
            <DocumentElement element={element}/>
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

export default DocumentView;
