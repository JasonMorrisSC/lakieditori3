import React from 'react'
import Layout from "../components/Layout";
import {convertToRaw, Editor, EditorState, RichUtils} from 'draft-js';

const RichTextEditorTest: React.FC = () => {
  const [editorState, setEditorState] = React.useState<EditorState>(EditorState.createEmpty());
  const [editorHtmlState, setEditorHtmlState] = React.useState<string>('');

  function handleKeyCommand(command: any, editorState: any) {
    const newState = RichUtils.handleKeyCommand(editorState, command);

    if (newState) {
      setEditorState(newState);
      return 'handled';
    }

    return 'not-handled';
  }

  function onBoldClick() {
    setEditorState(RichUtils.toggleInlineStyle(editorState, 'BOLD'));
  }

  function saveAndUpdateEditorState(newState: EditorState) {
    setEditorState(newState);

    const rawState = convertToRaw(newState.getCurrentContent());

    rawState.blocks.forEach(block => {
    });
  }

  return <Layout title="Testi">
    <button onClick={onBoldClick}>Bold</button>

    <Editor
        editorState={editorState}
        handleKeyCommand={handleKeyCommand}
        onChange={saveAndUpdateEditorState}/>

    <pre>
      {editorHtmlState}
    </pre>
  </Layout>;
};

export default RichTextEditorTest;
