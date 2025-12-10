type HeaderProps = {
  page: "view" | "predict";
  setPage: (mode: "view" | "predict") => void;
};

function Header({ page, setPage }: HeaderProps) {
  let isSelected = page === "view" ? "view" : "predict";
  return (
    <>
      {/* Main container */}
      <div className="flex w-100vw p-4 bg-[#3D3D3D] justify-between">
        {/* ArrayViz title */}
        <div className="flex ml-4">
          <h1 className="flex text-white text-2xl ">ArrayViz</h1>
        </div>
        {/* Controls */}
        <div className="flex gap-6 mr-4">
          <button
            className={`btn ${isSelected === "view" ? "bg-blue-500" : "bg-[#242424] hover:bg-[#343434]"} text-white font-bold py-2 px-4 cursor-pointer rounded`}
            onClick={() => setPage("view")}
          >
            View
          </button>
          <button
            className={`btn ${isSelected === "predict" ? "bg-blue-500" : "bg-[#242424] hover:bg-[#343434]"} text-white font-bold py-2 px-4 cursor-pointer rounded`}
            onClick={() => setPage("predict")}
          >
            Predict
          </button>
        </div>
      </div>
    </>
  );
}

export default Header;
