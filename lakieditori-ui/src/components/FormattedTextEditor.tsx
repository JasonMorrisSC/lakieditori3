import React, {CSSProperties, ReactNode, useEffect, useMemo, useRef, useState} from "react";
import {createPortal} from "react-dom";
import {createEditor, Editor, Node, Range, Text, Transforms} from 'slate'
import {
  Editable,
  ReactEditor,
  RenderElementProps,
  RenderLeafProps,
  Slate,
  useSlate,
  withReact
} from 'slate-react'
import {css, cx} from "emotion";
import {suomifiDesignTokens as sdt} from "suomifi-design-tokens";
import {withHistory} from "slate-history";

const initialEmptyValue = [{children: [{text: ''}]}];

const FormattedTextEditor: React.FC<Props> = ({value, onChange = () => null, placeholder, style}) => {
  const [editorValue, setEditorValue] = useState<Node[]>(initialEmptyValue);
  const editor = useMemo(() => withInlineLinks(withReact(withHistory(createEditor()))), []);

  // Set "real" initial editor value from properties after it is available
  useEffect(() => {
    if (value && editorValue === initialEmptyValue) {
      // TODO: de-serialize value
      setEditorValue([{children: [{text: value}]}]);
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
        renderElement={props => <Element {...props} />}
        renderLeaf={props => <Leaf {...props} />}
        placeholder={placeholder || ''}
        style={style}
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
  value: string,
  placeholder?: string,
  onChange?: (newValue: string) => void,
  style?: CSSProperties
}

const serialize = (node: Node): string => {
  if (Text.isText(node)) {
    // TODO: escape html
    let text = node.text;

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

const Element = ({attributes, children, element}: RenderElementProps) => {
  if (element.type === 'link') {
    return <a {...attributes} href={element.url} style={{
      color: sdt.colors.highlightBase,
      textDecoration: "none"
    }}>{children}</a>;
  } else {
    return <p {...attributes}>{children}</p>
  }
};

const Leaf = ({attributes, children, leaf}: RenderLeafProps) => {
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

const Menu = React.forwardRef(({className, ...props}: MenuProps, ref: any) => (
    <div
        {...props}
        ref={ref}
        className={cx(
            className,
            css`
        & > * {
          display: inline-block;
        }
        & > * + * {
          margin-left: 15px;
        }`)}
    />
));

interface MenuProps {
  className: any,
  children: any
}

const Button = React.forwardRef(
    ({className, active, reversed = true, onMouseDown, ...props}: ButtonProps, ref: any) => (
        <span
            {...props}
            onMouseDown={onMouseDown}
            ref={ref}
            className={cx(
                className,
                css`
          cursor: pointer;
          color: ${reversed
                    ? active
                        ? 'white'
                        : '#aaa'
                    : active
                        ? 'black'
                        : '#ccc'};
        `)}
        />
    )
);

interface ButtonProps {
  className?: any,
  active: boolean,
  reversed?: boolean,
  onMouseDown: (e: any) => void,
  children: any
}

export const Icon = React.forwardRef(({className, ...props}: IconProps, ref: any) => (
    <span
        {...props}
        ref={ref}
        className={cx(
            'material-icons',
            className,
            css`
        font-size: 18px;
        vertical-align: text-bottom;
      `)}
    />
));

interface IconProps {
  className?: any,
  children: any
}

const Portal = ({children}: PortalProps) => {
  return createPortal(children, document.body)
};

interface PortalProps {
  children: ReactNode
}

export default FormattedTextEditor;
