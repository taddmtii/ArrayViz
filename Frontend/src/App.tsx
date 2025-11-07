import "./App.css";
import Header from "./components/Header";
import CodeWindow from "./components/CodeWindow";
import ButtonControls from "./components/ButtonControls";

function App() {
  return (
    <>
      <Header />
      <div className="flex p-10">
        <div className="flex flex-col w-60vw h-80vh ">
          <CodeWindow />
          <ButtonControls />
        </div>
        <div className="flex"></div>
      </div>
    </>
  );
}

export default App;
