import type { InterpreterError } from "../../../Parser/Errors";
import type { PythonValue } from "../../../Parser/Nodes";

interface OutputWindowProps {
  outputs: PythonValue[];
  error: InterpreterError | null;
}

function OutputWindow({ outputs, error }: OutputWindowProps) {
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

          {/* error output */}
          {error && (
            <div className="text-red-400 mt-2 pt-2 border-t border-red-700">
              <div className="font-bold">{error.name}:</div>
              <div>{error.message}</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default OutputWindow;
