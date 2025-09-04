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
exports.CreateListCommand = exports.IndexAccessCommand = exports.InputCommand = exports.TypeCommand = exports.LenCommand = exports.PrintCommand = exports.ExitScopeCommand = exports.EnterScopeCommand = exports.JumpCommand = exports.ConditionalJumpCommand = exports.UnaryOpCommand = exports.ComparisonOpCommand = exports.BinaryOpCommand = exports.ReplaceHighlightedExpressionCommand = exports.HighlightStatementCommand = exports.MoveLinePointerCommand = exports.RetrieveValueCommand = exports.HighlightExpressionCommand = exports.PopValueCommand = exports.PushValueCommand = exports.IncrementProgramCounterCommand = exports.ChangeVariableCommand = exports.AssignVariableCommand = exports.State = exports.Command = void 0;
var readline = require("readline");
// ---------------------------------------------------------------------------------------
// INTERFACES AND CLASSES
// ---------------------------------------------------------------------------------------
var Command = /** @class */ (function () {
    function Command() {
    }
    Command.prototype.undo = function (_currentState) {
        this._undoCommand.do(_currentState);
    };
    return Command;
}());
exports.Command = Command;
// ---------------------------------------------------------------------------------------
// MACHINE STATE
// ---------------------------------------------------------------------------------------
var State = /** @class */ (function () {
    function State(_programCounter, _lineCount, _currentExpression, _callStack, _history, _variables, _debugOutput, _currentLine, _evaluationStack) {
        this._programCounter = 0; // which line of execution are we on.
        this._lineCount = 0; // all lines in program.
        this._currentLine = 1; // current line number
        this._variables = new Map(); // storage for variables and thier values
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
    Object.defineProperty(State.prototype, "programCounter", {
        get: function () { return this._programCounter; },
        set: function (val) { this._programCounter = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(State.prototype, "lineCount", {
        get: function () { return this._lineCount; },
        set: function (val) { this._lineCount = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(State.prototype, "currentLine", {
        get: function () { return this._currentLine; },
        set: function (val) { this._currentLine = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(State.prototype, "currentExpression", {
        get: function () { return this._currentExpression; },
        set: function (expr) { this._currentExpression = expr; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(State.prototype, "currentStatement", {
        get: function () { return this._currentStatement; },
        set: function (stmt) { this._currentStatement = stmt; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(State.prototype, "evaluationStack", {
        get: function () { return this._evaluationStack; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(State.prototype, "variables", {
        get: function () { return this._variables; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(State.prototype, "debugOutput", {
        get: function () { return this._debugOutput; },
        enumerable: false,
        configurable: true
    });
    State.prototype.setVariable = function (name, value) { this._variables.set(name, value); }; // adds new key value into variables map.
    State.prototype.getVariable = function (name) { return this._variables.get(name) || null; }; // could be nullable upon lookup. null is important here.
    State.prototype.pushCallStack = function (func) { this._callStack.push(func); }; // pushes element onto stack
    State.prototype.popCallStack = function () { return this._callStack.pop(); }; // gets element from top of stack
    State.prototype.addHistoryCommand = function (step) { this._history.push(step); };
    State.prototype.getMostRecentHistoryCommand = function () { return this._history.pop(); };
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
        this._oldValue = _currentState.getVariable(this._name); // grab current value of variable from map
        this._undoCommand = new ChangeVariableCommand(this._name, this._oldValue); // undo command: Change variable BACK to old value.
        _currentState.setVariable(this._name, newValue);
    };
    return AssignVariableCommand;
}(Command));
exports.AssignVariableCommand = AssignVariableCommand;
// For assignments to a variable
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
// Increments program counter in state to move to next line of execution.
var IncrementProgramCounterCommand = /** @class */ (function (_super) {
    __extends(IncrementProgramCounterCommand, _super);
    function IncrementProgramCounterCommand() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    IncrementProgramCounterCommand.prototype.do = function (_currentState) {
        this._undoCommand = new IncrementProgramCounterCommand();
        _currentState.programCounter += 1;
    };
    IncrementProgramCounterCommand.prototype.undo = function (_currentState) {
        _currentState.programCounter -= 1;
    };
    return IncrementProgramCounterCommand;
}(Command));
exports.IncrementProgramCounterCommand = IncrementProgramCounterCommand;
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
        return _super.call(this) || this;
    }
    PopValueCommand.prototype.do = function (_currentState) {
        this._value = _currentState.evaluationStack.pop(); // pop value and store in member
        this._undoCommand = new PushValueCommand(this._value);
        return this._value;
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
        console.log("Expression Highlighted!");
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
        return _currentState.getVariable(this._varName);
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
        var evaluatedLeft = _currentState.evaluationStack.pop();
        var evaluatedRight = _currentState.evaluationStack.pop();
        var res = null;
        if (this._op === '+' && (typeof evaluatedLeft === 'string' && typeof evaluatedRight === 'string')) {
            res = evaluatedLeft + evaluatedRight;
        }
        if (typeof evaluatedLeft === 'number' && typeof evaluatedRight === 'number') {
            switch (this._op) {
                case '+':
                    res = evaluatedLeft + evaluatedRight;
                    break;
                case '-':
                    res = evaluatedLeft - evaluatedRight;
                    break;
                case '%':
                    res = evaluatedLeft % evaluatedRight;
                    break;
                case '*':
                    res = evaluatedLeft * evaluatedRight;
                    break;
                case '//':
                    res = Math.floor(evaluatedLeft / evaluatedRight);
                    break;
                case '/':
                    res = evaluatedLeft / evaluatedRight;
                    break;
                case 'and':
                    res = evaluatedLeft && evaluatedRight;
                    break;
                case 'or':
                    res = evaluatedRight | evaluatedRight;
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
        var evaluatedLeft = _currentState.evaluationStack.pop();
        var evaluatedRight = _currentState.evaluationStack.pop();
        var res = null;
        switch (this._op) {
            case '<':
                res = evaluatedLeft < evaluatedRight;
                break;
            case '>':
                res = evaluatedLeft > evaluatedRight;
                break;
            case '<=':
                res = evaluatedLeft <= evaluatedRight;
                break;
            case '>=':
                res = evaluatedLeft >= evaluatedRight;
                break;
            case '!=':
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
        var res = null;
        switch (this._operator) {
            case '-':
                if (typeof operand === 'number') {
                    res = -(operand);
                }
                break;
            case '+':
                if (typeof operand === 'number') {
                    res = Math.abs(operand);
                }
                break;
            case '!':
                res = !operand;
                break;
            case 'not':
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
    ConditionalJumpCommand.prototype.do = function (_currentState) {
    };
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
            _currentState.setVariable(key, value); // set each one by one to restore state.
        });
    };
    return ExitScopeCommand;
}(Command));
exports.ExitScopeCommand = ExitScopeCommand;
// PrintCommand -> prints something to the console.
var PrintCommand = /** @class */ (function (_super) {
    __extends(PrintCommand, _super);
    function PrintCommand(_value) {
        var _this = _super.call(this) || this;
        _this._value = _value;
        return _this;
    }
    PrintCommand.prototype.do = function (_currentState) {
        console.log(this._value);
    };
    return PrintCommand;
}(Command));
exports.PrintCommand = PrintCommand;
// LenCommand -> gets length of strings and lists, etc...
var LenCommand = /** @class */ (function (_super) {
    __extends(LenCommand, _super);
    function LenCommand(_value) {
        var _this = _super.call(this) || this;
        _this._value = _value;
        return _this;
    }
    LenCommand.prototype.do = function (_currentState) {
        if (typeof this._value === 'string') {
            _currentState.evaluationStack.push(this._value.length);
        }
        else if (Array.isArray(this._value)) {
            _currentState.evaluationStack.push(this._value.length);
        }
    };
    return LenCommand;
}(Command));
exports.LenCommand = LenCommand;
// TypeCommand -> returns type of value
var TypeCommand = /** @class */ (function (_super) {
    __extends(TypeCommand, _super);
    function TypeCommand(_value) {
        var _this = _super.call(this) || this;
        _this._value = _value;
        return _this;
    }
    TypeCommand.prototype.do = function (_currentState) {
        return (typeof this._value);
    };
    return TypeCommand;
}(Command));
exports.TypeCommand = TypeCommand;
// InputCommand -> cin for user input
var InputCommand = /** @class */ (function (_super) {
    __extends(InputCommand, _super);
    function InputCommand(_prompt, _ans) {
        var _this = _super.call(this) || this;
        _this._prompt = _prompt;
        _this._ans = _ans;
        return _this;
    }
    InputCommand.prototype.do = function (_currentState) {
        var rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.question(this._prompt, function (answer) {
            this._ans = answer;
            rl.close();
        });
        return this._ans;
    };
    return InputCommand;
}(Command));
exports.InputCommand = InputCommand;
// IndexAccessCommand -> arr[5]
var IndexAccessCommand = /** @class */ (function (_super) {
    __extends(IndexAccessCommand, _super);
    function IndexAccessCommand() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    IndexAccessCommand.prototype.do = function (_currentState) {
    };
    return IndexAccessCommand;
}(Command));
exports.IndexAccessCommand = IndexAccessCommand;
// CreateListCommand -> Creates a list of values
var CreateListCommand = /** @class */ (function (_super) {
    __extends(CreateListCommand, _super);
    function CreateListCommand(_name, _values) {
        var _this = _super.call(this) || this;
        _this._name = _name;
        _this._values = _values;
        return _this;
    }
    CreateListCommand.prototype.do = function (_currentState) {
        this._undoCommand = new CreateListCommand(this._name, this._values);
        _currentState.setVariable(this._name, this._values);
    };
    CreateListCommand.prototype.undo = function (_currentState) {
        _currentState.variables.delete(this._name);
    };
    return CreateListCommand;
}(Command));
exports.CreateListCommand = CreateListCommand;
