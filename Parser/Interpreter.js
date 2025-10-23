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
exports.ReturnCommand = exports.CreateListCommand = exports.ListSliceCommand = exports.IndexAccessCommand = exports.InputCommand = exports.TypeCommand = exports.LenCommand = exports.PrintCommand = exports.ExitScopeCommand = exports.EnterScopeCommand = exports.JumpCommand = exports.ConditionalJumpCommand = exports.UnaryOpCommand = exports.ComparisonOpCommand = exports.BinaryOpCommand = exports.ReplaceHighlightedExpressionCommand = exports.HighlightStatementCommand = exports.MoveLinePointerCommand = exports.RetrieveValueCommand = exports.HighlightExpressionCommand = exports.PopValueCommand = exports.PushValueCommand = exports.ChangeVariableCommand = exports.AssignVariableCommand = exports.State = exports.Command = void 0;
// ---------------------------------------------------------------------------------------
// COMMANDS ABC
// ---------------------------------------------------------------------------------------
var Command = /** @class */ (function () {
    function Command() {
        this._undoCommand = null;
    }
    Command.prototype.undo = function (_currentState) {
        var _a;
        (_a = this._undoCommand) === null || _a === void 0 ? void 0 : _a.do(_currentState);
    };
    return Command;
}());
exports.Command = Command;
// ---------------------------------------------------------------------------------------
// PROGRAM STATE
// ---------------------------------------------------------------------------------------
var State = /** @class */ (function () {
    function State(_programCounter, _lineCount, _currentExpression, _currentStatement, _callStack, _history, _variables, _currentLine, _evaluationStack, _returnStack) {
        this._programCounter = 0; // which line of execution are we on.
        this._lineCount = 0; // all lines in program.
        this._currentLine = 1; // current line number
        this._variables = new Map(); // storage for variables and thier values
        this._programCounter = _programCounter;
        this._lineCount = _lineCount;
        this._currentExpression = _currentExpression;
        this._currentStatement = _currentStatement;
        this._callStack = _callStack;
        this._history = _history;
        this._variables = _variables;
        this._currentLine = _currentLine;
        this._evaluationStack = _evaluationStack;
        this._returnStack = _returnStack;
    }
    Object.defineProperty(State.prototype, "programCounter", {
        get: function () {
            return this._programCounter;
        },
        set: function (val) {
            this._programCounter = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(State.prototype, "lineCount", {
        get: function () {
            return this._lineCount;
        },
        set: function (val) {
            this._lineCount = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(State.prototype, "currentLine", {
        get: function () {
            return this._currentLine;
        },
        set: function (val) {
            this._currentLine = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(State.prototype, "currentExpression", {
        get: function () {
            return this._currentExpression;
        },
        set: function (expr) {
            this._currentExpression = expr;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(State.prototype, "currentStatement", {
        get: function () {
            return this._currentStatement;
        },
        set: function (stmt) {
            this._currentStatement = stmt;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(State.prototype, "evaluationStack", {
        get: function () {
            return this._evaluationStack;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(State.prototype, "variables", {
        get: function () {
            return this._variables;
        },
        enumerable: false,
        configurable: true
    });
    State.prototype.setVariable = function (name, value) {
        this._variables.set(name, value);
    }; // adds new key value into variables map.
    State.prototype.getVariable = function (name) {
        return this._variables.get(name) || null;
    }; // could be nullable upon lookup. null is important here.
    State.prototype.pushCallStack = function (func) {
        this._callStack.push(func);
    }; // pushes element onto stack
    State.prototype.popCallStack = function () {
        return this._callStack.pop();
    }; // gets element from top of stack
    State.prototype.addHistoryCommand = function (step) {
        this._history.push(step);
    };
    State.prototype.getMostRecentHistoryCommand = function () {
        return this._history.pop();
    };
    State.prototype.pushReturnStack = function (value) {
        this._returnStack.push(value);
    };
    State.prototype.popReturnStack = function () {
        return this._returnStack.pop();
    };
    return State;
}());
exports.State = State;
// ---------------------------------------------------------------------------------------
// COMMANDS
// ---------------------------------------------------------------------------------------
// Take value from top of evaluation stack and store it in a variable.
var AssignVariableCommand = /** @class */ (function (_super) {
    __extends(AssignVariableCommand, _super);
    function AssignVariableCommand(_name) {
        var _this = _super.call(this) || this;
        _this._name = _name;
        return _this;
    }
    AssignVariableCommand.prototype.do = function (_currentState) {
        var newValue = _currentState.evaluationStack.pop(); // get value from evaluation stack
        var oldValue = _currentState.getVariable(this._name); // grab current value of variable from map
        this._undoCommand = new ChangeVariableCommand(this._name, oldValue); // undo command: Change variable BACK to old value.
        _currentState.setVariable(this._name, newValue);
    };
    return AssignVariableCommand;
}(Command));
exports.AssignVariableCommand = AssignVariableCommand;
// NOTE: probably do not need this command.
// For reassignments to a variable. If variable name is not already assigned, it will be assigned.
var ChangeVariableCommand = /** @class */ (function (_super) {
    __extends(ChangeVariableCommand, _super);
    function ChangeVariableCommand(_name, _value) {
        var _this = _super.call(this) || this;
        _this._name = _name;
        _this._value = _value;
        return _this;
    }
    ChangeVariableCommand.prototype.do = function (_currentState) {
        var oldValue = _currentState.getVariable(this._name); // get current variables value
        this._undoCommand = new ChangeVariableCommand(this._name, oldValue); // undo command: Change variable to old value.
        _currentState.setVariable(this._name, this._value); // set variable to new value passed in
    };
    return ChangeVariableCommand;
}(Command));
exports.ChangeVariableCommand = ChangeVariableCommand;
// Pushes value onto Evaluation Stack during Expression processing.
var PushValueCommand = /** @class */ (function (_super) {
    __extends(PushValueCommand, _super);
    function PushValueCommand(value) {
        var _this = _super.call(this) || this;
        _this._value = value;
        return _this;
    }
    PushValueCommand.prototype.do = function (_currentState) {
        this._undoCommand = new PopValueCommand();
        _currentState.evaluationStack.push(this._value);
    };
    return PushValueCommand;
}(Command));
exports.PushValueCommand = PushValueCommand;
// Pops value off Evaluation Stack during Expression processing.
var PopValueCommand = /** @class */ (function (_super) {
    __extends(PopValueCommand, _super);
    function PopValueCommand() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PopValueCommand.prototype.do = function (_currentState) {
        var value;
        value = _currentState.evaluationStack.pop(); // pop value and store in member
        this._undoCommand = new PushValueCommand(value);
        return value;
    };
    return PopValueCommand;
}(Command));
exports.PopValueCommand = PopValueCommand;
// Highlights expression that is being evaluated.
var HighlightExpressionCommand = /** @class */ (function (_super) {
    __extends(HighlightExpressionCommand, _super);
    function HighlightExpressionCommand(_expression) {
        var _this = _super.call(this) || this; // call superclass constructor
        _this._expression = _expression;
        return _this;
    }
    HighlightExpressionCommand.prototype.do = function (_currentState) {
        this._undoCommand = new HighlightExpressionCommand(_currentState.currentExpression);
        _currentState.currentExpression = this._expression;
        var exprType = this._expression.constructor.name;
        var tok = this._expression._tok
            ? "\"".concat(this._expression._tok.text, "\" at line ").concat(this._expression._tok.line)
            : "at line ".concat(this._expression.lineNum);
        console.log("[EXPR] ".concat(exprType, ": ").concat(tok));
    };
    return HighlightExpressionCommand;
}(Command));
exports.HighlightExpressionCommand = HighlightExpressionCommand;
// Should grab current value of variable.
var RetrieveValueCommand = /** @class */ (function (_super) {
    __extends(RetrieveValueCommand, _super);
    function RetrieveValueCommand(_varName) {
        var _this = _super.call(this) || this;
        _this._varName = _varName;
        return _this;
    }
    RetrieveValueCommand.prototype.do = function (_currentState) {
        var value = _currentState.getVariable(this._varName);
        this._undoCommand = new PopValueCommand();
        _currentState.evaluationStack.push(value);
    };
    return RetrieveValueCommand;
}(Command));
exports.RetrieveValueCommand = RetrieveValueCommand;
var MoveLinePointerCommand = /** @class */ (function (_super) {
    __extends(MoveLinePointerCommand, _super);
    function MoveLinePointerCommand(_lineNum) {
        var _this = _super.call(this) || this;
        _this._lineNum = _lineNum;
        return _this;
    }
    MoveLinePointerCommand.prototype.do = function (_currentState) {
        this._undoCommand = new MoveLinePointerCommand(_currentState.programCounter);
        _currentState.programCounter = this._lineNum;
    };
    return MoveLinePointerCommand;
}(Command));
exports.MoveLinePointerCommand = MoveLinePointerCommand;
var HighlightStatementCommand = /** @class */ (function (_super) {
    __extends(HighlightStatementCommand, _super);
    function HighlightStatementCommand(_statement) {
        var _this = _super.call(this) || this;
        _this._statement = _statement;
        return _this;
    }
    HighlightStatementCommand.prototype.do = function (_currentState) {
        // Create undocommand that
        this._undoCommand = new HighlightStatementCommand(_currentState.currentStatement);
        _currentState.currentStatement = this._statement;
        console.log("Statement Highlighted!");
        // Tell UI somehow to highlight command we want it to.
    };
    return HighlightStatementCommand;
}(Command));
exports.HighlightStatementCommand = HighlightStatementCommand;
// TODO: call this everywhere too
var ReplaceHighlightedExpressionCommand = /** @class */ (function (_super) {
    __extends(ReplaceHighlightedExpressionCommand, _super);
    function ReplaceHighlightedExpressionCommand(_oldExpression, _newExpression) {
        var _this = _super.call(this) || this;
        _this._oldExpression = _oldExpression;
        _this._newExpression = _newExpression;
        return _this;
    }
    ReplaceHighlightedExpressionCommand.prototype.do = function (_currentState) {
        this._undoCommand = new ReplaceHighlightedExpressionCommand(this._newExpression, this._oldExpression);
        _currentState.currentExpression = this._newExpression;
    };
    return ReplaceHighlightedExpressionCommand;
}(Command));
exports.ReplaceHighlightedExpressionCommand = ReplaceHighlightedExpressionCommand;
// For evaluating arithmetic operations
var BinaryOpCommand = /** @class */ (function (_super) {
    __extends(BinaryOpCommand, _super);
    function BinaryOpCommand(_op) {
        var _this = _super.call(this) || this;
        _this._op = _op;
        return _this;
    }
    BinaryOpCommand.prototype.do = function (_currentState) {
        var evaluatedRight = _currentState.evaluationStack.pop(); // always pop right first!!
        var evaluatedLeft = _currentState.evaluationStack.pop();
        var res = 0;
        if (this._op === "+" &&
            typeof evaluatedLeft === "string" &&
            typeof evaluatedRight === "string") {
            res = evaluatedLeft + evaluatedRight;
        }
        if (typeof evaluatedLeft === "number" &&
            typeof evaluatedRight === "number") {
            switch (this._op) {
                case "+":
                    res = evaluatedLeft + evaluatedRight;
                    break;
                case "-":
                    res = evaluatedLeft - evaluatedRight;
                    break;
                case "%":
                    res = evaluatedLeft % evaluatedRight;
                    break;
                case "*":
                    res = evaluatedLeft * evaluatedRight;
                    break;
                case "**":
                    res = Math.pow(evaluatedLeft, evaluatedRight);
                    break;
                case "/":
                    res = evaluatedLeft / evaluatedRight;
                    break;
                case "//":
                    res = Math.floor(evaluatedLeft / evaluatedRight);
                    break;
                case "and":
                    res = evaluatedLeft && evaluatedRight;
                    break;
                case "or":
                    res = evaluatedRight || evaluatedRight;
                    break;
            }
        }
        _currentState.evaluationStack.push(res);
    };
    return BinaryOpCommand;
}(Command));
exports.BinaryOpCommand = BinaryOpCommand;
var ComparisonOpCommand = /** @class */ (function (_super) {
    __extends(ComparisonOpCommand, _super);
    function ComparisonOpCommand(_op) {
        var _this = _super.call(this) || this;
        _this._op = _op;
        return _this;
    }
    ComparisonOpCommand.prototype.do = function (_currentState) {
        var evaluatedRight = _currentState.evaluationStack.pop(); // right should be popped first.
        var evaluatedLeft = _currentState.evaluationStack.pop();
        var res = false;
        switch (this._op) {
            case "<":
                res = evaluatedLeft < evaluatedRight;
                break;
            case ">":
                res = evaluatedLeft > evaluatedRight;
                break;
            case "<=":
                res = evaluatedLeft <= evaluatedRight;
                break;
            case ">=":
                res = evaluatedLeft >= evaluatedRight;
                break;
            case "!=":
                res = evaluatedLeft != evaluatedRight;
                break;
        }
        _currentState.evaluationStack.push(res);
    };
    return ComparisonOpCommand;
}(Command));
exports.ComparisonOpCommand = ComparisonOpCommand;
var UnaryOpCommand = /** @class */ (function (_super) {
    __extends(UnaryOpCommand, _super);
    function UnaryOpCommand(_operator) {
        var _this = _super.call(this) || this;
        _this._operator = _operator;
        return _this;
    }
    UnaryOpCommand.prototype.do = function (_currentState) {
        var operand = _currentState.evaluationStack.pop();
        var res = 0;
        switch (this._operator) {
            case "-":
                res = -operand;
                break;
            case "+":
                res = operand;
                break;
            case "!":
                res = !operand;
                break;
            case "not":
                res = !operand;
                break;
        }
        _currentState.evaluationStack.push(res);
    };
    return UnaryOpCommand;
}(Command));
exports.UnaryOpCommand = UnaryOpCommand;
// ConditionalJumpCommand -> jumps to line if condition in loop is true/false
// TODO: Refer to Prof. O on this one.
var ConditionalJumpCommand = /** @class */ (function (_super) {
    __extends(ConditionalJumpCommand, _super);
    function ConditionalJumpCommand(_lineNum, _jumpBool) {
        var _this = _super.call(this) || this;
        _this._lineNum = _lineNum;
        _this._jumpBool = true; // default to true
        return _this;
    }
    ConditionalJumpCommand.prototype.do = function (_currentState) { };
    return ConditionalJumpCommand;
}(Command));
exports.ConditionalJumpCommand = ConditionalJumpCommand;
// JumpCommand -> jumps to a line number
var JumpCommand = /** @class */ (function (_super) {
    __extends(JumpCommand, _super);
    function JumpCommand(_lineNum) {
        var _this = _super.call(this) || this;
        _this._lineNum = _lineNum;
        return _this;
    }
    JumpCommand.prototype.do = function (_currentState) {
        this._undoCommand = new JumpCommand(_currentState.programCounter);
        _currentState.programCounter = this._lineNum;
    };
    return JumpCommand;
}(Command));
exports.JumpCommand = JumpCommand;
// EnterScopeCommand -> keeps local storage within functions/conditiionals/etc..
var EnterScopeCommand = /** @class */ (function (_super) {
    __extends(EnterScopeCommand, _super);
    function EnterScopeCommand(_savedVariables) {
        var _this = _super.call(this) || this;
        _this._savedVariables = _savedVariables;
        return _this;
    }
    EnterScopeCommand.prototype.do = function (_currentState) {
        this._savedVariables = new Map(_currentState.variables); // create new map for local variables only.
        this._undoCommand = new ExitScopeCommand(this._savedVariables); // restore previous variables.
    };
    return EnterScopeCommand;
}(Command));
exports.EnterScopeCommand = EnterScopeCommand;
// ExitScopeCommand -> exit scope and restore previous variable state.
var ExitScopeCommand = /** @class */ (function (_super) {
    __extends(ExitScopeCommand, _super);
    function ExitScopeCommand(_previousVariables) {
        var _this = _super.call(this) || this;
        _this._previousVariables = _previousVariables;
        return _this;
    }
    ExitScopeCommand.prototype.do = function (_currentState) {
        var currentVariables = new Map(_currentState.variables); // create copy of current variables set in scope. (local)
        this._undoCommand = new ExitScopeCommand(currentVariables); // undo is going back in scope, so restore variabels to local ones.
        _currentState.variables.clear(); // clear all local variables.
        this._previousVariables.forEach(function (value, key) {
            // iterate over all previous variables
            _currentState.setVariable(key, value); // set each one by one to restore state.
        });
    };
    return ExitScopeCommand;
}(Command));
exports.ExitScopeCommand = ExitScopeCommand;
// PrintCommand -> prints something to the console.
var PrintCommand = /** @class */ (function (_super) {
    __extends(PrintCommand, _super);
    function PrintCommand() {
        return _super.call(this) || this;
    }
    PrintCommand.prototype.do = function (_currentState) {
        var value = _currentState.evaluationStack.pop();
        console.log(value);
        // this._undoCommand = new PushValueCommand(value);
    };
    return PrintCommand;
}(Command));
exports.PrintCommand = PrintCommand;
// LenCommand -> gets length of strings and lists, etc...
var LenCommand = /** @class */ (function (_super) {
    __extends(LenCommand, _super);
    function LenCommand() {
        return _super.call(this) || this;
    }
    LenCommand.prototype.do = function (_currentState) {
        var value = _currentState.evaluationStack.pop();
        // let length = 0;
        if (typeof value === "string") {
            _currentState.evaluationStack.push(value.length);
        }
        else if (Array.isArray(value)) {
            _currentState.evaluationStack.push(value.length);
        }
    };
    return LenCommand;
}(Command));
exports.LenCommand = LenCommand;
// TypeCommand -> returns type of value
var TypeCommand = /** @class */ (function (_super) {
    __extends(TypeCommand, _super);
    function TypeCommand() {
        return _super.call(this) || this;
    }
    TypeCommand.prototype.do = function (_currentState) {
        var value = _currentState.evaluationStack.pop();
        _currentState.evaluationStack.push(typeof value);
    };
    return TypeCommand;
}(Command));
exports.TypeCommand = TypeCommand;
// InputCommand -> cin for user input
var InputCommand = /** @class */ (function (_super) {
    __extends(InputCommand, _super);
    function InputCommand() {
        return _super.call(this) || this;
    }
    InputCommand.prototype.do = function (_currentState) {
        var promptValue = _currentState.evaluationStack.pop();
        var prompt = promptValue;
        var ans = "";
        // ask UI for input, grab here.
        _currentState.evaluationStack.push(ans);
    };
    return InputCommand;
}(Command));
exports.InputCommand = InputCommand;
// IndexAccessCommand -> arr[5]
// ONLY HANDLES LISTS/ARRAYS right now, TODO: add string and list literal support.
var IndexAccessCommand = /** @class */ (function (_super) {
    __extends(IndexAccessCommand, _super);
    function IndexAccessCommand() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    IndexAccessCommand.prototype.do = function (_currentState) {
        var index = _currentState.evaluationStack.pop();
        var list = _currentState.evaluationStack.pop();
        var newindex = 0;
        if (typeof index === "number") {
            newindex = Number(index);
        }
        else if (typeof index === "number") {
            newindex = index;
        }
        // at the end of the day, we need to verify these types if there was some problem in the popped stack values.
        if (Array.isArray(list) || typeof list === "string") {
            this._undoCommand = new PopValueCommand(); // placeholder
            _currentState.evaluationStack.push(list[newindex]);
        }
    };
    return IndexAccessCommand;
}(Command));
exports.IndexAccessCommand = IndexAccessCommand;
var ListSliceCommand = /** @class */ (function (_super) {
    __extends(ListSliceCommand, _super);
    function ListSliceCommand() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ListSliceCommand.prototype.do = function (_currentState) {
        var step = _currentState.evaluationStack.pop();
        var end = _currentState.evaluationStack.pop();
        var start = _currentState.evaluationStack.pop();
        var list = _currentState.evaluationStack.pop();
        // handle arrays first
    };
    return ListSliceCommand;
}(Command));
exports.ListSliceCommand = ListSliceCommand;
// CreateListCommand -> Creates a list of values
var CreateListCommand = /** @class */ (function (_super) {
    __extends(CreateListCommand, _super);
    function CreateListCommand(_count) {
        var _this = _super.call(this) || this;
        _this._count = _count;
        return _this;
    }
    CreateListCommand.prototype.do = function (_currentState) {
        var list = [];
        // Pop elements in REVERSE order, then add them to the front array to maintain initial order.
        for (var i = 0; i < this._count; i++) {
            var elem = _currentState.evaluationStack.pop();
            list.unshift(elem);
        }
        _currentState.evaluationStack.push(list);
    };
    return CreateListCommand;
}(Command));
exports.CreateListCommand = CreateListCommand;
var ReturnCommand = /** @class */ (function (_super) {
    __extends(ReturnCommand, _super);
    function ReturnCommand() {
        return _super.call(this) || this;
    }
    ReturnCommand.prototype.do = function (_currentState) {
        var value = _currentState.evaluationStack.pop();
        _currentState.pushReturnStack(value);
    };
    return ReturnCommand;
}(Command));
exports.ReturnCommand = ReturnCommand;
