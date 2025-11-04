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
  ConditionalJumpCommand,
  JumpCommand,
  PushLoopBoundsCommand,
  PopLoopBoundsCommand,
  BreakCommand,
  ContinueCommand,
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
  ExpressionStatementNode,
  IfStatementNode,
  WhileStatementNode,
  ForStatementNode,
  BlockStatementNode,
  BreakStatementNode,
  ContinueStatementNode,
  PassStatementNode,
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
      [], // loopStack
    );
  }

  executeCommands(state: State, commands: Command[]): void {
    console.log(`\n${"=".repeat(60)}`);
    console.log(`Executing ${commands.length} commands:`);
    console.log("=".repeat(60));

    // Reset program counter to start
    state.programCounter = 0;

    while (state.programCounter < commands.length) {
      const cmd = commands[state.programCounter];
      const currentPC = state.programCounter;

      console.log(
        `\n[Command ${state.programCounter + 1}/${commands.length}] ${cmd.constructor.name}`,
      );
      console.log("-".repeat(40));

      const stackBefore = [...state.evaluationStack];
      const varsBefore = new Map(state.variables);

      cmd.do(state);

      // Increment PC only if the command didn't modify it
      if (state.programCounter === currentPC) {
        state.programCounter++;
      }

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

      // Safety check to prevent infinite loops
      if (state.programCounter > commands.length + 100) {
        console.log(
          "\n⚠️  WARNING: Potential infinite loop detected, breaking...",
        );
        break;
      }
    }

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
// EXPRESSION TESTS
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

// ============================================================================
// STATEMENT TESTS - ASSIGNMENT
// ============================================================================

runner.test("AssignmentStatementNode - Simple Assignment", () => {
  const state = runner.createState();

  const tokX = runner.createToken("x");
  const tok42 = runner.createToken("42");

  const value = new NumberLiteralExpressionNode("42", tok42);
  const assignment = new AssignmentStatementNode("x", value, tokX);

  const commands = assignment.execute();
  runner.executeCommands(state, commands);

  runner.assertEquals(state.getVariable("x"), 42, "x = 42");
});

runner.test("AssignmentStatementNode - Assignment with Expression", () => {
  const state = runner.createState();

  const tokY = runner.createToken("y");
  const tok5 = runner.createToken("5");
  const tok3 = runner.createToken("3");
  const tokPlus = runner.createToken("+");

  const five = new NumberLiteralExpressionNode("5", tok5);
  const three = new NumberLiteralExpressionNode("3", tok3);
  const addition = new BinaryExpressionNode(five, "+", three, tokPlus);
  const assignment = new AssignmentStatementNode("y", addition, tokY);

  const commands = assignment.execute();
  runner.executeCommands(state, commands);

  runner.assertEquals(state.getVariable("y"), 8, "y = 5 + 3 → y = 8");
});

// ============================================================================
// STATEMENT TESTS - IF STATEMENT
// ============================================================================

runner.test("IfStatementNode - True Condition", () => {
  const state = runner.createState();

  const tokIf = runner.createToken("if");
  const tokTrue = runner.createToken("True");
  const tokX = runner.createToken("x");
  const tok10 = runner.createToken("10");

  const condition = new BooleanLiteralExpressionNode(true, tokTrue);

  const value = new NumberLiteralExpressionNode("10", tok10);
  const assignment = new AssignmentStatementNode("x", value, tokX);
  const thenBlock = new BlockStatementNode([assignment], tokIf);

  const ifStmt = new IfStatementNode(condition, thenBlock, null, tokIf);

  const commands = ifStmt.execute();
  runner.executeCommands(state, commands);

  runner.assertEquals(state.getVariable("x"), 10, "x should be 10");
});

runner.test("IfStatementNode - If-Else (false condition)", () => {
  const state = runner.createState();

  const tokIf = runner.createToken("if");
  const tokFalse = runner.createToken("False");
  const tokX = runner.createToken("x");
  const tok10 = runner.createToken("10");
  const tok20 = runner.createToken("20");

  const condition = new BooleanLiteralExpressionNode(false, tokFalse);

  const value1 = new NumberLiteralExpressionNode("10", tok10);
  const assignment1 = new AssignmentStatementNode("x", value1, tokX);
  const thenBlock = new BlockStatementNode([assignment1], tokIf);

  const value2 = new NumberLiteralExpressionNode("20", tok20);
  const assignment2 = new AssignmentStatementNode("x", value2, tokX);
  const elseBlock = new BlockStatementNode([assignment2], tokIf);

  const ifStmt = new IfStatementNode(condition, thenBlock, elseBlock, tokIf);

  const commands = ifStmt.execute();
  runner.executeCommands(state, commands);

  runner.assertEquals(
    state.getVariable("x"),
    20,
    "x should be 20 (else branch)",
  );
});

// ============================================================================
// STATEMENT TESTS - WHILE LOOP
// ============================================================================

runner.test("WhileStatementNode - Simple Counter", () => {
  const state = runner.createState();
  state.setVariable("count", 0);

  const tokWhile = runner.createToken("while");
  const tokCount = runner.createToken("count");
  const tok3 = runner.createToken("3");
  const tok1 = runner.createToken("1");
  const tokPlus = runner.createToken("+");

  const count = new IdentifierExpressionNode(tokCount);
  const three = new NumberLiteralExpressionNode("3", tok3);
  const condition = new ComparisonExpressionNode(count, "<", three);

  const countExpr = new IdentifierExpressionNode(tokCount);
  const one = new NumberLiteralExpressionNode("1", tok1);
  const increment = new BinaryExpressionNode(countExpr, "+", one, tokPlus);
  const assignment = new AssignmentStatementNode("count", increment, tokCount);
  const block = new BlockStatementNode([assignment], tokWhile);

  const whileStmt = new WhileStatementNode(condition, block, tokWhile);

  const commands = whileStmt.execute();
  runner.executeCommands(state, commands);

  runner.assertEquals(state.getVariable("count"), 3, "count should be 3");
});

// ============================================================================
// STATEMENT TESTS - FOR LOOP
// ============================================================================

runner.test("ForStatementNode - Simple Iteration", () => {
  const state = runner.createState();
  state.setVariable("total", 0);

  const tokFor = runner.createToken("for");
  const tokI = runner.createToken("i");
  const tokList = runner.createToken("[");
  const tokTotal = runner.createToken("total");
  const tokPlus = runner.createToken("+");

  const loopVar = new IdentifierExpressionNode(tokI);

  const tok1 = runner.createToken("1");
  const tok2 = runner.createToken("2");
  const tok3 = runner.createToken("3");
  const items = [
    new NumberLiteralExpressionNode("1", tok1),
    new NumberLiteralExpressionNode("2", tok2),
    new NumberLiteralExpressionNode("3", tok3),
  ];
  const argList = new ArgListExpressionNode(items);
  const iterable = new ListLiteralExpressionNode(argList, tokList);

  const totalExpr = new IdentifierExpressionNode(tokTotal);
  const iExpr = new IdentifierExpressionNode(tokI);
  const addition = new BinaryExpressionNode(totalExpr, "+", iExpr, tokPlus);
  const assignment = new AssignmentStatementNode("total", addition, tokTotal);
  const block = new BlockStatementNode([assignment], tokFor);

  const forStmt = new ForStatementNode(loopVar, iterable, block, tokFor);

  const commands = forStmt.execute();
  runner.executeCommands(state, commands);

  runner.assertEquals(
    state.getVariable("total"),
    6,
    "total should be 6 (1+2+3)",
  );
});

// ============================================================================
// STATEMENT TESTS - PASS
// ============================================================================

runner.test("PassStatementNode - Does Nothing", () => {
  const state = runner.createState();

  const tokPass = runner.createToken("pass");
  const passStmt = new PassStatementNode(tokPass);

  const commands = passStmt.execute();
  runner.executeCommands(state, commands);

  runner.assert(
    commands.length >= 1,
    "Pass should generate at least highlight command",
  );
});

// ============================================================================
// INTEGRATION TESTS
// ============================================================================

runner.test("Integration - Nested If Statements", () => {
  const state = runner.createState();
  state.setVariable("x", 15);

  const tokIf = runner.createToken("if");
  const tokX = runner.createToken("x");
  const tok10 = runner.createToken("10");
  const tok20 = runner.createToken("20");
  const tokResult = runner.createToken("result");
  const tokMedium = runner.createToken('"medium"');
  const tokLarge = runner.createToken('"large"');

  const x1 = new IdentifierExpressionNode(tokX);
  const ten = new NumberLiteralExpressionNode("10", tok10);
  const outerCondition = new ComparisonExpressionNode(x1, ">", ten);

  const x2 = new IdentifierExpressionNode(tokX);
  const twenty = new NumberLiteralExpressionNode("20", tok20);
  const innerCondition = new ComparisonExpressionNode(x2, "<", twenty);

  const mediumVal = new StringLiteralExpressionNode(tokMedium);
  const mediumAssign = new AssignmentStatementNode(
    "result",
    mediumVal,
    tokResult,
  );
  const innerThen = new BlockStatementNode([mediumAssign], tokIf);

  const largeVal = new StringLiteralExpressionNode(tokLarge);
  const largeAssign = new AssignmentStatementNode(
    "result",
    largeVal,
    tokResult,
  );
  const innerElse = new BlockStatementNode([largeAssign], tokIf);

  const innerIf = new IfStatementNode(
    innerCondition,
    innerThen,
    innerElse,
    tokIf,
  );
  const outerThen = new BlockStatementNode([innerIf], tokIf);

  const outerIf = new IfStatementNode(outerCondition, outerThen, null, tokIf);

  const commands = outerIf.execute();
  runner.executeCommands(state, commands);

  runner.assertEquals(
    state.getVariable("result"),
    "medium",
    "result should be 'medium'",
  );
});

runner.test("Integration - Loop with Accumulation", () => {
  const state = runner.createState();
  state.setVariable("sum", 0);

  const tokFor = runner.createToken("for");
  const tokN = runner.createToken("n");
  const tokList = runner.createToken("[");
  const tokSum = runner.createToken("sum");
  const tokPlus = runner.createToken("+");

  const loopVar = new IdentifierExpressionNode(tokN);
  const items = [10, 20, 30, 40].map(
    (n) =>
      new NumberLiteralExpressionNode(
        n.toString(),
        runner.createToken(n.toString()),
      ),
  );
  const argList = new ArgListExpressionNode(items);
  const iterable = new ListLiteralExpressionNode(argList, tokList);

  const sumExpr = new IdentifierExpressionNode(tokSum);
  const nExpr = new IdentifierExpressionNode(tokN);
  const addition = new BinaryExpressionNode(sumExpr, "+", nExpr, tokPlus);
  const assignment = new AssignmentStatementNode("sum", addition, tokSum);
  const block = new BlockStatementNode([assignment], tokFor);

  const forStmt = new ForStatementNode(loopVar, iterable, block, tokFor);

  const commands = forStmt.execute();
  runner.executeCommands(state, commands);

  runner.assertEquals(state.getVariable("sum"), 100, "sum should be 100");
});

runner.test("Integration - Factorial with While Loop", () => {
  const state = runner.createState();
  state.setVariable("n", 5);
  state.setVariable("factorial", 1);

  const tokWhile = runner.createToken("while");
  const tokN = runner.createToken("n");
  const tok1 = runner.createToken("1");
  const tokFactorial = runner.createToken("factorial");
  const tokMult = runner.createToken("*");
  const tokMinus = runner.createToken("-");

  const n1 = new IdentifierExpressionNode(tokN);
  const one1 = new NumberLiteralExpressionNode("1", tok1);
  const condition = new ComparisonExpressionNode(n1, ">", one1);

  const factExpr = new IdentifierExpressionNode(tokFactorial);
  const nExpr1 = new IdentifierExpressionNode(tokN);
  const multiply = new BinaryExpressionNode(factExpr, "*", nExpr1, tokMult);
  const stmt1 = new AssignmentStatementNode(
    "factorial",
    multiply,
    tokFactorial,
  );

  const nExpr2 = new IdentifierExpressionNode(tokN);
  const one2 = new NumberLiteralExpressionNode("1", tok1);
  const decrement = new BinaryExpressionNode(nExpr2, "-", one2, tokMinus);
  const stmt2 = new AssignmentStatementNode("n", decrement, tokN);

  const block = new BlockStatementNode([stmt1, stmt2], tokWhile);

  const whileStmt = new WhileStatementNode(condition, block, tokWhile);

  const commands = whileStmt.execute();
  runner.executeCommands(state, commands);

  runner.assertEquals(state.getVariable("factorial"), 120, "5! should be 120");
});

runner.test("ProgramNode - Complete Mini Program", () => {
  const state = runner.createState();

  const tokTotal = runner.createToken("total");
  const tok0 = runner.createToken("0");
  const tokFor = runner.createToken("for");
  const tokI = runner.createToken("i");
  const tokList = runner.createToken("[");
  const tokPlus = runner.createToken("+");
  const tokResult = runner.createToken("result");

  const zero = new NumberLiteralExpressionNode("0", tok0);
  const initStmt = new AssignmentStatementNode("total", zero, tokTotal);

  const loopVar = new IdentifierExpressionNode(tokI);
  const items = [1, 2, 3, 4, 5].map(
    (n) =>
      new NumberLiteralExpressionNode(
        n.toString(),
        runner.createToken(n.toString()),
      ),
  );
  const argList = new ArgListExpressionNode(items);
  const iterable = new ListLiteralExpressionNode(argList, tokList);

  const totalExpr = new IdentifierExpressionNode(tokTotal);
  const iExpr = new IdentifierExpressionNode(tokI);
  const addition = new BinaryExpressionNode(totalExpr, "+", iExpr, tokPlus);
  const loopBody = new AssignmentStatementNode("total", addition, tokTotal);
  const block = new BlockStatementNode([loopBody], tokFor);

  const forStmt = new ForStatementNode(loopVar, iterable, block, tokFor);

  const finalTotal = new IdentifierExpressionNode(tokTotal);
  const finalStmt = new AssignmentStatementNode(
    "result",
    finalTotal,
    tokResult,
  );

  const program = new ProgramNode([initStmt, forStmt, finalStmt]);

  const commands = program.execute();
  runner.executeCommands(state, commands);

  runner.assertEquals(state.getVariable("total"), 15, "total should be 15");
  runner.assertEquals(state.getVariable("result"), 15, "result should be 15");
});

// ============================================================================
// RUN ALL TESTS AND DISPLAY SUMMARY
// ============================================================================

console.log("\n\n");
console.log("*".repeat(70));
console.log("STARTING COMPREHENSIVE TEST SUITE");
console.log("Expression Nodes + Statement Nodes + Integration Tests");
console.log("*".repeat(70));

runner.summary();
