import React, {useEffect, useMemo, useState} from 'react'
import Layout from "../components/Layout";
import {createEditor, Node} from "slate";
import {Editable, Slate, withReact} from "slate-react";
import {withHistory} from 'slate-history'

const RichTextEditorTest: React.FC = () => {
  const editor = useMemo(() => withReact(withHistory(createEditor())), []);
  const [value, setValue] = useState<Node[]>([
    {
      type: 'paragraph',
      children: [{text: 'A line of text in a paragraph.'}],
    },
  ]);

  // Remove 'onChange' when editor is unmounted to avoid errors when this component is unmounted.
  useEffect(() => {
    return () => {
      editor.onChange = () => null
    };
  }, [editor]);

  return <Layout title="Testi">
    <Slate editor={editor} value={value} onChange={value => {
      setValue(value);
    }}>
      <Editable/>
    </Slate>
  </Layout>;
};

export default RichTextEditorTest;
