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

type BinaryOp =  "+" | "-" | "*" | "%" | "/" | "//"

type ComparisonOp = "<" | ">" | "<=" | ">=" | "!="

type UnaryOp = "-" | "+" | "!"


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

class StatementNode {
    private _statement: Statement;
    constructor(_statement: Statement) {
        this._statement = _statement;
    }
}

class AssignmentStatementNode implements Statement {
    private _left: Assignable; // variable name
    private _right: Expression; // value
    constructor(_left: Assignable, _right: Expression) {
        this._left = _left;
        this._right = _right;
    }

}

class ReturnStatementNode implements Statement {
    private _value: Expression; // value by default should be null.
    constructor(_value: Expression) {
        this._value = _value;
    }
}

class BreakStatementNode implements Statement {
    private _tok: moo.Token;
    constructor(_tok: moo.Token) {
        this._tok = _tok;
    }
}

class ContinueStatementNode implements Statement{
    private _tok: moo.Token;
    constructor(_tok: moo.Token) {
        this._tok = _tok;
    }
}

class PassStatementNode implements Statement{
    private _tok: moo.Token;
    constructor(_tok: moo.Token) {
        this._tok = _tok;
    }
}

class IfStatementNode implements Statement {
    private _condition: ExpressionNode;
    private _thenBranch: BlockStatementNode;
    private _elseBranch: ElseBlockStatementNode;
    constructor(_condition: ExpressionNode, _thenBranch: BlockStatementNode, _elseBranch: ElseBlockStatementNode) {
        this._condition = _condition;
        this._thenBranch = _thenBranch;
        this._elseBranch = _elseBranch;
    }
}

class ForStatementNode implements Statement {
    private _loopVar: IdentifierExpressionNode;
    private _iterable: ExpressionNode;
    private _block: BlockStatementNode;
    constructor(_loopVar: IdentifierExpressionNode, _iterable: ExpressionNode, _block: BlockStatementNode) {
     this._loopVar = _loopVar;
     this._iterable = _iterable;
     this._block = _block;
   }
}

class WhileStatementNode implements Statement {
    private _expression: ExpressionNode;
    private _block: BlockStatementNode;
    constructor(_expression: ExpressionNode, _block: BlockStatementNode) {
      this._expression = _expression;
      this._block = _block;
   }
}

class FuncDefStatementNode implements Statement {
    private _name: IdentifierExpressionNode;
    private _formalParamList: FormalParamsListExpressionNode;
    constructor(_name: IdentifierExpressionNode, _formalParamList: FormalParamsListExpressionNode) {
      this._name = _name;
      this._formalParamList = _formalParamList;
   }
}

class ElifStatementNode implements Statement {
    private _condition: ExpressionNode;
    private _thenBranch: BlockStatementNode;
    private _elseBranch: ElseBlockStatementNode;
    constructor(_condition: ExpressionNode, _thenBranch: BlockStatementNode, _elseBranch: ElseBlockStatementNode) {
        this._condition = _condition;
        this._thenBranch = _thenBranch;
        this._elseBranch = _elseBranch;
    }
}

class ElseBlockStatementNode implements Statement {
    private _block : BlockStatementNode;
    constructor(_block: BlockStatementNode) {
     this._block = _block;
   }
}

class ExpresssionStatementNode implements Statement {
    private _expression: ExpressionNode;
    constructor(_expression: ExpressionNode) {
     this._expression = _expression;
   }
}

class BlockStatementNode implements Statement {
    private _statementList: StatementNode[];
    constructor(_statementList: StatementNode[]) {
     this._statementList = _statementList;
   }
}


// ------------------------------------------------------------------
// Expression Nodes
// ------------------------------------------------------------------

class ExpressionNode {
    private _expression: Expression;
    constructor(_expression: Expression) {
      this._expression = _expression;
   }
}

class FormalParamsListExpressionNode implements Expression {
   private _paramsList: IdentifierExpressionNode[];
   constructor(_paramsList: IdentifierExpressionNode[]) {
     this._paramsList = _paramsList;
  }
}

class ConditionalExpressionNode implements Expression {
    private _left: ExpressionNode;
    private _condition: ExpressionNode;
    private _right: ExpressionNode;
    constructor(_left: ExpressionNode, _condition: ExpressionNode, _right: ExpressionNode) {
      this._left = _left;
      this._condition = _condition;
      this._right = _right;
   }
 }

class ArgListExpressionNode implements Expression {
    private _argsList: ExpressionNode[];
    constructor(_argsList: ExpressionNode[]) {
     this._argsList = _argsList;
   }
 }

class ComparisonExpressionNode implements Expression {
    private _left: ExpressionNode;
    private _operator: ComparisonOp;
    private _right: ExpressionNode;
    constructor(_left: ExpressionNode, _operator: ComparisonOp, _right: ExpressionNode) {
      this._left = _left;
      this._operator = _operator;
      this._right = _right;
   }
 }

class BinaryExpressionNode implements Expression {
    private _left: ExpressionNode;
    private _operator: BinaryOp;
    private _right: ExpressionNode;
    constructor(_left: ExpressionNode, _operator: BinaryOp, _right: ExpressionNode) {
     this._left = _left;
     this._operator = _operator;
     this._right = _right;
   }
 }

class UnaryExpressionNode implements Expression {
    private _operator: UnaryOp;
    private _operand: ExpressionNode;
    constructor(_operator: UnaryOp, _operand: ExpressionNode) {
     this._operator = _operator;
     this._operand = _operand;
   }
 }

class FuncCallExpresssionNode implements Expression {
    private _func_name: ExpressionNode;
    private _args_list: ArgListExpressionNode;
    constructor(_func_name: ExpressionNode, _args_list: ArgListExpressionNode) {
     this._func_name = _func_name;
     this._args_list = _args_list;
   }
 }

class ListAccessExpresssionNode implements Expression {
    private _list: ExpressionNode;
    private _index: ExpressionNode;
    constructor(_list: ExpressionNode, _index: ExpressionNode) {
     this._list = _list;
     this._index = _index;
   }
 }

class MethodCallExpressionNode implements Expression {
    private _list: ExpressionNode;
    private _methodName: IdentifierExpressionNode;
    private _argsList: ArgListExpressionNode;
    constructor(_list: ExpressionNode, _methodName: IdentifierExpressionNode, _argsList: ArgListExpressionNode) {
     this._list = _list;
     this._methodName = _methodName;
     this._argsList = _argsList;
   }
 }

class ListSliceExpressionNode implements Expression {
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

class NumberLiteralExpressionNode implements Expression {
    private _value: Number;
    constructor(_value: Number) {
      this._value = _value;
  }
 }

class ListLiteralExpressionNode implements Expression {
    private _values: PythonValue[];
    constructor(_values: PythonValue[]) {
      this._values = _values;
  }
 }

class BooleanLiteralExpressionNode implements Expression {
    private _value: Boolean;
    constructor(_value: Boolean) {
      this._value = _value;
  }
 }

class StringLiteralExpressionNode implements Expression {
    private _value: String;
    constructor(_value: String) {
      this._value = _value;
  }
 }

class IdentifierExpressionNode implements Expression {
    private _name: String;
    constructor(_name: String) {
      this._name = _name;
  }
}
