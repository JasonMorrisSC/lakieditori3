import React, {CSSProperties, useEffect, useMemo, useRef, useState} from "react";
import {createEditor, Editor, Node as SlateNode, Range} from 'slate'
import {
  Editable,
  ReactEditor,
  RenderElementProps,
  RenderLeafProps,
  Slate,
  useSlate,
  withReact
} from 'slate-react'
import {withHistory} from "slate-history";
import {css} from "emotion";
import {Button, Icon, Menu, Portal} from "./RichTextEditorUtilComponents";
import {
  deserialize,
  insertLink,
  isFormatActive,
  isLinkActive,
  serialize,
  toggleFormat
} from "./RichTextEditorFunctions";

const RichTextEditor: React.FC<Props> = ({value, onChange = () => null, placeholder, style}) => {
  const [initialized, setInitialized] = useState<boolean>(false);
  const [editorValue, setEditorValue] = useState<SlateNode[]>([{children: [{text: ''}]}]);
  const editor = useMemo(() => withInlineLinks(withReact(withHistory(createEditor()))), []);

  // Sets real initial editor value from properties after it is available
  useEffect(() => {
    if (value && !initialized) {
      let initialValue = deserialize(value);
      if (initialValue && initialValue.length > 0) {
        setEditorValue([{children: initialValue}]);
      }
      setInitialized(true);
    }
  }, [value, initialized]);

  // Removes 'onChange' when editor is unmounted to avoid errors when this component is unmounted.
  useEffect(() => {
    return () => {
      editor.onChange = () => null
    };
  }, [editor]);

  return <Slate
      editor={editor}
      value={editorValue}
      onChange={nodes => {
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
        onBlur={() => {
          onChange(serialize({children: editorValue}));
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

const withInlineLinks = (editor: ReactEditor): ReactEditor => {
  const {isInline} = editor;

  editor.isInline = element => {
    return element.type === 'link' ? true : isInline(element);
  };

  return editor
};

const EditorElement = ({attributes, children, element}: RenderElementProps) => {
  if (element.type === 'link') {
    return <a {...attributes} href={element.url}>{children}</a>;
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

export default RichTextEditor;
