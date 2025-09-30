import * as moo from 'moo';
import { Command, 
         AssignVariableCommand, 
         ChangeVariableCommand, 
         IncrementProgramCounterCommand, 
         PushValueCommand, 
         PopValueCommand, 
         HighlightExpressionCommand, 
         RetrieveValueCommand,  
         MoveLinePointerCommand,
         HighlightStatementCommand,
         ReplaceHighlightedExpressionCommand,
         BinaryOpCommand,
         ComparisonOpCommand,
         UnaryOpCommand,
         ConditionalJumpCommand,
         JumpCommand,
         EnterScopeCommand,
         ExitScopeCommand,
         PrintCommand,
         LenCommand,
         TypeCommand,
         InputCommand,
         IndexAccessCommand,
         CreateListCommand
        } from './Interpreter'

export type Assignable = AssignmentStatementNode;
export type PythonValue = Number | String | PythonValue[] | Function | Boolean | BigInt | null
export type BinaryOp =  "+" | "-" | "*" | "%" | "/" | "//" | "and" | "or"
export type ComparisonOp = "<" | ">" | "<=" | ">=" | "!="
export type UnaryOp = "-" | "+" | "!" | "not"

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
// Abstract = class that cannot be instantiated on its own, serves as a blueprint for derived classes.

// Statement Node is the base class for all statement type nodes.
export abstract class StatementNode {
    abstract execute(): Command[];
}

export class AssignmentStatementNode extends StatementNode {
    private _left: string; // variable name
    private _right: ExpressionNode; // value
    constructor(_left: string, _right: ExpressionNode) {
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

class ReturnStatementNode extends StatementNode {
    private _value: ExpressionNode; // value by default should be null.
    constructor(_value: ExpressionNode) {
        super();
        this._value = _value;
    }
    execute(): Command[] {
      return [];
    }
}

class BreakStatementNode extends StatementNode {
    private _tok: moo.Token;
    constructor(_tok: moo.Token) {
        super();
        this._tok = _tok;
    }
    execute(): Command[] {
      return [];
    }
}

class ContinueStatementNode extends StatementNode {
    private _tok: moo.Token;
    constructor(_tok: moo.Token) {
        super();
        this._tok = _tok;
    }
    execute(): Command[] {
      return [];
    }
}

class PassStatementNode extends StatementNode {
    private _tok: moo.Token;
    constructor(_tok: moo.Token) {
        super();
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
        super();
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
        super();
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
      super();
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
      super();
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
        super();
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
      super();
      this._block = _block;
   }
    execute(): Command[] {
      return [];
    }
}

class ExpresssionStatementNode extends StatementNode {
    private _expression: ExpressionNode;
    constructor(_expression: ExpressionNode) {
      super(); 
      this._expression = _expression;
   }
    execute(): Command[] {
      return [];
    }
}

class BlockStatementNode extends StatementNode {
    private _statementList: StatementNode[];
    constructor(_statementList: StatementNode[]) {
      super();
      this._statementList = _statementList;
   }
    execute(): Command[] {
      return [];
    }
}


// ------------------------------------------------------------------
// Expression Nodes
// ------------------------------------------------------------------

export abstract class ExpressionNode {
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

export class NumberLiteralExpressionNode extends ExpressionNode {
  private _value: string;
  constructor(private value: string, tok: moo.Token) {
    super(tok);
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
      new PushValueCommand(numValue)
    ];
  }
 }

export class IdentifierExpressionNode extends ExpressionNode {
    public _tok: moo.Token;
    constructor(_tok: moo.Token) {
      super(_tok);
      this._tok = _tok;
    }
    evaluate(): Command[] {
      return [
        new HighlightExpressionCommand(this), // highlight, no need for replace.
        new RetrieveValueCommand(this._tok.text)
      ]
    }
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
      super();
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
    public _tok: moo.Token;
    private _left: ExpressionNode;
    private _operator: BinaryOp;
    private _right: ExpressionNode;
    constructor(_left: ExpressionNode, _operator: BinaryOp, _right: ExpressionNode, _tok: moo.Token) {
      super(_tok);
      this._tok = _tok;
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
     super();
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
      super();
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

class EvaluatedExpressionNode extends ExpressionNode {
    private _value: PythonValue | PythonValue[] | ExpressionNode;
    constructor(_value: PythonValue | PythonValue[] | ExpressionNode) {
        super();
        this._value = _value;
    }
    evaluate(): Command[] {
        return [];
    }
}