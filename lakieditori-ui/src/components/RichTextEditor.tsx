import React, {CSSProperties, useEffect, useMemo, useState} from "react";
import {createEditor, Node as SlateNode} from 'slate'
import {
  Editable,
  ReactEditor,
  RenderElementProps,
  RenderLeafProps,
  Slate,
  withReact
} from 'slate-react'
import {withHistory} from "slate-history";
import {suomifiDesignTokens as tokens} from "suomifi-ui-components";
import {deserialize, serialize, toggleFormat} from "./RichTextEditorFunctions";
import Toolbar from "./RichTextEditorToolbar";
import HoveringToolbar from "./RichTextEditorHoveringToolbar";

const RichTextEditor: React.FC<Props> = ({value, onChange = () => null, placeholder, style}) => {
  const [initialized, setInitialized] = useState<boolean>(false);
  const [focused, setFocused] = useState<boolean>(false);
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

  return (
      <div style={{...style, padding: 0}}>
        <Slate
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
              style={{padding: tokens.spacing.s}}
              onKeyDown={event => {
                if (event.keyCode === 13 /* enter */) {
                  event.preventDefault();
                }
              }}
              onFocus={() => {
                setFocused(true)
              }}
              onBlur={() => {
                onChange(serialize({children: editorValue}));
                setFocused(false);
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
          <div style={{display: focused ? 'block' : 'none'}}>
            <Toolbar/>
          </div>
        </Slate>
      </div>
  );
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

export default RichTextEditor;
