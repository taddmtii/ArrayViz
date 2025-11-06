import "./App.css";
import Header from "./components/Header";
import CodeWindow from "./components/CodeWindow";

function App() {
  return (
    <>
      <Header />
      <div className="flex p-10">
        <div className="flex w-60vw h-80vh">
          <CodeWindow />
        </div>
        <div className="flex"></div>
      </div>
    </>
  );
}

export default App;
