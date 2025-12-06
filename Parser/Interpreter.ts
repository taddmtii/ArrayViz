// ------------------------------------------------------------------
import {
  type PythonValue,
  type BinaryOp,
  type ComparisonOp,
  type UnaryOp,
  StatementNode,
  ExpressionNode,
  ListAccessExpressionNode,
  UserFunction,
} from "./Nodes";

import {
  InterpreterError,
  RuntimeError,
  TypeError,
  NameError,
  IndexError,
  ValueError,
  ZeroDivisionError,
} from "./Errors";
import { InterpreterService } from "../frontend/src/services/InterpreterService";

// ---------------------------------------------------------------------------------------
// COMMANDS ABC
// ---------------------------------------------------------------------------------------
export abstract class Command {
  protected _undoCommand: Command | null = null;
  abstract do(_currentState: State): void;
  undo(_currentState: State) {
    this._undoCommand?.do(_currentState);
  }
}

// ---------------------------------------------------------------------------------------
// PROGRAM STATE
// ---------------------------------------------------------------------------------------

export class State {
  private _programCounter: number = 0; // which line of execution are we on.
  private _lineCount: number = 0; // all lines in program.
  private _currentLine: number = 1; // current line number
  private _currentExpression: ExpressionNode | null; // current highlighted expression we are evaluating
  private _currentStatement: StatementNode | null; // what statement are we on
  private _callStack: ExpressionNode[]; // function call stack
  private _history: Command[]; // history of all commands
  private _variables: Map<string, PythonValue> = new Map(); // storage for variables and thier values
  private _evaluationStack: PythonValue[]; // stack for expression evaluation
  private _returnStack: PythonValue[]; // stack for return values
  private _loopStack: [number, number][];
  private _outputs: PythonValue[] = [];
  private _loopIterationState: Map<string, number> = new Map(); // tracks the iteration index per loop variable.
  private _error: InterpreterError | null = null;
  private _functionDefinitions: Map<string, UserFunction> = new Map();

  constructor(
    _programCounter: number,
    _lineCount: number,
    _currentExpression: ExpressionNode | null,
    _currentStatement: StatementNode | null,
    _callStack: ExpressionNode[],
    _history: Command[],
    _variables: Map<string, PythonValue>,
    _currentLine: number,
    _evaluationStack: PythonValue[],
    _returnStack: PythonValue[],
    _loopStack: [number, number][],
    _outputs: PythonValue[],
    _loopIterationState: Map<string, number>,
    _error: InterpreterError | null,
    _functionDefinitions: Map<string, UserFunction> = new Map(),
  ) {
    this._programCounter = _programCounter;
    this._lineCount = _lineCount;
    this._currentExpression = _currentExpression;
    this._currentStatement = _currentStatement;
    this._callStack = _callStack;
    this._history = _history;
    this._variables = _variables;
    this._currentLine = _currentLine;
    this._evaluationStack = _evaluationStack;
    this._returnStack = _returnStack;
    this._loopStack = _loopStack;
    this._outputs = _outputs;
    this._loopIterationState = _loopIterationState;
    this._error = _error;
    this._functionDefinitions = _functionDefinitions;
  }

  public get functionDefinitions() {
    return this._functionDefinitions;
  }

  public setFunction(name: string, func: UserFunction) {
    this._functionDefinitions.set(name, func);
  }

  public getFunction(name: string): UserFunction | undefined {
    return this._functionDefinitions.get(name);
  }

  public get programCounter() {
    return this._programCounter;
  }
  public set programCounter(val: number) {
    this._programCounter = val;
  }

  public get returnStack() {
    return this._returnStack;
  }

  public get outputs() {
    return this._outputs;
  }

  public get loopIterationState() {
    return this._loopIterationState;
  }

  public addOutput(value: PythonValue) {
    this._outputs.push(value);
  }

  public removeLastOutput() {
    this._outputs.pop();
  }

  public hasVariable(name: string): boolean {
    return this._variables.has(name);
  }
  public get lineCount() {
    return this._lineCount;
  }
  public set lineCount(val: number) {
    this._lineCount = val;
  }

  public get currentLine() {
    return this._currentLine;
  }

  public set currentLine(val: number) {
    this._currentLine = val;
  }

  public get currentExpression() {
    return this._currentExpression;
  }
  public set currentExpression(expr: ExpressionNode | null) {
    this._currentExpression = expr;
  }

  public get currentStatement() {
    return this._currentStatement;
  }
  public set currentStatement(stmt: StatementNode | null) {
    this._currentStatement = stmt;
  }

  public get evaluationStack() {
    return this._evaluationStack;
  }
  public get variables() {
    return this._variables;
  }

  public set variables(vars: Map<string, PythonValue | PythonValue[]>) {
    this._variables = vars;
  }

  public get loopStack() {
    return this._loopStack;
  }

  public get error() {
    return this._error;
  }
  public set error(err: InterpreterError | null) {
    this._error = err;
  }

  public setVariable(name: string, value: PythonValue | PythonValue[]) {
    this._variables.set(name, value);
  } // adds new key value into variables map.
  public getVariable(name: string): PythonValue | PythonValue[] {
    const v = this._variables.get(name);
    if (v === undefined) return null;
    return v;
  } // could be nullable upon lookup. null is important here.

  public pushCallStack(func: ExpressionNode) {
    this._callStack.push(func);
  } // pushes element onto stack
  public popCallStack() {
    return this._callStack.pop();
  } // gets element from top of stack

  public addHistoryCommand(step: Command) {
    this._history.push(step);
  }
  public getMostRecentHistoryCommand() {
    return this._history.pop();
  }

  public pushReturnStack(value: PythonValue) {
    this._returnStack.push(value);
  }
  public popReturnStack() {
    return this._returnStack.pop();
  }

  // get start line and end line for current statement for highlighting purposes
  public getCurrentStatementHighlight(): {
    startLine: number;
    endLine: number;
  } | null {
    if (!this._currentStatement) return null;
    return {
      startLine: this._currentStatement.startLine,
      endLine: this._currentStatement.endLine,
    };
  }

  // get start line, startCol, and endCol for current expression for highlighting purposes
  public getCurrentExpressionHighlight(): {
    line: number;
    startCol: number;
    endCol: number;
  } | null {
    if (!this._currentExpression) return null;
    return {
      line: this._currentExpression.lineNum,
      startCol: this._currentExpression.startCol,
      endCol: this._currentExpression.endCol,
    };
  }
}

// ---------------------------------------------------------------------------------------
// COMMANDS
// ---------------------------------------------------------------------------------------

// Take value from top of evaluation stack and store it in a variable.
export class AssignVariableCommand extends Command {
  private _name: string | ListAccessExpressionNode;
  constructor(_name: string | ListAccessExpressionNode) {
    super();
    this._name = _name;
  }

  do(_currentState: State) {
    try {
      // List assignment
      if (typeof this._name !== "string") {
        const value = _currentState.evaluationStack.pop()!;
        const index = _currentState.evaluationStack.pop()!;
        const list = _currentState.evaluationStack.pop()!;

        if (value === undefined || index === undefined || list === undefined) {
          throw new RuntimeError("Stack underflow during list assignment");
        }

        if (typeof index !== "number") {
          throw new TypeError(
            `list indices must be integers, not ${typeof index}`,
          );
        }

        if (!Array.isArray(list)) {
          throw new TypeError(
            `'${typeof list}' object does not support item assignment`,
          );
        }

        let actualIndex = index;
        if (actualIndex < 0) {
          actualIndex = list.length + actualIndex;
        }

        if (actualIndex < 0 || actualIndex >= list.length) {
          throw new IndexError(`list assignment index out of range`);
        }

        list[actualIndex] = value;
        return;
      }

      // For loop iteration
      const top =
        _currentState.evaluationStack[_currentState.evaluationStack.length - 1];

      if (_currentState.loopStack.length > 0 && Array.isArray(top)) {
        const iterable = _currentState.evaluationStack.pop()!;

        if (Array.isArray(iterable) && iterable.length > 0) {
          const currentIndex =
            _currentState.loopIterationState.get(this._name) || 0;

          if (currentIndex < iterable.length) {
            const nextItem = iterable[currentIndex];
            _currentState.setVariable(this._name, nextItem);
            _currentState.loopIterationState.set(this._name, currentIndex + 1);
            _currentState.evaluationStack.push(iterable);
            _currentState.evaluationStack.push(true);
          } else {
            _currentState.evaluationStack.push(false);
            _currentState.loopIterationState.delete(this._name);
          }
        } else {
          _currentState.evaluationStack.push(false);
        }
      } else {
        // normal assignment
        const newValue = _currentState.evaluationStack.pop();

        if (newValue === undefined) {
          throw new RuntimeError("Stack underflow during variable assignment");
        }

        _currentState.setVariable(this._name, newValue);
      }
    } catch (error) {
      if (error instanceof InterpreterError) {
        _currentState.error = error;
      }
      throw error;
    }
  }
}

// Pushes value onto Evaluation Stack during Expression processing.
export class PushValueCommand extends Command {
  private _value: PythonValue; // Value to push.
  constructor(value: PythonValue) {
    super();
    this._value = value;
  }

  do(_currentState: State) {
    _currentState.evaluationStack.push(this._value);
    this._undoCommand = new PopValueCommand();
  }
}

export class PushLoopBoundsCommand extends Command {
  private _start: number;
  private _end: number;
  constructor(_start: number, _end: number) {
    super();
    this._start = _start;
    this._end = _end;
  }

  do(_currentState: State) {
    // start, end passed in are not the absolute positions we would need to jump to and from. There are three commands that execute before every for loop (highlights and pushing the iterable)
    // we would need to calculate the absolute positions (the actual start and end of the loop) to calculate where we would need to break from or to continue from.
    let continueTarget = _currentState.programCounter + this._start; // this shoud always jump to the loop variable reassignment (which is AssignVariableCommand)
    let breakTarget = _currentState.programCounter + this._end; // this should always break out of the loop, to where we pop the loop bounds signaling the completetion of a loop (which is PopLoopBound)
    _currentState.loopStack.push([continueTarget, breakTarget]);
    this._undoCommand = new PopLoopBoundsCommand();
  }
}

export class PopLoopBoundsCommand extends Command {
  constructor() {
    super();
  }

  do(_currentState: State) {
    const loopBound = _currentState.loopStack.pop()!;
    this._undoCommand = new PushLoopBoundsCommand(loopBound[0], loopBound[1]);
  }
}

export class BreakCommand extends Command {
  constructor() {
    super();
  }
  do(_currentState: State) {
    if (_currentState.loopStack.length === 0) {
      throw new RuntimeError("'break' outside loop");
    }
    // get most recent loop bounds by grabbing the top.
    let startStop: [number, number] =
      _currentState.loopStack[_currentState.loopStack.length - 1];
    // jump to whereever we should break to. Set PC to that - 1 because main loop will increment it as part of
    // interpreter loop.
    _currentState.programCounter = startStop[1];
  }
}

export class ContinueCommand extends Command {
  constructor() {
    super();
  }
  do(_currentState: State) {
    if (_currentState.loopStack.length === 0) {
      throw new RuntimeError("'continue' not properly in loop");
    }
    // get most recent loop bounds by grabbing the top.
    let startStop: [number, number] =
      _currentState.loopStack[_currentState.loopStack.length - 1];
    // jump to whereever we should continue to. Set PC to that - 1 because main loop will increment it as part of
    // interpreter loop.
    _currentState.programCounter = startStop[0] - 1;
  }
}

// ConditionalJumpCommand -> jumps to line if condition in loop is true/false
// Used exclusively by if, while, for statements. only jumps if a conidtion (from the stack) evaluates to true/false.
// Example of use case:
// x > 5 gets evaluated, pushes True or False. ConditionalJumpCommand(2) would execute the next two commands, False would jump forward 2 commands.
export class ConditionalJumpCommand extends Command {
  private _commandsToJump: number;
  constructor(_commandsToJump: number) {
    super();
    this._commandsToJump = _commandsToJump;
  }
  do(_currentState: State) {
    const condition = _currentState.evaluationStack.pop()!; // true or false depending on
    const boolCondition = Boolean(condition);
    if (condition === undefined) {
      throw new RuntimeError(
        "Problem within conditional jump (condition evaluated to undefined)",
      );
    }
    // shoudl we jump?
    if (boolCondition === false) {
      _currentState.programCounter += this._commandsToJump - 1; // subtract 1 because stepForward increments PC;
    }
    // PC should be incremented normally.
  }
}

// JumpCommand -> jumps to a line number
// Used whenever want to always jump, end of loop is a great example.
// Use case:
// JumpCommand(2) -> skips two statements in block via skipping the commands themselves.
export class JumpCommand extends Command {
  private _commandsToJump: number;
  constructor(_commandsToJump: number) {
    super();
    this._commandsToJump = _commandsToJump;
  }
  do(_currentState: State) {
    this._undoCommand = new JumpCommand(_currentState.programCounter);
    // jump to a new position within the command array.
    _currentState.programCounter += this._commandsToJump - 1;
  }
}

// Pops value off Evaluation Stack during Expression processing.
export class PopValueCommand extends Command {
  do(_currentState: State) {
    let value: PythonValue;
    value = _currentState.evaluationStack.pop()!; // pop value and store in member
    this._undoCommand = new PushValueCommand(value);
    return value;
  }
}

// Highlights expression that is being evaluated.
export class HighlightExpressionCommand extends Command {
  private _expression: ExpressionNode;
  constructor(_expression: ExpressionNode) {
    super(); // call superclass constructor
    this._expression = _expression;
  }

  do(_currentState: State) {
    const previousExpression = _currentState.currentExpression;
    if (previousExpression) {
      this._undoCommand = new HighlightExpressionCommand(previousExpression);
    }

    _currentState.currentExpression = this._expression;
    const exprType = this._expression.constructor.name;
    const tok = this._expression._tok
      ? `"${this._expression._tok.text}" at line ${this._expression._tok.line}`
      : `at line ${this._expression.lineNum}`;
    console.log(`Highlight in UI: [EXPR] ${exprType}: ${tok}`);
  }
}

// Should grab current value of variable.
export class RetrieveValueCommand extends Command {
  private _varName: string;
  constructor(_varName: string) {
    super();
    this._varName = _varName;
  }
  do(_currentState: State) {
    try {
      const value = _currentState.getVariable(this._varName);
      this._undoCommand = new PopValueCommand();
      _currentState.evaluationStack.push(value);
    } catch (error) {
      if (error instanceof NameError) {
        _currentState.error = error;
      }
      throw error;
    }
  }
}

export class MoveLinePointerCommand extends Command {
  private _lineNum: number;
  constructor(_lineNum: number) {
    super();
    this._lineNum = _lineNum;
  }

  do(_currentState: State) {
    this._undoCommand = new MoveLinePointerCommand(
      _currentState.programCounter,
    );
    _currentState.programCounter = this._lineNum;
  }
}

export class HighlightStatementCommand extends Command {
  private _statement: StatementNode;
  constructor(_statement: StatementNode) {
    super();
    this._statement = _statement;
  }
  do(_currentState: State) {
    // Create undocommand that
    const previousStatement = _currentState.currentStatement;
    if (previousStatement) {
      this._undoCommand = new HighlightStatementCommand(previousStatement);
    }

    _currentState.currentStatement = this._statement;
    console.log("Statement Highlighted!");
    // Tell UI somehow to highlight command we want it to.
  }
}

// TODO: call this everywhere too
export class ReplaceHighlightedExpressionCommand extends Command {
  private _oldExpression: ExpressionNode;
  private _newExpression: ExpressionNode;
  constructor(_oldExpression: ExpressionNode, _newExpression: ExpressionNode) {
    super();
    this._oldExpression = _oldExpression;
    this._newExpression = _newExpression;
  }
  do(_currentState: State) {
    this._undoCommand = new ReplaceHighlightedExpressionCommand(
      this._newExpression,
      this._oldExpression,
    );
    _currentState.currentExpression = this._newExpression;
  }
}

// For evaluating arithmetic operations
export class BinaryOpCommand extends Command {
  private _op: BinaryOp;
  constructor(_op: BinaryOp) {
    super();
    this._op = _op;
  }
  do(_currentState: State) {
    const evaluatedRight = _currentState.evaluationStack.pop()!; // always pop right first!!
    const evaluatedLeft = _currentState.evaluationStack.pop()!;
    console.log(
      `BinaryOp ${this._op}: left=${evaluatedLeft}, right=${evaluatedRight}`,
    ); // DEBUG
    let res: PythonValue = 0;

    if (
      this._op === "+" &&
      typeof evaluatedLeft === "string" &&
      typeof evaluatedRight === "string"
    ) {
      res = evaluatedLeft + evaluatedRight;
    }

    if (
      typeof evaluatedLeft === "number" &&
      typeof evaluatedRight === "number"
    ) {
      switch (this._op) {
        case "+":
          res = evaluatedLeft + evaluatedRight;
          break;
        case "-":
          res = evaluatedLeft - evaluatedRight;
          break;
        case "%":
          if (evaluatedRight === 0) {
            throw new ZeroDivisionError("integer division or modulo by zero");
          }
          res = evaluatedLeft % evaluatedRight;
          break;
        case "*":
          res = evaluatedLeft * evaluatedRight;
          break;
        case "**":
          res = evaluatedLeft ** evaluatedRight;
          break;
        case "/":
          if (evaluatedRight === 0) {
            throw new ZeroDivisionError("integer division or modulo by zero");
          }
          res = evaluatedLeft / evaluatedRight;
          break;
        case "//":
          if (evaluatedRight === 0) {
            throw new ZeroDivisionError("integer division or modulo by zero");
          }
          res = Math.floor(evaluatedLeft / evaluatedRight);
          break;
        case "and":
          res = evaluatedLeft && evaluatedRight;
          break;
        case "or":
          res = evaluatedRight || evaluatedRight;
          break;
      }
    }
    _currentState.evaluationStack.push(res);
    console.log(`BinaryOp result: ${res}`);

    this._undoCommand = new (class extends Command {
      do(state: State) {
        state.evaluationStack.pop(); // pop the result.
        state.evaluationStack.push(evaluatedLeft); // restore the left
        state.evaluationStack.push(evaluatedRight); // restore the right
      }
    })();
  }
}

export class ComparisonOpCommand extends Command {
  private _op: ComparisonOp;
  constructor(_op: ComparisonOp) {
    super();
    this._op = _op;
  }
  do(_currentState: State) {
    const evaluatedRight = _currentState.evaluationStack.pop()!; // right should be popped first.
    const evaluatedLeft = _currentState.evaluationStack.pop()!;
    //console.log(`Left: ${evaluatedLeft}, Right: ${evaluatedRight}`);
    //console.log(`Operator: ${this._op == ">"}`);
    let res: Boolean = false;

    switch (this._op.toString()) {
      case "<":
        res = evaluatedLeft < evaluatedRight;
        break;
      case ">":
        res = evaluatedLeft > evaluatedRight;
        break;
      case "<=":
        res = evaluatedLeft <= evaluatedRight;
        break;
      case ">=":
        res = evaluatedLeft >= evaluatedRight;
        break;
      case "!=":
        res = evaluatedLeft != evaluatedRight;
        break;
      case "==":
        res = evaluatedLeft === evaluatedRight;
        break;
      default:
        res = false;
    }
    _currentState.evaluationStack.push(res);

    this._undoCommand = new (class extends Command {
      do(state: State) {
        state.evaluationStack.pop();
        state.evaluationStack.push(evaluatedLeft);
        state.evaluationStack.push(evaluatedRight);
      }
    })();
  }
}

export class UnaryOpCommand extends Command {
  private _operator: UnaryOp;
  constructor(_operator: UnaryOp) {
    super();
    this._operator = _operator;
  }
  do(_currentState: State) {
    let operand = _currentState.evaluationStack.pop()!;
    let res: PythonValue = 0;

    switch (this._operator) {
      case "-":
        if (typeof operand !== "number") {
          throw new TypeError(
            `bad operand type for unary -: '${typeof operand}'`,
          );
        }
        res = -operand;
        break;
      case "+":
        if (typeof operand !== "number") {
          throw new TypeError(
            `bad operand type for unary +: '${typeof operand}'`,
          );
        }
        res = operand;
        break;
      case "!":
        res = !operand;
        break;
      case "not":
        res = !operand;
        break;
    }
    _currentState.evaluationStack.push(res);

    this._undoCommand = new (class extends Command {
      do(state: State) {
        state.evaluationStack.pop();
        state.evaluationStack.push(operand);
      }
    })();
  }
}

// EnterScopeCommand -> keeps local storage within functions/conditiionals/etc..
export class EnterScopeCommand extends Command {
  private _savedVariables: Map<string, PythonValue>; // place to store current state of variables before we enter function scope.
  constructor(_savedVariables: Map<string, PythonValue>) {
    super();
    this._savedVariables = _savedVariables;
  }
  do(_currentState: State) {
    this._savedVariables = new Map(_currentState.variables); // create new map for local variables only.
    this._undoCommand = new ExitScopeCommand(this._savedVariables); // restore previous variables.
  }
}

// ExitScopeCommand -> exit scope and restore previous variable state.
export class ExitScopeCommand extends Command {
  private _previousVariables: Map<string, PythonValue>;
  constructor(_previousVariables: Map<string, PythonValue>) {
    super();
    this._previousVariables = _previousVariables;
  }
  do(_currentState: State) {
    const currentVariables = new Map(_currentState.variables); // create copy of current variables set in scope. (local)
    this._undoCommand = new ExitScopeCommand(currentVariables); // undo is going back in scope, so restore variabels to local ones.

    _currentState.variables.clear(); // clear all local variables.
    this._previousVariables.forEach((value, key) => {
      // iterate over all previous variables
      _currentState.setVariable(key, value); // set each one by one to restore state.
    });
  }
}

// AppendCommand
export class AppendCommand extends Command {
  constructor() {
    super();
  }
  do(_currentState: State) {
    const argsList = _currentState.evaluationStack.pop()!;
    const list = _currentState.evaluationStack.pop()!;
    // let newList;
    if (Array.isArray(list)) {
      if (argsList !== undefined) {
        list.push(argsList);
        _currentState.evaluationStack.push(null);
      }
    }
    // this._undoCommand = new PushValueCommand(value);
  }
}

// CountCommand
export class CountCommand extends Command {
  constructor() {
    super();
  }
  do(_currentState: State) {
    const argsList = _currentState.evaluationStack.pop()!;
    const list = _currentState.evaluationStack.pop()!;
    if (Array.isArray(list)) {
      if (argsList !== undefined) {
        const count = list.filter((elem) => elem === argsList).length;
        _currentState.evaluationStack.push(count);
      }
    }
    // this._undoCommand = new PushValueCommand(value);
  }
}

export class PopCommand extends Command {
  constructor() {
    super();
  }
  do(_currentState: State) {
    // const argsList = _currentState.evaluationStack.pop()!;
    const list = _currentState.evaluationStack.pop()!;
    let poppedValue;
    if (Array.isArray(list)) {
      console.log(list);
      poppedValue = list.pop();

      _currentState.evaluationStack.push(poppedValue);
    }
    // this._undoCommand = new PushValueCommand(value);
  }
}

export class SortCommand extends Command {
  constructor() {
    super();
  }
  do(_currentState: State) {
    // const argsList = _currentState.evaluationStack.pop()!;
    const list = _currentState.evaluationStack.pop()!;
    if (Array.isArray(list)) {
      // if (argsList !== undefined) {
      list.sort();
      _currentState.evaluationStack.push(null);
      // }
    }
    // this._undoCommand = new PushValueCommand(value);
  }
}

export class RemoveCommand extends Command {
  constructor() {
    super();
  }
  do(_currentState: State) {
    const argsList = _currentState.evaluationStack.pop()!;
    const list = _currentState.evaluationStack.pop()!;
    if (Array.isArray(list)) {
      if (argsList !== undefined) {
        const index = list.indexOf(argsList);
        if (index > -1) {
          list.splice(index, 1);
          _currentState.evaluationStack.push(null);
        }
      }
    }
    // this._undoCommand = new PushValueCommand(value);
  }
}

export class IndexCommand extends Command {
  constructor() {
    super();
  }
  do(_currentState: State) {
    const argsList = _currentState.evaluationStack.pop()!;
    const list = _currentState.evaluationStack.pop()!;
    if (Array.isArray(list)) {
      if (argsList !== undefined) {
        _currentState.evaluationStack.push(list.indexOf(argsList));
      }
    }
    // this._undoCommand = new PushValueCommand(value);
  }
}

export class ReverseCommand extends Command {
  constructor() {
    super();
  }
  do(_currentState: State) {
    // const argsList = _currentState.evaluationStack.pop()!;
    const list = _currentState.evaluationStack.pop()!;
    if (Array.isArray(list)) {
      // if (argsList !== undefined) {
      _currentState.evaluationStack.push(list.reverse());
      // }
    }
    // this._undoCommand = new PushValueCommand(value);
  }
}

export class ContainsCommand extends Command {
  constructor() {
    super();
  }
  do(_currentState: State) {
    const argsList = _currentState.evaluationStack.pop()!;
    const list = _currentState.evaluationStack.pop()!;
    if (Array.isArray(list)) {
      if (argsList !== undefined) {
        _currentState.evaluationStack.push(list.includes(argsList));
      }
    }
    // this._undoCommand = new PushValueCommand(value);
  }
}

// PrintCommand -> prints something to the console.
export class PrintCommand extends Command {
  constructor() {
    super();
  }
  do(_currentState: State) {
    const value = _currentState.evaluationStack.pop()!;
    _currentState.addOutput(String(value));
    // this._undoCommand = new PushValueCommand(value);
  }
}

// LenCommand -> gets length of strings and lists, etc...
export class LenCommand extends Command {
  constructor() {
    super();
  }
  do(_currentState: State) {
    const value = _currentState.evaluationStack.pop()!;
    // let length = 0;
    if (typeof value === "string") {
      _currentState.evaluationStack.push(value.length);
    } else if (Array.isArray(value)) {
      _currentState.evaluationStack.push(value.length);
    }
  }
}

// TypeCommand -> returns type of value
export class TypeCommand extends Command {
  constructor() {
    super();
  }
  do(_currentState: State) {
    const value = _currentState.evaluationStack.pop()!;
    if (Array.isArray(value)) {
      _currentState.evaluationStack.push("<class 'list'>");
    } else if (typeof value === "number") {
      _currentState.evaluationStack.push("<class 'int'>");
    } else {
      _currentState.evaluationStack.push(typeof value);
    }
  }
}

// RangeCommand -> for range() function
export class RangeCommand extends Command {
  private _numArgs: number;

  constructor(numArgs: number) {
    super();
    this._numArgs = numArgs;
  }

  do(_currentState: State) {
    let start = 0;
    let stop = 0;
    let step = 1;

    if (this._numArgs === 1) {
      stop = Number(_currentState.evaluationStack.pop());
    } else if (this._numArgs === 2) {
      const stopVal = _currentState.evaluationStack.pop();
      const startVal = _currentState.evaluationStack.pop();
      start = Number(startVal);
      stop = Number(stopVal);
    } else if (this._numArgs === 3) {
      const stepVal = _currentState.evaluationStack.pop();
      const stopVal = _currentState.evaluationStack.pop();
      const startVal = _currentState.evaluationStack.pop();
      start = Number(startVal);
      stop = Number(stopVal);
      step = Number(stepVal);
    }

    const result: number[] = [];
    if (step > 0) {
      for (let i = start; i < stop; i += step) {
        result.push(i);
      }
    } else if (step < 0) {
      for (let i = start; i > stop; i += step) {
        result.push(i);
      }
    }
    _currentState.setVariable("iterable", result); // show range iterable in preview.
    _currentState.evaluationStack.push(result);
  }
}

// InputCommand -> cin for user input
export class InputCommand extends Command {
  constructor() {
    super();
  }
  do(_currentState: State) {
    const promptValue = _currentState.evaluationStack.pop()!;
    const promptMessage = String(promptValue);

    // pop up browser prompt dialog and get user input through that.
    const userInput = prompt(promptMessage);

    // if user clicks cancel, userInput will be null -> we default to empty string
    const result = userInput !== null ? userInput : "";
    _currentState.evaluationStack.push(result);
  }
}

// IndexAccessCommand -> arr[5]
// ONLY HANDLES LISTS/ARRAYS right now, TODO: add string and list literal support.
export class IndexAccessCommand extends Command {
  do(_currentState: State) {
    const index = _currentState.evaluationStack.pop();
    const list = _currentState.evaluationStack.pop();
    let newindex: number = 0;
    if (typeof index === "number") {
      newindex = Number(index);
    } else if (typeof index === "number") {
      newindex = index;
    }
    // at the end of the day, we need to verify these types if there was some problem in the popped stack values.
    if (Array.isArray(list) || typeof list === "string") {
      this._undoCommand = new PopValueCommand(); // placeholder
      _currentState.evaluationStack.push(list[newindex]);
    }
  }
}

export class ListSliceCommand extends Command {
  do(_currentState: State) {
    let step = _currentState.evaluationStack.pop();
    let end = _currentState.evaluationStack.pop();
    let start = _currentState.evaluationStack.pop();
    let list = _currentState.evaluationStack.pop();

    // convert to numbers
    let startIndex = start === null ? 0 : Number(start);
    let endIndex = end === null ? 0 : Number(end);
    let stepIndex = step === null ? 1 : Number(step); // we by default step by 1

    // handle arrays first
    if (Array.isArray(list)) {
      // handle negative indices first.
      if (startIndex < 0) {
        startIndex = list.length + startIndex;
      }
      if (endIndex < 0) {
        endIndex = list.length + endIndex;
      }
      // then we slice.
      let result: PythonValue[] = [];
      if (stepIndex > 0) {
        for (
          let i = startIndex;
          i < endIndex && i < list.length;
          i += stepIndex
        ) {
          result.push(list[i]);
        }
      } else if (stepIndex < 0) {
        for (let i = startIndex; i > endIndex && i >= 0; i += stepIndex) {
          result.push(list[i]);
        }
      }
      _currentState.evaluationStack.push(result);
    } else if (typeof list === "string") {
      let result: string = "";

      if (startIndex < 0) {
        startIndex = list.length + startIndex;
      }
      if (endIndex < 0) {
        endIndex = list.length + endIndex;
      }
      if (stepIndex > 0) {
        for (
          let i = startIndex;
          i < endIndex && i < list.length;
          i += stepIndex
        ) {
          result += list[i];
        }
      } else if (stepIndex < 0) {
        for (let i = startIndex; i > endIndex && i >= 0; i += stepIndex) {
          result += list[i];
        }
      }
      _currentState.evaluationStack.push(result);
    }
  }
}

// CreateListCommand -> Creates a list of values
export class CreateListCommand extends Command {
  private _count: number;

  constructor(_count: number) {
    super();
    this._count = _count;
  }

  do(_currentState: State) {
    const list: PythonValue[] = [];

    // Pop elements in REVERSE order, then add them to the front array to maintain initial order.
    for (let i = 0; i < this._count; i++) {
      const elem: PythonValue = _currentState.evaluationStack.pop()!;
      list.unshift(elem);
    }

    _currentState.evaluationStack.push(list);
  }
}

export class ReturnCommand extends Command {
  constructor() {
    super();
  }
  do(_currentState: State) {
    console.log("ReturnCommand - eval stack before pop:", [
      ..._currentState.evaluationStack,
    ]);
    const value = _currentState.evaluationStack.pop()!;
    console.log("ReturnCommand - popped value:", value);
    _currentState.pushReturnStack(value);
  }
}

// TYPE CONVERTER SECTION
// int(), str(), float(), bool(), list()

export class IntCommand extends Command {
  constructor() {
    super();
  }

  do(_currentState: State) {
    const value = _currentState.evaluationStack.pop()!;
    let result: number;

    if (typeof value === "number") {
      // value is already a number, just truncate (removes any fraction or decimals)
      result = Math.trunc(value);
    } else if (typeof value === "string") {
      const parsed = parseInt(value, 10);
      result = parsed;
    } else if (typeof value === "boolean") {
      result = value ? 1 : 0;
    } else if (value === null) {
      console.error("argument for int() cannot be null");
      result = 0;
    } else {
      console.error("bad argument for int()");
      result = 0;
    }

    _currentState.evaluationStack.push(result);
  }
}

// 2. FloatCommand - float()
export class FloatCommand extends Command {
  constructor() {
    super();
  }

  do(_currentState: State) {
    const value = _currentState.evaluationStack.pop()!;
    let result: number;

    if (typeof value === "number") {
      result = value;
    } else if (typeof value === "string") {
      const parsed = parseFloat(value);
      result = parsed;
    } else if (typeof value === "boolean") {
      result = value ? 1.0 : 0.0;
    } else {
      console.error(
        "argument for float() must be a number, string, or boolean.",
      );
      result = 0.0;
    }

    _currentState.evaluationStack.push(result);
  }
}

// 3. StrCommand - str()
export class StrCommand extends Command {
  constructor() {
    super();
  }

  do(_currentState: State) {
    const value = _currentState.evaluationStack.pop()!;
    let result: string;

    if (typeof value === "string") {
      result = value;
    } else if (typeof value === "number") {
      result = String(value);
    } else if (typeof value === "boolean") {
      result = value ? "True" : "False";
    } else if (value === null) {
      result = "None";
    } else if (Array.isArray(value)) {
      // list converstion to string. We can do this by mapping over the array and concatenating values as we go through elements.
      result =
        "[" +
        value
          .map((v) => {
            if (typeof v === "string") return `'${v}'`;
            if (v === null) return "None";
            if (typeof v === "boolean") return v ? "True" : "False";
            return String(v);
          })
          .join(", ") +
        "]";
    } else {
      result = String(value);
    }

    _currentState.evaluationStack.push(result);
  }
}

// 4. BoolCommand - bool()
export class BoolCommand extends Command {
  constructor() {
    super();
  }

  do(_currentState: State) {
    const value = _currentState.evaluationStack.pop()!;
    let result: boolean;

    if (value === null || value === false) {
      result = false;
    } else if (typeof value === "number") {
      result = value !== 0;
    } else if (typeof value === "string") {
      result = value.length > 0;
    } else if (Array.isArray(value)) {
      result = value.length > 0;
    } else if (typeof value === "boolean") {
      result = value;
    } else {
      result = true;
    }

    _currentState.evaluationStack.push(result);
  }
}

// 5. ListCommand - list()
export class ListCommand extends Command {
  constructor() {
    super();
  }

  do(_currentState: State) {
    const value = _currentState.evaluationStack.pop()!;
    let result: PythonValue[];

    if (Array.isArray(value)) {
      // create copy of array.
      result = [...value];
    } else if (typeof value === "string") {
      // convert string to list of characters to create separate elements
      result = value.split("");
    } else if (value === null) {
      result = [];
    } else {
      console.error("invalid argument for list(), not iterable.");
      result = [];
    }

    _currentState.evaluationStack.push(result);
  }
}

export class CallUserFunctionCommand extends Command {
  private _funcName: string;
  private _numArgs: number;

  constructor(funcName: string, numArgs: number) {
    super();
    this._funcName = funcName;
    this._numArgs = numArgs;
  }

  do(_currentState: State) {
    // pop func object from stack.
    const func = _currentState.getFunction(this._funcName);
    // see if getFunction returns undefined.
    if (!func) {
      throw new NameError(`name '${this._funcName}' is not defined`);
    }

    // pop arguments in reverse order
    const args: PythonValue[] = [];
    for (let i = 0; i < this._numArgs; i++) {
      args.unshift(_currentState.evaluationStack.pop()!);
    }
    console.log(`Calling ${this._funcName} with args:`, args); // DEBUG
    // does the argument count match?
    if (args.length !== func.params.length) {
      throw new TypeError(
        `${this._funcName}() takes ${func.params.length} positional argument${func.params.length !== 1 ? "s" : ""} but ${args.length} ${args.length !== 1 ? "were" : "was"} given`,
      );
    }

    // save current state
    const savedVariables = new Map(_currentState.variables);
    const savedEvaluationStack = [..._currentState.evaluationStack];
    const savedPC = _currentState.programCounter;

    // create new scope with parent variables
    const newScope = new Map(savedVariables);
    for (let i = 0; i < func.params.length; i++) {
      newScope.set(func.params[i], args[i]);
    }

    // clear evaluation stack for clean function execution
    _currentState.evaluationStack.length = 0;
    _currentState.variables = newScope;

    // execute function body
    let returnValue: PythonValue = null;
    for (let i = 0; i < func.body.length; i++) {
      const cmd = func.body[i];
      cmd.do(_currentState);

      if (_currentState.returnStack.length > 0) {
        returnValue = _currentState.popReturnStack()!;
        break;
      }
    }

    // restore previous state (restore the global evalutation stack, variabels and program counter)
    _currentState.evaluationStack.length = 0;
    _currentState.evaluationStack.push(...savedEvaluationStack);
    _currentState.variables = savedVariables;
    _currentState.programCounter = savedPC;

    // Push return value
    _currentState.evaluationStack.push(returnValue);
  }
}

// registers the function in the state.
export class DefineFunctionCommand extends Command {
  private _functionObj: UserFunction;

  constructor(functionObj: UserFunction) {
    super();
    this._functionObj = functionObj;
  }

  do(_currentState: State) {
    _currentState.setFunction(this._functionObj.name, this._functionObj);
  }
}

// finds {variable} patterns and replaces them wiht the actual variable values.
export class InterpolateFStringCommand extends Command {
  private _template: string;

  constructor(template: string) {
    super();
    this._template = template;
  }

  do(_currentState: State) {
    // find all {variable} patterns
    const pattern = /\{([a-zA-Z_][a-zA-Z0-9_]*)\}/g;

    let result = this._template;
    let match;

    while ((match = pattern.exec(this._template)) !== null) {
      const varName = match[1];
      const value = _currentState.getVariable(varName);

      if (value === null) {
        throw new NameError(`name '${varName}' is not defined`);
      }

      // replace {varName} with the actual value (string representation since we are interpolating)
      result = result.replace(`{${varName}}`, String(value));
    }

    _currentState.evaluationStack.push(result);
  }
}
