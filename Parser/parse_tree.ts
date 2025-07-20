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

- What to do with BlockNode?

 */

// ------------------------------------------------------------------
// Interfaces
// ------------------------------------------------------------------
interface Statement {
    execute(): void;
}

interface Expression {
    evaluate(): void;
}

// ------------------------------------------------------------------
// Custom Types
// ------------------------------------------------------------------

type PythonValue = Number | String | PythonValue[]

type BinaryOp =  "+" | "-" | "*" | "%" | "/" | "//"

type ComparisonOp = "<" | ">" | "<=" | ">=" | "!="

type UnaryOp = "-" | "+" | "!"


// ------------------------------------------------------------------
// Program
// ------------------------------------------------------------------

class ProgramNode {
    private _statementList: Statement[];
    constructor(_statementList: Statement[]) {
        this._statementList = _statementList;
    }
}

// ------------------------------------------------------------------
// Statement Nodes
// ------------------------------------------------------------------

class StatementNode {
    private _statement: Statement;
    constructor(_statement: Statement) {
        this._statement = _statement;
    }
}

class AssignmentStatementNode {
    private _left: String; // variable name
    private _right: PythonValue; // value
    constructor(_left: String, _right: PythonValue) {
        this._left = _left;
        this._right = _right;
    }
}

class ReturnStatementNode {
    private _value: PythonValue; // value by default should be null.
    constructor(_value: PythonValue) {
        this._value = _value;
    }
}

class BreakStatementNode {
    // ????
}

class ContinueStatementNode {
    // ????
}

class PassStatementNode {
    // ????
}

class IfStatementNode {
    private _condition: ExpressionNode;
    private _then_branch: BlockStatementNode;
    private _else_branch: ElseBlockStatementNode;
    constructor(_condition: ExpressionNode, _then_branch: BlockStatementNode, _else_branch: ElseBlockStatementNode) {
        this._condition = _condition;
        this._then_branch = _then_branch;
        this._else_branch = _else_branch;
    }
}

class ForStatementNode {

}

class WhileStatementNode {

}

class FuncDefStatementNode {
    
}

class ElifStatementNode {
    
}

class ElseBlockStatementNode {
    
}

class ExpresssionStatementNode {
    
}

class BlockStatementNode {

}

// ------------------------------------------------------------------
// Statement Nodes
// ------------------------------------------------------------------

class ExpressionNode {

}