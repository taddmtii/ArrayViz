 /* 
 List of Nodes to implement
    - ProgramNode

    Statement Nodes:

    - StatementNode (SUPERCLASS)
    - AssignmentStatementNode
    - ReturnStatementNode
    - BreakStatementNode
    - ContinueStatementNode
    - PassStatementNode
    - IfStatementNode
    - ForStatementNode
    - WhileStatementNode
    - FuncDefStatementNode
    - ElifStatementNode
    - ElseBlockStatementNode
    - ExpresssionStatementNode
    - BlockStatementNode
    
    Expression Nodes:

    - ExpressionNode 
    - ConditionalExpressionNode
    - ArgListExpressionNode
    - BinaryExpressionNode (And, Or, Comparison, Multiplicative, Additive)
    - UnaryExpressionNode (Not)
    - FuncCallExpresssionNode
    - ListAccessExpresssionNode
    - MethodCallExpressionNode
    - ListSliceExpressionNode
    - NumberLiteralExpressionNode
    - ListLiteralExpressionNode
    - BooleanLiteralExpressionNode (True, False, None)
    - StringLiteralExpressionNode
    - IdentifierExpressionNode

 */
// ------------------------------------------------------------------
// Imports
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

}


class IdentifierExpressionNode {

}

class FormalParamsListExpressionNode implements Expression {
   private _paramsList: IdentifierExpressionNode[];
   constructor(_paramsList: IdentifierExpressionNode[]) {
     this._paramsList = _paramsList;
   }
 }

class ListAccessExpresssionNode {

}

