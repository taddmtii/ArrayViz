"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvaluatedExpressionNode = exports.StringLiteralExpressionNode = exports.BooleanLiteralExpressionNode = exports.ListLiteralExpressionNode = exports.ListSliceExpressionNode = exports.MethodCallExpressionNode = exports.ListAccessExpressionNode = exports.FuncCallExpressionNode = exports.UnaryExpressionNode = exports.BinaryExpressionNode = exports.ComparisonExpressionNode = exports.ArgListExpressionNode = exports.ConditionalExpressionNode = exports.FormalParamsListExpressionNode = exports.IdentifierExpressionNode = exports.NumberLiteralExpressionNode = exports.ExpressionNode = exports.BlockStatementNode = exports.ExpressionStatementNode = exports.ElseBlockStatementNode = exports.ElifStatementNode = exports.FuncDefStatementNode = exports.WhileStatementNode = exports.ForStatementNode = exports.IfStatementNode = exports.PassStatementNode = exports.ContinueStatementNode = exports.BreakStatementNode = exports.ReturnStatementNode = exports.AssignmentStatementNode = exports.StatementNode = exports.ProgramNode = void 0;
var Interpreter_1 = require("./Interpreter");
// ------------------------------------------------------------------
// ProgramNode
//
// Establishes list of statements that make up the program, encapsulates the 
// entire program. All commands collectively get added here to returned array here.
// ------------------------------------------------------------------
var ProgramNode = /** @class */ (function () {
    function ProgramNode(_statementList) {
        this._statementList = _statementList;
    }
    ProgramNode.prototype.execute = function () {
        var commands = [];
        for (var _i = 0, _a = this._statementList; _i < _a.length; _i++) {
            var statement = _a[_i];
            commands.push.apply(commands, statement.execute());
        }
        return commands;
    };
    return ProgramNode;
}());
exports.ProgramNode = ProgramNode;
// ------------------------------------------------------------------
// Statement Nodes
// ------------------------------------------------------------------
// Statement Node is the base class for all statement type nodes.
var StatementNode = /** @class */ (function () {
    function StatementNode(_tok) {
        this._startTok = _tok;
        this._endTok = _tok;
    }
    Object.defineProperty(StatementNode.prototype, "lineNum", {
        get: function () { return this._startTok.line; },
        enumerable: false,
        configurable: true
    });
    ;
    Object.defineProperty(StatementNode.prototype, "startLine", {
        get: function () { return this._startTok.line; },
        enumerable: false,
        configurable: true
    });
    ;
    Object.defineProperty(StatementNode.prototype, "endLine", {
        get: function () { return (this._endTok.line || this._startTok.line); },
        enumerable: false,
        configurable: true
    });
    ;
    return StatementNode;
}());
exports.StatementNode = StatementNode;
var AssignmentStatementNode = /** @class */ (function (_super) {
    __extends(AssignmentStatementNode, _super);
    function AssignmentStatementNode(_left, _right, _tok) {
        var _this = _super.call(this, _tok) || this;
        _this._left = _left;
        _this._right = _right;
        _this._tok = _tok;
        return _this;
    }
    AssignmentStatementNode.prototype.execute = function () {
        var commands = [];
        commands.push(new Interpreter_1.HighlightStatementCommand(this)); // Highlight
        commands.push.apply(// Highlight
        commands, (this._right.evaluate())); // evaluate (which may generate an array of commands, hence the spread operator)
        commands.push(new Interpreter_1.AssignVariableCommand(this._left)); // Bind variable.
        commands.push(new Interpreter_1.MoveLinePointerCommand(this._tok.line));
        return commands;
    };
    return AssignmentStatementNode;
}(StatementNode));
exports.AssignmentStatementNode = AssignmentStatementNode;
var ReturnStatementNode = /** @class */ (function (_super) {
    __extends(ReturnStatementNode, _super);
    function ReturnStatementNode(_value, _previousVariables, _tok) {
        var _this = _super.call(this, _tok) || this;
        _this._previousVariables = _previousVariables;
        _this._value = _value;
        return _this;
    }
    ReturnStatementNode.prototype.execute = function () {
        var commands = [];
        commands.push(new Interpreter_1.HighlightStatementCommand(this)); // highlight entire statement
        commands.push.apply(// highlight entire statement
        commands, (this._value.evaluate())); // evaluate value to be returned.
        commands.push(new Interpreter_1.ExitScopeCommand(this._previousVariables));
        // commands.push(new ReturnCommand());
        return commands;
    };
    return ReturnStatementNode;
}(StatementNode));
exports.ReturnStatementNode = ReturnStatementNode;
var BreakStatementNode = /** @class */ (function (_super) {
    __extends(BreakStatementNode, _super);
    function BreakStatementNode(_tok) {
        var _this = _super.call(this, _tok) || this;
        _this._tok = _tok;
        return _this;
    }
    BreakStatementNode.prototype.execute = function () {
        var commands = [];
        commands.push(new Interpreter_1.HighlightStatementCommand(this));
        // TODO: do break logic
        return commands;
    };
    return BreakStatementNode;
}(StatementNode));
exports.BreakStatementNode = BreakStatementNode;
var ContinueStatementNode = /** @class */ (function (_super) {
    __extends(ContinueStatementNode, _super);
    function ContinueStatementNode(_tok) {
        var _this = _super.call(this, _tok) || this;
        _this._tok = _tok;
        return _this;
    }
    ContinueStatementNode.prototype.execute = function () {
        var commands = [];
        commands.push(new Interpreter_1.HighlightStatementCommand(this));
        // TODO: do continue logic
        return commands;
    };
    return ContinueStatementNode;
}(StatementNode));
exports.ContinueStatementNode = ContinueStatementNode;
var PassStatementNode = /** @class */ (function (_super) {
    __extends(PassStatementNode, _super);
    function PassStatementNode(_tok) {
        var _this = _super.call(this, _tok) || this;
        _this._tok = _tok;
        return _this;
    }
    PassStatementNode.prototype.execute = function () {
        var commands = [];
        commands.push(new Interpreter_1.HighlightStatementCommand(this));
        commands.push(new Interpreter_1.MoveLinePointerCommand(this._tok.line)); // Move line pointer to token itself (the statement)
        return commands;
    };
    return PassStatementNode;
}(StatementNode));
exports.PassStatementNode = PassStatementNode;
var IfStatementNode = /** @class */ (function (_super) {
    __extends(IfStatementNode, _super);
    function IfStatementNode(_condition, _thenBranch, _elseBranch, _tok) {
        var _this = _super.call(this, _tok) || this;
        _this._condition = _condition;
        _this._thenBranch = _thenBranch;
        _this._elseBranch = _elseBranch;
        return _this;
    }
    IfStatementNode.prototype.execute = function () {
        var commands = [];
        commands.push(new Interpreter_1.HighlightStatementCommand(this));
        commands.push.apply(commands, this._condition.evaluate());
        // TODO: do conditional jump logic here
        // if then branch exists
        if (this._thenBranch) {
            commands.push.apply(commands, this._thenBranch.execute());
        }
        // if else branch exists...
        if (this._elseBranch) { // if else branch exists...
            commands.push.apply(// if else branch exists...
            commands, this._elseBranch.execute());
        }
        return commands;
    };
    return IfStatementNode;
}(StatementNode));
exports.IfStatementNode = IfStatementNode;
var ForStatementNode = /** @class */ (function (_super) {
    __extends(ForStatementNode, _super);
    function ForStatementNode(_loopVar, _iterable, _block, _tok) {
        var _this = _super.call(this, _tok) || this;
        _this._loopVar = _loopVar;
        _this._iterable = _iterable;
        _this._block = _block;
        return _this;
    }
    ForStatementNode.prototype.execute = function () {
        var commands = [];
        commands.push(new Interpreter_1.HighlightStatementCommand(this));
        commands.push.apply(commands, this._iterable.evaluate());
        // TODO: do for loop logic
        commands.push.apply(commands, this._block.execute());
        return commands;
    };
    return ForStatementNode;
}(StatementNode));
exports.ForStatementNode = ForStatementNode;
var WhileStatementNode = /** @class */ (function (_super) {
    __extends(WhileStatementNode, _super);
    function WhileStatementNode(_expression, _block, _tok) {
        var _this = _super.call(this, _tok) || this;
        _this._expression = _expression;
        _this._block = _block;
        return _this;
    }
    WhileStatementNode.prototype.execute = function () {
        var commands = [];
        commands.push(new Interpreter_1.HighlightStatementCommand(this));
        commands.push.apply(commands, this._expression.evaluate());
        // TODO: do while loop logic
        commands.push.apply(commands, this._block.execute());
        return commands;
    };
    return WhileStatementNode;
}(StatementNode));
exports.WhileStatementNode = WhileStatementNode;
var FuncDefStatementNode = /** @class */ (function (_super) {
    __extends(FuncDefStatementNode, _super);
    function FuncDefStatementNode(_name, _formalParamList, _block, _tok) {
        var _this = _super.call(this, _tok) || this;
        _this._name = _name;
        _this._formalParamList = _formalParamList;
        _this._block = _block;
        return _this;
    }
    FuncDefStatementNode.prototype.execute = function () {
        var commands = [];
        commands.push(new Interpreter_1.HighlightStatementCommand(this));
        // TODO: do function definition logic
        return commands;
    };
    return FuncDefStatementNode;
}(StatementNode));
exports.FuncDefStatementNode = FuncDefStatementNode;
var ElifStatementNode = /** @class */ (function (_super) {
    __extends(ElifStatementNode, _super);
    function ElifStatementNode(_condition, _thenBranch, _elseBranch, _tok) {
        var _this = _super.call(this, _tok) || this;
        _this._condition = _condition;
        _this._thenBranch = _thenBranch;
        _this._elseBranch = _elseBranch;
        return _this;
    }
    ElifStatementNode.prototype.execute = function () {
        var commands = [];
        commands.push(new Interpreter_1.HighlightStatementCommand(this));
        commands.push.apply(commands, this._condition.evaluate());
        // TODO: do elif logic
        if (this._thenBranch) {
            commands.push.apply(commands, this._thenBranch.execute());
        }
        if (this._elseBranch) {
            commands.push.apply(commands, this._elseBranch.execute());
        }
        return commands;
    };
    return ElifStatementNode;
}(StatementNode));
exports.ElifStatementNode = ElifStatementNode;
var ElseBlockStatementNode = /** @class */ (function (_super) {
    __extends(ElseBlockStatementNode, _super);
    function ElseBlockStatementNode(_block, _tok) {
        var _this = _super.call(this, _tok) || this;
        _this._block = _block;
        return _this;
    }
    ElseBlockStatementNode.prototype.execute = function () {
        var commands = [];
        this._block.execute();
        return commands;
    };
    return ElseBlockStatementNode;
}(StatementNode));
exports.ElseBlockStatementNode = ElseBlockStatementNode;
var ExpressionStatementNode = /** @class */ (function (_super) {
    __extends(ExpressionStatementNode, _super);
    function ExpressionStatementNode(_expression, _tok) {
        var _this = _super.call(this, _tok) || this;
        _this._expression = _expression;
        return _this;
    }
    ExpressionStatementNode.prototype.execute = function () {
        var commands = [];
        commands.push(new Interpreter_1.HighlightStatementCommand(this));
        commands.push.apply(commands, this._expression.evaluate());
        // commands.push(new PopValueCommand()); // do we really need to store the result since the expression is part of the statement, would that not be handled separately?
        return commands;
    };
    return ExpressionStatementNode;
}(StatementNode));
exports.ExpressionStatementNode = ExpressionStatementNode;
var BlockStatementNode = /** @class */ (function (_super) {
    __extends(BlockStatementNode, _super);
    function BlockStatementNode(_statementList, _tok) {
        var _this = _super.call(this, _tok) || this;
        _this._statementList = _statementList;
        return _this;
    }
    BlockStatementNode.prototype.execute = function () {
        var commands = [];
        for (var _i = 0, _a = this._statementList; _i < _a.length; _i++) {
            var statement = _a[_i];
            commands.push.apply(commands, statement.execute());
        }
        return commands;
    };
    return BlockStatementNode;
}(StatementNode));
exports.BlockStatementNode = BlockStatementNode;
// ------------------------------------------------------------------
// Expression Nodes
// ------------------------------------------------------------------
var ExpressionNode = /** @class */ (function () {
    function ExpressionNode(_tok) {
        this._tok = _tok;
    }
    Object.defineProperty(ExpressionNode.prototype, "lineNum", {
        get: function () { return this._tok.line; },
        enumerable: false,
        configurable: true
    });
    ;
    Object.defineProperty(ExpressionNode.prototype, "startLine", {
        get: function () { return this._tok.line; },
        enumerable: false,
        configurable: true
    });
    ;
    Object.defineProperty(ExpressionNode.prototype, "endLine", {
        get: function () { return this._tok.line; },
        enumerable: false,
        configurable: true
    });
    ;
    Object.defineProperty(ExpressionNode.prototype, "startCol", {
        get: function () { return this._tok.col; },
        enumerable: false,
        configurable: true
    });
    ;
    Object.defineProperty(ExpressionNode.prototype, "endCol", {
        get: function () { return this._tok.col + (this._tok.text.length - 1); },
        enumerable: false,
        configurable: true
    });
    ;
    return ExpressionNode;
}());
exports.ExpressionNode = ExpressionNode;
var NumberLiteralExpressionNode = /** @class */ (function (_super) {
    __extends(NumberLiteralExpressionNode, _super);
    function NumberLiteralExpressionNode(value, tok) {
        var _this = _super.call(this, tok) || this;
        _this._value = value;
        return _this;
    }
    NumberLiteralExpressionNode.prototype.evaluate = function () {
        var numValue;
        if (this._value.startsWith('0x')) { // hexadecimal
            numValue = parseInt(this._value, 16);
        }
        else if (this._value.startsWith('0b')) { // binary
            numValue = parseInt(this._value, 2);
        }
        else if (this._value.includes('.')) { // float
            numValue = parseFloat(this._value);
        }
        else {
            numValue = BigInt(this._value); // regular integer, base 10.
        }
        // Create list of commands and return as result to add to overall steps.
        return [
            new Interpreter_1.HighlightExpressionCommand(this), // visually indicate what expression to highlight.
            new Interpreter_1.PushValueCommand(numValue) // push onto stack
        ];
    };
    return NumberLiteralExpressionNode;
}(ExpressionNode));
exports.NumberLiteralExpressionNode = NumberLiteralExpressionNode;
var IdentifierExpressionNode = /** @class */ (function (_super) {
    __extends(IdentifierExpressionNode, _super);
    function IdentifierExpressionNode(_tok) {
        var _this = _super.call(this, _tok) || this;
        _this._tok = _tok;
        return _this;
    }
    IdentifierExpressionNode.prototype.evaluate = function () {
        return [
            new Interpreter_1.HighlightExpressionCommand(this), // highlight, no need for replace.
            new Interpreter_1.RetrieveValueCommand(this._tok.text)
        ];
    };
    return IdentifierExpressionNode;
}(ExpressionNode));
exports.IdentifierExpressionNode = IdentifierExpressionNode;
var FormalParamsListExpressionNode = /** @class */ (function (_super) {
    __extends(FormalParamsListExpressionNode, _super);
    function FormalParamsListExpressionNode(_paramsList) {
        var _this = _super.call(this, _paramsList[0]._tok) || this;
        _this._paramsList = _paramsList;
        return _this;
    }
    FormalParamsListExpressionNode.prototype.evaluate = function () {
        var commands = [];
        // TODO: do parameter list logic (???) not really sure where to start here yet.
        return commands;
    };
    return FormalParamsListExpressionNode;
}(ExpressionNode));
exports.FormalParamsListExpressionNode = FormalParamsListExpressionNode;
var ConditionalExpressionNode = /** @class */ (function (_super) {
    __extends(ConditionalExpressionNode, _super);
    function ConditionalExpressionNode(_left, _condition, _right) {
        var _this = _super.call(this, _condition._tok) || this; // pass conditions token.
        _this._left = _left;
        _this._condition = _condition;
        _this._right = _right;
        return _this;
    }
    ConditionalExpressionNode.prototype.evaluate = function () {
        var commands = [];
        commands.push.apply(commands, this._condition.evaluate());
        commands.push.apply(commands, this._left.evaluate());
        commands.push.apply(commands, this._right.evaluate());
        return commands;
    };
    return ConditionalExpressionNode;
}(ExpressionNode));
exports.ConditionalExpressionNode = ConditionalExpressionNode;
var ArgListExpressionNode = /** @class */ (function (_super) {
    __extends(ArgListExpressionNode, _super);
    function ArgListExpressionNode(_argsList) {
        var _this = _super.call(this, _argsList[0]._tok) || this;
        _this._argsList = _argsList;
        return _this;
    }
    ArgListExpressionNode.prototype.evaluate = function () {
        var commands = [];
        for (var _i = 0, _a = this._argsList; _i < _a.length; _i++) {
            var arg = _a[_i];
            commands.push.apply(commands, arg.evaluate());
        }
        return commands;
    };
    return ArgListExpressionNode;
}(ExpressionNode));
exports.ArgListExpressionNode = ArgListExpressionNode;
var ComparisonExpressionNode = /** @class */ (function (_super) {
    __extends(ComparisonExpressionNode, _super);
    function ComparisonExpressionNode(_left, _operator, _right) {
        var _this = _super.call(this, _left._tok) || this;
        _this._left = _left;
        _this._operator = _operator;
        _this._right = _right;
        return _this;
    }
    ComparisonExpressionNode.prototype.evaluate = function () {
        var commands = [];
        // TODO: comparison logic
        return commands;
    };
    return ComparisonExpressionNode;
}(ExpressionNode));
exports.ComparisonExpressionNode = ComparisonExpressionNode;
var BinaryExpressionNode = /** @class */ (function (_super) {
    __extends(BinaryExpressionNode, _super);
    function BinaryExpressionNode(_left, _operator, _right, _tok) {
        var _this = _super.call(this, _tok) || this;
        _this._left = _left;
        _this._operator = _operator;
        _this._right = _right;
        return _this;
    }
    BinaryExpressionNode.prototype.evaluate = function () {
        var commands = [];
        commands.push(new Interpreter_1.HighlightExpressionCommand(this));
        commands.push.apply(commands, this._left.evaluate());
        commands.push.apply(commands, this._right.evaluate());
        commands.push(new Interpreter_1.BinaryOpCommand(this._operator));
        return commands;
    };
    return BinaryExpressionNode;
}(ExpressionNode));
exports.BinaryExpressionNode = BinaryExpressionNode;
var UnaryExpressionNode = /** @class */ (function (_super) {
    __extends(UnaryExpressionNode, _super);
    function UnaryExpressionNode(_operator, _operand, _tok) {
        var _this = _super.call(this, _tok) || this;
        _this._operator = _operator;
        _this._operand = _operand;
        return _this;
    }
    UnaryExpressionNode.prototype.evaluate = function () {
        var commands = [];
        commands.push(new Interpreter_1.HighlightExpressionCommand(this));
        commands.push.apply(commands, this._operand.evaluate());
        commands.push(new Interpreter_1.UnaryOpCommand(this._operator));
        return commands;
    };
    return UnaryExpressionNode;
}(ExpressionNode));
exports.UnaryExpressionNode = UnaryExpressionNode;
var FuncCallExpressionNode = /** @class */ (function (_super) {
    __extends(FuncCallExpressionNode, _super);
    function FuncCallExpressionNode(_func_name, _args_list) {
        var _this = _super.call(this, _func_name._tok) || this;
        _this._func_name = _func_name;
        _this._args_list = _args_list;
        return _this;
    }
    FuncCallExpressionNode.prototype.evaluate = function () {
        var commands = [];
        // TODO: do func call logic
        return commands;
    };
    return FuncCallExpressionNode;
}(ExpressionNode));
exports.FuncCallExpressionNode = FuncCallExpressionNode;
var ListAccessExpressionNode = /** @class */ (function (_super) {
    __extends(ListAccessExpressionNode, _super);
    function ListAccessExpressionNode(_list, _index) {
        var _this = _super.call(this, _list._tok) || this;
        _this._list = _list;
        _this._index = _index;
        return _this;
    }
    ListAccessExpressionNode.prototype.evaluate = function () {
        var commands = [];
        commands.push(new Interpreter_1.HighlightExpressionCommand(this));
        commands.push.apply(commands, this._list.evaluate());
        commands.push.apply(commands, this._index.evaluate());
        // commands.push(new IndexAccessCommand());
        return commands;
    };
    return ListAccessExpressionNode;
}(ExpressionNode));
exports.ListAccessExpressionNode = ListAccessExpressionNode;
var MethodCallExpressionNode = /** @class */ (function (_super) {
    __extends(MethodCallExpressionNode, _super);
    function MethodCallExpressionNode(_list, _methodName, _argsList) {
        var _this = _super.call(this, _list._tok) || this;
        _this._list = _list;
        _this._methodName = _methodName;
        _this._argsList = _argsList;
        return _this;
    }
    MethodCallExpressionNode.prototype.evaluate = function () {
        var commands = [];
        // TODO: do method call logic
        return commands;
    };
    return MethodCallExpressionNode;
}(ExpressionNode));
exports.MethodCallExpressionNode = MethodCallExpressionNode;
var ListSliceExpressionNode = /** @class */ (function (_super) {
    __extends(ListSliceExpressionNode, _super);
    function ListSliceExpressionNode(_list, _start, _stop, _step) {
        var _this = _super.call(this, _list._tok) || this;
        _this._list = _list;
        _this._start = _start;
        _this._stop = _stop;
        _this._step = _step;
        return _this;
    }
    ListSliceExpressionNode.prototype.evaluate = function () {
        var commands = [];
        commands.push(new Interpreter_1.HighlightExpressionCommand(this));
        commands.push.apply(commands, this._list.evaluate());
        // if start exists, if stop exists, if step exists, otherwise push a null value and handle accordingly.
        if (this._start) {
            commands.push.apply(commands, this._start.evaluate());
        }
        else {
            commands.push(new Interpreter_1.PushValueCommand(null));
        }
        if (this._stop) {
            commands.push.apply(commands, this._stop.evaluate());
        }
        else {
            commands.push(new Interpreter_1.PushValueCommand(null));
        }
        if (this._step) {
            commands.push.apply(commands, this._step.evaluate());
        }
        else {
            commands.push(new Interpreter_1.PushValueCommand(null));
        }
        return commands;
    };
    return ListSliceExpressionNode;
}(ExpressionNode));
exports.ListSliceExpressionNode = ListSliceExpressionNode;
var ListLiteralExpressionNode = /** @class */ (function (_super) {
    __extends(ListLiteralExpressionNode, _super);
    function ListLiteralExpressionNode(_values, _tok) {
        var _this = _super.call(this, _tok) || this;
        _this._values = _values;
        return _this;
    }
    ListLiteralExpressionNode.prototype.evaluate = function () {
        return [
            new Interpreter_1.HighlightExpressionCommand(this),
            // TODO: fix implementation and do list literal logic
        ];
    };
    return ListLiteralExpressionNode;
}(ExpressionNode));
exports.ListLiteralExpressionNode = ListLiteralExpressionNode;
var BooleanLiteralExpressionNode = /** @class */ (function (_super) {
    __extends(BooleanLiteralExpressionNode, _super);
    function BooleanLiteralExpressionNode(_value, _tok) {
        var _this = _super.call(this, _tok) || this;
        _this._value = _value;
        return _this;
    }
    BooleanLiteralExpressionNode.prototype.evaluate = function () {
        return [
            new Interpreter_1.HighlightExpressionCommand(this), // highlight
            new Interpreter_1.PushValueCommand(this._value)
            // new ReplaceHighlightedExpressionCommand(this, new EvaluatedExpressionNode(this._value)) // replace
        ];
    };
    return BooleanLiteralExpressionNode;
}(ExpressionNode));
exports.BooleanLiteralExpressionNode = BooleanLiteralExpressionNode;
var StringLiteralExpressionNode = /** @class */ (function (_super) {
    __extends(StringLiteralExpressionNode, _super);
    function StringLiteralExpressionNode(_value) {
        var _this = _super.call(this, _value) || this;
        _this._value = _value;
        return _this;
    }
    StringLiteralExpressionNode.prototype.evaluate = function () {
        return [
            new Interpreter_1.HighlightExpressionCommand(this), // highlight
            new Interpreter_1.PushValueCommand(this._value.text)
            // new ReplaceHighlightedExpressionCommand(this, new EvaluatedExpressionNode(this._value)) // replace
        ];
    };
    return StringLiteralExpressionNode;
}(ExpressionNode));
exports.StringLiteralExpressionNode = StringLiteralExpressionNode;
var EvaluatedExpressionNode = /** @class */ (function (_super) {
    __extends(EvaluatedExpressionNode, _super);
    function EvaluatedExpressionNode(_value, _tok) {
        var _this = _super.call(this, _tok) || this;
        _this._value = _value;
        return _this;
    }
    EvaluatedExpressionNode.prototype.evaluate = function () {
        var commands = [];
        // commands.push(new PushValueCommand(this._value));
        // TODO: figure out what to do with this node.
        return commands;
    };
    return EvaluatedExpressionNode;
}(ExpressionNode));
exports.EvaluatedExpressionNode = EvaluatedExpressionNode;
