import {Editor, Node as SlateNode, Range, Text, Transforms} from "slate";
import {jsx} from "slate-hyperscript";
import escapeHtml from "escape-html";

export function deserialize(el: Node): SlateNode[] | null {
  if (el.nodeType === Node.TEXT_NODE || el.nodeType !== Node.ELEMENT_NODE) {
    return [jsx('text', {text: el.textContent?.replace(/\s+/g, ' ') || ''})];
  }

  const {nodeName} = el;

  const children = Array.from(el.childNodes)
  .map(deserialize)
  .flat();

  if (nodeName === 'a') {
    return [jsx('element', {type: 'link', url: (el as Element).getAttribute('href')}, children)];
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

  if (node.type === 'link') {
    return `<a href="${encodeURI(node.url)}">${children}</a>`;
  }

  return children;
}

export function isFormatActive(editor: Editor, format: string) {
  const [match] = Array.from(Editor.nodes(editor, {
    match: n => n[format] === true,
    mode: 'all',
  }));
  return !!match;
}

export function toggleFormat(editor: Editor, format: string) {
  const isActive = isFormatActive(editor, format);
  Transforms.setNodes(
      editor,
      {[format]: isActive ? null : true},
      {match: Text.isText, split: true}
  )
}

export function isLinkActive(editor: Editor) {
  const [link] = Array.from(Editor.nodes(editor, {
    match: n => n.type === 'link'
  }));
  return !!link
}

export function insertLink(editor: Editor, url: string | null) {
  if (editor.selection) {
    if (url) {
      wrapLink(editor, url);
    } else {
      unwrapLink(editor);
    }
  }
}

export function wrapLink(editor: Editor, url: string) {
  if (isLinkActive(editor)) {
    unwrapLink(editor)
  }

  const {selection} = editor;
  const isCollapsed = selection && Range.isCollapsed(selection);
  const link = {
    type: 'link',
    url,
    children: isCollapsed ? [{text: url}] : [],
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
