import { useRef, useState } from "react";
import { Editor, type OnMount } from "@monaco-editor/react";
type IStandaloneCodeEditor = Parameters<OnMount>[0];
function CodeWindow() {
  const editorReference = useRef<IStandaloneCodeEditor | null>(null);
  const [code, setCode] = useState("");

  // On load, editor focused.
  function onMount(editor: IStandaloneCodeEditor) {
    editorReference.current = editor;
    editor.focus();
  }

  return (
    <>
      <Editor
        height={"80vh"}
        width={"60vw"}
        theme="vs-dark"
        defaultLanguage="python"
        defaultValue="# Type code here..."
        onMount={onMount}
        value={code}
        onChange={(code) => setCode(code as string)}
      />
    </>
  );
}

export default CodeWindow;
