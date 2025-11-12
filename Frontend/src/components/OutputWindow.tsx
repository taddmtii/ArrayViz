import type { PythonValue } from "../../../Parser/Nodes";

interface OutputWindowProps {
  outputs: PythonValue[];
}

function OutputWindow({ outputs }: OutputWindowProps) {
  return (
    <>
      <div className="flex flex-col h-full bg-[#1E1E1E] border border-gray-700">
        <div className="bg-[#2D2D2D] px-4 py-2 border-b border-gray-700 text-center text-white">
          Output
        </div>
        <div className="flex-1 overflow-auto p-3 text-xs text-white">
          {/* any output should appear right here... */}
          {outputs.map((output, index) => (
            <div key={index}>{String(output)}</div>
          ))}
        </div>
      </div>
    </>
  );
}

export default OutputWindow;
