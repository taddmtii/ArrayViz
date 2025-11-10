function VariablesWindow() {
  return (
    <>
      {/*<div className="flex h-2/3">*/}
      <div className="flex flex-col h-full bg-[#1E1E1E] border border-gray-700">
        <div className="bg-[#2D2D2D] px-4 py-2 border-b border-gray-700 text-center text-white">
          Variables
        </div>
        <div className="flex flex-1">
          {/* Frames */}
          <div className="flex-1 flex flex-col border-r border-gray-700">
            <div className="bg-[#2D2D2D] px-3 py-2 text-xs border-b border-gray-700 text-white">
              Frames
            </div>
            <div className="p-3 text-sm text-white overflow-auto">
              {/* frames should appear here */}
            </div>
          </div>
          {/* Objects */}
          <div className="flex-1 flex flex-col">
            <div className="bg-[#2D2D2D] px-3 py-2 text-xs border-b border-gray-700 text-white">
              Objects
            </div>
            <div className="p-3 text-xs text-white overflow-auto">
              {/* objects should appear right here */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default VariablesWindow;
