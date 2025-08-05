import * as parse_tree_nodes from '../Parser/parse_tree.js'
import { EvaluatedExpressionNode } from '../Parser/parse_tree';
// References:
// https://medium.com/@alessandro.traversi/understanding-the-command-design-pattern-in-typescript-1d2ee3615da8
// https://refactoring.guru/design-patterns/command

// ---------------------------------------------------------------------------------------
// INTERFACES AND CLASSES
// ---------------------------------------------------------------------------------------
abstract class Command {
  protected _undoCommand: Command;
  abstract do(_currentState: State): void;
  undo(_currentState: State) {
    this._undoCommand.do(_currentState);
  }
}

type PythonValue = Number | String | PythonValue[] | Function | Boolean | BigInt | null

type BinaryOp =  "+" | "-" | "*" | "%" | "/" | "//" | "and" | "or"

type ComparisonOp = "<" | ">" | "<=" | ">=" | "!="

type UnaryOp = "-" | "+" | "!" | "not"

interface Expression {
  evaluate(): Command[];
}

interface Statement {
  execute(): Command[];
}

// ---------------------------------------------------------------------------------------
// MACHINE STATE
// ---------------------------------------------------------------------------------------
class State {
  private _programCounter: number;
  private _lineCount: number;
  private _currentLine: number;
  private _currentExpression: Expression;
  private _currentStatement: Statement;
  private _callStack: Expression[]; 
  private _steps: Command[];
  private _variables: Map<String, number>;
  private _evaluationStack: PythonValue[];
  private _debugOutput: string[]; 

  constructor(_programCounter: number, _lineCount: number, _currentExpression: Expression, _callStack: Expression[], _steps: Command[], _variables: Map<String, number>, _debugOutput: string[], _currentLine: number, _evaluationStack: PythonValue[]) {
    this._programCounter = _programCounter;
    this._lineCount = _lineCount;
    this._currentExpression = _currentExpression;
    this._callStack = _callStack;
    this._steps = _steps;
    this._variables = _variables;
    this._debugOutput = _debugOutput;
    this._currentLine = _currentLine;
    this._evaluationStack = _evaluationStack;
  }
  
  public get programCounter() {
    return this._programCounter;
  }

  public set programCounter(val: number) {
    if (val < 1 || val > this._lineCount) {
      throw new Error("Invalid PC");
    }
    this._programCounter = val;
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

  public set currentExpression(expr: Expression) {
    this._currentExpression = expr;
  }

  public get currentStatement() {
    return this._currentStatement;
  }

  public set currentStatement(stmt: Statement) {
    this._currentStatement = stmt;
  }

  public get evaluationStack() {
    return this._evaluationStack;
  }

  public pushCallStack(func: Expression) {
    this._callStack.push(func); // pushes element onto stack
  }

  public popCallStack() {
    return this._callStack.pop(); // gets element from top of stack
  }

  public addStep(step: Command) {
    this._steps.push(step);
  }

  public set steps(step: Command) {
    this._steps.push(step);
  }

}

// ---------------------------------------------------------------------------------------
// AST NODE TYPES
// ---------------------------------------------------------------------------------------

class NumberLiteralExpression implements Expression {
  private _value: string;
  constructor(private value: string) {
    this._value = value;
  }

  evaluate(): Command[] {
    let numValue: Number | BigInt;
    if (this.value.startsWith('0x')) { // hexadecimal
      numValue = parseInt(this.value, 16);
    } else if (this.value.startsWith('0b')) { // binary
      numValue = parseInt(this.value, 2);
    } else if (this.value.includes('.')) { // float
      numValue = parseFloat(this.value);
    } else {
      numValue = BigInt(this.value); // regular integer, base 10.
    }
    
    // Create list of commands and return as result to add to overall steps.
    return [
      new HighlightExpressionCommand(this), // visually indicate what expression to highlight.
      new ReplaceHighlightedExpression(this, new EvaluatedExpressionNode(numValue))
    ];
  }
}

// ---------------------------------------------------------------------------------------
// INTERPRETER
// - note to self: actually runs the commands in whatever buffer, probably some loop with extra fancy stuff I can worry about later.
// ---------------------------------------------------------------------------------------

class Interpreter {

}

// ---------------------------------------------------------------------------------------
// COMMANDS
// ---------------------------------------------------------------------------------------

class MoveLinePointerCommand extends Command {
  private _lineNum: number;
  constructor(_lineNum: number) {
    super(); // call superclass constructor
    this._lineNum = _lineNum;
  }

  do(_currentState: State) {
    this._undoCommand = new MoveLinePointerCommand(_currentState.programCounter);
    _currentState.programCounter = this._lineNum;
  }
}

// Highlights expression that is being evaluated.
class HighlightExpressionCommand extends Command {
  private _expression: Expression;
  constructor(_expression: Expression) {
    super(); // call superclass constructor
    this._expression = _expression;
  }

  do(_currentState: State) {
    this._undoCommand = new HighlightExpressionCommand(_currentState.currentExpression);
    _currentState.currentExpression = this._expression;
  }
  // where is expression
  // tell state what current expression is
  // do work
}

class ReplaceHighlightedExpression extends Command {
  private _oldExpression: Expression;
  private _newExpression: Expression;
  constructor(_oldExpression: Expression, _newExpression: Expression) {
    super();
    this._oldExpression = _oldExpression;
    this._newExpression = _newExpression;
  }
    do(_currentState: State) {
    this._undoCommand = new ReplaceHighlightedExpression(this._newExpression, this._oldExpression);
    _currentState.currentExpression = this._newExpression;
  }
  // decide: parse tree mutable or nah? If not mutable, we need to produce new parse tree branch whcih is identical to original to reflect changes
  // if mutable, change in place. other nodes that have a connection need to be rerouted. 
}

class PushValueCommand extends Command { // push value onto stack
  private _value: PythonValue; // Varaible could be any PythonValue
  constructor(value: PythonValue) {
    super();
    this._value = value;
  }

  do(_currentState: State) {
    this._undoCommand = new PopValueCommand(); // because we want to do the INVERSE for an undo here.
    _currentState.evaluationStack.push(this._value); // push value on stack
  }
}

class PopValueCommand extends Command {

}

class RetrieveValueCommand extends Command {
  private name: String; // variable name whose value we want to retrieve

}

// For evaluating arithmetic operations
class BinaryOpCommand extends Command {

}

// For assignments to a variable
class ChangeVariableCommand extends Command {
  private name: String; // variable name
  private value: Number; // value to be connected to variable

  constructor(name: String, value: Number) {
    this.name = name;
    this.value = value;
  } 
}

