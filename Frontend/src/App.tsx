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
      <div className="flex p-10">
        <div className="flex flex-col w-[60vw] h-[80vh]">
          <CodeWindow />
          <ButtonControls />
        </div>
        {/*{page === "predict" && (*/}
        <div className="flex flex-col w-[40vw] h-[85vh]">
          <VariablesWindow />
          <OutputWindow />
        </div>
        {/*)}*/}
      </div>
    </>
  );
}

export default App;
