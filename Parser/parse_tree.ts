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
    evaluate(): PythonValue;
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
    private _then_branch: BlockStatementNode;
    private _else_branch: ElseBlockStatementNode;
    constructor(_condition: ExpressionNode, _then_branch: BlockStatementNode, _else_branch: ElseBlockStatementNode) {
        this._condition = _condition;
        this._then_branch = _then_branch;
        this._else_branch = _else_branch;
    }
}

class ForStatementNode implements Statement {

}

class WhileStatementNode implements Statement {

}

class FuncDefStatementNode implements Statement {
    
}

class ElifStatementNode implements Statement {
    
}

class ElseBlockStatementNode implements Statement {
    
}

class ExpresssionStatementNode implements Statement {
    
}

class BlockStatementNode implements Statement {

}

// ------------------------------------------------------------------
// Statement Nodes
// ------------------------------------------------------------------

class ExpressionNode {

}

class IdentifierExpressionNode {

}

class ListAccessExpresssionNode {

}