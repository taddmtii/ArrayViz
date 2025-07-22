"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentifierExpressionNode = exports.StringLiteralExpressionNode = exports.BooleanLiteralExpressionNode = exports.ListLiteralExpressionNode = exports.NumberLiteralExpressionNode = exports.ListSliceExpressionNode = exports.MethodCallExpressionNode = exports.ListAccessExpresssionNode = exports.FuncCallExpresssionNode = exports.UnaryExpressionNode = exports.BinaryExpressionNode = exports.ComparisonExpressionNode = exports.ArgListExpressionNode = exports.ConditionalExpressionNode = exports.FormalParamsListExpressionNode = exports.ExpressionNode = exports.BlockStatementNode = exports.ExpresssionStatementNode = exports.ElseBlockStatementNode = exports.ElifStatementNode = exports.FuncDefStatementNode = exports.WhileStatementNode = exports.ForStatementNode = exports.IfStatementNode = exports.PassStatementNode = exports.ContinueStatementNode = exports.BreakStatementNode = exports.ReturnStatementNode = exports.AssignmentStatementNode = exports.StatementNode = exports.ProgramNode = void 0;
// ------------------------------------------------------------------
// Program
// ------------------------------------------------------------------
var ProgramNode = /** @class */ (function () {
    function ProgramNode(_statementList) {
        this._statementList = _statementList;
    }
    return ProgramNode;
}());
exports.ProgramNode = ProgramNode;
// ------------------------------------------------------------------
// Statement Nodes
// ------------------------------------------------------------------
// Implements = interface
// extends = class
var StatementNode = /** @class */ (function () {
    function StatementNode(_statement) {
        this._statement = _statement;
    }
    return StatementNode;
}());
exports.StatementNode = StatementNode;
var AssignmentStatementNode = /** @class */ (function () {
    function AssignmentStatementNode(_left, _right) {
        this._left = _left;
        this._right = _right;
    }
    return AssignmentStatementNode;
}());
exports.AssignmentStatementNode = AssignmentStatementNode;
var ReturnStatementNode = /** @class */ (function () {
    function ReturnStatementNode(_value) {
        this._value = _value;
    }
    return ReturnStatementNode;
}());
exports.ReturnStatementNode = ReturnStatementNode;
var BreakStatementNode = /** @class */ (function () {
    function BreakStatementNode(_tok) {
        this._tok = _tok;
    }
    return BreakStatementNode;
}());
exports.BreakStatementNode = BreakStatementNode;
var ContinueStatementNode = /** @class */ (function () {
    function ContinueStatementNode(_tok) {
        this._tok = _tok;
    }
    return ContinueStatementNode;
}());
exports.ContinueStatementNode = ContinueStatementNode;
var PassStatementNode = /** @class */ (function () {
    function PassStatementNode(_tok) {
        this._tok = _tok;
    }
    return PassStatementNode;
}());
exports.PassStatementNode = PassStatementNode;
var IfStatementNode = /** @class */ (function () {
    function IfStatementNode(_condition, _thenBranch, _elseBranch) {
        this._condition = _condition;
        this._thenBranch = _thenBranch;
        this._elseBranch = _elseBranch;
    }
    return IfStatementNode;
}());
exports.IfStatementNode = IfStatementNode;
var ForStatementNode = /** @class */ (function () {
    function ForStatementNode(_loopVar, _iterable, _block) {
        this._loopVar = _loopVar;
        this._iterable = _iterable;
        this._block = _block;
    }
    return ForStatementNode;
}());
exports.ForStatementNode = ForStatementNode;
var WhileStatementNode = /** @class */ (function () {
    function WhileStatementNode(_expression, _block) {
        this._expression = _expression;
        this._block = _block;
    }
    return WhileStatementNode;
}());
exports.WhileStatementNode = WhileStatementNode;
var FuncDefStatementNode = /** @class */ (function () {
    function FuncDefStatementNode(_name, _formalParamList) {
        this._name = _name;
        this._formalParamList = _formalParamList;
    }
    return FuncDefStatementNode;
}());
exports.FuncDefStatementNode = FuncDefStatementNode;
var ElifStatementNode = /** @class */ (function () {
    function ElifStatementNode(_condition, _thenBranch, _elseBranch) {
        this._condition = _condition;
        this._thenBranch = _thenBranch;
        this._elseBranch = _elseBranch;
    }
    return ElifStatementNode;
}());
exports.ElifStatementNode = ElifStatementNode;
var ElseBlockStatementNode = /** @class */ (function () {
    function ElseBlockStatementNode(_block) {
        this._block = _block;
    }
    return ElseBlockStatementNode;
}());
exports.ElseBlockStatementNode = ElseBlockStatementNode;
var ExpresssionStatementNode = /** @class */ (function () {
    function ExpresssionStatementNode(_expression) {
        this._expression = _expression;
    }
    return ExpresssionStatementNode;
}());
exports.ExpresssionStatementNode = ExpresssionStatementNode;
var BlockStatementNode = /** @class */ (function () {
    function BlockStatementNode(_statementList) {
        this._statementList = _statementList;
    }
    return BlockStatementNode;
}());
exports.BlockStatementNode = BlockStatementNode;
// ------------------------------------------------------------------
// Expression Nodes
// ------------------------------------------------------------------
var ExpressionNode = /** @class */ (function () {
    function ExpressionNode(_expression) {
        this._expression = _expression;
    }
    return ExpressionNode;
}());
exports.ExpressionNode = ExpressionNode;
var FormalParamsListExpressionNode = /** @class */ (function () {
    function FormalParamsListExpressionNode(_paramsList) {
        this._paramsList = _paramsList;
    }
    return FormalParamsListExpressionNode;
}());
exports.FormalParamsListExpressionNode = FormalParamsListExpressionNode;
var ConditionalExpressionNode = /** @class */ (function () {
    function ConditionalExpressionNode(_left, _condition, _right) {
        this._left = _left;
        this._condition = _condition;
        this._right = _right;
    }
    return ConditionalExpressionNode;
}());
exports.ConditionalExpressionNode = ConditionalExpressionNode;
var ArgListExpressionNode = /** @class */ (function () {
    function ArgListExpressionNode(_argsList) {
        this._argsList = _argsList;
    }
    return ArgListExpressionNode;
}());
exports.ArgListExpressionNode = ArgListExpressionNode;
var ComparisonExpressionNode = /** @class */ (function () {
    function ComparisonExpressionNode(_left, _operator, _right) {
        this._left = _left;
        this._operator = _operator;
        this._right = _right;
    }
    return ComparisonExpressionNode;
}());
exports.ComparisonExpressionNode = ComparisonExpressionNode;
var BinaryExpressionNode = /** @class */ (function () {
    function BinaryExpressionNode(_left, _operator, _right) {
        this._left = _left;
        this._operator = _operator;
        this._right = _right;
    }
    return BinaryExpressionNode;
}());
exports.BinaryExpressionNode = BinaryExpressionNode;
var UnaryExpressionNode = /** @class */ (function () {
    function UnaryExpressionNode(_operator, _operand) {
        this._operator = _operator;
        this._operand = _operand;
    }
    return UnaryExpressionNode;
}());
exports.UnaryExpressionNode = UnaryExpressionNode;
var FuncCallExpresssionNode = /** @class */ (function () {
    function FuncCallExpresssionNode(_func_name, _args_list) {
        this._func_name = _func_name;
        this._args_list = _args_list;
    }
    return FuncCallExpresssionNode;
}());
exports.FuncCallExpresssionNode = FuncCallExpresssionNode;
var ListAccessExpresssionNode = /** @class */ (function () {
    function ListAccessExpresssionNode(_list, _index) {
        this._list = _list;
        this._index = _index;
    }
    return ListAccessExpresssionNode;
}());
exports.ListAccessExpresssionNode = ListAccessExpresssionNode;
var MethodCallExpressionNode = /** @class */ (function () {
    function MethodCallExpressionNode(_list, _methodName, _argsList) {
        this._list = _list;
        this._methodName = _methodName;
        this._argsList = _argsList;
    }
    return MethodCallExpressionNode;
}());
exports.MethodCallExpressionNode = MethodCallExpressionNode;
var ListSliceExpressionNode = /** @class */ (function () {
    function ListSliceExpressionNode(_list, _start, _stop, _step) {
        this._list = _list;
        this._start = _start;
        this._stop = _stop;
        this._step = _step;
    }
    return ListSliceExpressionNode;
}());
exports.ListSliceExpressionNode = ListSliceExpressionNode;
var NumberLiteralExpressionNode = /** @class */ (function () {
    function NumberLiteralExpressionNode(_value) {
        this._value = _value;
    }
    return NumberLiteralExpressionNode;
}());
exports.NumberLiteralExpressionNode = NumberLiteralExpressionNode;
var ListLiteralExpressionNode = /** @class */ (function () {
    function ListLiteralExpressionNode(_values) {
        this._values = _values;
    }
    return ListLiteralExpressionNode;
}());
exports.ListLiteralExpressionNode = ListLiteralExpressionNode;
var BooleanLiteralExpressionNode = /** @class */ (function () {
    function BooleanLiteralExpressionNode(_value) {
        this._value = _value;
    }
    return BooleanLiteralExpressionNode;
}());
exports.BooleanLiteralExpressionNode = BooleanLiteralExpressionNode;
var StringLiteralExpressionNode = /** @class */ (function () {
    function StringLiteralExpressionNode(_value) {
        this._value = _value;
    }
    return StringLiteralExpressionNode;
}());
exports.StringLiteralExpressionNode = StringLiteralExpressionNode;
var IdentifierExpressionNode = /** @class */ (function () {
    function IdentifierExpressionNode(_name) {
        this._name = _name;
    }
    return IdentifierExpressionNode;
}());
exports.IdentifierExpressionNode = IdentifierExpressionNode;
