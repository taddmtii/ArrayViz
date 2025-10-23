import { ProgramNode } from "./Nodes";
import { State } from "./Interpreter";

// Import your parser
const nearley = require("nearley");
const grammar = require("./grammar");

// Helper function to parse code
function parseCode(code: string): ProgramNode {
  const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
  try {
    parser.feed(code);
    if (parser.results.length === 0) {
      throw new Error("No parse results");
    }
    if (parser.results.length > 1) {
      console.warn("Warning: Ambiguous grammar - multiple parse results");
    }
    return parser.results[0];
  } catch (e: any) {
    console.error("Parse error:", e.message);
    throw e;
  }
}

// Helper function to execute and get state
function executeProgram(code: string): State {
  const program = parseCode(code);
  const commands = program.execute();

  const state = new State(
    0,
    0,
    null as any,
    null as any,
    [],
    [],
    new Map(),
    1,
    [],
    [],
  );

  for (const command of commands) {
    command.do(state);
  }

  return state;
}

// Helper to format values
function formatValue(val: any): string {
  if (Array.isArray(val)) {
    return JSON.stringify(val);
  }
  if (typeof val === "string") {
    return `"${val}"`;
  }
  return String(val);
}

// Test suite
console.log("=== MILESTONE TESTS: Expressions & Assignments ===\n");

let passedTests = 0;
let failedTests = 0;

// ===== ARITHMETIC EXPRESSION TESTS =====
console.log("--- Arithmetic Expression Tests ---");

// Test 1: Simple addition
try {
  const state1 = executeProgram("x = 5 + 3\n");
  const result = state1.getVariable("x");
  console.log("✓ Test 1 passed: x = 5 + 3");
  console.log(`  Result: x = ${formatValue(result)}`);
  if (result === 8) {
    passedTests++;
  } else {
    console.log(`  ⚠ Warning: Expected 8, got ${result}`);
    failedTests++;
  }
} catch (e: any) {
  console.log("✗ Test 1 failed:", e.message);
  failedTests++;
}

// Test 2: Subtraction
try {
  const state2 = executeProgram("y = 10 - 4\n");
  const result = state2.getVariable("y");
  console.log("✓ Test 2 passed: y = 10 - 4");
  console.log(`  Result: y = ${formatValue(result)}`);
  if (result === 6) {
    passedTests++;
  } else {
    console.log(`  ⚠ Warning: Expected 6, got ${result}`);
    failedTests++;
  }
} catch (e: any) {
  console.log("✗ Test 2 failed:", e.message);
  failedTests++;
}

// Test 3: Multiplication
try {
  const state3 = executeProgram("z = 7 * 6\n");
  const result = state3.getVariable("z");
  console.log("✓ Test 3 passed: z = 7 * 6");
  console.log(`  Result: z = ${formatValue(result)}`);
  if (result === 42) {
    passedTests++;
  } else {
    console.log(`  ⚠ Warning: Expected 42, got ${result}`);
    failedTests++;
  }
} catch (e: any) {
  console.log("✗ Test 3 failed:", e.message);
  failedTests++;
}

// Test 4: Division
try {
  const state4 = executeProgram("a = 20 / 4\n");
  const result = state4.getVariable("a");
  console.log("✓ Test 4 passed: a = 20 / 4");
  console.log(`  Result: a = ${formatValue(result)}`);
  if (result === 5) {
    passedTests++;
  } else {
    console.log(`  ⚠ Warning: Expected 5, got ${result}`);
    failedTests++;
  }
} catch (e: any) {
  console.log("✗ Test 4 failed:", e.message);
  failedTests++;
}

// Test 5: Integer division
try {
  const state5 = executeProgram("b = 17 // 5\n");
  const result = state5.getVariable("b");
  console.log("✓ Test 5 passed: b = 17 // 5");
  console.log(`  Result: b = ${formatValue(result)}`);
  if (result === 3) {
    passedTests++;
  } else {
    console.log(`  ⚠ Warning: Expected 3, got ${result}`);
    failedTests++;
  }
} catch (e: any) {
  console.log("✗ Test 5 failed:", e.message);
  failedTests++;
}

// Test 6: Modulo
try {
  const state6 = executeProgram("c = 17 % 5\n");
  const result = state6.getVariable("c");
  console.log("✓ Test 6 passed: c = 17 % 5");
  console.log(`  Result: c = ${formatValue(result)}`);
  if (result === 2) {
    passedTests++;
  } else {
    console.log(`  ⚠ Warning: Expected 2, got ${result}`);
    failedTests++;
  }
} catch (e: any) {
  console.log("✗ Test 6 failed:", e.message);
  failedTests++;
}

// Test 7: Power
try {
  const state7 = executeProgram("d = 2 ** 3\n");
  const result = state7.getVariable("d");
  console.log("✓ Test 7 passed: d = 2 ** 3");
  console.log(`  Result: d = ${formatValue(result)}`);
  if (result === 8) {
    passedTests++;
  } else {
    console.log(`  ⚠ Warning: Expected 8, got ${result}`);
    failedTests++;
  }
} catch (e: any) {
  console.log("✗ Test 7 failed:", e.message);
  failedTests++;
}

console.log("\n--- Complex Arithmetic Tests ---");

// Test 8: Order of operations
try {
  const state8 = executeProgram("result = 2 + 3 * 4\n");
  const result = state8.getVariable("result");
  console.log("✓ Test 8 passed: result = 2 + 3 * 4");
  console.log(`  Result: result = ${formatValue(result)}`);
  if (result === 14) {
    passedTests++;
  } else {
    console.log(`  ⚠ Warning: Expected 14, got ${result}`);
    failedTests++;
  }
} catch (e: any) {
  console.log("✗ Test 8 failed:", e.message);
  failedTests++;
}

// Test 9: Parentheses
try {
  const state9 = executeProgram("result2 = (2 + 3) * 4\n");
  const result = state9.getVariable("result2");
  console.log("✓ Test 9 passed: result2 = (2 + 3) * 4");
  console.log(`  Result: result2 = ${formatValue(result)}`);
  if (result === 20) {
    passedTests++;
  } else {
    console.log(`  ⚠ Warning: Expected 20, got ${result}`);
    failedTests++;
  }
} catch (e: any) {
  console.log("✗ Test 9 failed:", e.message);
  failedTests++;
}

// Test 10: Unary operators
try {
  const state10 = executeProgram("neg = -5\n");
  const result = state10.getVariable("neg");
  console.log("✓ Test 10 passed: neg = -5");
  console.log(`  Result: neg = ${formatValue(result)}`);
  if (result === -5) {
    passedTests++;
  } else {
    console.log(`  ⚠ Warning: Expected -5, got ${result}`);
    failedTests++;
  }
} catch (e: any) {
  console.log("✗ Test 10 failed:", e.message);
  failedTests++;
}

// ===== COMPARISON EXPRESSION TESTS =====
console.log("\n--- Comparison Expression Tests ---");

// Test 11: Less than
try {
  const state11 = executeProgram("comp1 = 5 < 10\n");
  const result = state11.getVariable("comp1");
  console.log("✓ Test 11 passed: comp1 = 5 < 10");
  console.log(`  Result: comp1 = ${formatValue(result)}`);
  if (result === true) {
    passedTests++;
  } else {
    console.log(`  ⚠ Warning: Expected true, got ${result}`);
    failedTests++;
  }
} catch (e: any) {
  console.log("✗ Test 11 failed:", e.message);
  failedTests++;
}

// Test 12: Greater than
try {
  const state12 = executeProgram("comp2 = 10 > 5\n");
  const result = state12.getVariable("comp2");
  console.log("✓ Test 12 passed: comp2 = 10 > 5");
  console.log(`  Result: comp2 = ${formatValue(result)}`);
  if (result === true) {
    passedTests++;
  } else {
    console.log(`  ⚠ Warning: Expected true, got ${result}`);
    failedTests++;
  }
} catch (e: any) {
  console.log("✗ Test 12 failed:", e.message);
  failedTests++;
}

// Test 13: Not equal
try {
  const state13 = executeProgram("comp3 = 5 != 3\n");
  const result = state13.getVariable("comp3");
  console.log("✓ Test 13 passed: comp3 = 5 != 3");
  console.log(`  Result: comp3 = ${formatValue(result)}`);
  if (result === true) {
    passedTests++;
  } else {
    console.log(`  ⚠ Warning: Expected true, got ${result}`);
    failedTests++;
  }
} catch (e: any) {
  console.log("✗ Test 13 failed:", e.message);
  failedTests++;
}

// ===== VARIABLE REFERENCE TESTS =====
console.log("\n--- Variable Reference Tests ---");

// Test 14: Variable reference in expression
try {
  const code14 = "x = 5\ny = x + 3\n";
  const state14 = executeProgram(code14);
  const result = state14.getVariable("y");
  console.log("✓ Test 14 passed: x = 5, y = x + 3");
  console.log(`  Result: y = ${formatValue(result)}`);
  if (result === 8) {
    passedTests++;
  } else {
    console.log(`  ⚠ Warning: Expected 8, got ${result}`);
    failedTests++;
  }
} catch (e: any) {
  console.log("✗ Test 14 failed:", e.message);
  failedTests++;
}

// Test 15: Multiple variable references
try {
  const code15 = "a = 10\nb = 20\nc = a + b\n";
  const state15 = executeProgram(code15);
  const result = state15.getVariable("c");
  console.log("✓ Test 15 passed: a = 10, b = 20, c = a + b");
  console.log(`  Result: c = ${formatValue(result)}`);
  if (result === 30) {
    passedTests++;
  } else {
    console.log(`  ⚠ Warning: Expected 30, got ${result}`);
    failedTests++;
  }
} catch (e: any) {
  console.log("✗ Test 15 failed:", e.message);
  failedTests++;
}

// ===== STRING TESTS =====
console.log("\n--- String Expression Tests ---");

// Test 16: String concatenation
try {
  const state16 = executeProgram('greeting = "Hello" + " World"\n');
  const result = state16.getVariable("greeting");
  console.log('✓ Test 16 passed: greeting = "Hello" + " World"');
  console.log(`  Result: greeting = ${formatValue(result)}`);
  if (result === "Hello World") {
    passedTests++;
  } else {
    console.log(`  ⚠ Warning: Expected "Hello World", got ${result}`);
    failedTests++;
  }
} catch (e: any) {
  console.log("✗ Test 16 failed:", e.message);
  failedTests++;
}

// Test 17: Single quote strings
try {
  const state17 = executeProgram("msg = 'Python'\n");
  const result = state17.getVariable("msg");
  console.log("✓ Test 17 passed: msg = 'Python'");
  console.log(`  Result: msg = ${formatValue(result)}`);
  if (result === "Python") {
    passedTests++;
  } else {
    console.log(`  ⚠ Warning: Expected "Python", got ${result}`);
    failedTests++;
  }
} catch (e: any) {
  console.log("✗ Test 17 failed:", e.message);
  failedTests++;
}

// ===== BOOLEAN TESTS =====
console.log("\n--- Boolean Expression Tests ---");

// Test 18: Boolean literals
try {
  const code18 = "flag1 = True\nflag2 = False\n";
  const state18 = executeProgram(code18);
  const flag1 = state18.getVariable("flag1");
  const flag2 = state18.getVariable("flag2");
  console.log(state18.variables.get("flag2"));
  console.log("✓ Test 18 passed: flag1 = True, flag2 = False");
  console.log(`type of flag1: ${typeof flag1}, flag2: ${flag2}`);
  console.log(
    `  Result: flag1 = ${formatValue(flag1)}, flag2 = ${formatValue(flag2)}`,
  );
  if (flag1 === true && flag2 === false) {
    passedTests++;
  } else {
    console.log(
      `  ⚠ Warning: Expected true and false, got ${flag1} and ${flag2}`,
    );
    failedTests++;
  }
} catch (e: any) {
  console.log("✗ Test 18 failed:", e.message);
  failedTests++;
}

// Test 19: Logical AND
try {
  const state19 = executeProgram("logic1 = 1 and 2\n");
  const result = state19.getVariable("logic1");
  console.log("✓ Test 19 passed: logic1 = 1 and 2");
  console.log(`  Result: logic1 = ${formatValue(result)}`);
  if (result === 2) {
    passedTests++;
  } else {
    console.log(`  ⚠ Warning: Expected 2, got ${result}`);
    failedTests++;
  }
} catch (e: any) {
  console.log("✗ Test 19 failed:", e.message);
  failedTests++;
}

// Test 20: Logical OR
try {
  const state20 = executeProgram("logic2 = 0 or 5\n");
  const result = state20.getVariable("logic2");
  console.log("✓ Test 20 passed: logic2 = 0 or 5");
  console.log(`  Result: logic2 = ${formatValue(result)}`);
  if (result === 5) {
    passedTests++;
  } else {
    console.log(`  ⚠ Warning: Expected 5, got ${result}`);
    failedTests++;
  }
} catch (e: any) {
  console.log("✗ Test 20 failed:", e.message);
  failedTests++;
}

// ===== LIST TESTS =====
console.log("\n--- List Expression Tests ---");

// Test 21: Empty list
try {
  const state21 = executeProgram("empty = []\n");
  const result = state21.getVariable("empty");
  console.log("✓ Test 21 passed: empty = []");
  console.log(`  Result: empty = ${formatValue(result)}`);
  if (Array.isArray(result) && result.length === 0) {
    passedTests++;
  } else {
    console.log(`  ⚠ Warning: Expected [], got ${result}`);
    failedTests++;
  }
} catch (e: any) {
  console.log("✗ Test 21 failed:", e.message);
  failedTests++;
}

// Test 22: List with values
try {
  const state22 = executeProgram("nums = [1, 2, 3, 4, 5]\n");
  const result = state22.getVariable("nums");
  console.log("✓ Test 22 passed: nums = [1, 2, 3, 4, 5]");
  console.log(`  Result: nums = ${formatValue(result)}`);
  if (JSON.stringify(result) === JSON.stringify([1, 2, 3, 4, 5])) {
    passedTests++;
  } else {
    console.log(
      `  ⚠ Warning: Expected [1,2,3,4,5], got ${formatValue(result)}`,
    );
    failedTests++;
  }
} catch (e: any) {
  console.log("✗ Test 22 failed:", e.message);
  failedTests++;
}

// Test 23: List access
try {
  const code23 = "nums = [10, 20, 30]\nval = nums[1]\n";
  const state23 = executeProgram(code23);
  const result = state23.getVariable("val");
  console.log("✓ Test 23 passed: nums = [10, 20, 30], val = nums[1]");
  console.log(`  Result: val = ${formatValue(result)}`);
  if (result === 20) {
    passedTests++;
  } else {
    console.log(`  ⚠ Warning: Expected 20, got ${result}`);
    failedTests++;
  }
} catch (e: any) {
  console.log("✗ Test 23 failed:", e.message);
  failedTests++;
}

// ===== NUMBER FORMAT TESTS =====
console.log("\n--- Number Format Tests ---");

// Test 24: Hexadecimal
try {
  const state24 = executeProgram("hex_num = 0xFF\n");
  const result = state24.getVariable("hex_num");
  console.log("✓ Test 24 passed: hex_num = 0xFF");
  console.log(`  Result: hex_num = ${formatValue(result)}`);
  if (result === 255) {
    passedTests++;
  } else {
    console.log(`  ⚠ Warning: Expected 255, got ${result}`);
    failedTests++;
  }
} catch (e: any) {
  console.log("✗ Test 24 failed:", e.message);
  failedTests++;
}

// Test 25: Binary
try {
  const state25 = executeProgram("bin_num = 0b1010\n");
  const result = state25.getVariable("bin_num");
  console.log("✓ Test 25 passed: bin_num = 0b1010");
  console.log(`  Result: bin_num = ${formatValue(result)}`);
  if (result === 10) {
    passedTests++;
  } else {
    console.log(`  ⚠ Warning: Expected 10, got ${result}`);
    failedTests++;
  }
} catch (e: any) {
  console.log("✗ Test 25 failed:", e.message);
  failedTests++;
}

// ===== COMPLEX EXPRESSION TESTS =====
console.log("\n--- Complex Expression Tests ---");

// Test 26: Nested expressions
try {
  const state26 = executeProgram("result = ((2 + 3) * 4) - 5\n");
  const result = state26.getVariable("result");
  console.log("✓ Test 26 passed: result = ((2 + 3) * 4) - 5");
  console.log(`  Result: result = ${formatValue(result)}`);
  if (result === 15) {
    passedTests++;
  } else {
    console.log(`  ⚠ Warning: Expected 15, got ${result}`);
    failedTests++;
  }
} catch (e: any) {
  console.log("✗ Test 26 failed:", e.message);
  failedTests++;
}

// Test 27: Mixed operators
try {
  const state27 = executeProgram("mixed = 2 ** 3 + 4 * 5 - 6 / 2\n");
  const result = state27.getVariable("mixed");
  console.log("✓ Test 27 passed: mixed = 2 ** 3 + 4 * 5 - 6 / 2");
  console.log(`  Result: mixed = ${formatValue(result)}`);
  // 2**3 = 8, 4*5 = 20, 6/2 = 3, so 8 + 20 - 3 = 25
  if (result === 25) {
    passedTests++;
  } else {
    console.log(`  ⚠ Warning: Expected 25, got ${result}`);
    failedTests++;
  }
} catch (e: any) {
  console.log("✗ Test 27 failed:", e.message);
  failedTests++;
}

console.log("\n=== TEST SUMMARY ===");
console.log(`Passed: ${passedTests}`);
console.log(`Failed: ${failedTests}`);
console.log(`Total: ${passedTests + failedTests}`);
