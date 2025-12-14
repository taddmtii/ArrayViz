import { useEffect, useRef, useState } from "react";
import type { PythonValue, UserFunction } from "../../../Parser/Nodes";

interface VariablesWindowProps {
  variables: Record<string, PythonValue>;
  functionDefinitions?: Map<string, UserFunction>;
  mode: "view" | "predict";
}

function VariablesWindow({
  variables,
  functionDefinitions,
  mode,
}: VariablesWindowProps) {
  // separate variables into primitives (for Frames) and objects (for Objects)
  const frames: Record<string, PythonValue> = {};
  const objects: Array<{
    id: string; // unique identifier for each object
    value: PythonValue; // value of the object
    type: string; // type of the object
    name?: string; // name that is OPTIONAL because you can just declare something like a list literal.
  }> = [];
  const references: Record<string, string> = {}; // mapping from variable name to object id

  let objectId = 0;

  // add functions from functionDefinitions
  if (functionDefinitions) {
    functionDefinitions.forEach((func, funcName) => {
      const id = `obj${objectId++}`; // new ID is incremented.
      objects.push({ id, value: func, type: "function", name: funcName });
      references[funcName] = id; // add rellationship to references between variable name and ID.
    });
  }

  // add variables next
  Object.entries(variables).forEach(([name, value]) => {
    // handles arrays stored in variables.
    if (Array.isArray(value)) {
      const id = `obj${objectId++}`;
      objects.push({ id, value, type: "list" });
      references[name] = id;
      // if value is an object or some sort or a function
    } else if (
      value !== null &&
      typeof value === "object" &&
      "type" in value &&
      value.type === "Function"
    ) {
      // handle function objects in variables (if need be)
      const id = `obj${objectId++}`;
      objects.push({ id, value, type: "function", name });
      references[name] = id;
    } else {
      // otherwise, just add regular variables to frames.
      frames[name] = value;
    }
  });

  // helper function similar to what we had before for formatting output.
  function formattedValue(value: PythonValue) {
    if (Array.isArray(value)) {
      return `[${value
        .map((v) =>
          typeof v === "string"
            ? `'${v}'`
            : v === null
              ? "None"
              : typeof v === "boolean"
                ? v
                  ? "True"
                  : "False"
                : String(v),
        )
        .join(", ")}]`;
    }
    if (typeof value === "string") {
      return `"${value}"`;
    }
    if (value === null) return "None";
    if (typeof value === "boolean") return value ? "True" : "False";
    return String(value);
  }

  return (
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
            <div className="border border-gray-600 rounded p-2 bg-gray-800/30">
              <div className="text-xs text-gray-400 mb-2">Global frame</div>
              {/*display that no variables are currently available to display if frames and references' lengths evaluate to nothing*/}
              {Object.keys(frames).length === 0 &&
              Object.keys(references).length === 0 ? (
                <div className="text-xs text-gray-500">No variables</div>
              ) : (
                <div className="space-y-1">
                  {/*iterate over all the variables and display their values hesre*/}
                  {Object.entries(frames).map(([name, value]) => {
                    return (
                      <div key={name} className="flex gap-2 items-center">
                        <span className="text-blue-400">{name}</span>
                        <span className="text-gray-500">:</span>
                        <span className="text-green-400">
                          {formattedValue(value)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Objects */}
        <div className="flex-1 flex flex-col">
          <div className="bg-[#2D2D2D] px-3 py-2 text-xs border-b border-gray-700 text-white">
            Objects
          </div>
          <div className="p-3 text-xs text-white overflow-auto">
            {/*no objects, tell user there are no objects*/}
            {objects.length === 0 ? (
              <div className="text-gray-500">No objects</div>
            ) : (
              <div className="space-y-3">
                {/*go over all objects and properly display them depending on their type*/}
                {objects.map(({ id, value, type }) => (
                  <div
                    key={id}
                    className="border-2 border-yellow-500 rounded p-2 bg-yellow-900/10"
                  >
                    <div className="text-xs text-yellow-400 mb-2">{type}</div>
                    {type === "list" ? (
                      <div className="flex gap-1 flex-wrap max-w-full">
                        {Array.isArray(value) &&
                          // for every item in the list, create a box that shows the current index and the value inside the list of that index in the box.
                          value.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex flex-col items-center"
                            >
                              {/*display index*/}
                              <div className="text-xs text-gray-400">{idx}</div>
                              {/*create box with value inside of it.*/}
                              <div className="w-10 h-10 border border-yellow-500 bg-yellow-500/10 flex items-center justify-center text-xs">
                                {item === null
                                  ? "None"
                                  : typeof item === "boolean"
                                    ? item
                                      ? "True"
                                      : "False"
                                    : typeof item === "string"
                                      ? `'${item}'`
                                      : String(item)}
                              </div>
                            </div>
                          ))}
                      </div>
                    ) : type === "function" ? (
                      // functiosn should just show the name of the function and the parameters
                      <div className="text-sm">
                        <div className="text-blue-400">
                          function {value.name}({value.params?.join(", ") || ""}
                          )
                        </div>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VariablesWindow;
