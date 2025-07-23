// ------------------------------------------------------------------
import * as moo from 'moo';

// ------------------------------------------------------------------
// Interfaces
// ------------------------------------------------------------------
interface Statement {
    // execute(): void;
}

interface Expression {
    // evaluate(): PythonValue;
}

interface Function {
    invoke(): PythonValue;
}

// ------------------------------------------------------------------
// Custom Types
// ------------------------------------------------------------------

// type None = null

type Assignable = IdentifierExpressionNode | ListAccessExpresssionNode

type PythonValue = Number | String | PythonValue[] | Function | Boolean | Assignable | null

type BinaryOp =  "+" | "-" | "*" | "%" | "/" | "//" | "and" | "or"

type ComparisonOp = "<" | ">" | "<=" | ">=" | "!="

type UnaryOp = "-" | "+" | "!" | "not"


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

export class StatementNode {
    private _statement: Statement;
    constructor(_statement: Statement) {
        this._statement = _statement;
    }
}

export class AssignmentStatementNode implements Statement {
    private _left: Assignable; // variable name
    private _right: ExpressionNode; // value
    constructor(_left: Assignable, _right: ExpressionNode) {
        this._left = _left;
        this._right = _right;
    }

}

export class ReturnStatementNode implements Statement {
    private _value: ExpressionNode; // value by default should be null.
    constructor(_value: ExpressionNode) {
        this._value = _value;
    }
}

export class BreakStatementNode implements Statement {
    private _tok: moo.Token;
    constructor(_tok: moo.Token) {
        this._tok = _tok;
    }
}

export class ContinueStatementNode implements Statement{
    private _tok: moo.Token;
    constructor(_tok: moo.Token) {
        this._tok = _tok;
    }
}

export class PassStatementNode implements Statement{
    private _tok: moo.Token;
    constructor(_tok: moo.Token) {
        this._tok = _tok;
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
}

export class WhileStatementNode implements Statement {
    private _expression: ExpressionNode;
    private _block: BlockStatementNode;
    constructor(_expression: ExpressionNode, _block: BlockStatementNode) {
      this._expression = _expression;
      this._block = _block;
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
}

export class ElseBlockStatementNode implements Statement {
    private _block : BlockStatementNode;
    constructor(_block: BlockStatementNode) {
     this._block = _block;
   }
}

export class ExpresssionStatementNode implements Statement {
    private _expression: ExpressionNode;
    constructor(_expression: ExpressionNode) {
     this._expression = _expression;
   }
}

export class BlockStatementNode implements Statement {
    private _statementList: StatementNode[];
    constructor(_statementList: StatementNode[]) {
     this._statementList = _statementList;
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
}

export class FormalParamsListExpressionNode implements Expression {
   private _paramsList: IdentifierExpressionNode[];
   constructor(_paramsList: IdentifierExpressionNode[]) {
     this._paramsList = _paramsList;
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
 }

export class ArgListExpressionNode implements Expression {
    private _argsList: ExpressionNode[];
    constructor(_argsList: ExpressionNode[]) {
     this._argsList = _argsList;
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
 }

export class UnaryExpressionNode implements Expression {
    private _operator: UnaryOp;
    private _operand: ExpressionNode;
    constructor(_operator: UnaryOp, _operand: ExpressionNode) {
     this._operator = _operator;
     this._operand = _operand;
   }
 }

export class FuncCallExpresssionNode implements Expression {
    private _func_name: ExpressionNode;
    private _args_list: ArgListExpressionNode;
    constructor(_func_name: ExpressionNode, _args_list: ArgListExpressionNode) {
     this._func_name = _func_name;
     this._args_list = _args_list;
   }
 }

export class ListAccessExpresssionNode implements Expression {
    private _list: ExpressionNode;
    private _index: ExpressionNode;
    constructor(_list: ExpressionNode, _index: ExpressionNode) {
     this._list = _list;
     this._index = _index;
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
 }

export class NumberLiteralExpressionNode implements Expression {
    private _value: Number;
    constructor(_value: Number) {
      this._value = _value;
  }
 }

export class ListLiteralExpressionNode implements Expression {
    private _values: PythonValue[];
    constructor(_values: PythonValue[]) {
      this._values = _values;
  }
 }

export class BooleanLiteralExpressionNode implements Expression {
    private _value: Boolean;
    constructor(_value: Boolean) {
      this._value = _value;
  }
 }

export class StringLiteralExpressionNode implements Expression {
    private _value: String;
    constructor(_value: String) {
      this._value = _value;
  }
 }

export class IdentifierExpressionNode implements Expression {
    private _name: String;
    constructor(_name: String) {
      this._name = _name;
  }
}
