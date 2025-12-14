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
  private _scopeStack: Map<string, PythonValue>[]; // stack of scopes
  private _scopeNames: string[]; // things like Global, "add" (function) etc...

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
    _scopeStack = [new Map()],
    _scopeNames = ["Global"],
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
    this._scopeStack = _scopeStack;
    this._scopeNames = _scopeNames;
  }

  public get scopeStack() {
    return this._scopeStack;
  }

  public get scopeNames() {
    return this._scopeNames;
  }

  // push new scope of current variables map. push scope name as well.
  public pushScope(name: string) {
    this._scopeStack.push(new Map(this._variables));
    this._scopeNames.push(name);
  }

  // pop scope and scope name
  public popScope() {
    if (this._scopeStack.length > 1) {
      this._scopeStack.pop();
      this._scopeNames.pop();
    }
  }

  // take a "peek" without popping at currentScope.
  public get currentScope(): Map<string, PythonValue> {
    return this._scopeStack[this._scopeStack.length - 1];
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
    return this.currentScope.has(name);
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
    return this.currentScope;
  }

  public set variables(vars: Map<string, PythonValue | PythonValue[]>) {
    this._scopeStack[this._scopeStack.length - 1] = vars;
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
    this.currentScope.set(name, value);
  } // adds new key value into variables map.
  public getVariable(name: string): PythonValue | PythonValue[] {
    const v = this.currentScope.get(name);
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
          _currentState.error = new RuntimeError(
            "Stack underflow during list assignment",
          );
        }

        if (typeof index !== "number") {
          _currentState.error = new TypeError(
            `list indices must be integers, not ${typeof index}`,
          );
        }

        if (!Array.isArray(list)) {
          _currentState.error = new TypeError(
            `'${typeof list}' object does not support item assignment`,
          );
        }

        let actualIndex = index;
        if (actualIndex < 0) {
          actualIndex = list.length + actualIndex;
        }

        if (actualIndex < 0 || actualIndex >= list.length) {
          _currentState.error = new IndexError(
            `list assignment index out of range`,
          );
        }
        const name = this._name;
        const oldValue = list[actualIndex];
        list[actualIndex] = value;
        // list assignment undo
        this._undoCommand = new (class extends Command {
          do(state: State) {
            state.evaluationStack.push(list);
            state.evaluationStack.push(actualIndex);
            state.evaluationStack.push(oldValue);
            new AssignVariableCommand(name).do(state);
          }
        })();
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
            const oldValue = _currentState.getVariable(this._name);
            const oldIndex = currentIndex;
            const name = this._name;
            _currentState.setVariable(this._name, nextItem);
            _currentState.loopIterationState.set(this._name, currentIndex + 1);
            _currentState.evaluationStack.push(iterable);
            _currentState.evaluationStack.push(true);
            this._undoCommand = new (class extends Command {
              do(state: State) {
                state.evaluationStack.pop(); // pop true
                state.evaluationStack.pop(); // pop iterable
                state.setVariable(name, oldValue);
                state.loopIterationState.set(name, oldIndex);
                state.evaluationStack.push(iterable);
              }
            })();
          } else {
            _currentState.evaluationStack.push(false);
            this._undoCommand = new (class extends Command {
              do(state: State) {
                state.evaluationStack.pop(); // pop false
                state.evaluationStack.push(iterable);
              }
            })();
            _currentState.loopIterationState.delete(this._name);
          }
        } else {
          _currentState.evaluationStack.push(false);
          this._undoCommand = new (class extends Command {
            do(state: State) {
              state.evaluationStack.pop();
            }
          })();
        }
      } else {
        // normal assignment
        const newValue = _currentState.evaluationStack.pop();

        if (newValue === undefined) {
          _currentState.error = new RuntimeError(
            "Stack underflow during variable assignment",
          );
        }
        const oldValue = _currentState.getVariable(this._name);
        const hadVariable = _currentState.hasVariable(this._name);
        const name = this._name;
        _currentState.setVariable(this._name, newValue);

        this._undoCommand = new (class extends Command {
          do(state: State) {
            if (hadVariable) {
              state.setVariable(name, oldValue);
            } else {
              state.variables.delete(name);
            }
            state.evaluationStack.push(newValue);
          }
        })();
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
      _currentState.error = new RuntimeError("'break' outside loop");
    }
    // store oldPC for undo so we can go back to it.
    const oldPC = _currentState.programCounter;
    // get most recent loop bounds by grabbing the top.
    let startStop: [number, number] =
      _currentState.loopStack[_currentState.loopStack.length - 1];
    // jump to whereever we should break to. Set PC to that - 1 because main loop will increment it as part of
    // interpreter loop.
    _currentState.programCounter = startStop[1];

    this._undoCommand = new (class extends Command {
      do(state: State) {
        state.programCounter = oldPC;
      }
    })();
  }
}

export class ContinueCommand extends Command {
  constructor() {
    super();
  }
  do(_currentState: State) {
    if (_currentState.loopStack.length === 0) {
      _currentState.error = new RuntimeError("'continue' not properly in loop");
    }
    const oldPC = _currentState.programCounter;
    // get most recent loop bounds by grabbing the top.
    let startStop: [number, number] =
      _currentState.loopStack[_currentState.loopStack.length - 1];
    // jump to whereever we should continue to. Set PC to that - 1 because main loop will increment it as part of
    // interpreter loop.
    _currentState.programCounter = startStop[0] - 1;

    this._undoCommand = new (class extends Command {
      do(state: State) {
        state.programCounter = oldPC;
      }
    })();
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
    console.log(
      `ConditionalJump: condition=${condition}, bool=${boolCondition}, jump=${this._commandsToJump}`,
    );

    if (condition === undefined) {
      _currentState.error = new RuntimeError(
        "Problem within conditional jump (condition evaluated to undefined)",
      );
    }

    const oldPC = _currentState.programCounter;
    // shoudl we jump?
    if (boolCondition === false) {
      console.log(`Jumping forward ${this._commandsToJump - 1} commands`);
      _currentState.programCounter += this._commandsToJump - 1; // subtract 1 because stepForward increments PC;
    } else {
      console.log(`Not jumping, executing then branch`);
    }

    this._undoCommand = new (class extends Command {
      do(state: State) {
        state.programCounter = oldPC;
        state.evaluationStack.push(condition);
      }
    })();
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
      if (!_currentState.hasVariable(this._varName)) {
        _currentState.error = new NameError(
          `name '${this._varName}' is not defined`,
        );
      }
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
    );
    let res: PythonValue = 0;

    if (
      this._op === "+" &&
      typeof evaluatedLeft === "string" &&
      typeof evaluatedRight === "string"
    ) {
      res = evaluatedLeft + evaluatedRight;
    } else if (this._op === "and") {
      res = evaluatedLeft && evaluatedRight;
    } else if (this._op === "or") {
      res = evaluatedLeft || evaluatedRight;
    } else if (
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
            _currentState.error = new ZeroDivisionError(
              "integer division or modulo by zero",
            );
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
            _currentState.error = new ZeroDivisionError(
              "integer division or modulo by zero",
            );
          }
          res = evaluatedLeft / evaluatedRight;
          break;
        case "//":
          if (evaluatedRight === 0) {
            _currentState.error = new ZeroDivisionError(
              "integer division or modulo by zero",
            );
          }
          res = Math.floor(evaluatedLeft / evaluatedRight);
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
    console.log(
      `Comparison: ${evaluatedLeft} ${this._op} ${evaluatedRight} = ${res}`,
    );
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
          _currentState.error = new TypeError(
            `bad operand type for unary minus : '${typeof operand}'`,
          );
        }
        res = -operand;
        break;
      case "+":
        if (typeof operand !== "number") {
          _currentState.error = new TypeError(
            `bad operand type for unary plus : '${typeof operand}'`,
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
        this._undoCommand = new (class extends Command {
          do(state: State) {
            list.pop();
            state.evaluationStack.push(list);
            state.evaluationStack.push(argsList);
          }
        })();
        // _currentState.evaluationStack.push(null);
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

        this._undoCommand = new (class extends Command {
          do(state: State) {
            state.evaluationStack.pop();
            state.evaluationStack.push(list);
            state.evaluationStack.push(argsList);
          }
        })();
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
      this._undoCommand = new (class extends Command {
        do(state: State) {
          state.evaluationStack.pop();
          list.push(poppedValue);
          state.evaluationStack.push(list);
        }
      })();
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
      const originalOrder = [...list];
      list.sort();

      this._undoCommand = new (class extends Command {
        do(state: State) {
          list.length = 0;
          list.push(...originalOrder);
          state.evaluationStack.push(list);
        }
      })();
      // _currentState.evaluationStack.push(null);
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
          this._undoCommand = new (class extends Command {
            do(state: State) {
              list.splice(index, 0, argsList);
              state.evaluationStack.push(list);
              state.evaluationStack.push(argsList);
            }
          })();
          // _currentState.evaluationStack.push(null);
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
        this._undoCommand = new (class extends Command {
          do(state: State) {
            state.evaluationStack.pop();
            state.evaluationStack.push(list);
            state.evaluationStack.push(argsList);
          }
        })();
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
      const originalOrder = [...list];
      // if (argsList !== undefined) {
      _currentState.evaluationStack.push(list.reverse());
      this._undoCommand = new (class extends Command {
        do(state: State) {
          state.evaluationStack.pop();
          list.length = 0;
          list.push(...originalOrder);
          state.evaluationStack.push(list);
        }
      })();
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
        this._undoCommand = new (class extends Command {
          do(state: State) {
            state.evaluationStack.pop();
            state.evaluationStack.push(list);
            state.evaluationStack.push(argsList);
          }
        })();
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
    let output: string;
    if (typeof value === "string") {
      output = value;
    } else if (Array.isArray(value)) {
      output =
        "[" +
        value
          .map((v) => {
            if (typeof v === "string") return v;
            if (v === null) return "None";
            if (typeof v === "boolean") return v ? "True" : "False";
            return String(v);
          })
          .join(", ") +
        "]";
    } else if (value === null) {
      output = "None";
    } else if (typeof value === "boolean") {
      output = value ? "True" : "False";
    } else {
      output = String(value);
    }

    _currentState.addOutput(output);
    this._undoCommand = new (class extends Command {
      do(state: State) {
        state.removeLastOutput();
        state.evaluationStack.push(value);
      }
    })();
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
    this._undoCommand = new (class extends Command {
      do(state: State) {
        state.evaluationStack.pop();
        state.evaluationStack.push(value);
      }
    })();
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
    this._undoCommand = new (class extends Command {
      do(state: State) {
        state.evaluationStack.pop();
        state.evaluationStack.push(value);
      }
    })();
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
    let args: PythonValue[] = [];

    if (this._numArgs === 1) {
      stop = Number(_currentState.evaluationStack.pop());
      args.push(stop);
    } else if (this._numArgs === 2) {
      const stopVal = _currentState.evaluationStack.pop();
      const startVal = _currentState.evaluationStack.pop();
      start = Number(startVal);
      stop = Number(stopVal);
      args.push(start);
      args.push(stop);
    } else if (this._numArgs === 3) {
      const stepVal = _currentState.evaluationStack.pop();
      const stopVal = _currentState.evaluationStack.pop();
      const startVal = _currentState.evaluationStack.pop();
      start = Number(startVal);
      stop = Number(stopVal);
      step = Number(stepVal);
      args.push(start);
      args.push(stop);
      args.push(step);
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
    // _currentState.setVariable("iterable", result); // show range iterable in preview.
    _currentState.evaluationStack.push(result);

    this._undoCommand = new (class extends Command {
      do(state: State) {
        state.evaluationStack.pop(); // pop the result array
        // push args back in reverse order
        for (let i = args.length - 1; i >= 0; i--) {
          state.evaluationStack.push(args[i]);
        }
      }
    })();
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

    this._undoCommand = new (class extends Command {
      do(state: State) {
        state.evaluationStack.pop();
        state.evaluationStack.push(promptValue);
      }
    })();
  }
}

// IndexAccessCommand -> arr[5]
// ONLY HANDLES LISTS/ARRAYS right now, TODO: add string and list literal support.
export class IndexAccessCommand extends Command {
  do(_currentState: State) {
    const index = _currentState.evaluationStack.pop();
    const list = _currentState.evaluationStack.pop();

    if (typeof index !== "number") {
      _currentState.error = new TypeError(`index must be a number`);
    }

    let actualIndex = index;
    if (Array.isArray(list) || typeof list === "string") {
      // handle negative indices / calculate offset
      if (actualIndex < 0) {
        actualIndex = list.length + actualIndex;
      }

      // check bounds
      if (actualIndex < 0 || actualIndex >= list.length) {
        _currentState.error = new IndexError(`list index out of range`);
      }

      _currentState.evaluationStack.push(list[actualIndex]);
      this._undoCommand = new (class extends Command {
        do(state: State) {
          state.evaluationStack.pop();
          state.evaluationStack.push(list);
          state.evaluationStack.push(index);
        }
      })();
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
    // let endIndex = end === null ? 0 : Number(end);
    let stepIndex = step === null ? 1 : Number(step); // we by default step by 1

    // handle arrays first
    if (Array.isArray(list)) {
      let endIndex: number;
      if (end === null) {
        endIndex = stepIndex > 0 ? list.length : -1;
      } else {
        endIndex = Number(end);
      }
      // handle negative indices first.
      if (startIndex < 0) {
        startIndex = list.length + startIndex;
      }
      if (endIndex < 0 && endIndex !== null) {
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
      let endIndex: number;
      if (end === null) {
        endIndex = stepIndex > 0 ? list.length : -1;
      } else {
        endIndex = Number(end);
      }

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
      this._undoCommand = new (class extends Command {
        do(state: State) {
          state.evaluationStack.pop();
          state.evaluationStack.push(list);
          state.evaluationStack.push(start!);
          state.evaluationStack.push(end!);
          state.evaluationStack.push(step!);
        }
      })();
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
    const poppedElements: PythonValue[] = [];
    // Pop elements in REVERSE order, then add them to the front array to maintain initial order.
    for (let i = 0; i < this._count; i++) {
      const elem: PythonValue = _currentState.evaluationStack.pop()!;
      poppedElements.push(elem);
      list.unshift(elem);
    }

    _currentState.evaluationStack.push(list);
    this._undoCommand = new (class extends Command {
      do(state: State) {
        state.evaluationStack.pop(); // pop the list
        // push elements back in reverse order
        for (let i = poppedElements.length - 1; i >= 0; i--) {
          state.evaluationStack.push(poppedElements[i]);
        }
      }
    })();
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
    this._undoCommand = new (class extends Command {
      do(state: State) {
        state.popReturnStack();
        state.evaluationStack.push(value);
      }
    })();
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
    this._undoCommand = new (class extends Command {
      do(state: State) {
        state.evaluationStack.pop();
        state.evaluationStack.push(value);
      }
    })();
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
    this._undoCommand = new (class extends Command {
      do(state: State) {
        state.evaluationStack.pop();
        state.evaluationStack.push(value);
      }
    })();
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
    this._undoCommand = new (class extends Command {
      do(state: State) {
        state.evaluationStack.pop();
        state.evaluationStack.push(value);
      }
    })();
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
    this._undoCommand = new (class extends Command {
      do(state: State) {
        state.evaluationStack.pop();
        state.evaluationStack.push(value);
      }
    })();
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
    this._undoCommand = new (class extends Command {
      do(state: State) {
        state.evaluationStack.pop();
        state.evaluationStack.push(value);
      }
    })();
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
    // NEED TO SAVE STATE BEFORE FUNC EXECUTION TO UNDO
    // const savedEvalStack = [..._currentState.evaluationStack];
    // const savedReturnStack = [..._currentState.returnStack];
    // const savedVariablesForUndo = new Map(_currentState.variables);
    // const savedPCforUndo = _currentState.programCounter;

    // pop func object from stack.
    const func = _currentState.getFunction(this._funcName)!;
    // see if getFunction returns undefined.
    if (!func) {
      _currentState.error = new NameError(
        `name '${this._funcName}' is not defined`,
      );
    }

    console.log(
      `Function ${this._funcName} body has ${func.body.length} commands:`,
    );
    func.body.forEach((cmd, i) => {
      console.log(`  ${i}: ${cmd.constructor.name}`);
    });

    // pop arguments in reverse order
    const args: PythonValue[] = [];
    for (let i = 0; i < this._numArgs; i++) {
      args.unshift(_currentState.evaluationStack.pop()!);
    }
    console.log(`Calling ${this._funcName} with args:`, args);
    // does the argument count match?
    if (args.length !== func.params.length) {
      _currentState.error = new TypeError(
        `${this._funcName}() takes ${func.params.length} positional argument${func.params.length !== 1 ? "s" : ""} but ${args.length} ${args.length !== 1 ? "were" : "was"} given`,
      );
    }

    // save current state
    // const savedVariables = new Map(_currentState.variables);
    const savedEvaluationStack = [..._currentState.evaluationStack];
    const savedPC = _currentState.programCounter;
    const savedStatement = _currentState.currentStatement;
    const savedExpression = _currentState.currentExpression;

    // create new scope with parent variables
    // const newScope = new Map(savedVariables);
    // for (let i = 0; i < func.params.length; i++) {
    //   newScope.set(func.params[i], args[i]);
    // }

    // // clear evaluation stack for clean function execution
    // _currentState.evaluationStack.length = 0;
    // _currentState.variables = newScope;
    // _currentState.programCounter = 0;

    //push new scope for new function. set parameteres for new scope.
    _currentState.pushScope(this._funcName);
    for (let i = 0; i < func.params.length; i++) {
      _currentState.setVariable(func.params[i], args[i]);
    }
    _currentState.evaluationStack.length = 0;
    _currentState.programCounter = 0;

    // execute function body
    let returnValue: PythonValue = null;
    while (_currentState.programCounter < func.body.length) {
      const cmd = func.body[_currentState.programCounter];
      _currentState.programCounter++;
      cmd.do(_currentState);

      if (_currentState.returnStack.length > 0) {
        returnValue = _currentState.popReturnStack()!;
        break;
      }
    }

    _currentState.popScope();

    // restore previous state (restore the global evalutation stack, variabels and program counter)
    _currentState.evaluationStack.length = 0;
    _currentState.evaluationStack.push(...savedEvaluationStack);
    // _currentState.variables = savedVariables;
    _currentState.programCounter = savedPC;
    _currentState.currentStatement = savedStatement;
    _currentState.currentExpression = savedExpression;

    // Push return value
    _currentState.evaluationStack.push(returnValue);
    // TODO: Implement undo logic for function calls
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
    const hadFunction = _currentState.functionDefinitions.has(
      this._functionObj.name,
    );
    const oldFunction = _currentState.getFunction(this._functionObj.name);
    const funcObjectName = this._functionObj.name;
    _currentState.setFunction(this._functionObj.name, this._functionObj);
    this._undoCommand = new (class extends Command {
      do(state: State) {
        if (hadFunction) {
          state.setFunction(funcObjectName, oldFunction!);
        } else {
          state.functionDefinitions.delete(funcObjectName);
        }
      }
    })();
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
    // this pattern finds all {...} patterns
    const pattern = /\{([^}]+)\}/g;
    // the _template itself is the f string content (including the interpolation)
    // pattern.exec() finds the next match in the string.
    // match[1] is the content inside the curly braces
    let result = this._template;
    const matches: string[] = [];
    let match;

    while ((match = pattern.exec(this._template)) !== null) {
      matches.push(match[1]);
    }

    // loop through every single captured expression.
    // need to triim to remove any whitespace.
    for (const expr of matches) {
      const trimmed = expr.trim();

      // regex checsk to see if it is a valid Python variable name. REJECTS complex expressions!
      if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(trimmed)) {
        // look up variable in state, throw error if not found.
        const value = _currentState.getVariable(trimmed);
        if (value === null && !_currentState.hasVariable(trimmed)) {
          _currentState.error = new NameError(
            `name '${trimmed}' is not defined`,
          );
        }

        let strValue: string;
        if (typeof value === "string") {
          strValue = value;
        } else if (Array.isArray(value)) {
          // format like Python lists
          strValue =
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
        } else if (value === null) {
          strValue = "None";
        } else if (typeof value === "boolean") {
          strValue = value ? "True" : "False";
        } else {
          strValue = String(value);
        }
        // replace the placeholder with the formatted value
        result = result.replace(`{${expr}}`, strValue);
      }
    }

    _currentState.evaluationStack.push(result);

    this._undoCommand = new (class extends Command {
      do(state: State) {
        state.evaluationStack.pop();
      }
    })();
  }
}

// used for grouping multiple sub commands as one step.
export class MacroCommand extends Command {
  private _commands: Command[];

  constructor(commands: Command[]) {
    super();
    this._commands = commands;
  }

  do(_currentState: State) {
    // go through all sub commands and run.
    for (const cmd of this._commands) {
      cmd.do(_currentState);
      if (_currentState.error) break;
    }

    // revereses all of the commands in reverse order.
    // this._undoCommand = new (class extends Command {
    //   do(state: State) {
    //     for (let i = commands.length - 1; i >= 0; i--) {
    //       commands[i].undo(state);
    //     }
    //   }
    // })();
  }
}
