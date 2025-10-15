"use strict";
// comprehensive-test.ts
// Comprehensive test file for all expressions and commands
Object.defineProperty(exports, "__esModule", { value: true });
var Nodes_1 = require("./Nodes");
var Interpreter_1 = require("./Interpreter");
// Helper to create dummy token
function createToken(text, line, col) {
    if (line === void 0) { line = 1; }
    if (col === void 0) { col = 1; }
    return { line: line, col: col, text: text, type: "test", value: text };
}
// Helper to serialize values (handles BigInt recursively)
function serializeValue(v) {
    if (typeof v === "bigint") {
        return v.toString() + "n";
    }
    if (Array.isArray(v)) {
        return "[" + v.map(function (item) { return serializeValue(item); }).join(", ") + "]";
    }
    if (v === null) {
        return "null";
    }
    if (typeof v === "object") {
        // Handle other objects
        var entries = Object.entries(v).map(function (_a) {
            var key = _a[0], val = _a[1];
            return "".concat(key, ": ").concat(serializeValue(val));
        });
        return "{" + entries.join(", ") + "}";
    }
    // For primitives (string, number, boolean), use JSON.stringify
    return JSON.stringify(v);
}
// Helper to print state
function printState(state, label) {
    console.log("\n--- ".concat(label, " ---"));
    console.log("Evaluation Stack: [".concat(state.evaluationStack.map(function (v) { return serializeValue(v); }).join(", "), "]"));
    console.log("Variables:", Array.from(state.variables.entries())
        .map(function (_a) {
        var k = _a[0], v = _a[1];
        return "".concat(k, "=").concat(serializeValue(v));
    })
        .join(", ") || "(empty)");
    console.log("Program Counter: ".concat(state.programCounter));
}
// Helper to execute commands and show each step
function executeAndShow(commands, state, description) {
    console.log("\n".concat("=".repeat(60)));
    console.log("TEST: ".concat(description));
    console.log("".concat("=".repeat(60)));
    commands.forEach(function (cmd, idx) {
        console.log("\nStep ".concat(idx + 1, ": Executing ").concat(cmd.constructor.name));
        cmd.do(state);
        console.log("  Stack after: [".concat(state.evaluationStack.map(function (v) { return serializeValue(v); }).join(", "), "]"));
        if (state.variables.size > 0) {
            console.log("  Variables: ".concat(Array.from(state.variables.entries())
                .map(function (_a) {
                var k = _a[0], v = _a[1];
                return "".concat(k, "=").concat(serializeValue(v));
            })
                .join(", ")));
        }
    });
    printState(state, "Final State after ".concat(description));
}
// Initialize fresh state for testing
function createFreshState() {
    return new Interpreter_1.State(0, // programCounter
    0, // lineCount
    null, // currentExpression
    null, // currentStatement
    [], // callStack
    [], // history
    new Map(), // variables
    1, // currentLine
    [], // evaluationStack
    []);
}
console.log("\n" + "█".repeat(70));
console.log("█" + " ".repeat(68) + "█");
console.log("█" + "  COMPREHENSIVE EXPRESSION AND COMMAND TEST SUITE".padEnd(68) + "█");
console.log("█" + " ".repeat(68) + "█");
console.log("█".repeat(70));
// ============================================================================
// TEST 1: Number Literal Expressions
// ============================================================================
var state = createFreshState();
console.log("\n\n" + "▓".repeat(70));
console.log("▓ TEST SUITE 1: NUMBER LITERAL EXPRESSIONS");
console.log("▓".repeat(70));
var intLiteral = new Nodes_1.NumberLiteralExpressionNode("42", createToken("42"));
executeAndShow(intLiteral.evaluate(), state, "Integer Literal: 42");
state = createFreshState();
var floatLiteral = new Nodes_1.NumberLiteralExpressionNode("3.14", createToken("3.14"));
executeAndShow(floatLiteral.evaluate(), state, "Float Literal: 3.14");
state = createFreshState();
var hexLiteral = new Nodes_1.NumberLiteralExpressionNode("0xFF", createToken("0xFF"));
executeAndShow(hexLiteral.evaluate(), state, "Hexadecimal Literal: 0xFF");
state = createFreshState();
var binaryLiteral = new Nodes_1.NumberLiteralExpressionNode("0b1010", createToken("0b1010"));
executeAndShow(binaryLiteral.evaluate(), state, "Binary Literal: 0b1010");
// ============================================================================
// TEST 2: String and Boolean Literals
// ============================================================================
console.log("\n\n" + "▓".repeat(70));
console.log("▓ TEST SUITE 2: STRING AND BOOLEAN LITERALS");
console.log("▓".repeat(70));
state = createFreshState();
var stringLiteral = new Nodes_1.StringLiteralExpressionNode(createToken('"Hello World"'));
executeAndShow(stringLiteral.evaluate(), state, 'String Literal: "Hello World"');
state = createFreshState();
var trueLiteral = new Nodes_1.BooleanLiteralExpressionNode(true, createToken("True"));
executeAndShow(trueLiteral.evaluate(), state, "Boolean Literal: True");
state = createFreshState();
var falseLiteral = new Nodes_1.BooleanLiteralExpressionNode(false, createToken("False"));
executeAndShow(falseLiteral.evaluate(), state, "Boolean Literal: False");
// ============================================================================
// TEST 3: Binary Operations (Arithmetic)
// ============================================================================
console.log("\n\n" + "▓".repeat(70));
console.log("▓ TEST SUITE 3: BINARY ARITHMETIC OPERATIONS");
console.log("▓".repeat(70));
state = createFreshState();
var add = new Nodes_1.BinaryExpressionNode(new Nodes_1.NumberLiteralExpressionNode("10", createToken("10")), "+", new Nodes_1.NumberLiteralExpressionNode("5", createToken("5")), createToken("+"));
executeAndShow(add.evaluate(), state, "Addition: 10 + 5");
state = createFreshState();
var subtract = new Nodes_1.BinaryExpressionNode(new Nodes_1.NumberLiteralExpressionNode("10", createToken("10")), "-", new Nodes_1.NumberLiteralExpressionNode("5", createToken("5")), createToken("-"));
executeAndShow(subtract.evaluate(), state, "Subtraction: 10 - 5");
state = createFreshState();
var multiply = new Nodes_1.BinaryExpressionNode(new Nodes_1.NumberLiteralExpressionNode("10", createToken("10")), "*", new Nodes_1.NumberLiteralExpressionNode("5", createToken("5")), createToken("*"));
executeAndShow(multiply.evaluate(), state, "Multiplication: 10 * 5");
state = createFreshState();
var divide = new Nodes_1.BinaryExpressionNode(new Nodes_1.NumberLiteralExpressionNode("10", createToken("10")), "/", new Nodes_1.NumberLiteralExpressionNode("5", createToken("5")), createToken("/"));
executeAndShow(divide.evaluate(), state, "Division: 10 / 5");
state = createFreshState();
var floorDivide = new Nodes_1.BinaryExpressionNode(new Nodes_1.NumberLiteralExpressionNode("10", createToken("10")), "//", new Nodes_1.NumberLiteralExpressionNode("3", createToken("3")), createToken("//"));
executeAndShow(floorDivide.evaluate(), state, "Floor Division: 10 // 3");
state = createFreshState();
var modulo = new Nodes_1.BinaryExpressionNode(new Nodes_1.NumberLiteralExpressionNode("10", createToken("10")), "%", new Nodes_1.NumberLiteralExpressionNode("3", createToken("3")), createToken("%"));
executeAndShow(modulo.evaluate(), state, "Modulo: 10 % 3");
// ============================================================================
// TEST 4: String Concatenation
// ============================================================================
console.log("\n\n" + "▓".repeat(70));
console.log("▓ TEST SUITE 4: STRING CONCATENATION");
console.log("▓".repeat(70));
state = createFreshState();
var strConcat = new Nodes_1.BinaryExpressionNode(new Nodes_1.StringLiteralExpressionNode(createToken('"Hello"')), "+", new Nodes_1.StringLiteralExpressionNode(createToken('" World"')), createToken("+"));
executeAndShow(strConcat.evaluate(), state, 'String Concatenation: "Hello" + " World"');
// ============================================================================
// TEST 5: Comparison Operations
// ============================================================================
console.log("\n\n" + "▓".repeat(70));
console.log("▓ TEST SUITE 5: COMPARISON OPERATIONS");
console.log("▓".repeat(70));
state = createFreshState();
var lessThan = new Nodes_1.ComparisonExpressionNode(new Nodes_1.NumberLiteralExpressionNode("5", createToken("5")), "<", new Nodes_1.NumberLiteralExpressionNode("10", createToken("10")));
executeAndShow(lessThan.evaluate(), state, "Less Than: 5 < 10");
state = createFreshState();
var greaterThan = new Nodes_1.ComparisonExpressionNode(new Nodes_1.NumberLiteralExpressionNode("10", createToken("10")), ">", new Nodes_1.NumberLiteralExpressionNode("5", createToken("5")));
executeAndShow(greaterThan.evaluate(), state, "Greater Than: 10 > 5");
state = createFreshState();
var lessEqual = new Nodes_1.ComparisonExpressionNode(new Nodes_1.NumberLiteralExpressionNode("5", createToken("5")), "<=", new Nodes_1.NumberLiteralExpressionNode("5", createToken("5")));
executeAndShow(lessEqual.evaluate(), state, "Less Than or Equal: 5 <= 5");
state = createFreshState();
var greaterEqual = new Nodes_1.ComparisonExpressionNode(new Nodes_1.NumberLiteralExpressionNode("10", createToken("10")), ">=", new Nodes_1.NumberLiteralExpressionNode("5", createToken("5")));
executeAndShow(greaterEqual.evaluate(), state, "Greater Than or Equal: 10 >= 5");
state = createFreshState();
var notEqual = new Nodes_1.ComparisonExpressionNode(new Nodes_1.NumberLiteralExpressionNode("5", createToken("5")), "!=", new Nodes_1.NumberLiteralExpressionNode("10", createToken("10")));
executeAndShow(notEqual.evaluate(), state, "Not Equal: 5 != 10");
// ============================================================================
// TEST 6: Unary Operations
// ============================================================================
console.log("\n\n" + "▓".repeat(70));
console.log("▓ TEST SUITE 6: UNARY OPERATIONS");
console.log("▓".repeat(70));
state = createFreshState();
var negation = new Nodes_1.UnaryExpressionNode("-", new Nodes_1.NumberLiteralExpressionNode("5", createToken("5")), createToken("-"));
executeAndShow(negation.evaluate(), state, "Negation: -5");
state = createFreshState();
var unaryPlus = new Nodes_1.UnaryExpressionNode("+", new Nodes_1.NumberLiteralExpressionNode("5", createToken("5")), createToken("+"));
executeAndShow(unaryPlus.evaluate(), state, "Unary Plus: +5");
state = createFreshState();
var logicalNot = new Nodes_1.UnaryExpressionNode("not", new Nodes_1.BooleanLiteralExpressionNode(true, createToken("True")), createToken("not"));
executeAndShow(logicalNot.evaluate(), state, "Logical Not: not True");
// ============================================================================
// TEST 7: Variable Assignment and Retrieval
// ============================================================================
console.log("\n\n" + "▓".repeat(70));
console.log("▓ TEST SUITE 7: VARIABLE ASSIGNMENT AND RETRIEVAL");
console.log("▓".repeat(70));
state = createFreshState();
var assignment = new Nodes_1.AssignmentStatementNode("x", new Nodes_1.NumberLiteralExpressionNode("42", createToken("42")), createToken("="));
executeAndShow(assignment.execute(), state, "Assignment: x = 42");
// Create fresh state but keep the variable
var xValue = state.getVariable("x");
state = createFreshState();
state.setVariable("x", xValue);
var retrieval = new Nodes_1.IdentifierExpressionNode(createToken("x"));
executeAndShow(retrieval.evaluate(), state, "Variable Retrieval: x");
// ============================================================================
// TEST 8: List Literals
// ============================================================================
console.log("\n\n" + "▓".repeat(70));
console.log("▓ TEST SUITE 8: LIST LITERALS");
console.log("▓".repeat(70));
state = createFreshState();
var emptyList = new Nodes_1.ListLiteralExpressionNode(new Nodes_1.ArgListExpressionNode([]), createToken("["));
executeAndShow(emptyList.evaluate(), state, "Empty List: []");
state = createFreshState();
var simpleList = new Nodes_1.ListLiteralExpressionNode(new Nodes_1.ArgListExpressionNode([
    new Nodes_1.NumberLiteralExpressionNode("1", createToken("1")),
    new Nodes_1.NumberLiteralExpressionNode("2", createToken("2")),
    new Nodes_1.NumberLiteralExpressionNode("3", createToken("3")),
]), createToken("["));
executeAndShow(simpleList.evaluate(), state, "Simple List: [1, 2, 3]");
state = createFreshState();
var mixedList = new Nodes_1.ListLiteralExpressionNode(new Nodes_1.ArgListExpressionNode([
    new Nodes_1.NumberLiteralExpressionNode("1", createToken("1")),
    new Nodes_1.StringLiteralExpressionNode(createToken('"hello"')),
    new Nodes_1.BooleanLiteralExpressionNode(true, createToken("True")),
]), createToken("["));
executeAndShow(mixedList.evaluate(), state, 'Mixed List: [1, "hello", True]');
// ============================================================================
// TEST 9: List Access (Indexing)
// ============================================================================
console.log("\n\n" + "▓".repeat(70));
console.log("▓ TEST SUITE 9: LIST ACCESS (INDEXING)");
console.log("▓".repeat(70));
state = createFreshState();
state.setVariable("mylist", [10, 20, 30, 40, 50]);
var listAccess = new Nodes_1.ListAccessExpressionNode(new Nodes_1.IdentifierExpressionNode(createToken("mylist")), new Nodes_1.NumberLiteralExpressionNode("2", createToken("2")));
executeAndShow(listAccess.evaluate(), state, "List Access: mylist[2]");
state = createFreshState();
state.setVariable("mylist", [10, 20, 30, 40, 50]);
var negativeIndex = new Nodes_1.ListAccessExpressionNode(new Nodes_1.IdentifierExpressionNode(createToken("mylist")), new Nodes_1.NumberLiteralExpressionNode("-1", createToken("-1")));
executeAndShow(negativeIndex.evaluate(), state, "Negative Index: mylist[-1]");
state = createFreshState();
state.setVariable("mystr", "Hello");
var stringAccess = new Nodes_1.ListAccessExpressionNode(new Nodes_1.IdentifierExpressionNode(createToken("mystr")), new Nodes_1.NumberLiteralExpressionNode("1", createToken("1")));
executeAndShow(stringAccess.evaluate(), state, 'String Access: mystr[1] where mystr="Hello"');
// ============================================================================
// TEST 10: List Slicing
// ============================================================================
console.log("\n\n" + "▓".repeat(70));
console.log("▓ TEST SUITE 10: LIST SLICING");
console.log("▓".repeat(70));
state = createFreshState();
state.setVariable("arr", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
var basicSlice = new Nodes_1.ListSliceExpressionNode(new Nodes_1.IdentifierExpressionNode(createToken("arr")), new Nodes_1.NumberLiteralExpressionNode("2", createToken("2")), new Nodes_1.NumberLiteralExpressionNode("5", createToken("5")), null);
executeAndShow(basicSlice.evaluate(), state, "Basic Slice: arr[2:5]");
state = createFreshState();
state.setVariable("arr", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
var sliceWithStep = new Nodes_1.ListSliceExpressionNode(new Nodes_1.IdentifierExpressionNode(createToken("arr")), new Nodes_1.NumberLiteralExpressionNode("0", createToken("0")), new Nodes_1.NumberLiteralExpressionNode("8", createToken("8")), new Nodes_1.NumberLiteralExpressionNode("2", createToken("2")));
executeAndShow(sliceWithStep.evaluate(), state, "Slice with Step: arr[0:8:2]");
state = createFreshState();
state.setVariable("arr", [0, 1, 2, 3, 4, 5]);
var sliceNoStart = new Nodes_1.ListSliceExpressionNode(new Nodes_1.IdentifierExpressionNode(createToken("arr")), null, new Nodes_1.NumberLiteralExpressionNode("3", createToken("3")), null);
executeAndShow(sliceNoStart.evaluate(), state, "Slice No Start: arr[:3]");
state = createFreshState();
state.setVariable("arr", [0, 1, 2, 3, 4, 5]);
var sliceNoStop = new Nodes_1.ListSliceExpressionNode(new Nodes_1.IdentifierExpressionNode(createToken("arr")), new Nodes_1.NumberLiteralExpressionNode("2", createToken("2")), null, null);
executeAndShow(sliceNoStop.evaluate(), state, "Slice No Stop: arr[2:]");
// ============================================================================
// TEST 11: Built-in Functions - len()
// ============================================================================
console.log("\n\n" + "▓".repeat(70));
console.log("▓ TEST SUITE 11: BUILT-IN FUNCTION - len()");
console.log("▓".repeat(70));
state = createFreshState();
var lenList = new Nodes_1.FuncCallExpressionNode(new Nodes_1.IdentifierExpressionNode(createToken("len")), new Nodes_1.ArgListExpressionNode([
    new Nodes_1.ListLiteralExpressionNode(new Nodes_1.ArgListExpressionNode([
        new Nodes_1.NumberLiteralExpressionNode("1", createToken("1")),
        new Nodes_1.NumberLiteralExpressionNode("2", createToken("2")),
        new Nodes_1.NumberLiteralExpressionNode("3", createToken("3")),
    ]), createToken("[")),
]));
executeAndShow(lenList.evaluate(), state, "len([1, 2, 3])");
state = createFreshState();
var lenString = new Nodes_1.FuncCallExpressionNode(new Nodes_1.IdentifierExpressionNode(createToken("len")), new Nodes_1.ArgListExpressionNode([
    new Nodes_1.StringLiteralExpressionNode(createToken('"Hello"')),
]));
executeAndShow(lenString.evaluate(), state, 'len("Hello")');
// ============================================================================
// TEST 12: Built-in Functions - type()
// ============================================================================
console.log("\n\n" + "▓".repeat(70));
console.log("▓ TEST SUITE 12: BUILT-IN FUNCTION - type()");
console.log("▓".repeat(70));
state = createFreshState();
var typeInt = new Nodes_1.FuncCallExpressionNode(new Nodes_1.IdentifierExpressionNode(createToken("type")), new Nodes_1.ArgListExpressionNode([
    new Nodes_1.NumberLiteralExpressionNode("42", createToken("42")),
]));
executeAndShow(typeInt.evaluate(), state, "type(42)");
state = createFreshState();
var typeString = new Nodes_1.FuncCallExpressionNode(new Nodes_1.IdentifierExpressionNode(createToken("type")), new Nodes_1.ArgListExpressionNode([
    new Nodes_1.StringLiteralExpressionNode(createToken('"hello"')),
]));
executeAndShow(typeString.evaluate(), state, 'type("hello")');
state = createFreshState();
var typeList = new Nodes_1.FuncCallExpressionNode(new Nodes_1.IdentifierExpressionNode(createToken("type")), new Nodes_1.ArgListExpressionNode([
    new Nodes_1.ListLiteralExpressionNode(new Nodes_1.ArgListExpressionNode([]), createToken("[")),
]));
executeAndShow(typeList.evaluate(), state, "type([])");
// ============================================================================
// TEST 13: Complex Nested Expressions
// ============================================================================
console.log("\n\n" + "▓".repeat(70));
console.log("▓ TEST SUITE 13: COMPLEX NESTED EXPRESSIONS");
console.log("▓".repeat(70));
state = createFreshState();
var complex1 = new Nodes_1.BinaryExpressionNode(new Nodes_1.BinaryExpressionNode(new Nodes_1.NumberLiteralExpressionNode("10", createToken("10")), "+", new Nodes_1.NumberLiteralExpressionNode("5", createToken("5")), createToken("+")), "*", new Nodes_1.NumberLiteralExpressionNode("2", createToken("2")), createToken("*"));
executeAndShow(complex1.evaluate(), state, "Nested Arithmetic: (10 + 5) * 2");
state = createFreshState();
var complex2 = new Nodes_1.ComparisonExpressionNode(new Nodes_1.BinaryExpressionNode(new Nodes_1.NumberLiteralExpressionNode("10", createToken("10")), "+", new Nodes_1.NumberLiteralExpressionNode("5", createToken("5")), createToken("+")), ">", new Nodes_1.NumberLiteralExpressionNode("10", createToken("10")));
executeAndShow(complex2.evaluate(), state, "Comparison with Arithmetic: (10 + 5) > 10");
// ============================================================================
// TEST 14: Direct Command Testing
// ============================================================================
console.log("\n\n" + "▓".repeat(70));
console.log("▓ TEST SUITE 14: DIRECT COMMAND TESTING");
console.log("▓".repeat(70));
state = createFreshState();
var pushCmd = new Interpreter_1.PushValueCommand(100);
executeAndShow([pushCmd], state, "PushValueCommand: Push 100");
state = createFreshState();
state.evaluationStack.push(42);
var popCmd = new Interpreter_1.PopValueCommand();
console.log("\n" + "=".repeat(60));
console.log("TEST: PopValueCommand: Pop value");
console.log("=".repeat(60));
console.log("\nBefore pop - Stack:", state.evaluationStack);
var popped = popCmd.do(state);
console.log("After pop - Stack:", state.evaluationStack);
console.log("Popped value:", popped);
state = createFreshState();
state.evaluationStack.push(50);
var assignCmd = new Interpreter_1.AssignVariableCommand("myvar");
executeAndShow([assignCmd], state, "AssignVariableCommand: Assign myvar = 50");
while (state.evaluationStack.length > 0) {
    state.evaluationStack.pop();
}
var retrieveCmd = new Interpreter_1.RetrieveValueCommand("myvar");
executeAndShow([retrieveCmd], state, "RetrieveValueCommand: Retrieve myvar");
// ============================================================================
// FINAL SUMMARY
// ============================================================================
console.log("\n\n" + "█".repeat(70));
console.log("█" + " ".repeat(68) + "█");
console.log("█" + "  TEST SUITE COMPLETE!".padEnd(68) + "█");
console.log("█" +
    "  All expression evaluations and commands have been tested.".padEnd(68) +
    "█");
console.log("█" + " ".repeat(68) + "█");
console.log("█".repeat(70) + "\n");
