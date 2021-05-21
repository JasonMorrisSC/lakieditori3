import React, {useContext, useEffect, useRef, useState} from "react";
import {Button, Text} from "suomifi-ui-components";
import styled from '@emotion/styled'
import {Link, useHistory} from "react-router-dom";
import {parseXml, queryElements, queryFirstText, toString, getContents, getStatuteProps } from "../../../utils/xmlUtils";
import {useDocument} from "../useDocument";
import {ErrorPanel, Toolbar} from "../DocumentStyles";
import {suomifiDesignTokens as tokens} from "suomifi-design-tokens";
import StatuteElement from "../view/statute/StatuteElement";
import {useLineNumberAnnotations} from "./useLineNumberAnnotations";
import AceEditor from "react-ace";
import 'ace-builds'
import 'ace-builds/webpack-resolver'
import "ace-builds/src-noconflict/mode-xml";
import "ace-builds/src-noconflict/theme-eclipse";
import {useValidation} from "./useValidation";
import {useFormat} from "./useFormat";
import {AuthenticationContext} from "../../../App";
import ProposalElement from "../view/proposal/ProposalElement";
import Statements from '../../../utils/pseudo/Statements';

const Content = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: ${tokens.colors.whiteBase};
  border: 1px solid ${tokens.colors.depthLight13};
`;

const Source = styled.div`
  flex: 5;
  overflow: scroll;
`;

const Preview = styled.div`
  background-color: ${tokens.colors.highlightLight53};
  border-left: 1px solid ${tokens.colors.depthLight13};
  flex: 5;
  overflow: scroll;
`;

interface LineNumberElementId {
  lineNumber: number,
  elementId: string,
}

interface Props {
  schemaName: string,
  id: string,
  lock: null | string,
}

const DocumentPseudoEdit: React.FC<Props> = ({schemaName, id, lock}) => {
  const [user] = useContext(AuthenticationContext);
  const history = useHistory();
  const {document} = useDocument(schemaName, id);
  const {formattedDocument} = useFormat(document);
  const element = document.documentElement;
  const title = queryFirstText(element, "title");
  const [errorMessage, setErrorMessage] = useState("");

  const [editorValue, setEditorValue] = useState<string>(toString(document));

  // PseudoStatute conversion:
  const docText            = getContents(document);
  let   pseudoStatute      = getStatuteProps(document);
  const statementStructure = new Statements(docText).buildStructure();

  pseudoStatute = {
    ...pseudoStatute,
    statements: statementStructure
  };

  // For viewing the strucutre:
  const statements = JSON.stringify(pseudoStatute, null, 2)

  const previewElementRef = useRef<HTMLDivElement>(null);
  const {annotatedDocument} = useLineNumberAnnotations(editorValue);
  const {validationErrorMessage} = useValidation(schemaName, editorValue);

  useEffect(() => {
    setEditorValue(toString(formattedDocument ? formattedDocument : document));
  }, [document, formattedDocument]);

  useEffect(() => {
    setErrorMessage(validationErrorMessage);
  }, [validationErrorMessage]);

  useEffect(() => {
    if (annotatedDocument) {
      const newLineNumberMap: LineNumberElementId[] = [];

      queryElements(annotatedDocument, 'statute/chapter').forEach(chapter => {
        const chapterNumber = queryFirstText(chapter, "@number");
        queryElements(chapter, 'section').forEach(section => {
          const sectionNumber = queryFirstText(section, "@number");
          const sectionLineNumber = parseInt(queryFirstText(section, "@lineNumber"));

          newLineNumberMap.push({
            lineNumber: sectionLineNumber,
            elementId: `chapter-${chapterNumber}-section-${sectionNumber}`,
          });
        });
      });

      newLineNumberMap.sort((a, b) => {
        return a.lineNumber < b.lineNumber ? -1 : (a.lineNumber > b.lineNumber ? 1 : 0);
      });
    }
  }, [annotatedDocument]);

  return (
      <main>
        <Toolbar style={{zIndex: 5}}>
          <Text>
            <Link to={`/${schemaName}`}>Etusivu</Link>&nbsp;/&nbsp;
            <Link to={`/${schemaName}/${id}`}>{title}</Link>&nbsp;/&nbsp;
            PseudoCode
          </Text>
          <div>
            <Button.secondaryNoborder
                style={{marginRight: tokens.spacing.s, background: "none"}}
                icon={"close"}
                onClick={() => history.push(`/${schemaName}/${id}`)}>
              Sulje
            </Button.secondaryNoborder>
          </div>
          {errorMessage &&
          <ErrorPanel>
            XML dokumentissa on virhe:<br/>
            {errorMessage ? errorMessage : ''}<br/>
          </ErrorPanel>}
          {lock && (lock !== user.username) &&
          <ErrorPanel>
            Dokumentti on lukittu, sitä muokkaa käyttäjä:<br/>
            {lock}<br/>
          </ErrorPanel>}
        </Toolbar>

        <Content style={{height: "95vh"}}>
          <Source>
            <AceEditor
                mode="json"
                theme="eclipse"
                width={"100%"}
                height={"100%"}
                fontSize={14}
                wrapEnabled={true}
                readOnly={true}
                showPrintMargin={false}
                value={statements}
            />
          </Source>
          <Preview ref={previewElementRef}>
            <div style={{padding: tokens.spacing.l}}>
              {schemaName === "statute" &&
              <StatuteElement element={parseXml(editorValue).documentElement}/>}
              {schemaName === "proposal" &&
              <ProposalElement element={parseXml(editorValue).documentElement}/>}
            </div>
          </Preview>
        </Content>

      </main>
  );
};

export default DocumentPseudoEdit;
