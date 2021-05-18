export function cloneDocument(document: Document): Document {
  return document.cloneNode(true) as Document;
}

export function parseXml(xmlString: string): Document {
  return new DOMParser().parseFromString(xmlString, "text/xml");
}

export function toString(xmlDocument: Node): string {
  return new XMLSerializer().serializeToString(xmlDocument);
}

export function updateElement(document: Document, elementPath: string,
                              updateFunction: (el: Element) => void): Document {

  let element = queryFirstElement(document, elementPath);

  if (element) {
    updateFunction(element);
  } else {
    console.warn("Could not update, element not found with: " + elementPath);
  }

  return document;
}

export function ensureElementAndUpdate(
    document: Document, parentPath: string, elementName: string, beforeSibling: string[] | null,
    updateFunction: (el: Element) => void = () => null): Document {
  let element = queryFirstElement(document, parentPath + "/" + elementName);

  if (element) {
    updateFunction(element);
    return document;
  }

  let parentNode = queryFirstNode(document, parentPath);

  if (parentNode) {
    const newChild = document.createElement(elementName);

    let sibling = null;

    if (beforeSibling) {
      for (let i = 0; i < parentNode.childNodes.length; i++) {
        let childNode = parentNode.childNodes[i];
        if (beforeSibling.find(siblingName => siblingName === childNode.nodeName)) {
          sibling = childNode;
          break;
        }
      }
    }

    updateFunction(parentNode.insertBefore(newChild, sibling))
  } else {
    console.warn("Could not create and update child element, parent node not found with: " + parentPath);
  }

  return document;
}

export function queryFirstNode(context: Node, xPathExpression: string): Node | null {
  return new XPathEvaluator().evaluate(
      xPathExpression, context, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null).singleNodeValue;
}

export function queryFirstText(context: Node, xPathExpression: string): string {
  return queryFirstNode(context, xPathExpression)?.textContent || '';
}

export function queryFirstElement(context: Node, xPathExpression: string): Element | null {
  let node = queryFirstNode(context, xPathExpression);

  if (node === null) {
    return null;
  }

  if (node.nodeType === Node.ELEMENT_NODE) {
    return node as Element;
  } else {
    throw new Error("Unexpected node type: " + node);
  }
}

export function queryNodes(context: Node, xPathExpression: string): Node[] {
  let results: Node[] = [];
  let nodeIterator = new XPathEvaluator().evaluate(
      xPathExpression, context, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);

  let thisNode = nodeIterator.iterateNext();
  while (thisNode) {
    results.push(thisNode);
    thisNode = nodeIterator.iterateNext();
  }

  return results;
}

export function queryElements(context: Node, xPathExpression: string): Element[] {
  let nodes = queryNodes(context, xPathExpression);

  nodes.forEach(node => {
    if (node.nodeType !== Node.ELEMENT_NODE) {
      throw new Error("Unexpected node type: " + node);
    }
  });

  return nodes as Element[];
}

export function queryTexts(context: Node, xPathExpression: string): string[] {
  return queryNodes(context, xPathExpression).map(n => n.textContent || "");
}

export function countNodes(context: Node, xPathExpression: string): number {
  return new XPathEvaluator().evaluate(
      'count(' + xPathExpression + ')', context, null, XPathResult.NUMBER_TYPE, null).numberValue
}

export function childElements(node: Node): Element[] {
  return Array.from(node.childNodes)
  .filter(n => n.nodeType === Node.ELEMENT_NODE)
  .map(n => n as Element);
}

// use the following with pseudocode editor

export const getStatuteProps = (doc: Document): object => {
  const statute = Array.from(doc.getElementsByTagName('statute'))[0];
  // const title   = Array.from(doc.getElementsByTagName('title'))[0].textContent;
  return statute ? {
    id: statute.getAttribute('id'),
    number: statute.getAttribute('number'),
    title: '',
    created: statute.getAttribute('createdDate'),
    modified: statute.getAttribute('lastModifiedDate'),
  } : {};
}

export const getContents = (doc: Document): string =>
  Array.from(doc.getElementsByTagName("content"))
       .map(each => each.textContent)
       .join('\n') || '!!unable to get <content>!!';