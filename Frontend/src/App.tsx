import "./App.css";
import Header from "./components/Header";
import CodeWindow from "./components/CodeWindow";
import ButtonControls from "./components/ButtonControls";
import VariablesWindow from "./components/VariablesWindow";
import OutputWindow from "./components/OutputWindow";
import { useRef, useState } from "react";
import { InterpreterService } from "./services/InterpreterService";

function App() {
  const [page, setPage] = useState("view");
  const [code, setCode] = useState("");
  const [interpreterState, setInterpreterState] = useState({
    variables: {},
    currentLine: 1,
    outputs: [],
    canStepForward: false,
    canStepBackward: false,
    currentStep: 0,
    totalSteps: 0,
  });

  const interpreterServiceReference = useRef(new InterpreterService());

  // set code state when code changes.
  function handleCodeChange(code: string) {
    setCode(code);
  }

  // parses current code, updates state after code ran.
  function handleRun() {
    interpreterServiceReference.current.parseCode(code);
    updateState();
  }

  // updates current state (snapshot) with what we have when we call the function.
  function updateState() {
    const state = interpreterServiceReference.current.getState();
    setInterpreterState(state);
  }

  function handleStepForward() {
    interpreterServiceReference.current.stepForward();
    updateState();
  }

  function handleStepBackward() {
    interpreterServiceReference.current.stepBack();
    updateState();
  }

  function handleFirst() {
    interpreterServiceReference.current.toBeg();
    updateState();
  }

  function handleLast() {
    interpreterServiceReference.current.toEnd();
    updateState();
  }

  return (
    <>
      <Header page={page} setPage={setPage} />
      <div className="flex p-6 gap-4">
        <div className="flex flex-col w-[60vw] h-[80vh] gap-2">
          <CodeWindow
            code={code}
            onCodeChange={handleCodeChange}
            currentLine={interpreterState.currentLine}
          />
          <ButtonControls
            onFirst={handleFirst}
            onPrev={handleStepBackward}
            onNext={handleStepForward}
            onLast={handleLast}
            onRun={handleRun}
            canStepForward={interpreterState.canStepForward}
            canStepBackward={interpreterState.canStepBackward}
          />
        </div>

        <div className="flex flex-col w-[40vw] h-[85vh] gap-2">
          <div className="h-2/3">
            <VariablesWindow variables={interpreterState.variables} />
          </div>
          <div className="h-1/3">
            <OutputWindow outputs={interpreterState.outputs} />
          </div>
        </div>
        {/*)}*/}
      </div>
    </>
  );
}

export default App;
