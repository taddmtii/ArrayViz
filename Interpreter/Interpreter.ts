// ------------------------------------------------------------------
import * as moo from 'moo';

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

type Assignable = AssignmentStatementNode; // change later, placeholder.

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


// ------------------------------------------------------------------
// Program
// ------------------------------------------------------------------

export class ProgramNode {
    private _statementList: StatementNode[];
    constructor(_statementList: StatementNode[]) {
        this._statementList = _statementList;
    }
}

// ------------------------------------------------------------------
// Statement Nodes
// ------------------------------------------------------------------

// Implements = interface
// extends = class

export class StatementNode implements Statement {
    private _statement: Statement;
    constructor(_statement: Statement) {
        this._statement = _statement;
    }
    execute(): Command[] {
      return [];
    }
}

export class AssignmentStatementNode implements Statement {
    private _left: Assignable; // variable name
    private _right: ExpressionNode; // value
    constructor(_left: Assignable, _right: ExpressionNode) {
        this._left = _left;
        this._right = _right;
    }

    execute(): Command[] {
      return [];
    }
}

export class ReturnStatementNode implements Statement {
    private _value: ExpressionNode; // value by default should be null.
    constructor(_value: ExpressionNode) {
        this._value = _value;
    }
    execute(): Command[] {
      return [];
    }
}

export class BreakStatementNode implements Statement {
    private _tok: moo.Token;
    constructor(_tok: moo.Token) {
        this._tok = _tok;
    }
    execute(): Command[] {
      return [];
    }
}

export class ContinueStatementNode implements Statement {
    private _tok: moo.Token;
    constructor(_tok: moo.Token) {
        this._tok = _tok;
    }
    execute(): Command[] {
      return [];
    }
}

export class PassStatementNode implements Statement {
    private _tok: moo.Token;
    constructor(_tok: moo.Token) {
        this._tok = _tok;
    }
    execute(): Command[] {
      return [];
    }
}

export class IfStatementNode implements Statement {
    private _condition: ExpressionNode;
    private _thenBranch: BlockStatementNode;
    private _elseBranch: ElseBlockStatementNode;
    constructor(_condition: ExpressionNode, _thenBranch: BlockStatementNode, _elseBranch: ElseBlockStatementNode) {
        this._condition = _condition;
        this._thenBranch = _thenBranch;
        this._elseBranch = _elseBranch;
    }
    execute(): Command[] {
      return [];
    }
}

export class ForStatementNode implements Statement {
    private _loopVar: IdentifierExpressionNode;
    private _iterable: ExpressionNode;
    private _block: BlockStatementNode;
    constructor(_loopVar: IdentifierExpressionNode, _iterable: ExpressionNode, _block: BlockStatementNode) {
     this._loopVar = _loopVar;
     this._iterable = _iterable;
     this._block = _block;
   }
    execute(): Command[] {
      return [];
    }
}

export class WhileStatementNode implements Statement {
    private _expression: ExpressionNode;
    private _block: BlockStatementNode;
    constructor(_expression: ExpressionNode, _block: BlockStatementNode) {
      this._expression = _expression;
      this._block = _block;
   }
    execute(): Command[] {
      return [];
    }
}

export class FuncDefStatementNode implements Statement {
    private _name: IdentifierExpressionNode;
    private _formalParamList: FormalParamsListExpressionNode;
    private _block: BlockStatementNode;
    constructor(_name: IdentifierExpressionNode, _formalParamList: FormalParamsListExpressionNode, _block: BlockStatementNode) {
      this._name = _name;
      this._formalParamList = _formalParamList;
      this._block = _block;
   }
    execute(): Command[] {
      return [];
    }
}

export class ElifStatementNode implements Statement {
    private _condition: ExpressionNode;
    private _thenBranch: BlockStatementNode;
    private _elseBranch: ElseBlockStatementNode;
    constructor(_condition: ExpressionNode, _thenBranch: BlockStatementNode, _elseBranch: ElseBlockStatementNode) {
        this._condition = _condition;
        this._thenBranch = _thenBranch;
        this._elseBranch = _elseBranch;
    }
    execute(): Command[] {
      return [];
    }
}

export class ElseBlockStatementNode implements Statement {
    private _block : BlockStatementNode;
    constructor(_block: BlockStatementNode) {
     this._block = _block;
   }
    execute(): Command[] {
      return [];
    }
}

export class ExpresssionStatementNode implements Statement {
    private _expression: ExpressionNode;
    constructor(_expression: ExpressionNode) {
     this._expression = _expression;
   }
    execute(): Command[] {
      return [];
    }
}

export class BlockStatementNode implements Statement {
    private _statementList: StatementNode[];
    constructor(_statementList: StatementNode[]) {
     this._statementList = _statementList;
   }
    execute(): Command[] {
      return [];
    }
}


// ------------------------------------------------------------------
// Expression Nodes
// ------------------------------------------------------------------

export class ExpressionNode {
    private _expression: Expression;
    constructor(_expression: Expression) {
      this._expression = _expression;
   }
  evaluate(): Command[] {
    return [];
   }
}

export class FormalParamsListExpressionNode implements Expression {
   private _paramsList: IdentifierExpressionNode[];
   constructor(_paramsList: IdentifierExpressionNode[]) {
     this._paramsList = _paramsList;
  }
   evaluate(): Command[] {
    return [];
   }
}

export class ConditionalExpressionNode implements Expression {
    private _left: ExpressionNode;
    private _condition: ExpressionNode;
    private _right: ExpressionNode;
    constructor(_left: ExpressionNode, _condition: ExpressionNode, _right: ExpressionNode) {
      this._left = _left;
      this._condition = _condition;
      this._right = _right;
   }
    evaluate(): Command[] {
      return [];
    }
 }

export class ArgListExpressionNode implements Expression {
    private _argsList: ExpressionNode[];
    constructor(_argsList: ExpressionNode[]) {
     this._argsList = _argsList;
   }
   this._args_list.ForEach(function (arg) {
    new HighlightExpressionCommand(arg);
    new ReplaceHighlightedExpression(arg, new EvaluatedExpressionNode()); // what to pass in here?
   })
    evaluate(): Command[] {
      return [];
    }
 }

export class ComparisonExpressionNode implements Expression {
    private _left: ExpressionNode;
    private _operator: ComparisonOp;
    private _right: ExpressionNode;
    constructor(_left: ExpressionNode, _operator: ComparisonOp, _right: ExpressionNode) {
      this._left = _left;
      this._operator = _operator;
      this._right = _right;
   }
    evaluate(): Command[] {
      return [];
    }
 }

export class BinaryExpressionNode implements Expression {
    private _left: ExpressionNode;
    private _operator: BinaryOp;
    private _right: ExpressionNode;
    constructor(_left: ExpressionNode, _operator: BinaryOp, _right: ExpressionNode) {
     this._left = _left;
     this._operator = _operator;
     this._right = _right;
   }
    evaluate(): Command[] {
      return [];
    }
 }

export class UnaryExpressionNode implements Expression {
    private _operator: UnaryOp;
    private _operand: ExpressionNode;
    constructor(_operator: UnaryOp, _operand: ExpressionNode) {
     this._operator = _operator;
     this._operand = _operand;
   }
    evaluate(): Command[] {
      return [];
    }
 }

export class FuncCallExpresssionNode implements Expression {
    private _func_name: ExpressionNode;
    private _args_list: ArgListExpressionNode;
    constructor(_func_name: ExpressionNode, _args_list: ArgListExpressionNode) {
     this._func_name = _func_name;
     this._args_list = _args_list;
   }
    evaluate(): Command[] {
      return [];
    }
 }

export class ListAccessExpresssionNode implements Expression  {
    private _list: ExpressionNode;
    private _index: ExpressionNode;
    constructor(_list: ExpressionNode, _index: ExpressionNode) {
     this._list = _list;
     this._index = _index;
   }
    evaluate(): Command[] {
      return [];
    }
 }

export class MethodCallExpressionNode implements Expression {
    private _list: ExpressionNode;
    private _methodName: IdentifierExpressionNode;
    private _argsList: ArgListExpressionNode;
    constructor(_list: ExpressionNode, _methodName: IdentifierExpressionNode, _argsList: ArgListExpressionNode) {
     this._list = _list;
     this._methodName = _methodName;
     this._argsList = _argsList;
   }
    evaluate(): Command[] {
      return [];
    }
 }

export class ListSliceExpressionNode implements Expression {
    private _list: ExpressionNode;
    private _start: ExpressionNode;
    private _stop: ExpressionNode;
    private _step: ExpressionNode;
    constructor(_list: ExpressionNode, _start: ExpressionNode, _stop: ExpressionNode, _step: ExpressionNode) {
      this._list = _list;
      this._start = _start;
      this._stop = _stop;
      this._step = _step;
  }
    evaluate(): Command[] {
      let operations: ExpressionNode[] = [this._start, this._stop, this._step];
      operations.forEach(function (val) { // for each element here, highlight and evaluate
        new HighlightExpressionCommand(val);
        new ReplaceHighlightedExpression(this, new EvaluatedExpressionNode(val));
      })
      return [
        new HighlightExpressionCommand(this), // the idea is to then highlight the entire thing.
        new ReplaceHighlightedExpression(this, new EvaluatedExpressionNode())
      ];
    }
 }

export class NumberLiteralExpressionNode implements Expression {
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

export class ListLiteralExpressionNode implements Expression {
    private _values: PythonValue[];
    constructor(_values: PythonValue[]) {
      this._values = _values;
    }
  evaluate(): Command[] {
    return [
      new HighlightExpressionCommand(this),
      new ReplaceHighlightedExpression(this, new EvaluatedExpressionNode(this._values))
    ];
  }
 }

export class BooleanLiteralExpressionNode implements Expression {
    private _value: Boolean;
    constructor(_value: Boolean) {
      this._value = _value;
  }
  evaluate(): Command[] {
    return [
      new HighlightExpressionCommand(this), // highlight
      new ReplaceHighlightedExpression(this, new EvaluatedExpressionNode(this._value)) // replace
    ]
  }
 }

export class StringLiteralExpressionNode implements Expression {
    private _value: String;
    constructor(_value: String) {
      this._value = _value;
  }
    evaluate(): Command[] {
      return [
        new HighlightExpressionCommand(this), // highlight
        new ReplaceHighlightedExpression(this, new EvaluatedExpressionNode(this._value)) // replace
    ]
    }
 }

export class IdentifierExpressionNode implements Expression {
    private _name: String;
    constructor(_name: String) {
      this._name = _name;
  }
    evaluate(): Command[] {
      return [
        new HighlightExpressionCommand(this), // highlight, no need for replace.
    ]
    }
}

export class EvaluatedExpressionNode implements Expression {
    private _value: PythonValue | PythonValue[] | ExpressionNode;
    constructor(_value: PythonValue | PythonValue[] | ExpressionNode) {
        this._value = _value;
    }
    evaluate(): Command[] {
        return [];
    }
}


// References:
// https://medium.com/@alessandro.traversi/understanding-the-command-design-pattern-in-typescript-1d2ee3615da8
// https://refactoring.guru/design-patterns/command

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
  private _value: PythonValue; // Varaible could be any PythonValue
  constructor(value: PythonValue) {
    super();
    this._value = value;
  }

  do(_currentState: State) {
    this._undoCommand = new PushValueCommand(); // because we want to do the INVERSE for an undo here.
    _currentState.evaluationStack.pop(this._value); // pop value off stack
  }
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

