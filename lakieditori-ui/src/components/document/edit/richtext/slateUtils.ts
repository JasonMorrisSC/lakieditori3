import {Editor, Location, Node as SlateNode, NodeEntry, Range, Text, Transforms} from "slate";
import {jsx} from "slate-hyperscript";
import escapeHtml from "escape-html";
import {isBlank} from "../../../../utils/stringUtils";
import {Concept} from "./useTextConcepts";

export function deserialize(el: Node): SlateNode[] | null {
  if (el.nodeType === Node.TEXT_NODE || el.nodeType !== Node.ELEMENT_NODE) {
    const textContent = el.textContent?.replace(/\s+/g, ' ') || '';

    if (!isBlank(textContent)) {
      return [jsx('text', {text: textContent})];
    }
  }

  const {nodeName} = el;

  const children = Array.from(el.childNodes)
  .map(deserialize)
  .flat();

  if (nodeName === 'a' && children.length > 0) {
    return [jsx('element', {type: 'link', url: (el as Element).getAttribute('href')}, children)];
  }
  if (nodeName === 'p' && children.length > 0) {
    return [jsx('element', {type: 'paragraph'}, children)];
  }
  if (nodeName === 'strong') {
    return children.map(child => jsx('text', {bold: true}, child));
  }
  if (nodeName === 'em') {
    return children.map(child => jsx('text', {italic: true}, child));
  }

  return jsx('fragment', {}, children);
}

export function serialize(node: SlateNode): string {
  if (Text.isText(node)) {
    let text = escapeHtml(node.text);

    if (node.bold) {
      text = `<strong>${text}</strong>`
    }

    if (node.italic) {
      text = `<em>${text}</em>`
    }

    return text;
  }

  const children = node.children.map(n => serialize(n)).join('');

  if (node.type === 'link' && children.length > 0) {
    return `<a href="${encodeURI(node.url)}">${children}</a>`;
  }
  if (node.type === 'paragraph' && children.length > 0) {
    return `<p>${children}</p>`;
  }

  return children;
}

export function isMarkActive(editor: Editor, format: string) {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
}

export function toggleMark(editor: Editor, format: string) {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
}

export function isFormatActive(editor: Editor, format: string) {
  const [match] = Array.from(Editor.nodes(editor, {
    match: n => n[format] === true,
    mode: 'all',
  }));
  return !!match;
}

export function toggleFormat(editor: Editor, format: string, at?: Location) {
  const isActive = isFormatActive(editor, format);
  Transforms.setNodes(
      editor,
      {[format]: isActive ? null : true},
      {at, match: Text.isText, split: true}
  )
}

export function isLinkActive(editor: Editor) {
  const [link] = Array.from(Editor.nodes(editor, {
    match: n => n.type === 'link'
  }));
  return !!link
}

export function insertLink(editor: Editor, url: string, text?: string) {
  if (editor.selection) {
    wrapLink(editor, url, text);
  }
}

export function wrapLink(editor: Editor, url: string, text?: string) {
  if (isLinkActive(editor)) {
    unwrapLink(editor)
  }

  const {selection} = editor;
  const isCollapsed = selection && Range.isCollapsed(selection);
  const link = {
    type: 'link',
    url: url,
    children: isCollapsed ? [{text: text || url}] : [],
  };

  if (isCollapsed) {
    Transforms.insertNodes(editor, link);
  } else {
    Transforms.wrapNodes(editor, link, {split: true});
    Transforms.collapse(editor, {edge: 'end'});
  }
}

export function unwrapLink(editor: Editor) {
  Transforms.unwrapNodes(editor, {match: n => n.type === 'link'});
}

export function selectionOrEnd(editor: Editor): Location {
  return editor.selection || [0];
}

export function selectionOrWord(editor: Editor): null | Range {
  const {selection} = editor;
  return selection && Range.isCollapsed(selection) ? {
    anchor: Editor.before(editor, selection, {unit: "word"}) || selection.anchor,
    focus: Editor.after(editor, selection, {unit: "word"}) || selection.focus
  } : selection;
}

export function highlightConceptMatches(
    findConcept: (word: string) => Concept | undefined,
    importantConceptPredicate: (uri: string) => boolean, [node, path]: NodeEntry): Range[] {

  const ranges: Range[] = [];

  if (Text.isText(node)) {
    const {text} = node;

    const words = text.split(/[\s.,!?(){}#]/);
    let offset = 0;

    words.forEach((word, i) => {
      const concept = findConcept(word);

      if (concept) {
        ranges.push({
          anchor: {path, offset: offset + word.length},
          focus: {path, offset},
          highlight: !importantConceptPredicate(concept.uri),
          important: importantConceptPredicate(concept.uri)
        })
      }
      offset = offset + word.length + 1;
    })
  }

  return ranges;
}
