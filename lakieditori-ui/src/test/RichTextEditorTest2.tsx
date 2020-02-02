import React, {useCallback, useMemo, useState} from "react";
import {createEditor, Editor, Node, Text, Transforms} from 'slate'
import {DefaultElement, Editable, RenderLeafProps, Slate, withReact} from 'slate-react'
import Layout from "../components/Layout";
import {RenderElementProps} from "slate-react/dist/components/editable";

const RichTextEditorTest2: React.FC = () => {
  const editor = useMemo(() => withReact(createEditor()), []);
  const [value, setValue] = useState<Node[]>([
    {
      type: 'paragraph',
      children: [{text: 'A line of text in a paragraph.'}],
    },
  ]);

  const renderElement = useCallback(props => {
    switch (props.element.type) {
      case 'code':
        return <CodeElement {...props} />
      default:
        return <DefaultElement {...props} />
    }
  }, []);

  const renderLeaf = useCallback(props => {
    return <Leaf {...props} />
  }, []);

  const CustomEditor = {
    isBoldMarkActive(editor: Editor) {
      const [match] = Array.from(Editor.nodes(editor, {
        match: n => n.bold === true,
        universal: true,
      }));

      return !!match;
    },

    isCodeBlockActive(editor: Editor) {
      const [match] = Array.from(Editor.nodes(editor, {
        match: n => n.type === 'code',
      }));

      return !!match;
    },

    toggleBoldMark(editor: Editor) {
      const isActive = CustomEditor.isBoldMarkActive(editor);
      Transforms.setNodes(
          editor,
          {bold: isActive ? null : true},
          {match: n => Text.isText(n), split: true}
      );
    },

    toggleCodeBlock(editor: Editor) {
      const isActive = CustomEditor.isCodeBlockActive(editor);
      Transforms.setNodes(
          editor,
          {type: isActive ? null : 'code'},
          {match: n => Editor.isBlock(editor, n)}
      );
    },
  };


  return <Layout title="Testi">
    <Slate editor={editor} value={value} onChange={value => setValue(value)}>
      <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          onKeyDown={event => {
            if (!(event.ctrlKey || event.metaKey)) {
              return;
            }

            switch (event.key) {
              case 'å': {
                event.preventDefault();
                // Determine whether any of the currently selected blocks are code blocks.
                const [match] = Array.from(Editor.nodes(editor, {
                  match: n => n.type === 'code',
                }));
                // Toggle the block type depending on whether there's already a match.
                Transforms.setNodes(
                    editor,
                    {type: match ? 'paragraph' : 'code'},
                    {match: n => Editor.isBlock(editor, n)}
                );
                break;
              }
              case 'b': {
                console.log("bold");
                event.preventDefault();
                Transforms.setNodes(
                    editor,
                    {bold: true},
                    // Apply it to text nodes, and split the text node up if the
                    // selection is overlapping only part of it.
                    {match: n => Text.isText(n), split: true}
                );
                break
              }

            }

          }}
      />
    </Slate>
  </Layout>;
};

const CodeElement = (props: RenderElementProps) => {
  return <pre {...props.attributes}><code>{props.children}</code></pre>;
};

const Leaf = (props: RenderLeafProps) => {
  return (
      <span
          {...props.attributes}
          style={{fontWeight: props.leaf.bold ? 'bold' : 'normal'}}
      >
      {props.children}
    </span>
  )
};

export default RichTextEditorTest2;
