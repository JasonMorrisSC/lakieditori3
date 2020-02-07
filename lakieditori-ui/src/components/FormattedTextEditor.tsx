import React, {CSSProperties, useEffect, useMemo, useRef, useState} from "react";
import {createEditor, Editor, Node as SlateNode, Range, Text, Transforms} from 'slate'
import {
  Editable,
  ReactEditor,
  RenderElementProps,
  RenderLeafProps,
  Slate,
  useSlate,
  withReact
} from 'slate-react'
import {css} from "emotion";
import {suomifiDesignTokens as sdt} from "suomifi-design-tokens";
import {withHistory} from "slate-history";
import escapeHtml from "escape-html";
import {jsx} from "slate-hyperscript";
import {Button, Icon, Menu, Portal} from "./ToolbarComponents";

const initialEmptyValue = [{children: [{text: ''}]}];

const FormattedTextEditor: React.FC<Props> = ({value, onChange = () => null, placeholder, style}) => {
  const [editorValue, setEditorValue] = useState<SlateNode[]>(initialEmptyValue);
  const editor = useMemo(() => withInlineLinks(withReact(withHistory(createEditor()))), []);

  // Set real initial editor value from properties after it is available
  useEffect(() => {
    if (value && editorValue === initialEmptyValue) {
      let initialValue = deserialize(value);
      if (initialValue && initialValue.length > 0) {
        setEditorValue([{children: initialValue}]);
      }
    }
  }, [value, editorValue]);

  // Remove 'onChange' when editor is unmounted to avoid errors when this component is unmounted.
  useEffect(() => {
    return () => {
      editor.onChange = () => null
    };
  }, [editor]);

  return <Slate
      editor={editor}
      value={editorValue}
      onChange={nodes => {
        const xmlValue = serialize({children: nodes});
        onChange(xmlValue);
        setEditorValue(nodes);
      }}>
    <HoveringToolbar/>
    <Editable
        renderElement={props => <EditorElement {...props} />}
        renderLeaf={props => <EditorLeaf {...props} />}
        placeholder={placeholder || ''}
        style={style}
        onKeyDown={event => {
          if (event.keyCode === 13 /* enter */) {
            event.preventDefault();
          }
        }}
        onDOMBeforeInput={event => {
          switch ((event as InputEvent).inputType) {
            case 'formatBold':
              return toggleFormat(editor, 'bold');
            case 'formatItalic':
              return toggleFormat(editor, 'italic');
          }
        }}
    />
  </Slate>;
};

interface Props {
  value: Element | null,
  placeholder?: string,
  onChange?: (newValue: string) => void,
  style?: CSSProperties
}

const deserialize = (el: Node): SlateNode[] | null => {
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
};

const serialize = (node: SlateNode): string => {
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
};

const withInlineLinks = (editor: ReactEditor): ReactEditor => {
  const {isInline} = editor;

  editor.isInline = element => {
    return element.type === 'link' ? true : isInline(element);
  };

  return editor
};

const isFormatActive = (editor: Editor, format: string) => {
  const [match] = Array.from(Editor.nodes(editor, {
    match: n => n[format] === true,
    mode: 'all',
  }));
  return !!match;
};

const toggleFormat = (editor: Editor, format: string) => {
  const isActive = isFormatActive(editor, format);
  Transforms.setNodes(
      editor,
      {[format]: isActive ? null : true},
      {match: Text.isText, split: true}
  )
};

const isLinkActive = (editor: Editor) => {
  const [link] = Array.from(Editor.nodes(editor, {
    match: n => n.type === 'link'
  }));
  return !!link
};

const insertLink = (editor: Editor, url: string | null) => {
  if (editor.selection) {
    if (url) {
      wrapLink(editor, url);
    } else {
      unwrapLink(editor);
    }
  }
};

const wrapLink = (editor: Editor, url: string) => {
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
};

const unwrapLink = (editor: Editor) => {
  Transforms.unwrapNodes(editor, {match: n => n.type === 'link'});
};

const EditorElement = ({attributes, children, element}: RenderElementProps) => {
  if (element.type === 'link') {
    return <a {...attributes} href={element.url} style={{
      color: sdt.colors.highlightBase,
      textDecoration: "none"
    }}>{children}</a>;
  } else {
    return <div {...attributes}>{children}</div>
  }
};

const EditorLeaf = ({attributes, children, leaf}: RenderLeafProps) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>
  }
  if (leaf.italic) {
    children = <em>{children}</em>
  }
  return <span {...attributes}>{children}</span>
};

const HoveringToolbar = () => {
  const ref = useRef<HTMLDivElement>();
  const editor = useSlate();

  useEffect(() => {
    const el = ref.current;
    const {selection} = editor;

    if (!el) {
      return;
    }

    if (!selection ||
        !ReactEditor.isFocused(editor) ||
        Range.isCollapsed(selection) ||
        Editor.string(editor, selection) === '') {
      el.removeAttribute('style');
      return;
    }

    const domSelection = window.getSelection();

    if (!domSelection || !domSelection.rangeCount) {
      return;
    }

    const domRange = domSelection.getRangeAt(0);
    const rect = domRange.getBoundingClientRect();

    if (rect) {
      el.style.opacity = '1';
      el.style.top = `${rect.top + window.pageYOffset - el.offsetHeight}px`;
      el.style.left = `${rect.left + window.pageXOffset - el.offsetWidth / 2 + rect.width / 2}px`;
    }
  });

  return (
      <Portal>
        <Menu
            ref={ref}
            className={css`
          padding: 8px 7px 6px;
          position: absolute;
          z-index: 1;
          top: -10000px;
          left: -10000px;
          margin-top: -6px;
          opacity: 0;
          background-color: #333;
          border-radius: 4px;
          transition: opacity 0.75s;
        `}
        >
          <FormatButton format="bold" icon="format_bold"/>
          <FormatButton format="italic" icon="format_italic"/>
          <LinkButton/>
        </Menu>
      </Portal>
  )
};

const FormatButton = ({format, icon}: FormatButtonProps) => {
  const editor = useSlate();
  return (
      <Button
          active={isFormatActive(editor, format)}
          onMouseDown={event => {
            event.preventDefault();
            toggleFormat(editor, format);
          }}>
        <Icon>{icon}</Icon>
      </Button>
  );
};

const LinkButton = () => {
  const editor = useSlate();
  return (
      <Button
          active={isLinkActive(editor)}
          onMouseDown={event => {
            event.preventDefault();
            if (!isLinkActive(editor)) {
              insertLink(editor, window.prompt('Enter the URL of the link:'));
            } else {
              const [link] = Array.from(Editor.nodes(editor, {
                match: n => n.type === 'link'
              }));
              const oldUrl = link[0].url;
              const newUrl = window.prompt('Enter the URL of the link:', oldUrl);
              insertLink(editor, newUrl === null ? oldUrl : newUrl);
            }
          }}>
        <Icon>link</Icon>
      </Button>
  )
};

interface FormatButtonProps {
  format: string,
  icon: string
}

export default FormattedTextEditor;
