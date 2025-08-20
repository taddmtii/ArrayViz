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

// ---------------------------------------------------------------------------------------
// MACHINE STATE
// ---------------------------------------------------------------------------------------
class State {
  private _programCounter: number = 0; // which line of execution are we on.
  private _lineCount: number = 0; // all lines in program.
  private _currentLine: number = 1; // current line number
  private _currentExpression: ExpressionNode; // current highlighted expression we are evaluating
  private _currentStatement: StatementNode; // what statement are we on
  private _callStack: ExpressionNode[];  // function call stack
  private _history: Command[]; // history of all commands
  private _variables: Map<String, PythonValue> = new Map(); // storage for variables and thier values
  private _evaluationStack: PythonValue[]; // stack for expression evaluation
  private _debugOutput: string[];  // debug messages

  constructor(_programCounter: number, _lineCount: number, _currentExpression: ExpressionNode, _callStack: ExpressionNode[], _history: Command[], _variables: Map<String, number>, _debugOutput: string[], _currentLine: number, _evaluationStack: PythonValue[]) {
    this._programCounter = _programCounter;
    this._lineCount = _lineCount;
    this._currentExpression = _currentExpression;
    this._callStack = _callStack;
    this._history = _history;
    this._variables = _variables;
    this._debugOutput = _debugOutput;
    this._currentLine = _currentLine;
    this._evaluationStack = _evaluationStack;
  }
  
  public get programCounter() { return this._programCounter;}
  public set programCounter(val: number) {
    if (val < 1 || val > this._lineCount) {
      throw new Error("Invalid PC");
    }
    this._programCounter = val;
  }

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
  public get debugOutput() { return this._debugOutput; }

  public setVariable(name: string, value: PythonValue) {
    this._variables.set(name, value); // adds new key value into variables map.
  }

  public getVariable(name: string): PythonValue {
    return this._variables.get(name) || null; // could be nullable upon lookup. null is important here.
  }

  public pushCallStack(func: ExpressionNode) { this._callStack.push(func); } // pushes element onto stack
  public popCallStack() { return this._callStack.pop(); } // gets element from top of stack

  public addHistoryCommand(step: Command) { this._history.push(step); }
  public getMostRecentHistoryCommand(): Command { return this._history.pop(); } 

}

type Assignable = AssignmentStatementNode; // change later, placeholder.

type PythonValue = Number | String | PythonValue[] | Function | Boolean | BigInt | null

type BinaryOp =  "+" | "-" | "*" | "%" | "/" | "//" | "and" | "or"

type ComparisonOp = "<" | ">" | "<=" | ">=" | "!="

type UnaryOp = "-" | "+" | "!" | "not"

// ------------------------------------------------------------------
// Program
// ------------------------------------------------------------------

class ProgramNode {
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
// Abstract = class that cannot be instantiated on its own, serves as a blueprint for derived classes.

// Statement Node is the base class for all statement type nodes.
abstract class StatementNode {
    abstract execute(): Command[];
}

class AssignmentStatementNode extends StatementNode {
    private _left: Assignable | string; // variable name
    private _right: ExpressionNode; // value
    constructor(_left: Assignable | string, _right: ExpressionNode) {
        super();
        this._left = _left;
        this._right = _right;
    }

    execute(): Command[] {
      // 1. Highlight Statement
      // 2. Evaluate right hand expression
      // 3. Bind result from eval stack to variable
      // 4. Move to next line
        const commands: Command[] = [];
      
        commands.push(new HighlightStatementCommand(this)); // Highlight
        commands.push(...(this._right.evaluate())); // evaluate (which may generate an array of commands, hence the spread operator)
        commands.push(new AssignVariableCommand(this._left)); // Bind variable.
        commands.push(new IncrementProgramCounterCommand());
        
        return commands;
      // return [
      //   new HighlightStatementCommand(this),
      //   new ...this._right.evaluate(),

      // ]
    }
}

// The idea: use evaluation stack to get value since we have a chain of evaluate methods ebing called all going to the evaluation stack.
class AssignVariableCommand extends Command {

}

class IncrementProgramCounterCommand extends Command {

}

class ReturnStatementNode extends StatementNode {
    private _value: ExpressionNode; // value by default should be null.
    constructor(_value: ExpressionNode) {
        this._value = _value;
    }
    execute(): Command[] {
      return [];
    }
}

class BreakStatementNode extends StatementNode {
    private _tok: moo.Token;
    constructor(_tok: moo.Token) {
        this._tok = _tok;
    }
    execute(): Command[] {
      return [];
    }
}

class ContinueStatementNode extends StatementNode {
    private _tok: moo.Token;
    constructor(_tok: moo.Token) {
        this._tok = _tok;
    }
    execute(): Command[] {
      return [];
    }
}

class PassStatementNode extends StatementNode {
    private _tok: moo.Token;
    constructor(_tok: moo.Token) {
        this._tok = _tok;
    }
    execute(): Command[] {
      return [];
    }
}

class IfStatementNode extends StatementNode {
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

class ForStatementNode extends StatementNode {
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

class WhileStatementNode extends StatementNode {
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

class FuncDefStatementNode extends StatementNode {
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

class ElifStatementNode extends StatementNode {
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

class ElseBlockStatementNode extends StatementNode {
    private _block : BlockStatementNode;
    constructor(_block: BlockStatementNode) {
     this._block = _block;
   }
    execute(): Command[] {
      return [];
    }
}

class ExpresssionStatementNode extends StatementNode {
    private _expression: ExpressionNode;
    constructor(_expression: ExpressionNode) {
     this._expression = _expression;
   }
    execute(): Command[] {
      return [];
    }
}

class BlockStatementNode extends StatementNode {
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

abstract class ExpressionNode {
    public _tok: moo.Token; 
    constructor(_tok: moo.Token) {
      this._tok = _tok;
   }
  abstract evaluate(): Command[];
  public get lineNum() {return this._tok.line};
  public get startLine() {return this._tok.line};
  public get endLine() {return this._tok.line};
  public get startCol() {return this._tok.col};
  public get endCol() {return this._tok.col + (this._tok.text.length - 1)};
}

class FormalParamsListExpressionNode extends ExpressionNode {
   private _paramsList: IdentifierExpressionNode[];
   constructor(_paramsList: IdentifierExpressionNode[]) {
     super(_paramsList[0]._tok);
     this._paramsList = _paramsList;
  }
   evaluate(): Command[] {
    return [];
   }
   override public get endLine() {
    return this._paramsList[this._paramsList.length - 1]._tok.line
  }
   override public get endCol() {
    let _lastTok = this._paramsList[this._paramsList.length - 1]._tok;
    return _lastTok.col + (_lastTok.text.length - 1);
  }
}

class ConditionalExpressionNode extends ExpressionNode {
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

class ArgListExpressionNode extends ExpressionNode {
    private _argsList: ExpressionNode[];
    constructor(_argsList: ExpressionNode[]) {
     this._argsList = _argsList;
   }
   this._args_list.ForEach(function (arg) {
    new HighlightExpressionCommand(arg);
    new ReplaceHighlightedExpressionCommand(arg, new EvaluatedExpressionNode()); // what to pass in here?
   })
    evaluate(): Command[] {
      return [];
    }
 }

class ComparisonExpressionNode extends ExpressionNode {
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

class BinaryExpressionNode extends ExpressionNode {
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

class UnaryExpressionNode extends ExpressionNode {
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

class FuncCallExpresssionNode extends ExpressionNode {
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

class ListAccessExpresssionNode extends ExpressionNode  {
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

class MethodCallExpressionNode extends ExpressionNode {
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

class ListSliceExpressionNode extends ExpressionNode {
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
        new ReplaceHighlightedExpressionCommand(this, new EvaluatedExpressionNode(val));
      })
      return [
        new HighlightExpressionCommand(this), // the idea is to then highlight the entire thing.
        new ReplaceHighlightedExpressionCommand(this, new EvaluatedExpressionNode())
      ];
    }
 }

class NumberLiteralExpressionNode extends ExpressionNode {
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
      new ReplaceHighlightedExpressionCommand(this, new EvaluatedExpressionNode(numValue))
    ];
  }
 }

class ListLiteralExpressionNode extends ExpressionNode {
    private _values: PythonValue[];
    constructor(_values: PythonValue[]) {
      this._values = _values;
    }
  evaluate(): Command[] {
    return [
      new HighlightExpressionCommand(this),
      new ReplaceHighlightedExpressionCommand(this, new EvaluatedExpressionNode(this._values))
    ];
  }
 }

class BooleanLiteralExpressionNode extends ExpressionNode {
    private _value: Boolean;
    constructor(_value: Boolean) {
      this._value = _value;
  }
  evaluate(): Command[] {
    return [
      new HighlightExpressionCommand(this), // highlight
      new ReplaceHighlightedExpressionCommand(this, new EvaluatedExpressionNode(this._value)) // replace
    ]
  }
 }

class StringLiteralExpressionNode extends ExpressionNode {
    private _value: moo.Token;
    constructor(_value: moo.Token) {
      super(_value);
      this._value = _value;
  }
    evaluate(): Command[] {
      return [
        new HighlightExpressionCommand(this), // highlight
        new ReplaceHighlightedExpressionCommand(this, new EvaluatedExpressionNode(this._value)) // replace
    ]
    }
 }

class IdentifierExpressionNode extends ExpressionNode {
    private _name: moo.Token;
    constructor(_name: moo.Token) {
      super(_name);
      this._name = _name;
  }
    evaluate(): Command[] {
      return [
        new HighlightExpressionCommand(this), // highlight, no need for replace.
        // lookup its value, show visually where the variable is being looked up
        new ReplaceHighlightedExpressionCommand(this, new EvaluatedExpressionNode(null)) // val we just looked up passed into EvaluatedExpressionNode
      ]
    }
}

class EvaluatedExpressionNode extends ExpressionNode {
    private _value: PythonValue | PythonValue[] | ExpressionNode;
    constructor(_value: PythonValue | PythonValue[] | ExpressionNode) {
        this._value = _value;
    }
    evaluate(): Command[] {
        return [];
    }
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

class HighlightStatementCommand extends Command {

}

// Highlights expression that is being evaluated.
class HighlightExpressionCommand extends Command {
  private _expression: ExpressionNode;
  constructor(_expression: ExpressionNode) {
    super(); // call superclass constructor
    this._expression = _expression;
  }

  do(_currentState: State) {
    this._undoCommand = new HighlightExpressionCommand(_currentState.currentExpression);
    _currentState.currentExpression = this._expression;
  }
  // tell state what current expression is
  // do work
}

class ReplaceHighlightedExpressionCommand extends Command {
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


