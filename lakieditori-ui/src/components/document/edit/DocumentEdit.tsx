import React, {useState} from "react";
import {queryFirstText} from "../../../utils/xmlUtils";
import {useDocument} from "../useDocument";
import {FlexRowPlain} from "../../common/StyledComponents";
import {suomifiDesignTokens as tokens} from "suomifi-design-tokens";
import StatuteTableOfContents from "../view/statute/StatuteTableOfContents";
import StatuteElementEdit from "./statute/StatuteElementEdit";
import DocumentEditToolbar from "./DocumentEditToolbar";
import Concepts from "../view/Concepts";
import {useDocumentProperties} from "../useDocumentProperties";
import ProposalElementEdit from "./proposal/ProposalElementEdit";
import ProposalTableOfContents from "../view/proposal/ProposalTableOfContents";
import {useDocumentComments} from "../useDocumentComments";

interface Props {
  schemaName: string,
  id: string,
  lock: null | string,
}

const DocumentEdit: React.FC<Props> = ({schemaName, id, lock}) => {
  const {document, setDocument, saveDocument} = useDocument(schemaName, id);
  const {properties: documentProperties} = useDocumentProperties(schemaName, id);
  const {comments: documentComments, setComments: setDocumentComments, saveComments: saveDocumentComments} = useDocumentComments(schemaName, id);
  const [showComments, setShowComments] = useState(true);

  const element = document.documentElement;
  const title = queryFirstText(element, "title");

  return (
      <main>
        <DocumentEditToolbar schemaName={schemaName} id={id} title={title} lock={lock}
                             saveDocument={() => saveDocument(document).then(() => saveDocumentComments(documentComments))}
                             showComments={showComments} setShowComments={setShowComments}/>

        <FlexRowPlain style={{
          backgroundColor: tokens.colors.whiteBase,
          border: `1px solid ${tokens.colors.depthLight13}`,
        }}>

          <div style={{
            flex: 2,
            background: tokens.colors.highlightLight53,
            padding: `${tokens.spacing.xl} ${tokens.spacing.l}`
          }}>
            {schemaName === "statute" &&
            <StatuteTableOfContents document={document}/>}
            {schemaName === "proposal" &&
            <ProposalTableOfContents document={document}/>}
          </div>

          <div style={{
            flex: showComments ? 10 : 8,
            padding: showComments ? `${tokens.spacing.xl} ${tokens.spacing.l}` : tokens.spacing.xl
          }}>
            {schemaName === "statute" &&
            <StatuteElementEdit
                document={document}
                setDocument={setDocument}
                documentProperties={documentProperties}
                documentComments={documentComments}
                setDocumentComments={setDocumentComments}
                currentPath={"/statute"}
                currentElement={element}
                showComments={showComments}/>}
            {schemaName === "proposal" &&
            <ProposalElementEdit
                document={document}
                setDocument={setDocument}
                documentProperties={documentProperties}
                currentPath={"/proposal"}
                currentElement={element}/>}
          </div>

          {!showComments &&
          <div style={{
            flex: 2,
            borderLeft: `1px solid ${tokens.colors.depthLight26}`,
            padding: `${tokens.spacing.xl} ${tokens.spacing.l}`
          }}>
            <Concepts document={document}/>
          </div>}

        </FlexRowPlain>
      </main>
  );
};

export default DocumentEdit;
