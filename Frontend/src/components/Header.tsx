function Header() {
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
          <button className="btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 cursor-pointer rounded">
            View
          </button>
          <button className="btn btn bg-[#242424] hover:bg-[#343434]  text-white font-bold py-2 px-4 cursor-pointer rounded ">
            Predict
          </button>
        </div>
      </div>
    </>
  );
}

export default Header;
