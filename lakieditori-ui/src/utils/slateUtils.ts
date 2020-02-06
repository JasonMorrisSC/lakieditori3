import {Node as SlateNode} from 'slate'
import {jsx} from 'slate-hyperscript'

const ELEMENT_TAGS: { [key: string]: (e: Element) => Object; } = {
  'a': el => ({type: 'link', url: el.getAttribute('href')}),
};

const TEXT_TAGS: { [key: string]: (e: Element) => Object; } = {
  'em': () => ({italic: true}),
  'strong': () => ({bold: true}),
};

export const deserialize = (el: Node): SlateNode[] | null => {
  if (el.nodeType === Node.TEXT_NODE || el.nodeType !== Node.ELEMENT_NODE) {
    return [jsx('text', {text: el.textContent?.replace(/\s+/g, ' ').trimLeft() || ''})];
  }

  const {nodeName} = el;

  const children = Array.from(el.childNodes)
  .map(deserialize)
  .flat();

  if (ELEMENT_TAGS[nodeName]) {
    const attrs = ELEMENT_TAGS[nodeName](el as Element);
    return [jsx('element', attrs, children)];
  }

  if (TEXT_TAGS[nodeName]) {
    const attrs = TEXT_TAGS[nodeName](el as Element);
    return children.map(child => jsx('text', attrs, child));
  }

  return jsx('fragment', {}, children);
};
