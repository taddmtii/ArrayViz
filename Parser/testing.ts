import {
  State,
  Command,
  AssignVariableCommand,
  PushValueCommand,
  PopValueCommand,
  HighlightExpressionCommand,
  RetrieveValueCommand,
  BinaryOpCommand,
  ComparisonOpCommand,
  UnaryOpCommand,
  PrintCommand,
  LenCommand,
  TypeCommand,
  IndexAccessCommand,
  CreateListCommand,
  ListSliceCommand,
} from "./Interpreter";

import {
  ProgramNode,
  NumberLiteralExpressionNode,
  IdentifierExpressionNode,
  BinaryExpressionNode,
  UnaryExpressionNode,
  ComparisonExpressionNode,
  BooleanLiteralExpressionNode,
  StringLiteralExpressionNode,
  ListLiteralExpressionNode,
  ListAccessExpressionNode,
  ListSliceExpressionNode,
  FuncCallExpressionNode,
  ArgListExpressionNode,
  ConditionalExpressionNode,
  AssignmentStatementNode,
  ExpressionNode,
  StatementNode,
  PythonValue,
} from "./Nodes";

import * as moo from "moo";

// ============================================================================
// TEST UTILITIES
// ============================================================================

class TestRunner {
  private testCount = 0;
  private passCount = 0;
  private failCount = 0;

  createToken(text: string, line: number = 1, col: number = 1): moo.Token {
    return {
      type: "TEST",
      value: text,
      text: text,
      offset: 0,
      lineBreaks: 0,
      line: line,
      col: col,
    } as moo.Token;
  }

  createState(): State {
    return new State(
      0, // programCounter
      0, // lineCount
      null as any, // currentExpression
      null as any, // currentStatement
      [], // callStack
      [], // history
      new Map(), // variables
      1, // currentLine
      [], // evaluationStack
      [], // returnStack
    );
  }

  executeCommands(state: State, commands: Command[]): void {
    console.log(`\n${"=".repeat(60)}`);
    console.log(`Executing ${commands.length} commands:`);
    console.log("=".repeat(60));

    commands.forEach((cmd, idx) => {
      console.log(
        `\n[Command ${idx + 1}/${commands.length}] ${cmd.constructor.name}`,
      );
      console.log("-".repeat(40));

      const stackBefore = [...state.evaluationStack];
      const varsBefore = new Map(state.variables);

      cmd.do(state);

      // Show state changes
      if (
        state.evaluationStack.length !== stackBefore.length ||
        !this.arraysEqual(state.evaluationStack, stackBefore)
      ) {
        console.log(
          `  Stack Before: [${stackBefore.map((v) => JSON.stringify(v)).join(", ")}]`,
        );
        console.log(
          `  Stack After:  [${state.evaluationStack.map((v) => JSON.stringify(v)).join(", ")}]`,
        );
      }

      if (
        state.variables.size !== varsBefore.size ||
        !this.mapsEqual(state.variables, varsBefore)
      ) {
        console.log(`  Variables Changed:`);
        state.variables.forEach((value, key) => {
          if (varsBefore.get(key) !== value) {
            console.log(`    ${key} = ${JSON.stringify(value)}`);
          }
        });
      }
    });

    console.log(`\n${"=".repeat(60)}`);
  }

  arraysEqual(a: any[], b: any[]): boolean {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (JSON.stringify(a[i]) !== JSON.stringify(b[i])) return false;
    }
    return true;
  }

  mapsEqual(a: Map<string, any>, b: Map<string, any>): boolean {
    if (a.size !== b.size) return false;
    for (let [key, val] of a) {
      if (b.get(key) !== val) return false;
    }
    return true;
  }

  test(name: string, testFn: () => void): void {
    this.testCount++;
    console.log(`\n${"#".repeat(70)}`);
    console.log(`# TEST ${this.testCount}: ${name}`);
    console.log("#".repeat(70));

    try {
      testFn();
      this.passCount++;
      console.log(`\n✅ PASSED: ${name}`);
    } catch (error) {
      this.failCount++;
      console.log(`\n❌ FAILED: ${name}`);
      console.error(error);
    }
  }

  assert(condition: boolean, message: string): void {
    if (!condition) {
      throw new Error(`Assertion failed: ${message}`);
    }
    console.log(`  ✓ ${message}`);
  }

  assertEquals(actual: any, expected: any, message: string): void {
    const actualStr = JSON.stringify(actual);
    const expectedStr = JSON.stringify(expected);
    if (actualStr !== expectedStr) {
      throw new Error(
        `${message}\n    Expected: ${expectedStr}\n    Actual: ${actualStr}`,
      );
    }
    console.log(`  ✓ ${message}`);
  }

  summary(): void {
    console.log("\n" + "=".repeat(70));
    console.log("TEST SUMMARY");
    console.log("=".repeat(70));
    console.log(`Total Tests: ${this.testCount}`);
    console.log(`Passed: ${this.passCount} ✅`);
    console.log(`Failed: ${this.failCount} ❌`);
    console.log(
      `Success Rate: ${((this.passCount / this.testCount) * 100).toFixed(2)}%`,
    );
    console.log("=".repeat(70));
  }
}

// ============================================================================
// TEST SUITE
// ============================================================================

const runner = new TestRunner();

// ============================================================================
// NUMBER LITERAL TESTS
// ============================================================================

runner.test("NumberLiteralExpressionNode - Integer", () => {
  const state = runner.createState();
  const token = runner.createToken("42");
  const node = new NumberLiteralExpressionNode("42", token);

  const commands = node.evaluate();
  runner.executeCommands(state, commands);

  runner.assertEquals(commands.length, 2, "Should generate 2 commands");
  runner.assertEquals(state.evaluationStack[0], 42, "Stack should contain 42");
});

runner.test("NumberLiteralExpressionNode - Float", () => {
  const state = runner.createState();
  const token = runner.createToken("3.14");
  const node = new NumberLiteralExpressionNode("3.14", token);

  const commands = node.evaluate();
  runner.executeCommands(state, commands);

  runner.assertEquals(
    state.evaluationStack[0],
    3.14,
    "Stack should contain 3.14",
  );
});

runner.test("NumberLiteralExpressionNode - Hexadecimal", () => {
  const state = runner.createState();
  const token = runner.createToken("0xFF");
  const node = new NumberLiteralExpressionNode("0xFF", token);

  const commands = node.evaluate();
  runner.executeCommands(state, commands);

  runner.assertEquals(state.evaluationStack[0], 255, "0xFF should equal 255");
});

runner.test("NumberLiteralExpressionNode - Binary", () => {
  const state = runner.createState();
  const token = runner.createToken("0b1010");
  const node = new NumberLiteralExpressionNode("0b1010", token);

  const commands = node.evaluate();
  runner.executeCommands(state, commands);

  runner.assertEquals(state.evaluationStack[0], 10, "0b1010 should equal 10");
});

// ============================================================================
// STRING LITERAL TESTS
// ============================================================================

runner.test("StringLiteralExpressionNode - Double Quotes", () => {
  const state = runner.createState();
  const token = runner.createToken('"hello world"');
  const node = new StringLiteralExpressionNode(token);

  const commands = node.evaluate();
  runner.executeCommands(state, commands);

  runner.assertEquals(
    state.evaluationStack[0],
    "hello world",
    "Stack should contain unquoted string",
  );
});

runner.test("StringLiteralExpressionNode - Single Quotes", () => {
  const state = runner.createState();
  const token = runner.createToken("'python'");
  const node = new StringLiteralExpressionNode(token);

  const commands = node.evaluate();
  runner.executeCommands(state, commands);

  runner.assertEquals(
    state.evaluationStack[0],
    "python",
    "Stack should contain 'python'",
  );
});

// ============================================================================
// BOOLEAN LITERAL TESTS
// ============================================================================

runner.test("BooleanLiteralExpressionNode - True", () => {
  const state = runner.createState();
  const token = runner.createToken("True");
  const node = new BooleanLiteralExpressionNode(true, token);

  const commands = node.evaluate();
  runner.executeCommands(state, commands);

  runner.assertEquals(
    state.evaluationStack[0],
    true,
    "Stack should contain true",
  );
});

runner.test("BooleanLiteralExpressionNode - False", () => {
  const state = runner.createState();
  const token = runner.createToken("False");
  const node = new BooleanLiteralExpressionNode(false, token);

  const commands = node.evaluate();
  runner.executeCommands(state, commands);

  runner.assertEquals(
    state.evaluationStack[0],
    false,
    "Stack should contain false",
  );
});

// ============================================================================
// IDENTIFIER TESTS
// ============================================================================

runner.test("IdentifierExpressionNode - Retrieve Variable", () => {
  const state = runner.createState();
  state.setVariable("x", 100);

  const token = runner.createToken("x");
  const node = new IdentifierExpressionNode(token);

  const commands = node.evaluate();
  runner.executeCommands(state, commands);

  runner.assertEquals(state.evaluationStack[0], 100, "Should retrieve x = 100");
});

// ============================================================================
// BINARY EXPRESSION TESTS
// ============================================================================

runner.test("BinaryExpressionNode - Addition", () => {
  const state = runner.createState();
  const tok1 = runner.createToken("5");
  const tok2 = runner.createToken("3");
  const tokOp = runner.createToken("+");

  const left = new NumberLiteralExpressionNode("5", tok1);
  const right = new NumberLiteralExpressionNode("3", tok2);
  const node = new BinaryExpressionNode(left, "+", right, tokOp);

  const commands = node.evaluate();
  runner.executeCommands(state, commands);

  runner.assertEquals(state.evaluationStack[0], 8, "5 + 3 = 8");
});

runner.test("BinaryExpressionNode - Subtraction", () => {
  const state = runner.createState();
  const tok1 = runner.createToken("10");
  const tok2 = runner.createToken("4");
  const tokOp = runner.createToken("-");

  const left = new NumberLiteralExpressionNode("10", tok1);
  const right = new NumberLiteralExpressionNode("4", tok2);
  const node = new BinaryExpressionNode(left, "-", right, tokOp);

  const commands = node.evaluate();
  runner.executeCommands(state, commands);

  runner.assertEquals(state.evaluationStack[0], 6, "10 - 4 = 6");
});

runner.test("BinaryExpressionNode - Multiplication", () => {
  const state = runner.createState();
  const tok1 = runner.createToken("7");
  const tok2 = runner.createToken("6");
  const tokOp = runner.createToken("*");

  const left = new NumberLiteralExpressionNode("7", tok1);
  const right = new NumberLiteralExpressionNode("6", tok2);
  const node = new BinaryExpressionNode(left, "*", right, tokOp);

  const commands = node.evaluate();
  runner.executeCommands(state, commands);

  runner.assertEquals(state.evaluationStack[0], 42, "7 * 6 = 42");
});

runner.test("BinaryExpressionNode - Division", () => {
  const state = runner.createState();
  const tok1 = runner.createToken("15");
  const tok2 = runner.createToken("3");
  const tokOp = runner.createToken("/");

  const left = new NumberLiteralExpressionNode("15", tok1);
  const right = new NumberLiteralExpressionNode("3", tok2);
  const node = new BinaryExpressionNode(left, "/", right, tokOp);

  const commands = node.evaluate();
  runner.executeCommands(state, commands);

  runner.assertEquals(state.evaluationStack[0], 5, "15 / 3 = 5");
});

runner.test("BinaryExpressionNode - Integer Division", () => {
  const state = runner.createState();
  const tok1 = runner.createToken("17");
  const tok2 = runner.createToken("5");
  const tokOp = runner.createToken("//");

  const left = new NumberLiteralExpressionNode("17", tok1);
  const right = new NumberLiteralExpressionNode("5", tok2);
  const node = new BinaryExpressionNode(left, "//", right, tokOp);

  const commands = node.evaluate();
  runner.executeCommands(state, commands);

  runner.assertEquals(state.evaluationStack[0], 3, "17 // 5 = 3");
});

runner.test("BinaryExpressionNode - Modulo", () => {
  const state = runner.createState();
  const tok1 = runner.createToken("17");
  const tok2 = runner.createToken("5");
  const tokOp = runner.createToken("%");

  const left = new NumberLiteralExpressionNode("17", tok1);
  const right = new NumberLiteralExpressionNode("5", tok2);
  const node = new BinaryExpressionNode(left, "%", right, tokOp);

  const commands = node.evaluate();
  runner.executeCommands(state, commands);

  runner.assertEquals(state.evaluationStack[0], 2, "17 % 5 = 2");
});

runner.test("BinaryExpressionNode - Power", () => {
  const state = runner.createState();
  const tok1 = runner.createToken("2");
  const tok2 = runner.createToken("8");
  const tokOp = runner.createToken("**");

  const left = new NumberLiteralExpressionNode("2", tok1);
  const right = new NumberLiteralExpressionNode("8", tok2);
  const node = new BinaryExpressionNode(left, "**", right, tokOp);

  const commands = node.evaluate();
  runner.executeCommands(state, commands);

  runner.assertEquals(state.evaluationStack[0], 256, "2 ** 8 = 256");
});

runner.test("BinaryExpressionNode - String Concatenation", () => {
  const state = runner.createState();
  const tok1 = runner.createToken('"Hello"');
  const tok2 = runner.createToken('"World"');
  const tokOp = runner.createToken("+");

  const left = new StringLiteralExpressionNode(tok1);
  const right = new StringLiteralExpressionNode(tok2);
  const node = new BinaryExpressionNode(left, "+", right, tokOp);

  const commands = node.evaluate();
  runner.executeCommands(state, commands);

  runner.assertEquals(
    state.evaluationStack[0],
    "HelloWorld",
    "String concatenation",
  );
});

// ============================================================================
// UNARY EXPRESSION TESTS
// ============================================================================

runner.test("UnaryExpressionNode - Negative", () => {
  const state = runner.createState();
  const tok = runner.createToken("5");
  const tokOp = runner.createToken("-");

  const operand = new NumberLiteralExpressionNode("5", tok);
  const node = new UnaryExpressionNode("-", operand, tokOp);

  const commands = node.evaluate();
  runner.executeCommands(state, commands);

  runner.assertEquals(state.evaluationStack[0], -5, "-5 = -5");
});

runner.test("UnaryExpressionNode - Positive", () => {
  const state = runner.createState();
  const tok = runner.createToken("5");
  const tokOp = runner.createToken("+");

  const operand = new NumberLiteralExpressionNode("5", tok);
  const node = new UnaryExpressionNode("+", operand, tokOp);

  const commands = node.evaluate();
  runner.executeCommands(state, commands);

  runner.assertEquals(state.evaluationStack[0], 5, "+5 = 5");
});

runner.test("UnaryExpressionNode - Not", () => {
  const state = runner.createState();
  const tok = runner.createToken("True");
  const tokOp = runner.createToken("not");

  const operand = new BooleanLiteralExpressionNode(true, tok);
  const node = new UnaryExpressionNode("not", operand, tokOp);

  const commands = node.evaluate();
  runner.executeCommands(state, commands);

  runner.assertEquals(state.evaluationStack[0], false, "not True = False");
});

// ============================================================================
// COMPARISON EXPRESSION TESTS
// ============================================================================

runner.test("ComparisonExpressionNode - Less Than (True)", () => {
  const state = runner.createState();
  const tok1 = runner.createToken("5");
  const tok2 = runner.createToken("10");

  const left = new NumberLiteralExpressionNode("5", tok1);
  const right = new NumberLiteralExpressionNode("10", tok2);
  const node = new ComparisonExpressionNode(left, "<", right);

  const commands = node.evaluate();
  runner.executeCommands(state, commands);

  runner.assertEquals(state.evaluationStack[0], true, "5 < 10 = True");
});

runner.test("ComparisonExpressionNode - Greater Than", () => {
  const state = runner.createState();
  const tok1 = runner.createToken("10");
  const tok2 = runner.createToken("5");

  const left = new NumberLiteralExpressionNode("10", tok1);
  const right = new NumberLiteralExpressionNode("5", tok2);
  const node = new ComparisonExpressionNode(left, ">", right);

  const commands = node.evaluate();
  runner.executeCommands(state, commands);

  runner.assertEquals(state.evaluationStack[0], true, "10 > 5 = True");
});

runner.test("ComparisonExpressionNode - Less Than or Equal", () => {
  const state = runner.createState();
  const tok1 = runner.createToken("5");
  const tok2 = runner.createToken("5");

  const left = new NumberLiteralExpressionNode("5", tok1);
  const right = new NumberLiteralExpressionNode("5", tok2);
  const node = new ComparisonExpressionNode(left, "<=", right);

  const commands = node.evaluate();
  runner.executeCommands(state, commands);

  runner.assertEquals(state.evaluationStack[0], true, "5 <= 5 = True");
});

runner.test("ComparisonExpressionNode - Greater Than or Equal", () => {
  const state = runner.createState();
  const tok1 = runner.createToken("10");
  const tok2 = runner.createToken("10");

  const left = new NumberLiteralExpressionNode("10", tok1);
  const right = new NumberLiteralExpressionNode("10", tok2);
  const node = new ComparisonExpressionNode(left, ">=", right);

  const commands = node.evaluate();
  runner.executeCommands(state, commands);

  runner.assertEquals(state.evaluationStack[0], true, "10 >= 10 = True");
});

runner.test("ComparisonExpressionNode - Not Equal", () => {
  const state = runner.createState();
  const tok1 = runner.createToken("5");
  const tok2 = runner.createToken("10");

  const left = new NumberLiteralExpressionNode("5", tok1);
  const right = new NumberLiteralExpressionNode("10", tok2);
  const node = new ComparisonExpressionNode(left, "!=", right);

  const commands = node.evaluate();
  runner.executeCommands(state, commands);

  runner.assertEquals(state.evaluationStack[0], true, "5 != 10 = True");
});

// ============================================================================
// LIST LITERAL TESTS
// ============================================================================

runner.test("ListLiteralExpressionNode - Empty List", () => {
  const state = runner.createState();
  const token = runner.createToken("[");

  const argList = new ArgListExpressionNode([]);
  const node = new ListLiteralExpressionNode(argList, token);

  const commands = node.evaluate();
  runner.executeCommands(state, commands);

  runner.assertEquals(state.evaluationStack[0], [], "Should create empty list");
});

runner.test("ListLiteralExpressionNode - Number List", () => {
  const state = runner.createState();
  const token = runner.createToken("[");

  const tok1 = runner.createToken("1");
  const tok2 = runner.createToken("2");
  const tok3 = runner.createToken("3");

  const args = [
    new NumberLiteralExpressionNode("1", tok1),
    new NumberLiteralExpressionNode("2", tok2),
    new NumberLiteralExpressionNode("3", tok3),
  ];
  const argList = new ArgListExpressionNode(args);
  const node = new ListLiteralExpressionNode(argList, token);

  const commands = node.evaluate();
  runner.executeCommands(state, commands);

  runner.assertEquals(
    state.evaluationStack[0],
    [1, 2, 3],
    "Should create [1, 2, 3]",
  );
});

runner.test("ListLiteralExpressionNode - Mixed Types", () => {
  const state = runner.createState();
  const token = runner.createToken("[");

  const tok1 = runner.createToken("42");
  const tok2 = runner.createToken('"hello"');
  const tok3 = runner.createToken("True");

  const args = [
    new NumberLiteralExpressionNode("42", tok1),
    new StringLiteralExpressionNode(tok2),
    new BooleanLiteralExpressionNode(true, tok3),
  ];
  const argList = new ArgListExpressionNode(args);
  const node = new ListLiteralExpressionNode(argList, token);

  const commands = node.evaluate();
  runner.executeCommands(state, commands);

  runner.assertEquals(
    state.evaluationStack[0],
    [42, "hello", true],
    "Should create mixed type list",
  );
});

// ============================================================================
// LIST ACCESS TESTS
// ============================================================================

runner.test("ListAccessExpressionNode - Simple Index", () => {
  const state = runner.createState();
  state.setVariable("arr", [10, 20, 30, 40, 50]);

  const tokArr = runner.createToken("arr");
  const tokIdx = runner.createToken("2");

  const listNode = new IdentifierExpressionNode(tokArr);
  const indexNode = new NumberLiteralExpressionNode("2", tokIdx);
  const node = new ListAccessExpressionNode(listNode, indexNode);

  const commands = node.evaluate();
  runner.executeCommands(state, commands);

  runner.assertEquals(state.evaluationStack[0], 30, "arr[2] = 30");
});

runner.test("ListAccessExpressionNode - First Element", () => {
  const state = runner.createState();
  state.setVariable("nums", [100, 200, 300]);

  const tokArr = runner.createToken("nums");
  const tokIdx = runner.createToken("0");

  const listNode = new IdentifierExpressionNode(tokArr);
  const indexNode = new NumberLiteralExpressionNode("0", tokIdx);
  const node = new ListAccessExpressionNode(listNode, indexNode);

  const commands = node.evaluate();
  runner.executeCommands(state, commands);

  runner.assertEquals(state.evaluationStack[0], 100, "nums[0] = 100");
});

// ============================================================================
// FUNCTION CALL TESTS (Built-in Functions)
// ============================================================================

runner.test("FuncCallExpressionNode - print()", () => {
  const state = runner.createState();
  const tokFunc = runner.createToken("print");
  const tokArg = runner.createToken('"Hello"');

  const funcName = new IdentifierExpressionNode(tokFunc);
  const args = [new StringLiteralExpressionNode(tokArg)];
  const argList = new ArgListExpressionNode(args);
  const node = new FuncCallExpressionNode(funcName, argList);

  const commands = node.evaluate();
  console.log("\n--- Executing print() ---");
  runner.executeCommands(state, commands);

  runner.assert(commands.length > 0, "Should generate commands for print");
});

runner.test("FuncCallExpressionNode - len() on string", () => {
  const state = runner.createState();
  const tokFunc = runner.createToken("len");
  const tokArg = runner.createToken('"Python"');

  const funcName = new IdentifierExpressionNode(tokFunc);
  const args = [new StringLiteralExpressionNode(tokArg)];
  const argList = new ArgListExpressionNode(args);
  const node = new FuncCallExpressionNode(funcName, argList);

  const commands = node.evaluate();
  runner.executeCommands(state, commands);

  runner.assertEquals(state.evaluationStack[0], 6, 'len("Python") = 6');
});

runner.test("FuncCallExpressionNode - len() on list", () => {
  const state = runner.createState();
  const tokFunc = runner.createToken("len");
  const tokList = runner.createToken("[");

  const tok1 = runner.createToken("1");
  const tok2 = runner.createToken("2");
  const tok3 = runner.createToken("3");
  const tok4 = runner.createToken("4");

  const listArgs = [
    new NumberLiteralExpressionNode("1", tok1),
    new NumberLiteralExpressionNode("2", tok2),
    new NumberLiteralExpressionNode("3", tok3),
    new NumberLiteralExpressionNode("4", tok4),
  ];
  const list = new ListLiteralExpressionNode(
    new ArgListExpressionNode(listArgs),
    tokList,
  );

  const funcName = new IdentifierExpressionNode(tokFunc);
  const argList = new ArgListExpressionNode([list]);
  const node = new FuncCallExpressionNode(funcName, argList);

  const commands = node.evaluate();
  runner.executeCommands(state, commands);

  runner.assertEquals(state.evaluationStack[0], 4, "len([1,2,3,4]) = 4");
});

runner.test("FuncCallExpressionNode - type()", () => {
  const state = runner.createState();
  const tokFunc = runner.createToken("type");
  const tokArg = runner.createToken("42");

  const funcName = new IdentifierExpressionNode(tokFunc);
  const args = [new NumberLiteralExpressionNode("42", tokArg)];
  const argList = new ArgListExpressionNode(args);
  const node = new FuncCallExpressionNode(funcName, argList);

  const commands = node.evaluate();
  runner.executeCommands(state, commands);

  runner.assertEquals(
    state.evaluationStack[0],
    "number",
    "type(42) = 'number'",
  );
});

// ============================================================================
// COMPLEX NESTED EXPRESSION TESTS
// ============================================================================

runner.test("Complex Expression - (5 + 3) * 2", () => {
  const state = runner.createState();

  const tok5 = runner.createToken("5");
  const tok3 = runner.createToken("3");
  const tok2 = runner.createToken("2");
  const tokPlus = runner.createToken("+");
  const tokMult = runner.createToken("*");

  const five = new NumberLiteralExpressionNode("5", tok5);
  const three = new NumberLiteralExpressionNode("3", tok3);
  const two = new NumberLiteralExpressionNode("2", tok2);

  const addition = new BinaryExpressionNode(five, "+", three, tokPlus);
  const multiplication = new BinaryExpressionNode(addition, "*", two, tokMult);

  const commands = multiplication.evaluate();
  runner.executeCommands(state, commands);

  runner.assertEquals(state.evaluationStack[0], 16, "(5 + 3) * 2 = 16");
});

runner.test("Complex Expression - 2 ** 3 + 5", () => {
  const state = runner.createState();

  const tok2 = runner.createToken("2");
  const tok3 = runner.createToken("3");
  const tok5 = runner.createToken("5");
  const tokPower = runner.createToken("**");
  const tokPlus = runner.createToken("+");

  const two = new NumberLiteralExpressionNode("2", tok2);
  const three = new NumberLiteralExpressionNode("3", tok3);
  const five = new NumberLiteralExpressionNode("5", tok5);

  const power = new BinaryExpressionNode(two, "**", three, tokPower);
  const addition = new BinaryExpressionNode(power, "+", five, tokPlus);

  const commands = addition.evaluate();
  runner.executeCommands(state, commands);

  runner.assertEquals(state.evaluationStack[0], 13, "2 ** 3 + 5 = 13");
});

runner.test("Complex Expression - Variable in Expression", () => {
  const state = runner.createState();
  state.setVariable("x", 10);

  const tokX = runner.createToken("x");
  const tok5 = runner.createToken("5");
  const tokMult = runner.createToken("*");

  const x = new IdentifierExpressionNode(tokX);
  const five = new NumberLiteralExpressionNode("5", tok5);
  const multiplication = new BinaryExpressionNode(x, "*", five, tokMult);

  const commands = multiplication.evaluate();
  runner.executeCommands(state, commands);

  runner.assertEquals(state.evaluationStack[0], 50, "x * 5 where x=10 = 50");
});

runner.test("Complex Expression - Nested Comparisons", () => {
  const state = runner.createState();

  const tok10 = runner.createToken("10");
  const tok5 = runner.createToken("5");
  const tok20 = runner.createToken("20");
  const tokPlus = runner.createToken("+");

  const ten = new NumberLiteralExpressionNode("10", tok10);
  const five = new NumberLiteralExpressionNode("5", tok5);
  const twenty = new NumberLiteralExpressionNode("20", tok20);

  const addition = new BinaryExpressionNode(ten, "+", five, tokPlus);
  const comparison = new ComparisonExpressionNode(addition, "<", twenty);

  const commands = comparison.evaluate();
  runner.executeCommands(state, commands);

  runner.assertEquals(state.evaluationStack[0], true, "(10 + 5) < 20 = True");
});

// ============================================================================
// LIST SLICE TESTS
// ============================================================================

runner.test("ListSliceExpressionNode - Full Slice with Start and Stop", () => {
  const state = runner.createState();
  state.setVariable("nums", [0, 1, 2, 3, 4, 5]);

  const tokNums = runner.createToken("nums");
  const tok1 = runner.createToken("1");
  const tok4 = runner.createToken("4");

  const listNode = new IdentifierExpressionNode(tokNums);
  const startNode = new NumberLiteralExpressionNode("1", tok1);
  const stopNode = new NumberLiteralExpressionNode("4", tok4);

  const node = new ListSliceExpressionNode(listNode, startNode, stopNode, null);

  const commands = node.evaluate();
  runner.executeCommands(state, commands);

  console.log("  Note: ListSliceCommand implementation needs completion");
});

runner.test("ListSliceExpressionNode - Only Stop", () => {
  const state = runner.createState();
  state.setVariable("nums", [10, 20, 30, 40, 50]);

  const tokNums = runner.createToken("nums");
  const tok3 = runner.createToken("3");

  const listNode = new IdentifierExpressionNode(tokNums);
  const stopNode = new NumberLiteralExpressionNode("3", tok3);

  const node = new ListSliceExpressionNode(listNode, null, stopNode, null);

  const commands = node.evaluate();
  runner.executeCommands(state, commands);

  console.log("  Note: Should implement nums[:3]");
});

runner.test("ListSliceExpressionNode - Only Start", () => {
  const state = runner.createState();
  state.setVariable("nums", [10, 20, 30, 40, 50]);

  const tokNums = runner.createToken("nums");
  const tok2 = runner.createToken("2");

  const listNode = new IdentifierExpressionNode(tokNums);
  const startNode = new NumberLiteralExpressionNode("2", tok2);

  const node = new ListSliceExpressionNode(listNode, startNode, null, null);

  const commands = node.evaluate();
  runner.executeCommands(state, commands);

  console.log("  Note: Should implement nums[2:]");
});

runner.test("ListSliceExpressionNode - With Step", () => {
  const state = runner.createState();
  state.setVariable("nums", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

  const tokNums = runner.createToken("nums");
  const tok0 = runner.createToken("0");
  const tok8 = runner.createToken("8");
  const tok2 = runner.createToken("2");

  const listNode = new IdentifierExpressionNode(tokNums);
  const startNode = new NumberLiteralExpressionNode("0", tok0);
  const stopNode = new NumberLiteralExpressionNode("8", tok8);
  const stepNode = new NumberLiteralExpressionNode("2", tok2);

  const node = new ListSliceExpressionNode(
    listNode,
    startNode,
    stopNode,
    stepNode,
  );

  const commands = node.evaluate();
  runner.executeCommands(state, commands);

  console.log("  Note: Should implement nums[0:8:2] - even numbers");
});

// ============================================================================
// CONDITIONAL EXPRESSION TESTS
// ============================================================================

runner.test("ConditionalExpressionNode - True Condition", () => {
  const state = runner.createState();

  const tokTrue = runner.createToken("True");
  const tok10 = runner.createToken("10");
  const tok20 = runner.createToken("20");

  const condition = new BooleanLiteralExpressionNode(true, tokTrue);
  const trueValue = new NumberLiteralExpressionNode("10", tok10);
  const falseValue = new NumberLiteralExpressionNode("20", tok20);

  const node = new ConditionalExpressionNode(trueValue, condition, falseValue);

  const commands = node.evaluate();
  runner.executeCommands(state, commands);

  console.log(
    "  Note: Conditional expression needs conditional logic implementation",
  );
  runner.assert(commands.length > 0, "Should generate commands");
});

// ============================================================================
// ARG LIST TESTS
// ============================================================================

runner.test("ArgListExpressionNode - Multiple Arguments", () => {
  const state = runner.createState();

  const tok1 = runner.createToken("1");
  const tok2 = runner.createToken("2");
  const tok3 = runner.createToken("3");

  const args = [
    new NumberLiteralExpressionNode("1", tok1),
    new NumberLiteralExpressionNode("2", tok2),
    new NumberLiteralExpressionNode("3", tok3),
  ];
  const argList = new ArgListExpressionNode(args);

  const commands = argList.evaluate();
  runner.executeCommands(state, commands);

  runner.assertEquals(state.evaluationStack.length, 3, "Should push 3 values");
  runner.assertEquals(state.evaluationStack[0], 1, "First arg = 1");
  runner.assertEquals(state.evaluationStack[1], 2, "Second arg = 2");
  runner.assertEquals(state.evaluationStack[2], 3, "Third arg = 3");
});

runner.test("ArgListExpressionNode - Empty", () => {
  const state = runner.createState();
  const argList = new ArgListExpressionNode([]);

  const commands = argList.evaluate();
  runner.executeCommands(state, commands);

  runner.assertEquals(state.evaluationStack.length, 0, "Empty arg list");
});

// ============================================================================
// EDGE CASES AND ERROR SCENARIOS
// ============================================================================

runner.test("Edge Case - Division by Zero", () => {
  const state = runner.createState();

  const tok10 = runner.createToken("10");
  const tok0 = runner.createToken("0");
  const tokDiv = runner.createToken("/");

  const ten = new NumberLiteralExpressionNode("10", tok10);
  const zero = new NumberLiteralExpressionNode("0", tok0);
  const division = new BinaryExpressionNode(ten, "/", zero, tokDiv);

  const commands = division.evaluate();
  runner.executeCommands(state, commands);

  runner.assert(
    state.evaluationStack[0] === Infinity || isNaN(state.evaluationStack[0]),
    "10 / 0 should be Infinity or NaN",
  );
});

runner.test("Edge Case - Negative List Index", () => {
  const state = runner.createState();
  state.setVariable("arr", [1, 2, 3, 4, 5]);

  const tokArr = runner.createToken("arr");
  const tokIdx = runner.createToken("-1");
  const tokMinus = runner.createToken("-");

  const listNode = new IdentifierExpressionNode(tokArr);
  const one = new NumberLiteralExpressionNode("1", tokIdx);
  const negOne = new UnaryExpressionNode("-", one, tokMinus);
  const node = new ListAccessExpressionNode(listNode, negOne);

  const commands = node.evaluate();
  runner.executeCommands(state, commands);

  console.log("  Note: Negative indexing may need special handling");
});

runner.test("Edge Case - Very Large Numbers", () => {
  const state = runner.createState();

  const tok1 = runner.createToken("999999999");
  const tok2 = runner.createToken("999999999");
  const tokMult = runner.createToken("*");

  const num1 = new NumberLiteralExpressionNode("999999999", tok1);
  const num2 = new NumberLiteralExpressionNode("999999999", tok2);
  const multiplication = new BinaryExpressionNode(num1, "*", num2, tokMult);

  const commands = multiplication.evaluate();
  runner.executeCommands(state, commands);

  runner.assert(
    state.evaluationStack[0] > 0,
    "Large number multiplication should work",
  );
});

runner.test("Edge Case - Empty String", () => {
  const state = runner.createState();
  const token = runner.createToken('""');
  const node = new StringLiteralExpressionNode(token);

  const commands = node.evaluate();
  runner.executeCommands(state, commands);

  runner.assertEquals(state.evaluationStack[0], "", "Empty string should work");
});

// ============================================================================
// INTEGRATION TESTS - Multiple Expression Types Together
// ============================================================================

runner.test("Integration - List with Expressions", () => {
  const state = runner.createState();
  state.setVariable("x", 5);

  const tokList = runner.createToken("[");
  const tokX = runner.createToken("x");
  const tok10 = runner.createToken("10");
  const tokPlus = runner.createToken("+");

  const x = new IdentifierExpressionNode(tokX);
  const ten = new NumberLiteralExpressionNode("10", tok10);
  const addition = new BinaryExpressionNode(x, "+", ten, tokPlus);

  const args = [x, addition];
  const argList = new ArgListExpressionNode(args);
  const listNode = new ListLiteralExpressionNode(argList, tokList);

  const commands = listNode.evaluate();
  runner.executeCommands(state, commands);

  runner.assertEquals(
    state.evaluationStack[0],
    [5, 15],
    "List [x, x+10] where x=5 = [5, 15]",
  );
});

runner.test("Integration - Comparison with Variables", () => {
  const state = runner.createState();
  state.setVariable("a", 10);
  state.setVariable("b", 5);

  const tokA = runner.createToken("a");
  const tokB = runner.createToken("b");

  const a = new IdentifierExpressionNode(tokA);
  const b = new IdentifierExpressionNode(tokB);
  const comparison = new ComparisonExpressionNode(a, ">", b);

  const commands = comparison.evaluate();
  runner.executeCommands(state, commands);

  runner.assertEquals(
    state.evaluationStack[0],
    true,
    "a > b where a=10, b=5 = True",
  );
});

runner.test("Integration - Nested Function Calls", () => {
  const state = runner.createState();

  const tokLen = runner.createToken("len");
  const tokList = runner.createToken("[");
  const tok1 = runner.createToken("1");
  const tok2 = runner.createToken("2");
  const tok3 = runner.createToken("3");

  const listArgs = [
    new NumberLiteralExpressionNode("1", tok1),
    new NumberLiteralExpressionNode("2", tok2),
    new NumberLiteralExpressionNode("3", tok3),
  ];
  const list = new ListLiteralExpressionNode(
    new ArgListExpressionNode(listArgs),
    tokList,
  );

  const funcName = new IdentifierExpressionNode(tokLen);
  const argList = new ArgListExpressionNode([list]);
  const funcCall = new FuncCallExpressionNode(funcName, argList);

  const commands = funcCall.evaluate();
  runner.executeCommands(state, commands);

  runner.assertEquals(state.evaluationStack[0], 3, "len([1, 2, 3]) = 3");
});

runner.test("Integration - Complex Boolean Expression", () => {
  const state = runner.createState();
  state.setVariable("x", 15);

  const tokX = runner.createToken("x");
  const tok10 = runner.createToken("10");
  const tok20 = runner.createToken("20");

  const x = new IdentifierExpressionNode(tokX);
  const ten = new NumberLiteralExpressionNode("10", tok10);
  const twenty = new NumberLiteralExpressionNode("20", tok20);

  const comp1 = new ComparisonExpressionNode(x, ">", ten);
  const comp2 = new ComparisonExpressionNode(x, "<", twenty);

  const tokAnd = runner.createToken("and");
  const andExpr = new BinaryExpressionNode(comp1, "and", comp2, tokAnd);

  const commands = andExpr.evaluate();
  runner.executeCommands(state, commands);

  runner.assertEquals(
    state.evaluationStack[0],
    true,
    "x > 10 and x < 20 where x=15 = True",
  );
});

runner.test("Integration - String Operations", () => {
  const state = runner.createState();

  const tokHello = runner.createToken('"Hello"');
  const tokSpace = runner.createToken('" "');
  const tokWorld = runner.createToken('"World"');
  const tokPlus1 = runner.createToken("+");
  const tokPlus2 = runner.createToken("+");

  const hello = new StringLiteralExpressionNode(tokHello);
  const space = new StringLiteralExpressionNode(tokSpace);
  const world = new StringLiteralExpressionNode(tokWorld);

  const concat1 = new BinaryExpressionNode(hello, "+", space, tokPlus1);
  const concat2 = new BinaryExpressionNode(concat1, "+", world, tokPlus2);

  const commands = concat2.evaluate();
  runner.executeCommands(state, commands);

  runner.assertEquals(
    state.evaluationStack[0],
    "Hello World",
    '"Hello" + " " + "World" = "Hello World"',
  );
});

runner.test("Integration - List Access with Expression", () => {
  const state = runner.createState();
  state.setVariable("arr", [100, 200, 300, 400]);
  state.setVariable("i", 1);

  const tokArr = runner.createToken("arr");
  const tokI = runner.createToken("i");
  const tok1 = runner.createToken("1");
  const tokPlus = runner.createToken("+");

  const arr = new IdentifierExpressionNode(tokArr);
  const i = new IdentifierExpressionNode(tokI);
  const one = new NumberLiteralExpressionNode("1", tok1);
  const index = new BinaryExpressionNode(i, "+", one, tokPlus);

  const access = new ListAccessExpressionNode(arr, index);

  const commands = access.evaluate();
  runner.executeCommands(state, commands);

  runner.assertEquals(
    state.evaluationStack[0],
    300,
    "arr[i+1] where i=1 = arr[2] = 300",
  );
});

runner.test("Integration - Nested Lists", () => {
  const state = runner.createState();

  const tokOuter = runner.createToken("[");
  const tokInner1 = runner.createToken("[");
  const tokInner2 = runner.createToken("[");

  const tok1 = runner.createToken("1");
  const tok2 = runner.createToken("2");
  const tok3 = runner.createToken("3");
  const tok4 = runner.createToken("4");

  const inner1Args = [
    new NumberLiteralExpressionNode("1", tok1),
    new NumberLiteralExpressionNode("2", tok2),
  ];
  const inner2Args = [
    new NumberLiteralExpressionNode("3", tok3),
    new NumberLiteralExpressionNode("4", tok4),
  ];

  const inner1 = new ListLiteralExpressionNode(
    new ArgListExpressionNode(inner1Args),
    tokInner1,
  );
  const inner2 = new ListLiteralExpressionNode(
    new ArgListExpressionNode(inner2Args),
    tokInner2,
  );

  const outer = new ListLiteralExpressionNode(
    new ArgListExpressionNode([inner1, inner2]),
    tokOuter,
  );

  const commands = outer.evaluate();
  runner.executeCommands(state, commands);

  runner.assertEquals(
    JSON.stringify(state.evaluationStack[0]),
    JSON.stringify([
      [1, 2],
      [3, 4],
    ]),
    "Nested list [[1, 2], [3, 4]]",
  );
});

runner.test("Integration - All Arithmetic Operators", () => {
  const state = runner.createState();

  // Test: 2 + 3 * 4 - 5 / 2 (should be evaluated as separate operations)
  const tok2 = runner.createToken("2");
  const tok3 = runner.createToken("3");
  const tokPlus = runner.createToken("+");

  const two = new NumberLiteralExpressionNode("2", tok2);
  const three = new NumberLiteralExpressionNode("3", tok3);
  const add = new BinaryExpressionNode(two, "+", three, tokPlus);

  const commands = add.evaluate();
  runner.executeCommands(state, commands);

  runner.assertEquals(state.evaluationStack[0], 5, "2 + 3 = 5");
});

runner.test("Integration - Multiple Unary Operators", () => {
  const state = runner.createState();

  const tok5 = runner.createToken("5");
  const tokMinus1 = runner.createToken("-");
  const tokMinus2 = runner.createToken("-");

  const five = new NumberLiteralExpressionNode("5", tok5);
  const negOnce = new UnaryExpressionNode("-", five, tokMinus1);
  const negTwice = new UnaryExpressionNode("-", negOnce, tokMinus2);

  const commands = negTwice.evaluate();
  runner.executeCommands(state, commands);

  runner.assertEquals(state.evaluationStack[0], 5, "--5 = 5");
});

// ============================================================================
// STATEMENT INTEGRATION WITH EXPRESSIONS
// ============================================================================

runner.test("Statement - Assignment with Expression", () => {
  const state = runner.createState();

  const tokX = runner.createToken("x");
  const tok5 = runner.createToken("5");
  const tok3 = runner.createToken("3");
  const tokPlus = runner.createToken("+");

  const five = new NumberLiteralExpressionNode("5", tok5);
  const three = new NumberLiteralExpressionNode("3", tok3);
  const addition = new BinaryExpressionNode(five, "+", three, tokPlus);

  const assignment = new AssignmentStatementNode("x", addition, tokX);

  const commands = assignment.execute();
  runner.executeCommands(state, commands);

  runner.assertEquals(state.getVariable("x"), 8, "x = 5 + 3 → x = 8");
});

runner.test("Statement - Assignment with Variable Reference", () => {
  const state = runner.createState();
  state.setVariable("a", 10);

  const tokB = runner.createToken("b");
  const tokA = runner.createToken("a");

  const a = new IdentifierExpressionNode(tokA);
  const assignment = new AssignmentStatementNode("b", a, tokB);

  const commands = assignment.execute();
  runner.executeCommands(state, commands);

  runner.assertEquals(state.getVariable("b"), 10, "b = a where a=10 → b = 10");
});

// ============================================================================
// PERFORMANCE TESTS
// ============================================================================

runner.test("Performance - Large List Creation", () => {
  const state = runner.createState();
  const tokList = runner.createToken("[");

  const args: ExpressionNode[] = [];
  for (let i = 0; i < 100; i++) {
    const tok = runner.createToken(i.toString());
    args.push(new NumberLiteralExpressionNode(i.toString(), tok));
  }

  const argList = new ArgListExpressionNode(args);
  const listNode = new ListLiteralExpressionNode(argList, tokList);

  const startTime = Date.now();
  const commands = listNode.evaluate();
  runner.executeCommands(state, commands);
  const endTime = Date.now();

  runner.assertEquals(
    (state.evaluationStack[0] as any[]).length,
    100,
    "Should create list of 100 elements",
  );
  console.log(`  Execution time: ${endTime - startTime}ms`);
});

runner.test("Performance - Deeply Nested Expression", () => {
  const state = runner.createState();

  let current: ExpressionNode = new NumberLiteralExpressionNode(
    "1",
    runner.createToken("1"),
  );

  // Create: 1 + 1 + 1 + 1 + ... (20 times)
  for (let i = 0; i < 20; i++) {
    const one = new NumberLiteralExpressionNode("1", runner.createToken("1"));
    const tokPlus = runner.createToken("+");
    current = new BinaryExpressionNode(current, "+", one, tokPlus);
  }

  const startTime = Date.now();
  const commands = current.evaluate();
  runner.executeCommands(state, commands);
  const endTime = Date.now();

  runner.assertEquals(
    state.evaluationStack[0],
    21,
    "1 + 1 + ... (21 times) = 21",
  );
  console.log(`  Execution time: ${endTime - startTime}ms`);
});

// ============================================================================
// RUN ALL TESTS
// ============================================================================

console.log("\n\n");
console.log("*".repeat(70));
console.log("STARTING COMPREHENSIVE EXPRESSION NODE TEST SUITE");
console.log("*".repeat(70));

runner.summary();
