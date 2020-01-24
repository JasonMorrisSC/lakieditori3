import React, {Dispatch, SetStateAction, SyntheticEvent, useState} from "react";
import Layout from "../components/Layout";
import {exampleDocument} from "./example-document";
import {suomifiDesignTokens as sdt} from "suomifi-design-tokens";
import {Prism} from "react-syntax-highlighter";

const TwoWayBindTest2: React.FC = () => {
  const [document, updateDocument] = useState<Document>(
      new DOMParser().parseFromString(exampleDocument(), "text/xml"));

  return <Layout title="Testi 2">
    <DocEditor document={document}
               currentElement={document.documentElement}
               currentPath={"/document"}
               updateDocument={updateDocument}/>

    <Prism language="xml" customStyle={{
      background: 'none',
      fontSize: sdt.values.typography.bodyTextSmall.fontSize.value,
      marginTop: 100,
      padding: 0
    }}>
      {new XMLSerializer().serializeToString(document)}
    </Prism>
  </Layout>;
};

interface DocumentEditorProperties {
  document: Document,
  currentElement: Element,
  currentPath: string,
  updateDocument: Dispatch<SetStateAction<Document>>
}

/*
 * Document editor
 */

const DocEditor: React.FC<DocumentEditorProperties> = ({document, currentElement, currentPath, updateDocument}) => {

  function updateTitle(e: SyntheticEvent<HTMLInputElement>) {
    const newTitle = e.currentTarget.value;

    updateDocument((prevDocument) => {
      return cloneDocumentAndUpdateText(prevDocument, currentPath + "/title", newTitle);
    });
  }

  let number = queryFirstText(document, "@number", currentElement);
  let title = queryFirstText(document, "title", currentElement);

  return <div>
    <h1>{number}<br/>{title}</h1>

    <input type="text" value={title} onChange={updateTitle}/>

    {queryElements(document, "chapter", currentElement).map((chapter, i) => {
      return <div key={i}>
        <ChapterEditor document={document}
                       currentElement={chapter}
                       currentPath={currentPath + "/chapter[" + (i + 1) + "]"}
                       updateDocument={updateDocument}/>
      </div>
    })}
  </div>;
};

/*
 * Chapter editor
 */

const ChapterEditor: React.FC<DocumentEditorProperties> = ({document, currentElement, currentPath, updateDocument}) => {

  function updateTitle(e: SyntheticEvent<HTMLInputElement>) {
    const newTitle = e.currentTarget.value;

    updateDocument((prevDocument) => {
      return cloneDocumentAndUpdateText(prevDocument, currentPath + "/title", newTitle);
    });
  }

  let number = queryFirstText(document, "@number", currentElement);
  let title = queryFirstText(document, "title", currentElement);

  return <div>
    <h2>luku {number} - {title}</h2>
    <input type="text" value={title} onChange={updateTitle}/>
  </div>;
};

/*
 * utils
 */

function cloneDocument(document: Document): Document {
  return document.cloneNode(true) as Document;
}

function cloneDocumentAndUpdateText(document: Document, xPathExpression: string, text: string): Document {
  let documentCopy = cloneDocument(document);

  let node = queryFirstNode(documentCopy, xPathExpression);

  if (node) {
    node.textContent = text;
  } else {
    console.warn("Node not found with: " + xPathExpression);
  }

  return documentCopy;
}

function queryFirstNode(document: Document, xPathExpression: string, context?: Node | null): Node | null {
  return document.evaluate(
      xPathExpression, context ? context : document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null).singleNodeValue;
}

/*
function queryFirstElement(document: Document, xPathExpression: string, context?: Node | null): Element | null {
  let node = queryFirstNode(document, xPathExpression, context);

  if (node === null) {
    return null;
  }

  if (node.nodeType === Node.ELEMENT_NODE) {
    return node as Element;
  } else {
    throw new Error("Unexpected node type: " + node);
  }
}
*/

function queryFirstText(document: Document, xPathExpression: string, context?: Node | null): string {
  return queryFirstNode(document, xPathExpression, context)?.textContent || '';
}

function queryNodes(document: Document, xPathExpression: string, context?: Node | null): Node[] {
  let results: Node[] = [];
  let nodeIterator = document.evaluate(
      xPathExpression, context ? context : document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);

  let thisNode = nodeIterator.iterateNext();
  while (thisNode) {
    results.push(thisNode);
    thisNode = nodeIterator.iterateNext();
  }

  return results;
}

function queryElements(document: Document, xPathExpression: string, context?: Node | null): Element[] {
  let nodes = queryNodes(document, xPathExpression, context);

  nodes.forEach(node => {
    if (node.nodeType !== Node.ELEMENT_NODE) {
      throw new Error("Unexpected node type: " + node);
    }
  });

  return nodes as Element[];
}

export default TwoWayBindTest2;
