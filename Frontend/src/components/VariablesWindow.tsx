import type { PythonValue } from "../../../Parser/Nodes";

interface VariablesWindowProps {
  variables: Record<string, PythonValue>;
}

function VariablesWindow({ variables }: VariablesWindowProps) {
  // we want to format the value depending on what it is for clean output.
  function formattedValue(value: PythonValue) {
    if (Array.isArray(value)) {
      return `[${value.join(", ")}]`;
    }
    if (typeof value === "string") {
      return `"${value}"`;
    }
    return String(value); // anything else.
  }

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
              <div>
                {Object.entries(variables).map(([name, value]) => (
                  <div key={name} className="flex gap-2">
                    <span className="text-blue-400">{name} :</span>
                    <span className="text-green-400">
                      {formattedValue(value)}
                    </span>
                  </div>
                ))}
              </div>
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
