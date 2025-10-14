// comprehensive-test.ts
// Comprehensive test file for all expressions and commands

import { 
  NumberLiteralExpressionNode, 
  BinaryExpressionNode,
  ComparisonExpressionNode,
  UnaryExpressionNode,
  IdentifierExpressionNode,
  ListLiteralExpressionNode,
  ListAccessExpressionNode,
  ListSliceExpressionNode,
  BooleanLiteralExpressionNode,
  StringLiteralExpressionNode,
  FuncCallExpressionNode,
  ArgListExpressionNode,
  ConditionalExpressionNode,
  AssignmentStatementNode,
  ExpressionStatementNode,
  ProgramNode
} from './Nodes';
import { 
  State, 
  Command,
  AssignVariableCommand,
  ChangeVariableCommand,
  PushValueCommand,
  PopValueCommand,
  RetrieveValueCommand,
  BinaryOpCommand,
  ComparisonOpCommand,
  UnaryOpCommand,
  PrintCommand,
  LenCommand,
  TypeCommand,
  IndexAccessCommand,
  ListSliceCommand,
  CreateListCommand
} from './Interpreter';
import * as moo from 'moo';

// Helper to create dummy token
function createToken(text: string, line: number = 1, col: number = 1): moo.Token {
  return { line, col, text, type: 'test', value: text } as moo.Token;
}

// Helper to serialize values (handles BigInt)
function serializeValue(v: any): string {
  if (typeof v === 'bigint') {
    return v.toString() + 'n';
  }
  return JSON.stringify(v);
}

// Helper to print state
function printState(state: State, label: string) {
  console.log(`\n--- ${label} ---`);
  console.log(`Evaluation Stack: [${state.evaluationStack.map(v => serializeValue(v)).join(', ')}]`);
  console.log(`Variables:`, Array.from(state.variables.entries()).map(([k, v]) => `${k}=${serializeValue(v)}`).join(', ') || '(empty)');
  console.log(`Program Counter: ${state.programCounter}`);
}

// Helper to execute commands and show each step
function executeAndShow(commands: Command[], state: State, description: string) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`TEST: ${description}`);
  console.log(`${'='.repeat(60)}`);
  
  commands.forEach((cmd, idx) => {
    console.log(`\nStep ${idx + 1}: Executing ${cmd.constructor.name}`);
    cmd.do(state);
    console.log(`  Stack after: [${state.evaluationStack.map(v => serializeValue(v)).join(', ')}]`);
    if (state.variables.size > 0) {
      console.log(`  Variables: ${Array.from(state.variables.entries()).map(([k, v]) => `${k}=${serializeValue(v)}`).join(', ')}`);
    }
  });
  
  printState(state, `Final State after ${description}`);
}

// Initialize fresh state for testing
function createFreshState(): State {
  return new State(
    0,      // programCounter
    0,      // lineCount
    null as any,  // currentExpression
    null as any,  // currentStatement
    [],     // callStack
    [],     // history
    new Map(), // variables
    1,      // currentLine
    [],     // evaluationStack
    []      // returnStack
  );
}

console.log('\n' + '█'.repeat(70));
console.log('█' + ' '.repeat(68) + '█');
console.log('█' + '  COMPREHENSIVE EXPRESSION AND COMMAND TEST SUITE'.padEnd(68) + '█');
console.log('█' + ' '.repeat(68) + '█');
console.log('█'.repeat(70));

// ============================================================================
// TEST 1: Number Literal Expressions
// ============================================================================
let state = createFreshState();
console.log('\n\n' + '▓'.repeat(70));
console.log('▓ TEST SUITE 1: NUMBER LITERAL EXPRESSIONS');
console.log('▓'.repeat(70));

const intLiteral = new NumberLiteralExpressionNode("42", createToken("42"));
executeAndShow(intLiteral.evaluate(), state, "Integer Literal: 42");

state = createFreshState();
const floatLiteral = new NumberLiteralExpressionNode("3.14", createToken("3.14"));
executeAndShow(floatLiteral.evaluate(), state, "Float Literal: 3.14");

state = createFreshState();
const hexLiteral = new NumberLiteralExpressionNode("0xFF", createToken("0xFF"));
executeAndShow(hexLiteral.evaluate(), state, "Hexadecimal Literal: 0xFF");

state = createFreshState();
const binaryLiteral = new NumberLiteralExpressionNode("0b1010", createToken("0b1010"));
executeAndShow(binaryLiteral.evaluate(), state, "Binary Literal: 0b1010");

// ============================================================================
// TEST 2: String and Boolean Literals
// ============================================================================
console.log('\n\n' + '▓'.repeat(70));
console.log('▓ TEST SUITE 2: STRING AND BOOLEAN LITERALS');
console.log('▓'.repeat(70));

state = createFreshState();
const stringLiteral = new StringLiteralExpressionNode(createToken('"Hello World"'));
executeAndShow(stringLiteral.evaluate(), state, 'String Literal: "Hello World"');

state = createFreshState();
const trueLiteral = new BooleanLiteralExpressionNode(true, createToken("True"));
executeAndShow(trueLiteral.evaluate(), state, "Boolean Literal: True");

state = createFreshState();
const falseLiteral = new BooleanLiteralExpressionNode(false, createToken("False"));
executeAndShow(falseLiteral.evaluate(), state, "Boolean Literal: False");

// ============================================================================
// TEST 3: Binary Operations (Arithmetic)
// ============================================================================
console.log('\n\n' + '▓'.repeat(70));
console.log('▓ TEST SUITE 3: BINARY ARITHMETIC OPERATIONS');
console.log('▓'.repeat(70));

state = createFreshState();
const add = new BinaryExpressionNode(
  new NumberLiteralExpressionNode("10", createToken("10")),
  "+",
  new NumberLiteralExpressionNode("5", createToken("5")),
  createToken("+")
);
executeAndShow(add.evaluate(), state, "Addition: 10 + 5");

state = createFreshState();
const subtract = new BinaryExpressionNode(
  new NumberLiteralExpressionNode("10", createToken("10")),
  "-",
  new NumberLiteralExpressionNode("5", createToken("5")),
  createToken("-")
);
executeAndShow(subtract.evaluate(), state, "Subtraction: 10 - 5");

state = createFreshState();
const multiply = new BinaryExpressionNode(
  new NumberLiteralExpressionNode("10", createToken("10")),
  "*",
  new NumberLiteralExpressionNode("5", createToken("5")),
  createToken("*")
);
executeAndShow(multiply.evaluate(), state, "Multiplication: 10 * 5");

state = createFreshState();
const divide = new BinaryExpressionNode(
  new NumberLiteralExpressionNode("10", createToken("10")),
  "/",
  new NumberLiteralExpressionNode("5", createToken("5")),
  createToken("/")
);
executeAndShow(divide.evaluate(), state, "Division: 10 / 5");

state = createFreshState();
const floorDivide = new BinaryExpressionNode(
  new NumberLiteralExpressionNode("10", createToken("10")),
  "//",
  new NumberLiteralExpressionNode("3", createToken("3")),
  createToken("//")
);
executeAndShow(floorDivide.evaluate(), state, "Floor Division: 10 // 3");

state = createFreshState();
const modulo = new BinaryExpressionNode(
  new NumberLiteralExpressionNode("10", createToken("10")),
  "%",
  new NumberLiteralExpressionNode("3", createToken("3")),
  createToken("%")
);
executeAndShow(modulo.evaluate(), state, "Modulo: 10 % 3");

// ============================================================================
// TEST 4: String Concatenation
// ============================================================================
console.log('\n\n' + '▓'.repeat(70));
console.log('▓ TEST SUITE 4: STRING CONCATENATION');
console.log('▓'.repeat(70));

state = createFreshState();
const strConcat = new BinaryExpressionNode(
  new StringLiteralExpressionNode(createToken('"Hello"')),
  "+",
  new StringLiteralExpressionNode(createToken('" World"')),
  createToken("+")
);
executeAndShow(strConcat.evaluate(), state, 'String Concatenation: "Hello" + " World"');

// ============================================================================
// TEST 5: Comparison Operations
// ============================================================================
console.log('\n\n' + '▓'.repeat(70));
console.log('▓ TEST SUITE 5: COMPARISON OPERATIONS');
console.log('▓'.repeat(70));

state = createFreshState();
const lessThan = new ComparisonExpressionNode(
  new NumberLiteralExpressionNode("5", createToken("5")),
  "<",
  new NumberLiteralExpressionNode("10", createToken("10"))
);
executeAndShow(lessThan.evaluate(), state, "Less Than: 5 < 10");

state = createFreshState();
const greaterThan = new ComparisonExpressionNode(
  new NumberLiteralExpressionNode("10", createToken("10")),
  ">",
  new NumberLiteralExpressionNode("5", createToken("5"))
);
executeAndShow(greaterThan.evaluate(), state, "Greater Than: 10 > 5");

state = createFreshState();
const lessEqual = new ComparisonExpressionNode(
  new NumberLiteralExpressionNode("5", createToken("5")),
  "<=",
  new NumberLiteralExpressionNode("5", createToken("5"))
);
executeAndShow(lessEqual.evaluate(), state, "Less Than or Equal: 5 <= 5");

state = createFreshState();
const greaterEqual = new ComparisonExpressionNode(
  new NumberLiteralExpressionNode("10", createToken("10")),
  ">=",
  new NumberLiteralExpressionNode("5", createToken("5"))
);
executeAndShow(greaterEqual.evaluate(), state, "Greater Than or Equal: 10 >= 5");

state = createFreshState();
const notEqual = new ComparisonExpressionNode(
  new NumberLiteralExpressionNode("5", createToken("5")),
  "!=",
  new NumberLiteralExpressionNode("10", createToken("10"))
);
executeAndShow(notEqual.evaluate(), state, "Not Equal: 5 != 10");

// ============================================================================
// TEST 6: Unary Operations
// ============================================================================
console.log('\n\n' + '▓'.repeat(70));
console.log('▓ TEST SUITE 6: UNARY OPERATIONS');
console.log('▓'.repeat(70));

state = createFreshState();
const negation = new UnaryExpressionNode(
  "-",
  new NumberLiteralExpressionNode("5", createToken("5")),
  createToken("-")
);
executeAndShow(negation.evaluate(), state, "Negation: -5");

state = createFreshState();
const unaryPlus = new UnaryExpressionNode(
  "+",
  new NumberLiteralExpressionNode("5", createToken("5")),
  createToken("+")
);
executeAndShow(unaryPlus.evaluate(), state, "Unary Plus: +5");

state = createFreshState();
const logicalNot = new UnaryExpressionNode(
  "not",
  new BooleanLiteralExpressionNode(true, createToken("True")),
  createToken("not")
);
executeAndShow(logicalNot.evaluate(), state, "Logical Not: not True");

// ============================================================================
// TEST 7: Variable Assignment and Retrieval
// ============================================================================
console.log('\n\n' + '▓'.repeat(70));
console.log('▓ TEST SUITE 7: VARIABLE ASSIGNMENT AND RETRIEVAL');
console.log('▓'.repeat(70));

state = createFreshState();
const assignment = new AssignmentStatementNode(
  "x",
  new NumberLiteralExpressionNode("42", createToken("42")),
  createToken("=")
);
executeAndShow(assignment.execute(), state, "Assignment: x = 42");

// Create fresh state but keep the variable
const xValue = state.getVariable("x");
state = createFreshState();
state.setVariable("x", xValue);
const retrieval = new IdentifierExpressionNode(createToken("x"));
executeAndShow(retrieval.evaluate(), state, "Variable Retrieval: x");

// ============================================================================
// TEST 8: List Literals
// ============================================================================
console.log('\n\n' + '▓'.repeat(70));
console.log('▓ TEST SUITE 8: LIST LITERALS');
console.log('▓'.repeat(70));

state = createFreshState();
const emptyList = new ListLiteralExpressionNode(
  new ArgListExpressionNode([]),
  createToken("[")
);
executeAndShow(emptyList.evaluate(), state, "Empty List: []");

state = createFreshState();
const simpleList = new ListLiteralExpressionNode(
  new ArgListExpressionNode([
    new NumberLiteralExpressionNode("1", createToken("1")),
    new NumberLiteralExpressionNode("2", createToken("2")),
    new NumberLiteralExpressionNode("3", createToken("3"))
  ]),
  createToken("[")
);
executeAndShow(simpleList.evaluate(), state, "Simple List: [1, 2, 3]");

state = createFreshState();
const mixedList = new ListLiteralExpressionNode(
  new ArgListExpressionNode([
    new NumberLiteralExpressionNode("1", createToken("1")),
    new StringLiteralExpressionNode(createToken('"hello"')),
    new BooleanLiteralExpressionNode(true, createToken("True"))
  ]),
  createToken("[")
);
executeAndShow(mixedList.evaluate(), state, 'Mixed List: [1, "hello", True]');

// ============================================================================
// TEST 9: List Access (Indexing)
// ============================================================================
console.log('\n\n' + '▓'.repeat(70));
console.log('▓ TEST SUITE 9: LIST ACCESS (INDEXING)');
console.log('▓'.repeat(70));

state = createFreshState();
state.setVariable("mylist", [10, 20, 30, 40, 50]);
const listAccess = new ListAccessExpressionNode(
  new IdentifierExpressionNode(createToken("mylist")),
  new NumberLiteralExpressionNode("2", createToken("2"))
);
executeAndShow(listAccess.evaluate(), state, "List Access: mylist[2]");

state = createFreshState();
state.setVariable("mylist", [10, 20, 30, 40, 50]);
const negativeIndex = new ListAccessExpressionNode(
  new IdentifierExpressionNode(createToken("mylist")),
  new NumberLiteralExpressionNode("-1", createToken("-1"))
);
executeAndShow(negativeIndex.evaluate(), state, "Negative Index: mylist[-1]");

state = createFreshState();
state.setVariable("mystr", "Hello");
const stringAccess = new ListAccessExpressionNode(
  new IdentifierExpressionNode(createToken("mystr")),
  new NumberLiteralExpressionNode("1", createToken("1"))
);
executeAndShow(stringAccess.evaluate(), state, 'String Access: mystr[1] where mystr="Hello"');

// ============================================================================
// TEST 10: List Slicing
// ============================================================================
console.log('\n\n' + '▓'.repeat(70));
console.log('▓ TEST SUITE 10: LIST SLICING');
console.log('▓'.repeat(70));

state = createFreshState();
state.setVariable("arr", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
const basicSlice = new ListSliceExpressionNode(
  new IdentifierExpressionNode(createToken("arr")),
  new NumberLiteralExpressionNode("2", createToken("2")),
  new NumberLiteralExpressionNode("5", createToken("5")),
  null as any
);
executeAndShow(basicSlice.evaluate(), state, "Basic Slice: arr[2:5]");

state = createFreshState();
state.setVariable("arr", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
const sliceWithStep = new ListSliceExpressionNode(
  new IdentifierExpressionNode(createToken("arr")),
  new NumberLiteralExpressionNode("0", createToken("0")),
  new NumberLiteralExpressionNode("8", createToken("8")),
  new NumberLiteralExpressionNode("2", createToken("2"))
);
executeAndShow(sliceWithStep.evaluate(), state, "Slice with Step: arr[0:8:2]");

state = createFreshState();
state.setVariable("arr", [0, 1, 2, 3, 4, 5]);
const sliceNoStart = new ListSliceExpressionNode(
  new IdentifierExpressionNode(createToken("arr")),
  null as any,
  new NumberLiteralExpressionNode("3", createToken("3")),
  null as any
);
executeAndShow(sliceNoStart.evaluate(), state, "Slice No Start: arr[:3]");

state = createFreshState();
state.setVariable("arr", [0, 1, 2, 3, 4, 5]);
const sliceNoStop = new ListSliceExpressionNode(
  new IdentifierExpressionNode(createToken("arr")),
  new NumberLiteralExpressionNode("2", createToken("2")),
  null as any,
  null as any
);
executeAndShow(sliceNoStop.evaluate(), state, "Slice No Stop: arr[2:]");

// ============================================================================
// TEST 11: Built-in Functions - len()
// ============================================================================
console.log('\n\n' + '▓'.repeat(70));
console.log('▓ TEST SUITE 11: BUILT-IN FUNCTION - len()');
console.log('▓'.repeat(70));

state = createFreshState();
const lenList = new FuncCallExpressionNode(
  new IdentifierExpressionNode(createToken("len")),
  new ArgListExpressionNode([
    new ListLiteralExpressionNode(
      new ArgListExpressionNode([
        new NumberLiteralExpressionNode("1", createToken("1")),
        new NumberLiteralExpressionNode("2", createToken("2")),
        new NumberLiteralExpressionNode("3", createToken("3"))
      ]),
      createToken("[")
    )
  ])
);
executeAndShow(lenList.evaluate(), state, "len([1, 2, 3])");

state = createFreshState();
const lenString = new FuncCallExpressionNode(
  new IdentifierExpressionNode(createToken("len")),
  new ArgListExpressionNode([
    new StringLiteralExpressionNode(createToken('"Hello"'))
  ])
);
executeAndShow(lenString.evaluate(), state, 'len("Hello")');

// ============================================================================
// TEST 12: Built-in Functions - type()
// ============================================================================
console.log('\n\n' + '▓'.repeat(70));
console.log('▓ TEST SUITE 12: BUILT-IN FUNCTION - type()');
console.log('▓'.repeat(70));

state = createFreshState();
const typeInt = new FuncCallExpressionNode(
  new IdentifierExpressionNode(createToken("type")),
  new ArgListExpressionNode([
    new NumberLiteralExpressionNode("42", createToken("42"))
  ])
);
executeAndShow(typeInt.evaluate(), state, "type(42)");

state = createFreshState();
const typeString = new FuncCallExpressionNode(
  new IdentifierExpressionNode(createToken("type")),
  new ArgListExpressionNode([
    new StringLiteralExpressionNode(createToken('"hello"'))
  ])
);
executeAndShow(typeString.evaluate(), state, 'type("hello")');

state = createFreshState();
const typeList = new FuncCallExpressionNode(
  new IdentifierExpressionNode(createToken("type")),
  new ArgListExpressionNode([
    new ListLiteralExpressionNode(
      new ArgListExpressionNode([]),
      createToken("[")
    )
  ])
);
executeAndShow(typeList.evaluate(), state, "type([])");

// ============================================================================
// TEST 13: Complex Nested Expressions
// ============================================================================
console.log('\n\n' + '▓'.repeat(70));
console.log('▓ TEST SUITE 13: COMPLEX NESTED EXPRESSIONS');
console.log('▓'.repeat(70));

state = createFreshState();
const complex1 = new BinaryExpressionNode(
  new BinaryExpressionNode(
    new NumberLiteralExpressionNode("10", createToken("10")),
    "+",
    new NumberLiteralExpressionNode("5", createToken("5")),
    createToken("+")
  ),
  "*",
  new NumberLiteralExpressionNode("2", createToken("2")),
  createToken("*")
);
executeAndShow(complex1.evaluate(), state, "Nested Arithmetic: (10 + 5) * 2");

state = createFreshState();
const complex2 = new ComparisonExpressionNode(
  new BinaryExpressionNode(
    new NumberLiteralExpressionNode("10", createToken("10")),
    "+",
    new NumberLiteralExpressionNode("5", createToken("5")),
    createToken("+")
  ),
  ">",
  new NumberLiteralExpressionNode("10", createToken("10"))
);
executeAndShow(complex2.evaluate(), state, "Comparison with Arithmetic: (10 + 5) > 10");

// ============================================================================
// TEST 14: Direct Command Testing
// ============================================================================
console.log('\n\n' + '▓'.repeat(70));
console.log('▓ TEST SUITE 14: DIRECT COMMAND TESTING');
console.log('▓'.repeat(70));

state = createFreshState();
const pushCmd = new PushValueCommand(100);
executeAndShow([pushCmd], state, "PushValueCommand: Push 100");

state = createFreshState();
state.evaluationStack.push(42);
const popCmd = new PopValueCommand();
console.log('\n' + '='.repeat(60));
console.log('TEST: PopValueCommand: Pop value');
console.log('='.repeat(60));
console.log('\nBefore pop - Stack:', state.evaluationStack);
const popped = popCmd.do(state);
console.log('After pop - Stack:', state.evaluationStack);
console.log('Popped value:', popped);

state = createFreshState();
state.evaluationStack.push(50);
const assignCmd = new AssignVariableCommand("myvar");
executeAndShow([assignCmd], state, "AssignVariableCommand: Assign myvar = 50");

while (state.evaluationStack.length > 0) {
  state.evaluationStack.pop();
}
const retrieveCmd = new RetrieveValueCommand("myvar");
executeAndShow([retrieveCmd], state, "RetrieveValueCommand: Retrieve myvar");

// ============================================================================
// FINAL SUMMARY
// ============================================================================
console.log('\n\n' + '█'.repeat(70));
console.log('█' + ' '.repeat(68) + '█');
console.log('█' + '  TEST SUITE COMPLETE!'.padEnd(68) + '█');
console.log('█' + '  All expression evaluations and commands have been tested.'.padEnd(68) + '█');
console.log('█' + ' '.repeat(68) + '█');
console.log('█'.repeat(70) + '\n');