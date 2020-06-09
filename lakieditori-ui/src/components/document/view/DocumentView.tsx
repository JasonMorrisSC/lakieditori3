import React from "react";
import {suomifiDesignTokens as tokens} from "suomifi-ui-components";
import {queryFirstText} from "../../../utils/xmlUtils";
import {FlexRowPlain} from "../../common/StyledComponents";
import TableOfContents from "./TableOfContents";
import Concepts from "./Concepts";
import {useDocument} from "../useDocument";
import DocumentViewToolbar from "./DocumentViewToolbar";
import StatuteElement from "./statute/StatuteElement";
import ProposalElement from "./proposal/ProposalElement";

interface Props {
  schemaName: string,
  id: string
}

const DocumentView: React.FC<Props> = ({schemaName, id}) => {
  const {document} = useDocument(schemaName, id);

  const element = document.documentElement;
  const title = queryFirstText(element, "title");

  return (
      <main>
        <DocumentViewToolbar schemaName={schemaName} id={id} title={title}/>

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
            {schemaName === "statute" &&
            <StatuteElement element={element}/>}
            {schemaName === "proposal" &&
            <ProposalElement element={element}/>}
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
