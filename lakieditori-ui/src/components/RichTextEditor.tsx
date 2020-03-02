import React, {CSSProperties, useCallback, useEffect, useMemo, useState} from "react";
import {createEditor, Node as SlateNode, NodeEntry, Range, Text} from 'slate'
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
import axios from "axios";

const RichTextEditor: React.FC<Props> = ({value, onChange = () => null, placeholder, style}) => {
  const [initialized, setInitialized] = useState<boolean>(false);
  const [focused, setFocused] = useState<boolean>(false);
  const [concepts, setConcepts] = useState<string[]>([]);
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

  const decorate = useCallback(([node, path]: NodeEntry) => {
    const ranges: Range[] = [];

    if (focused && Text.isText(node)) {
      const {text} = node;

      const words = text.split(/\s/);
      let offset = 0;

      words.forEach((word, i) => {
        if (concepts.includes(word)) {
          ranges.push({
            anchor: {path, offset: offset + word.length},
            focus: {path, offset},
            highlight: true
          })
        }
        offset = offset + word.length + 1;
      })
    }

    return ranges;
  }, [focused, concepts]);

  function recognizeConcepts() {
    const editorWords: string[] = editorValue.flatMap(n => SlateNode.string(n).split(/\s+/));

    editorWords.forEach(word => {
      axios.get('/api/lemma', {
        params: {word: word.toLowerCase()},
        responseType: 'text'
      }).then(res => {
        return axios.get('/api/concepts', {
          params: {query: res.data},
          responseType: 'document'
        });
      }).then(res => {
        if (res.data.documentElement.childElementCount > 0) {
          setConcepts(prevConcepts => prevConcepts.concat(word));
        }
      });
    });
  }

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
              decorate={decorate}
              onKeyDown={event => {
                if (event.keyCode === 13 /* enter */) {
                  event.preventDefault();
                }
                setTimeout(() => recognizeConcepts(), 400);
              }}
              onFocus={() => {
                setFocused(true);
                setTimeout(() => recognizeConcepts(), 400);
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
  if (leaf.highlight) {
    children = <span style={{backgroundColor: tokens.colors.highlightLight50}}>{children}</span>
  }
  return <span {...attributes}>{children}</span>
};

export default RichTextEditor;
