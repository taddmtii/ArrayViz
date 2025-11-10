import "./App.css";
import Header from "./components/Header";
import CodeWindow from "./components/CodeWindow";
import ButtonControls from "./components/ButtonControls";
import VariablesWindow from "./components/VariablesWindow";
import OutputWindow from "./components/OutputWindow";
import { useState } from "react";

function App() {
  const [page, setPage] = useState("view");
  return (
    <>
      <Header page={page} setPage={setPage} />
      <div className="flex p-6 gap-4">
        <div className="flex flex-col w-[60vw] h-[80vh] gap-2">
          <CodeWindow />
          <ButtonControls />
        </div>
        {/*{page === "predict" && (*/}
        <div className="flex flex-col w-[40vw] h-[85vh] gap-2">
          <div className="h-2/3">
            <VariablesWindow />
          </div>
          <div className="h-1/3">
            <OutputWindow />
          </div>
        </div>
        {/*)}*/}
      </div>
    </>
  );
}

export default App;
