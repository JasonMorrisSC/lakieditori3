export function cloneDocument(document: Document): Document {
  return document.cloneNode(true) as Document;
}

export function updateElement(document: Document, elementPath: string,
                              updateFunction: (el: Element) => void): Document {

  let element = queryFirstElement(document, null, elementPath);

  if (element) {
    updateFunction(element);
  } else {
    console.warn("Could not update, element not found with: " + elementPath);
  }

  return document;
}

export function ensureElementAndUpdate(
    document: Document, parentPath: string, elementName: string, beforeSibling: string[] | null,
    updateFunction: (el: Element) => void = (el) => null): Document {
  let element = queryFirstElement(document, null, parentPath + "/" + elementName);

  if (element) {
    updateFunction(element);
    return document;
  }

  let parentNode = queryFirstNode(document, null, parentPath);

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

export function queryFirstNode(document: Document, context: Node | null, xPathExpression: string): Node | null {
  return document.evaluate(
      xPathExpression, context ? context : document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null).singleNodeValue;
}

export function queryFirstText(document: Document, context: Node | null, xPathExpression: string): string {
  return queryFirstNode(document, context, xPathExpression)?.textContent || '';
}

export function queryFirstElement(document: Document, context: Node | null, xPathExpression: string): Element | null {
  let node = queryFirstNode(document, context, xPathExpression);

  if (node === null) {
    return null;
  }

  if (node.nodeType === Node.ELEMENT_NODE) {
    return node as Element;
  } else {
    throw new Error("Unexpected node type: " + node);
  }
}

export function queryNodes(document: Document, context: Node | null, xPathExpression: string): Node[] {
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

export function queryElements(document: Document, context: Node | null, xPathExpression: string): Element[] {
  let nodes = queryNodes(document, context, xPathExpression);

  nodes.forEach(node => {
    if (node.nodeType !== Node.ELEMENT_NODE) {
      throw new Error("Unexpected node type: " + node);
    }
  });

  return nodes as Element[];
}

export function countNodes(document: Document, xPathExpression: string): number {
  return document.evaluate('count(' + xPathExpression + ')', document, null, XPathResult.NUMBER_TYPE, null).numberValue
}

export function toElementsArr(nodes: NodeListOf<Node>, predicate: (v: Element) => boolean = (x: Element) => true): Element[] {
  const result = new Array<Element>();

  nodes.forEach(child => {
    if (child.nodeType === Node.ELEMENT_NODE && predicate(child as Element)) {
      result.push(child as Element);
    }
  });

  return result;
}

export function firstChildByTagName(element: Element, tagName: string): Element | undefined {
  return firstChild(element, e => e.localName === tagName);
}

export function firstChild(element: Element, predicate: (v: Element) => boolean = (x: Element) => true): Element | undefined {
  for (let i = 0, length = element.children.length; i < length; i++) {
    if (predicate(element.children[i])) {
      return element.children[i]
    }
  }
}
