// References:
// https://medium.com/@alessandro.traversi/understanding-the-command-design-pattern-in-typescript-1d2ee3615da8
// https://refactoring.guru/design-patterns/command

// Command: interface that tells us how to carry out an operation.
// Each step that needs to be executed.
interface Command {
  execute(): void;
}

type PythonValue = number | strin

interface Expression {
  evaluate(): ; 
}

interface Statement {

}

// Internal object, not to be directly binded with UI. Notify other objects when things are changed.
class State {
  private _programCounter: number;
  private _lineCount: number;

  constructor(_programCounter: number, _lineCount: number) {
    this._programCounter = _programCounter;
    this._lineCount = _lineCount;
  }
  
  private get programCounter() {
    return this._programCounter;
  }

  private set programCounter(val: number) {
    if (val < 1 || val > this._lineCount) {
      throw new Error("Invalid PC");
    }
    this._programCounter = val;
    // iterate over subscribers, notify value has changed.
  }
}


// Sender: UI
class UI {
  private _interpreter: Interpreter;
  constructor(_interpreter: Interpreter) {
    this._interpreter = _interpreter;
  }
  public stepForward(): void {
    this._interpreter.stepForward();
  };
  public stepBack(): void {

  };

}

// Invoker/Receiver: component that knows how to perform operations.
class Interpreter {
  // private _prevCommandList: Command[];
  // private _currentCommandList: 
  private _nextCommandList: Command[];
  public stepForward(): void {
      this._nextCommandList.shift()?.execute(); // gets first command in list and calls execute on that command

  };
}


// Commands/Change: 

// Arrow that indicates which line we are currently executing.
class MoveLinePointerCommand implements Command {
    private interpreter: Interpreter; // reference to Interpreter (receiver)

}

// Highlights expression that is being evaluated.
class HighlightExpressionCommand implements Command {
    private interpreter: Interpreter; // reference to Interpreter (receiver)
    private expression: Expression;
}

class RetrieveValueCommand implements Command {
  private interpreter: Interpreter; // reference to Interpreter (receiver)
  private name: String; // variable name whose value we want to retrieve

}

// For evaluating arithmetic operations
class BinaryOpCommand implements Command {
  private interpreter: Interpreter; // reference to Interpreter (receiver)

}

// For assignments to a variable
class ChangeVariableCommand implements Command {
  private interpreter: Interpreter; // reference to Interpreter (receiver)
  private name: String; // variable name
  private value: Number; // value to be connected to variable

  constructor(interpreter: Interpreter, name: String, value: Number) {
    this.interpreter = interpreter;
    this.name = name;
    this.value = value;
  } 
}

