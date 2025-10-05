// ------------------------------------------------------------------
import { PythonValue, BinaryOp, ComparisonOp, UnaryOp, StatementNode, ExpressionNode, ListAccessExpressionNode } from './Nodes';
import * as readline from 'readline';
// ---------------------------------------------------------------------------------------
// INTERFACES AND CLASSES
// ---------------------------------------------------------------------------------------
export abstract class Command {
  protected _undoCommand: Command | null = null;
  abstract do(_currentState: State): void;
  undo(_currentState: State) {
    this._undoCommand?.do(_currentState);
  }
}

// ---------------------------------------------------------------------------------------
// MACHINE STATE
// ---------------------------------------------------------------------------------------

export class State {
  private _programCounter: number = 0; // which line of execution are we on.
  private _lineCount: number = 0; // all lines in program.
  private _currentLine: number = 1; // current line number
  private _currentExpression: ExpressionNode; // current highlighted expression we are evaluating
  private _currentStatement: StatementNode; // what statement are we on
  private _callStack: ExpressionNode[];  // function call stack
  private _history: Command[]; // history of all commands
  private _variables: Map<string, PythonValue> = new Map(); // storage for variables and thier values
  private _evaluationStack: PythonValue[]; // stack for expression evaluation
  private _returnStack: PythonValue[]; // stack for return values

  constructor(_programCounter: number,
              _lineCount: number, 
              _currentExpression: ExpressionNode, 
              _currentStatement: StatementNode, 
              _callStack: ExpressionNode[], 
              _history: Command[], 
              _variables: Map<string, PythonValue>, 
              _currentLine: number, 
              _evaluationStack: PythonValue[],
              _returnStack: PythonValue[]) {
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
  }
  
  public get programCounter() { return this._programCounter; }
  public set programCounter(val: number) { this._programCounter = val; }

  public get lineCount() { return this._lineCount; }
  public set lineCount(val: number) { this._lineCount = val; }

  public get currentLine() { return this._currentLine; }
  public set currentLine(val: number) { this._currentLine = val; }

  public get currentExpression() { return this._currentExpression; }
  public set currentExpression(expr: ExpressionNode) { this._currentExpression = expr; }

  public get currentStatement() { return this._currentStatement; }
  public set currentStatement(stmt: StatementNode) {this._currentStatement = stmt; }

  public get evaluationStack() { return this._evaluationStack; }
  public get variables() { return this._variables; }

  public setVariable(name: string, value: (PythonValue | PythonValue[])) { this._variables.set(name, value); } // adds new key value into variables map.
  public getVariable(name: string): PythonValue | PythonValue[] { return this._variables.get(name) || null; } // could be nullable upon lookup. null is important here.

  public pushCallStack(func: ExpressionNode) { this._callStack.push(func); } // pushes element onto stack
  public popCallStack() { return this._callStack.pop(); } // gets element from top of stack

  public addHistoryCommand(step: Command) { this._history.push(step); }
  public getMostRecentHistoryCommand() { return this._history.pop(); } 

  public pushReturnStack(value: PythonValue) { this._returnStack.push(value); }
  public popReturnStack() { return this._returnStack.pop(); }
}

// ---------------------------------------------------------------------------------------
// COMMANDS
// ---------------------------------------------------------------------------------------

// Take value from top of evaluation stack and store it in a variable.
export class AssignVariableCommand extends Command {
  private _name: string;
  constructor(_name: string) {
    super();
    this._name = _name;
  }
  
  do(_currentState: State) {
    const newValue = _currentState.evaluationStack.pop()!; // get value from evaluation stack
    const oldValue = _currentState.getVariable(this._name); // grab current value of variable from map
    this._undoCommand = new ChangeVariableCommand(this._name, oldValue); // undo command: Change variable BACK to old value.
    _currentState.setVariable(this._name, newValue);
  }
}

// For assignments to a variable. If variable name is not already assigned, it will be assigned.
export class ChangeVariableCommand extends Command {
  private _name: string; // variable name
  private _value: PythonValue; // value to be connected to variable
  constructor(_name: string, _value: PythonValue) {
    super();
    this._name = _name;
    this._value = _value;
  } 

  do(_currentState: State) {
    const oldValue = _currentState.getVariable(this._name); // get current variables value
    this._undoCommand = new ChangeVariableCommand(this._name, oldValue); // undo command: Change variable to old value.
    _currentState.setVariable(this._name, this._value); // set variable to new value passed in
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
    this._undoCommand = new PopValueCommand();
    _currentState.evaluationStack.push(this._value);
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
    this._undoCommand = new HighlightExpressionCommand(_currentState.currentExpression);
    _currentState.currentExpression = this._expression;
    console.log("Expression Highlighted!");
  }
}

// Should grab current value of variable.
export class RetrieveValueCommand extends Command { 
  private _varName: string; // variable name whose value we want to retrieve
  constructor(_varName: string) {
    super();
    this._varName = _varName;
  }
  do(_currentState: State) {
    const value = _currentState.getVariable(this._varName);
    this._undoCommand = new PopValueCommand();
    _currentState.evaluationStack.push(value);
  }
}

export class MoveLinePointerCommand extends Command {
  private _lineNum: number;
  constructor(_lineNum: number) {
    super(); 
    this._lineNum = _lineNum;
  }

  do(_currentState: State) {
    this._undoCommand = new MoveLinePointerCommand(_currentState.programCounter);
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
    this._undoCommand = new HighlightStatementCommand(_currentState.currentStatement);
    _currentState.currentStatement = this._statement;
    console.log("Statement Highlighted!");
    // Tell UI somehow to highlight command we want it to.
  }
}

export class ReplaceHighlightedExpressionCommand extends Command {
  private _oldExpression: ExpressionNode;
  private _newExpression: ExpressionNode;
  constructor(_oldExpression: ExpressionNode, _newExpression: ExpressionNode) {
    super();
    this._oldExpression = _oldExpression;
    this._newExpression = _newExpression;
  }
    do(_currentState: State) {
    this._undoCommand = new ReplaceHighlightedExpressionCommand(this._newExpression, this._oldExpression);
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
      const evaluatedLeft = _currentState.evaluationStack.pop()!;
      const evaluatedRight = _currentState.evaluationStack.pop()!;
      let res: PythonValue = null;

      if (this._op === '+' && (typeof evaluatedLeft === 'string' && typeof evaluatedRight === 'string')) {
        res = evaluatedLeft + evaluatedRight;
      }

      if (typeof evaluatedLeft === 'number' && typeof evaluatedRight === 'number') {
        switch (this._op) {
          case '+':
            res = evaluatedLeft + evaluatedRight;
            break;
          case '-':
            res = evaluatedLeft - evaluatedRight;
            break;
          case '%':
            res = evaluatedLeft % evaluatedRight;
            break;
          case '*':
            res = evaluatedLeft * evaluatedRight;
            break;
          case '//':
            res = Math.floor(evaluatedLeft / evaluatedRight);
            break;
          case '/':
            res = evaluatedLeft / evaluatedRight;
            break;
          case 'and':
            res = evaluatedLeft && evaluatedRight;
            break;
          case 'or':
            res = evaluatedRight || evaluatedRight;
            break;
      }
    }
    _currentState.evaluationStack.push(res);
  }
}

export class ComparisonOpCommand extends Command {
  private _op: ComparisonOp;
  constructor(_op: ComparisonOp) {
    super();
    this._op = _op;
  }
  do(_currentState: State) {
      const evaluatedLeft = _currentState.evaluationStack.pop()!;
      const evaluatedRight = _currentState.evaluationStack.pop()!;
      let res: PythonValue = null;

      switch (this._op) {
        case '<':
          res = evaluatedLeft < evaluatedRight;
          break;
        case '>':
          res = evaluatedLeft > evaluatedRight;
          break;
        case '<=':
          res = evaluatedLeft <= evaluatedRight;
          break;
        case '>=':
          res  = evaluatedLeft >= evaluatedRight;
          break;
        case '!=':
          res = evaluatedLeft != evaluatedRight;
          break;
      }
      _currentState.evaluationStack.push(res);
  }
}

export class UnaryOpCommand extends Command {
  private _operator: UnaryOp;
  constructor(_operator: UnaryOp) {
    super();
    this._operator = _operator;
  }
  do(_currentState: State) {
    const operand = _currentState.evaluationStack.pop()!;
    let res: PythonValue = null;

      switch (this._operator) {
        case '-':
          if (typeof operand === 'number') {
            res = -(operand);
          }
          break;
        case '+':
          if (typeof operand === 'number') {
            res = Math.abs(operand);
          }
          break;
        case '!':
          res = !operand;
          break;
        case 'not':
          res = !operand;
          break;
      }
      _currentState.evaluationStack.push(res);
    }
  }

// ConditionalJumpCommand -> jumps to line if condition in loop is true/false
// TODO: Refer to Prof. O on this one.
export class ConditionalJumpCommand extends Command {
  private _lineNum: number;
  private _jumpBool: boolean; // true if condition is true, false is condition is false
  constructor(_lineNum: number, _jumpBool: boolean) {
    super();
    this._lineNum = _lineNum;
    this._jumpBool = true; // default to true
  }
  do(_currentState: State) {
    
  }
}

// JumpCommand -> jumps to a line number
export class JumpCommand extends Command {
  private _lineNum: number;
  constructor(_lineNum: number) {
    super();
    this._lineNum = _lineNum;
  }
  do(_currentState: State) {
    this._undoCommand = new JumpCommand(_currentState.programCounter);
    _currentState.programCounter = this._lineNum;
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
    this._previousVariables.forEach((value, key) => { // iterate over all previous variables
      _currentState.setVariable(key, value); // set each one by one to restore state.
    });
  }
}


// PrintCommand -> prints something to the console.
export class PrintCommand extends Command {
  private _value: PythonValue;
  constructor(_value: PythonValue) {
    super();
    this._value = _value;
  }
  do(_currentState: State) {
    console.log(this._value);
  }
}

// LenCommand -> gets length of strings and lists, etc...
export class LenCommand extends Command {
  private _value: PythonValue;
  constructor(_value: PythonValue) {
    super();
    this._value = _value;
  }
  do(_currentState: State) {
    if (typeof this._value === 'string') {
      _currentState.evaluationStack.push(this._value.length);
    }
    else if (Array.isArray(this._value)) {
      _currentState.evaluationStack.push(this._value.length);
    }
  }
}

// TypeCommand -> returns type of value
export class TypeCommand extends Command {
  private _value: PythonValue;
  constructor(_value: PythonValue) {
    super();
    this._value = _value;
  }
  do(_currentState: State) {
    this._undoCommand = new PopValueCommand();
    _currentState.evaluationStack.push(typeof this._value);
  }
}

// InputCommand -> cin for user input
export class InputCommand extends Command {
  private _prompt: string;
  constructor(_prompt: string) {
    super();
    this._prompt = _prompt;
  }
  do(_currentState: State) {
    let ans: string = "";
    var rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })
    rl.question(this._prompt, function(answer) {
      ans = answer;
      rl.close();
    });
    _currentState.evaluationStack.push(ans);
  }
}


// IndexAccessCommand -> arr[5]
export class IndexAccessCommand extends Command {
  do(_currentState: State) {
    const index = _currentState.evaluationStack.pop();
    const list = _currentState.evaluationStack.pop();
    
    // at the end of the day, we need to verify these types if there was some problem in the popped stack values.
    if (Array.isArray(list) && typeof index === 'number') {
      this._undoCommand = new PopValueCommand();
      _currentState.evaluationStack.push(list[index]);
    }
  }
}


// CreateListCommand -> Creates a list of values
export class CreateListCommand extends Command {
  private _name: string;
  private _values: PythonValue[];
  constructor(_name: string, _values: PythonValue[]) {
    super();
    this._name = _name;
    this._values = _values;
  }
  do(_currentState: State) {
    this._undoCommand = new CreateListCommand(this._name, this._values);
    _currentState.setVariable(this._name, this._values);
  }
  override undo(_currentState: State) {
    _currentState.variables.delete(this._name);
  }
}

export class ReturnCommand extends Command {
  private _value: PythonValue;
  constructor(_value: PythonValue) {
    super();
    this._value = _value;
  }
  do(_currentState: State) {
    _currentState.pushReturnStack(this._value);
  }
}