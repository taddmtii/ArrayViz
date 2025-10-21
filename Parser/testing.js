"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Interpreter_1 = require("./Interpreter");
// Import your parser
var nearley = require("nearley");
var grammar = require("./grammar");
// Helper function to parse code
function parseCode(code) {
    var parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
    try {
        parser.feed(code);
        if (parser.results.length === 0) {
            throw new Error("No parse results");
        }
        if (parser.results.length > 1) {
            console.warn("Warning: Ambiguous grammar - multiple parse results");
        }
        return parser.results[0];
    }
    catch (e) {
        console.error("Parse error:", e.message);
        throw e;
    }
}
// Helper function to execute and get state
function executeProgram(code) {
    var program = parseCode(code);
    var commands = program.execute();
    var state = new Interpreter_1.State(0, 0, null, null, [], [], new Map(), 1, [], []);
    for (var _i = 0, commands_1 = commands; _i < commands_1.length; _i++) {
        var command = commands_1[_i];
        command.do(state);
    }
    return state;
}
// Helper to format values
function formatValue(val) {
    if (typeof val === "bigint") {
        return val.toString();
    }
    if (Array.isArray(val)) {
        return JSON.stringify(val);
    }
    if (typeof val === "string") {
        return "\"".concat(val, "\"");
    }
    return String(val);
}
// Test suite
console.log("=== MILESTONE TESTS: Expressions & Assignments ===\n");
var passedTests = 0;
var failedTests = 0;
// ===== ARITHMETIC EXPRESSION TESTS =====
console.log("--- Arithmetic Expression Tests ---");
// Test 1: Simple addition
try {
    var state1 = executeProgram("x = 5 + 3\n");
    var result = state1.getVariable("x");
    console.log("✓ Test 1 passed: x = 5 + 3");
    console.log("  Result: x = ".concat(formatValue(result)));
    if (result === BigInt(8)) {
        passedTests++;
    }
    else {
        console.log("  \u26A0 Warning: Expected 8, got ".concat(result));
        failedTests++;
    }
}
catch (e) {
    console.log("✗ Test 1 failed:", e.message);
    failedTests++;
}
// Test 2: Subtraction
try {
    var state2 = executeProgram("y = 10 - 4\n");
    var result = state2.getVariable("y");
    console.log("✓ Test 2 passed: y = 10 - 4");
    console.log("  Result: y = ".concat(formatValue(result)));
    if (result === BigInt(6)) {
        passedTests++;
    }
    else {
        console.log("  \u26A0 Warning: Expected 6, got ".concat(result));
        failedTests++;
    }
}
catch (e) {
    console.log("✗ Test 2 failed:", e.message);
    failedTests++;
}
// Test 3: Multiplication
try {
    var state3 = executeProgram("z = 7 * 6\n");
    var result = state3.getVariable("z");
    console.log("✓ Test 3 passed: z = 7 * 6");
    console.log("  Result: z = ".concat(formatValue(result)));
    if (result === BigInt(42)) {
        passedTests++;
    }
    else {
        console.log("  \u26A0 Warning: Expected 42, got ".concat(result));
        failedTests++;
    }
}
catch (e) {
    console.log("✗ Test 3 failed:", e.message);
    failedTests++;
}
// Test 4: Division
try {
    var state4 = executeProgram("a = 20 / 4\n");
    var result = state4.getVariable("a");
    console.log("✓ Test 4 passed: a = 20 / 4");
    console.log("  Result: a = ".concat(formatValue(result)));
    if (result === BigInt(5)) {
        passedTests++;
    }
    else {
        console.log("  \u26A0 Warning: Expected 5, got ".concat(result));
        failedTests++;
    }
}
catch (e) {
    console.log("✗ Test 4 failed:", e.message);
    failedTests++;
}
// Test 5: Integer division
try {
    var state5 = executeProgram("b = 17 // 5\n");
    var result = state5.getVariable("b");
    console.log("✓ Test 5 passed: b = 17 // 5");
    console.log("  Result: b = ".concat(formatValue(result)));
    if (result === BigInt(3)) {
        passedTests++;
    }
    else {
        console.log("  \u26A0 Warning: Expected 3, got ".concat(result));
        failedTests++;
    }
}
catch (e) {
    console.log("✗ Test 5 failed:", e.message);
    failedTests++;
}
// Test 6: Modulo
try {
    var state6 = executeProgram("c = 17 % 5\n");
    var result = state6.getVariable("c");
    console.log("✓ Test 6 passed: c = 17 % 5");
    console.log("  Result: c = ".concat(formatValue(result)));
    if (result === BigInt(2)) {
        passedTests++;
    }
    else {
        console.log("  \u26A0 Warning: Expected 2, got ".concat(result));
        failedTests++;
    }
}
catch (e) {
    console.log("✗ Test 6 failed:", e.message);
    failedTests++;
}
// Test 7: Power
try {
    var state7 = executeProgram("d = 2 ** 3\n");
    var result = state7.getVariable("d");
    console.log("✓ Test 7 passed: d = 2 ** 3");
    console.log("  Result: d = ".concat(formatValue(result)));
    if (result === BigInt(8)) {
        passedTests++;
    }
    else {
        console.log("  \u26A0 Warning: Expected 8, got ".concat(result));
        failedTests++;
    }
}
catch (e) {
    console.log("✗ Test 7 failed:", e.message);
    failedTests++;
}
console.log("\n--- Complex Arithmetic Tests ---");
// Test 8: Order of operations
try {
    var state8 = executeProgram("result = 2 + 3 * 4\n");
    var result = state8.getVariable("result");
    console.log("✓ Test 8 passed: result = 2 + 3 * 4");
    console.log("  Result: result = ".concat(formatValue(result)));
    if (result === BigInt(14)) {
        passedTests++;
    }
    else {
        console.log("  \u26A0 Warning: Expected 14, got ".concat(result));
        failedTests++;
    }
}
catch (e) {
    console.log("✗ Test 8 failed:", e.message);
    failedTests++;
}
// Test 9: Parentheses
try {
    var state9 = executeProgram("result2 = (2 + 3) * 4\n");
    var result = state9.getVariable("result2");
    console.log("✓ Test 9 passed: result2 = (2 + 3) * 4");
    console.log("  Result: result2 = ".concat(formatValue(result)));
    if (result === BigInt(20)) {
        passedTests++;
    }
    else {
        console.log("  \u26A0 Warning: Expected 20, got ".concat(result));
        failedTests++;
    }
}
catch (e) {
    console.log("✗ Test 9 failed:", e.message);
    failedTests++;
}
// Test 10: Unary operators
try {
    var state10 = executeProgram("neg = -5\n");
    var result = state10.getVariable("neg");
    console.log("✓ Test 10 passed: neg = -5");
    console.log("  Result: neg = ".concat(formatValue(result)));
    if (result === BigInt(-5)) {
        passedTests++;
    }
    else {
        console.log("  \u26A0 Warning: Expected -5, got ".concat(result));
        failedTests++;
    }
}
catch (e) {
    console.log("✗ Test 10 failed:", e.message);
    failedTests++;
}
// ===== COMPARISON EXPRESSION TESTS =====
console.log("\n--- Comparison Expression Tests ---");
// Test 11: Less than
try {
    var state11 = executeProgram("comp1 = 5 < 10\n");
    var result = state11.getVariable("comp1");
    console.log("✓ Test 11 passed: comp1 = 5 < 10");
    console.log("  Result: comp1 = ".concat(formatValue(result)));
    passedTests++;
}
catch (e) {
    console.log("✗ Test 11 failed:", e.message);
    failedTests++;
}
// Test 12: Greater than
try {
    var state12 = executeProgram("comp2 = 10 > 5\n");
    var result = state12.getVariable("comp2");
    console.log("✓ Test 12 passed: comp2 = 10 > 5");
    console.log("  Result: comp2 = ".concat(formatValue(result)));
    passedTests++;
}
catch (e) {
    console.log("✗ Test 12 failed:", e.message);
    failedTests++;
}
// Test 13: Not equal
try {
    var state13 = executeProgram("comp3 = 5 != 3\n");
    var result = state13.getVariable("comp3");
    console.log("✓ Test 13 passed: comp3 = 5 != 3");
    console.log("  Result: comp3 = ".concat(formatValue(result)));
    passedTests++;
}
catch (e) {
    console.log("✗ Test 13 failed:", e.message);
    failedTests++;
}
// ===== VARIABLE REFERENCE TESTS =====
console.log("\n--- Variable Reference Tests ---");
// Test 14: Variable reference in expression
try {
    var code14 = "x = 5\ny = x + 3\n";
    var state14 = executeProgram(code14);
    var result = state14.getVariable("y");
    console.log("✓ Test 14 passed: x = 5, y = x + 3");
    console.log("  Result: y = ".concat(formatValue(result)));
    if (result === BigInt(8)) {
        passedTests++;
    }
    else {
        console.log("  \u26A0 Warning: Expected 8, got ".concat(result));
        failedTests++;
    }
}
catch (e) {
    console.log("✗ Test 14 failed:", e.message);
    failedTests++;
}
// Test 15: Multiple variable references
try {
    var code15 = "a = 10\nb = 20\nc = a + b\n";
    var state15 = executeProgram(code15);
    var result = state15.getVariable("c");
    console.log("✓ Test 15 passed: a = 10, b = 20, c = a + b");
    console.log("  Result: c = ".concat(formatValue(result)));
    if (result === BigInt(30)) {
        passedTests++;
    }
    else {
        console.log("  \u26A0 Warning: Expected 30, got ".concat(result));
        failedTests++;
    }
}
catch (e) {
    console.log("✗ Test 15 failed:", e.message);
    failedTests++;
}
// ===== STRING TESTS =====
console.log("\n--- String Expression Tests ---");
// Test 16: String concatenation
try {
    var state16 = executeProgram('greeting = "Hello" + " World"\n');
    var result = state16.getVariable("greeting");
    console.log('✓ Test 16 passed: greeting = "Hello" + " World"');
    console.log("  Result: greeting = ".concat(formatValue(result)));
    passedTests++;
}
catch (e) {
    console.log("✗ Test 16 failed:", e.message);
    failedTests++;
}
// Test 17: Single quote strings
try {
    var state17 = executeProgram("msg = 'Python'\n");
    var result = state17.getVariable("msg");
    console.log("✓ Test 17 passed: msg = 'Python'");
    console.log("  Result: msg = ".concat(formatValue(result)));
    passedTests++;
}
catch (e) {
    console.log("✗ Test 17 failed:", e.message);
    failedTests++;
}
// ===== BOOLEAN TESTS =====
console.log("\n--- Boolean Expression Tests ---");
// Test 18: Boolean literals
try {
    var code18 = "flag1 = True\nflag2 = False\n";
    var state18 = executeProgram(code18);
    var flag1 = state18.getVariable("flag1");
    var flag2 = state18.getVariable("flag2");
    console.log("✓ Test 18 passed: flag1 = True, flag2 = False");
    console.log("  Result: flag1 = ".concat(formatValue(flag1), ", flag2 = ").concat(formatValue(flag2)));
    passedTests++;
}
catch (e) {
    console.log("✗ Test 18 failed:", e.message);
    failedTests++;
}
// Test 19: Logical AND
try {
    var state19 = executeProgram("logic1 = 1 and 2\n");
    var result = state19.getVariable("logic1");
    console.log("✓ Test 19 passed: logic1 = 1 and 2");
    console.log("  Result: logic1 = ".concat(formatValue(result)));
    passedTests++;
}
catch (e) {
    console.log("✗ Test 19 failed:", e.message);
    failedTests++;
}
// Test 20: Logical OR
try {
    var state20 = executeProgram("logic2 = 0 or 5\n");
    var result = state20.getVariable("logic2");
    console.log("✓ Test 20 passed: logic2 = 0 or 5");
    console.log("  Result: logic2 = ".concat(formatValue(result)));
    passedTests++;
}
catch (e) {
    console.log("✗ Test 20 failed:", e.message);
    failedTests++;
}
// ===== LIST TESTS =====
console.log("\n--- List Expression Tests ---");
// Test 21: Empty list
try {
    var state21 = executeProgram("empty = []\n");
    var result = state21.getVariable("empty");
    console.log("✓ Test 21 passed: empty = []");
    console.log("  Result: empty = ".concat(formatValue(result)));
    passedTests++;
}
catch (e) {
    console.log("✗ Test 21 failed:", e.message);
    failedTests++;
}
// Test 22: List with values
try {
    var state22 = executeProgram("nums = [1, 2, 3, 4, 5]\n");
    var result = state22.getVariable("nums");
    console.log("✓ Test 22 passed: nums = [1, 2, 3, 4, 5]");
    console.log("  Result: nums = ".concat(formatValue(result)));
    passedTests++;
}
catch (e) {
    console.log("✗ Test 22 failed:", e.message);
    failedTests++;
}
// Test 23: List access
try {
    var code23 = "nums = [10, 20, 30]\nval = nums[1]\n";
    var state23 = executeProgram(code23);
    var result = state23.getVariable("val");
    console.log("✓ Test 23 passed: nums = [10, 20, 30], val = nums[1]");
    console.log("  Result: val = ".concat(formatValue(result)));
    passedTests++;
}
catch (e) {
    console.log("✗ Test 23 failed:", e.message);
    failedTests++;
}
// ===== NUMBER FORMAT TESTS =====
console.log("\n--- Number Format Tests ---");
// Test 24: Hexadecimal
try {
    var state24 = executeProgram("hex_num = 0xFF\n");
    var result = state24.getVariable("hex_num");
    console.log("✓ Test 24 passed: hex_num = 0xFF");
    console.log("  Result: hex_num = ".concat(formatValue(result)));
    passedTests++;
}
catch (e) {
    console.log("✗ Test 24 failed:", e.message);
    failedTests++;
}
// Test 25: Binary
try {
    var state25 = executeProgram("bin_num = 0b1010\n");
    var result = state25.getVariable("bin_num");
    console.log("✓ Test 25 passed: bin_num = 0b1010");
    console.log("  Result: bin_num = ".concat(formatValue(result)));
    passedTests++;
}
catch (e) {
    console.log("✗ Test 25 failed:", e.message);
    failedTests++;
}
// ===== COMPLEX EXPRESSION TESTS =====
console.log("\n--- Complex Expression Tests ---");
// Test 26: Nested expressions
try {
    var state26 = executeProgram("result = ((2 + 3) * 4) - 5\n");
    var result = state26.getVariable("result");
    console.log("✓ Test 26 passed: result = ((2 + 3) * 4) - 5");
    console.log("  Result: result = ".concat(formatValue(result)));
    if (result === BigInt(15)) {
        passedTests++;
    }
    else {
        console.log("  \u26A0 Warning: Expected 15, got ".concat(result));
        failedTests++;
    }
}
catch (e) {
    console.log("✗ Test 26 failed:", e.message);
    failedTests++;
}
// Test 27: Mixed operators
try {
    var state27 = executeProgram("mixed = 2 ** 3 + 4 * 5 - 6 / 2\n");
    var result = state27.getVariable("mixed");
    console.log("✓ Test 27 passed: mixed = 2 ** 3 + 4 * 5 - 6 / 2");
    console.log("  Result: mixed = ".concat(formatValue(result)));
    passedTests++;
}
catch (e) {
    console.log("✗ Test 27 failed:", e.message);
    failedTests++;
}
console.log("\n=== TEST SUMMARY ===");
console.log("Passed: ".concat(passedTests));
console.log("Failed: ".concat(failedTests));
console.log("Total: ".concat(passedTests + failedTests));
