import React, {CSSProperties, ReactNode, useCallback, useEffect, useMemo, useState} from "react";
import {createEditor, Location, Node as SlateNode, NodeEntry, Transforms} from 'slate'
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
import {deserialize, highlightMatches, serialize, toggleFormat} from "./slateUtils";
import {useTextConcepts} from "./useTextConcepts";
import TextEditorToolbar from "./TextEditorToolbar";
import TextEditorHoveringToolbar from "./TextEditorHoveringToolbar";
import LinkModal from "./LinkModal";

interface Props {
  value: Element | null,
  setValue: (xmlValue: string) => void,
  inline?: boolean,
  label?: string,
  style?: CSSProperties,
  customTools?: ReactNode,
  terminologyUris?: string[],
}

const TextEditor: React.FC<Props> = (
    {value, setValue, inline = true, label, style, customTools, terminologyUris = []}) => {
  const [focused, setFocused] = useState<boolean>(false);

  const editor = useMemo(() => withInlineLinks(withReact(withHistory(createEditor()))), []);
  const [editorValue, setEditorValue] = useState<SlateNode[]>(
      inline ?
          [{children: [{text: ''}]}] :
          [{type: "paragraph", children: [{text: ''}]}]);

  const [isLinkModalOpen, setLinkModalOpen] = useState(false);
  const [linkModalSelection, setLinkModalSelection] = useState<Location>([0]);

  const {concepts} = useTextConcepts(editorValue.map(n => SlateNode.string(n)).join('\n'), terminologyUris, focused);

  // Sets real initial editor value from properties after it is available
  useEffect(() => {
    if (value) {
      let initialValue = deserialize(value);
      if (initialValue && initialValue.length > 0) {
        setEditorValue([{children: initialValue}]);
      }
    }
  }, [value]);

  // Removes 'onChange' when editor is unmounted to avoid errors when this component is unmounted.
  useEffect(() => {
    return () => {
      editor.onChange = () => null
    };
  }, [editor]);

  const decorate = useCallback(([node, path]: NodeEntry) => {
    return focused ? highlightMatches((w) => concepts.has(w), [node, path]) : [];
  }, [focused, concepts]);

  return (
      <div style={{margin: `${tokens.spacing.xxs} 0`, ...style}}>
        <Slate
            editor={editor}
            value={editorValue}
            onChange={nodes => setEditorValue(nodes)}>
          <TextEditorHoveringToolbar
              words={concepts}
              linkSelection={(location) => {
                setLinkModalSelection(location);
                setLinkModalOpen(true);
              }}/>

          <div style={{border: `1px solid ${tokens.colors.depthLight13}`, borderRadius: "2px"}}>
            <TextEditorToolbar label={label || ''} expanded={focused}
                               linkSelection={(location) => {
                                 setLinkModalSelection(location);
                                 setLinkModalOpen(true);
                               }}
                               customTools={customTools}/>

            <Editable
                renderElement={props => <EditorElement {...props} />}
                renderLeaf={props => <EditorLeaf {...props} />}
                style={{padding: tokens.spacing.s, paddingTop: 0}}
                decorate={decorate}
                onKeyDown={event => {
                  if (inline && event.keyCode === 13 /* enter */) {
                    event.preventDefault();
                  }
                }}
                onFocus={() => {
                  setFocused(true);
                }}
                onBlur={() => {
                  Transforms.select(editor, [0]);
                  setValue(serialize({children: editorValue}));
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
          </div>

          <LinkModal
              isOpen={isLinkModalOpen}
              close={() => setLinkModalOpen(false)}
              selection={linkModalSelection}
              terminologyUris={terminologyUris}/>
        </Slate>
      </div>
  );
};

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
  } else if (element.type === 'paragraph') {
    return <p {...attributes}>{children}</p>
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

export default TextEditor;
