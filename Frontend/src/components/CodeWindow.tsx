import { useRef } from "react";
import { Editor, type OnMount } from "@monaco-editor/react";
type IStandaloneCodeEditor = Parameters<OnMount>[0];

interface CodeWindowProps {
  code: string;
  onCodeChange: (code: string) => void;
  currentLine: number;
}

function CodeWindow({ code, onCodeChange, currentLine }: CodeWindowProps) {
  const editorReference = useRef<IStandaloneCodeEditor | null>(null);
  // const [code, setCode] = useState("");

  // On load, editor focused.
  function onMount(editor: IStandaloneCodeEditor) {
    editorReference.current = editor;
    editor.focus();
  }

  return (
    <>
      <div className="flex flex-col h-full bg-[#1E1E1E] border border-gray-700">
        <div className="bg-[#2D2D2D] px-4 py-2 border-b border-gray-700 text-center text-white">
          Code{" "}
          {currentLine > 0 && (
            <span className="text-white ml-2">(Line {currentLine})</span>
          )}
        </div>
        <Editor
          height={"100%"}
          width={"100%"}
          theme="vs-dark"
          defaultLanguage="python"
          defaultValue=""
          onMount={onMount}
          value={code}
          onChange={(code) => onCodeChange(code as string)}
          options={{
            lineNumbers: "on",
            minimap: { enabled: false },
          }}
        />
      </div>
    </>
  );
}

export default CodeWindow;
