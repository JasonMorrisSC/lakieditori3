import React, {useEffect, useRef, useState} from "react";
import {Button, Text} from "suomifi-ui-components";
import styled from '@emotion/styled'
import {Link, useHistory} from "react-router-dom";
import axios, {AxiosResponse} from "axios";
import {UnControlled as CodeMirror} from 'react-codemirror2';
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/theme/eclipse.css";
import "codemirror/mode/xml/xml";
import {parseXml, queryElements, queryFirstText} from "../../../utils/xmlUtils";
import "./DocumentEditSource.css";
import {useDocument} from "../useDocument";
import {ErrorPanel, Toolbar} from "../DocumentStyles";
import {suomifiDesignTokens as tokens} from "suomifi-design-tokens";
import DocumentElement from "../view/elements/DocumentElement";
import {useLineNumberAnnotations} from "./useLineNumberAnnotations";

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: ${tokens.colors.whiteBase};
  border: 1px solid ${tokens.colors.depthLight13};
`;

const Source = styled.div`
  flex: 4;
  overflow: scroll;
`;

const Preview = styled.div`
  background-color: ${tokens.colors.highlightLight53};
  border-left: 1px solid ${tokens.colors.depthLight13};
  flex: 2;
  overflow: scroll;
  padding: ${tokens.spacing.l};
`;

interface Props {
  id: string;
}

interface LineNumberElementId {
  lineNumber: number,
  elementId: string,
}

const DocumentEditSource: React.FC<Props> = ({id}) => {
  const history = useHistory();

  const {document} = useDocument(id);
  const element = document.documentElement;
  const title = queryFirstText(element, "title");

  const [editorValue, setEditorValue] = useState<string>(new XMLSerializer().serializeToString(document));
  const previewElementRef = useRef<HTMLDivElement>(null);
  const [lineNumberMap, setLineNumberMap] = useState<LineNumberElementId[]>([]);
  const {annotatedDocument} = useLineNumberAnnotations(editorValue);

  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if (annotatedDocument) {
      const newLineNumberMap: LineNumberElementId[] = [];

      queryElements(annotatedDocument, 'document/chapter').forEach(chapter => {
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

      setLineNumberMap(newLineNumberMap);
    }
  }, [annotatedDocument]);

  const scrollPreviewToLine = (lineNumber: number) => {
    console.log("scroll to ", lineNumber);

    let elementId;

    for (let i = 0; i < lineNumberMap.length - 1; i++) {
      const curr = lineNumberMap[i];
      const next = lineNumberMap[i + 1];

      if (lineNumber >= curr.lineNumber && lineNumber < next.lineNumber) {
        elementId = curr.elementId;
        break;
      }
    }

    const elementToScroll = window.document.getElementById(elementId || '');

    if (previewElementRef.current && elementToScroll) {
      previewElementRef.current.scrollTop = elementToScroll.offsetTop - previewElementRef.current.offsetTop - 32;
    }
  };

  function validateDocument(data: string): Promise<AxiosResponse> {
    return axios.post('/api/validate', data, {
      headers: {'Content-Type': 'text/xml'}
    });
  }

  function saveAndClose() {
    validateDocument(editorValue).then(() => {
      // updateDocument(new DOMParser().parseFromString(editorData, 'text/xml'));
      history.push(`/documents/${id}/edit`);
    }).catch((error) => {
      setErrorMessage(error.response.data.message);
    });
  }

  return (
      <main>
        <Toolbar>
          <Text>
            <Link to={"/documents"}>Etusivu</Link> / <Link
              to={`/documents/${id}`}>{title}</Link> / <Link
              to={`/documents/${id}/edit`}>Muokkaa</Link> / XML
          </Text>
          <Button
              icon={"save"}
              onClick={saveAndClose}>
            Tallenna
          </Button>
        </Toolbar>

        {errorMessage &&
        <ErrorPanel>
          XML dokumentissa on virhe:<br/>
          {errorMessage ? errorMessage : ''}<br/>
        </ErrorPanel>}

        <Row style={{height: "95vh"}}>
          <Source>
            <CodeMirror
                value={new XMLSerializer().serializeToString(document)}
                options={{
                  mode: 'xml',
                  theme: 'eclipse',
                  lineNumbers: true,
                  lineWrapping: true
                }}
                autoCursor={false}
                onChange={(editor, data, value) => {
                  setEditorValue(value);
                  scrollPreviewToLine(data.from.line);
                }}
                onCursor={((editor, data) => scrollPreviewToLine(data.line))}
            />
          </Source>
          <Preview ref={previewElementRef}>
            <DocumentElement element={parseXml(editorValue).documentElement}/>
          </Preview>
        </Row>

      </main>
  );
};

export default DocumentEditSource;
