import * as moo from "moo";
import {
  Command,
  AssignVariableCommand,
  PushValueCommand,
  PopValueCommand,
  HighlightExpressionCommand,
  RetrieveValueCommand,
  MoveLinePointerCommand,
  HighlightStatementCommand,
  ReplaceHighlightedExpressionCommand,
  BinaryOpCommand,
  ComparisonOpCommand,
  UnaryOpCommand,
  ConditionalJumpCommand,
  JumpCommand,
  EnterScopeCommand,
  ExitScopeCommand,
  PrintCommand,
  LenCommand,
  TypeCommand,
  InputCommand,
  IndexAccessCommand,
  CreateListCommand,
  ReturnCommand,
  BreakCommand,
  ContinueCommand,
  ListSliceCommand,
  PushLoopBoundsCommand,
  PopLoopBoundsCommand,
  AppendCommand,
  CountCommand,
  PopCommand,
  SortCommand,
  RemoveCommand,
  IndexCommand,
  ReverseCommand,
  ContainsCommand,
  CallUserFunctionCommand,
  RangeCommand,
  IntCommand,
  FloatCommand,
  StrCommand,
  BoolCommand,
  ListCommand,
  DefineFunctionCommand,
  InterpolateFStringCommand,
} from "./Interpreter";

export type Assignable = AssignmentStatementNode;
export type PythonValue =
  | number
  | string
  | PythonValue[]
  | Function
  | boolean
  | Object
  | null;
export type BinaryOp = "+" | "-" | "*" | "%" | "/" | "//" | "and" | "or" | "**";
export type ComparisonOp = "<" | ">" | "<=" | ">=" | "!=" | "==";
export type UnaryOp = "-" | "+" | "!" | "not";
export interface UserFunction {
  name: string;
  params: string[]; // names of the parameters
  body: Command[]; // commands that make up the function body
  type: "Function";
}

// -----------------------------------------------------------------------------------------------------------
// COMMON ERRORS:
// "Cannot read properties of undefined (reading _tok)" -> accessing an undefined or null's token.
// -----------------------------------------------------------------------------------------------------------

// -----------------------------------------------------------------------------------------------------------
// References:
// https://craftinginterpreters.com/statements-and-state.html
// -----------------------------------------------------------------------------------------------------------

// ------------------------------------------------------------------
// ProgramNode
//
// Establishes list of statements that make up the program, encapsulates the
// entire program. All commands collectively get added here to returned array here.
// ------------------------------------------------------------------

export class ProgramNode {
  private _statementList: StatementNode[];
  constructor(_statementList: StatementNode[]) {
    this._statementList = _statementList;
  }

  execute(): Command[] {
    const commands: Command[] = [];
    for (const statement of this._statementList) {
      commands.push(...statement.execute());
    }
    return commands;
  }
}

// ------------------------------------------------------------------
// Statement Nodes
// ------------------------------------------------------------------

// Statement Node is the base class for all statement type nodes.
export abstract class StatementNode {
  abstract execute(): Command[];
  public _startTok: moo.Token;
  public _endTok: moo.Token;
  constructor(_tok: moo.Token) {
    this._startTok = _tok;
    this._endTok = _tok;
  }
  public get lineNum() {
    return this._startTok.line;
  }
  public get startLine() {
    return this._startTok.line;
  }
  public get endLine() {
    return this._endTok.line || this._startTok.line;
  }
}

export class AssignmentStatementNode extends StatementNode {
  private _left: string | ListAccessExpressionNode; // variable name
  private _right: ExpressionNode; // value
  public _tok: moo.Token;
  constructor(
    _left: string | ListAccessExpressionNode,
    _right: ExpressionNode,
    _tok: moo.Token,
  ) {
    super(_tok);
    this._left = _left;
    this._right = _right;
    this._tok = _tok;
  }

  execute(): Command[] {
    const commands: Command[] = [];
    commands.push(new HighlightStatementCommand(this)); // Highlight
    if (this._left instanceof ListAccessExpressionNode) {
      commands.push(...this._left._list.evaluate()); // pushes list
      commands.push(...this._left._index.evaluate()); // pushes index
      commands.push(...this._right.evaluate()); // evaluate (which may generate an array of commands, hence the spread operator)
      commands.push(new AssignVariableCommand(this._left)); // Bind variable.
    } else {
      commands.push(...this._right.evaluate());
      commands.push(new AssignVariableCommand(this._left as string));
    }
    return commands;
  }
}

export class ReturnStatementNode extends StatementNode {
  private _value: ExpressionNode | null; // value by default should be null.
  private _previousVariables: Map<string, PythonValue>;
  constructor(
    _value: ExpressionNode,
    _previousVariables: Map<string, PythonValue>,
    _tok: moo.Token,
  ) {
    super(_tok);
    this._previousVariables = _previousVariables;
    this._value = _value;
  }
  execute(): Command[] {
    const commands: Command[] = [];

    commands.push(new HighlightStatementCommand(this)); // highlight entire statement
    if (this._value) {
      // value not null
      commands.push(...this._value.evaluate());
    } else {
      commands.push(new PushValueCommand(null));
    }
    // commands.push(new ExitScopeCommand(this._previousVariables));
    commands.push(new ReturnCommand());
    return commands;
  }
}

export class BreakStatementNode extends StatementNode {
  public _tok: moo.Token;
  constructor(_tok: moo.Token) {
    super(_tok);
    this._tok = _tok;
  }
  execute(): Command[] {
    const commands: Command[] = [];
    commands.push(new HighlightStatementCommand(this));
    // Break statement itself should jump out of current loop and go to the next enclosing loop.
    // I may need some additional context about how deep loops may be nested, which the parser knows but
    // I do not here.
    commands.push(new BreakCommand());
    return commands;
  }
}

export class ContinueStatementNode extends StatementNode {
  private _tok: moo.Token;
  constructor(_tok: moo.Token) {
    super(_tok);
    this._tok = _tok;
  }
  execute(): Command[] {
    const commands: Command[] = [];
    commands.push(new HighlightStatementCommand(this));
    commands.push(new ContinueCommand());
    return commands;
  }
}

export class PassStatementNode extends StatementNode {
  private _tok: moo.Token;
  constructor(_tok: moo.Token) {
    super(_tok);
    this._tok = _tok;
  }
  execute(): Command[] {
    const commands: Command[] = [];
    commands.push(new HighlightStatementCommand(this));
    // commands.push(new MoveLinePointerCommand(this._tok.line)); // Move line pointer to token itself (the statement)
    return commands;
  }
}

export class IfStatementNode extends StatementNode {
  private _condition: ExpressionNode;
  private _thenBranch: BlockStatementNode;
  private _elseBranch: BlockStatementNode | null;
  constructor(
    _condition: ExpressionNode,
    _thenBranch: BlockStatementNode,
    _elseBranch: BlockStatementNode | null,
    _tok: moo.Token,
  ) {
    super(_tok);
    this._condition = _condition;
    this._thenBranch = _thenBranch;
    this._elseBranch = _elseBranch;
  }
  execute(): Command[] {
    const commands: Command[] = [];
    commands.push(new HighlightStatementCommand(this));

    let conditionCommands: Command[] = this._condition.evaluate();
    commands.push(...conditionCommands);

    let thenCommands: Command[] = this._thenBranch.execute();
    let elseCommands: Command[] = [];
    if (this._elseBranch) {
      elseCommands = this._elseBranch.execute();
    }
    if (elseCommands.length > 0) {
      // has an else: jump over then branch + the jump command after it
      commands.push(new ConditionalJumpCommand(thenCommands.length + 2));
    } else {
      // no else: just jump over the then branch
      commands.push(new ConditionalJumpCommand(thenCommands.length + 1));
    }

    commands.push(...thenCommands); // have to spread these since we are pushing multiple.

    if (elseCommands.length > 0) {
      // has an else: jump over then branch + the jump command after it
      commands.push(new JumpCommand(elseCommands.length + 1));
      commands.push(...elseCommands);
    }

    return commands;
  }
}

export class ElifStatementNode extends StatementNode {
  private _condition: ExpressionNode;
  private _thenBranch: BlockStatementNode | null;
  private _elseBranch: BlockStatementNode | null;
  constructor(
    _condition: ExpressionNode,
    _thenBranch: BlockStatementNode,
    _elseBranch: BlockStatementNode,
    _tok: moo.Token,
  ) {
    super(_tok);
    this._condition = _condition;
    this._thenBranch = _thenBranch;
    this._elseBranch = _elseBranch;
  }
  execute(): Command[] {
    const commands: Command[] = [];
    commands.push(new HighlightStatementCommand(this));

    let conditionCommands: Command[] = this._condition.evaluate();
    commands.push(...conditionCommands);

    let thenCommands: Command[] = this._thenBranch!.execute();
    let elseCommands: Command[] = [];

    if (this._elseBranch) {
      elseCommands = this._elseBranch.execute();
    }

    // if condition is false, jump over then branch
    if (elseCommands.length > 0) {
      // has more elif/else: jump over then branch + the jump command after it
      commands.push(new ConditionalJumpCommand(thenCommands.length + 2));
    } else {
      // no more elif/else: just jump over then branch
      commands.push(new ConditionalJumpCommand(thenCommands.length + 1));
    }

    commands.push(...thenCommands);

    // if we executed then branch, jump over remaining elif/else
    if (elseCommands.length > 0) {
      commands.push(new JumpCommand(elseCommands.length + 1));
      commands.push(...elseCommands);
    }

    return commands;
  }
}

export class ForStatementNode extends StatementNode {
  private _loopVar: IdentifierExpressionNode;
  private _iterable: ExpressionNode;
  private _block: BlockStatementNode;
  constructor(
    _loopVar: IdentifierExpressionNode,
    _iterable: ExpressionNode,
    _block: BlockStatementNode,
    _tok: moo.Token,
  ) {
    super(_tok);
    this._loopVar = _loopVar;
    this._iterable = _iterable;
    this._block = _block;
  }
  execute(): Command[] {
    // Loop Structure:
    // 1. Evaluate iterable
    // 2. Push loop bounds
    // 3. check if there is a next item
    // 4. Conditionally jump based on boolean from stack that signals if the condition was true or not (in a for loops case, if there is a next item to iterate) (if false, we jump forward three commands to signal end of loop)
    // 5. Retreive the value of next item
    // 6. Execute body
    // 7. Jump back to step 3.
    // 8. once loop is finished, pop loop bounds.

    const commands: Command[] = [];
    commands.push(new HighlightStatementCommand(this));
    // evaluate iterable and then push onto stack
    let iterableCommands: Command[] = this._iterable.evaluate();
    commands.push(...iterableCommands);

    const blockCommands = this._block.execute();
    // + 3 accounts for commands "above" this one: the whole statement highlight, the iterable hghlight, and the push value for the iterable.
    commands.push(
      new PushLoopBoundsCommand(
        0,
        1 + iterableCommands.length + blockCommands.length,
      ),
    );
    // Iterable now on stack, so we want to assign the loopvar to whatever it evaluated to on the stack.
    // Then, we conidtionally jump. ( + 2 is to account for the commands below)
    commands.push(new AssignVariableCommand(this._loopVar._tok.text));
    commands.push(new ConditionalJumpCommand(blockCommands.length + 2));
    // execute the loop body
    commands.push(...blockCommands);
    // jump back up to loop condition check (we get original start value and just negate it to go back)
    // We are jumping to AssignVariableCommand to get the next item/value in the list.
    commands.push(new JumpCommand(-(blockCommands.length + 2)));

    // since we are now done, we can pop loop bounds.
    commands.push(new PopLoopBoundsCommand());
    return commands;
  }
}

export class WhileStatementNode extends StatementNode {
  private _expression: ExpressionNode;
  private _block: BlockStatementNode;
  constructor(
    _expression: ExpressionNode,
    _block: BlockStatementNode,
    _tok: moo.Token,
  ) {
    super(_tok);
    this._expression = _expression;
    this._block = _block;
  }
  execute(): Command[] {
    const commands: Command[] = [];
    commands.push(new HighlightStatementCommand(this));
    const blockCommands = this._block.execute();
    const conditionCommands = this._expression.evaluate();

    commands.push(
      new PushLoopBoundsCommand(
        0,
        blockCommands.length + conditionCommands.length + 2,
      ),
    );

    commands.push(...conditionCommands);
    // if condition is false, jump to end
    commands.push(new ConditionalJumpCommand(blockCommands.length + 2));
    // execute block commands
    commands.push(...blockCommands);
    // jump back to condition check
    commands.push(
      new JumpCommand(-(blockCommands.length + conditionCommands.length + 1)),
    );

    // finally, pop loop bounds
    commands.push(new PopLoopBoundsCommand());
    return commands;
  }
}

export class FuncDefStatementNode extends StatementNode {
  private _name: IdentifierExpressionNode;
  private _formalParamList: FormalParamsListExpressionNode | null;
  private _block: BlockStatementNode;

  constructor(
    _name: IdentifierExpressionNode,
    _formalParamList: FormalParamsListExpressionNode,
    _block: BlockStatementNode,
    _tok: moo.Token,
  ) {
    super(_tok);
    this._name = _name;
    this._formalParamList = _formalParamList;
    this._block = _block;
  }

  execute(): Command[] {
    const commands: Command[] = [];
    commands.push(new HighlightStatementCommand(this));

    // extract the parameter names
    const paramNames: string[] = [];
    if (this._formalParamList && this._formalParamList._paramsList) {
      for (const param of this._formalParamList._paramsList) {
        paramNames.push(param._tok.text);
      }
    }
    // console.log("Function params:", paramNames);
    // get function body commands
    const blockCommands = this._block.execute();

    // create the function object
    const functionObj: UserFunction = {
      name: this._name._tok.text,
      params: paramNames,
      body: blockCommands,
      type: "Function",
    };

    // define the function in state
    commands.push(new DefineFunctionCommand(functionObj));

    return commands;
  }
}

export class ExpressionStatementNode extends StatementNode {
  private _expression: ExpressionNode;
  constructor(_expression: ExpressionNode, _tok: moo.Token) {
    super(_tok);
    this._expression = _expression;
  }
  execute(): Command[] {
    const commands: Command[] = [];
    commands.push(new HighlightStatementCommand(this));
    commands.push(...this._expression.evaluate());
    // commands.push(new PopValueCommand()); // do we really need to store the result since the expression is part of the statement, would that not be handled separately?
    // only pop for func call expressions, let
    // if (this._expression instanceof FuncCallExpressionNode) {
    //   commands.push(new PopValueCommand());
    // }

    return commands;
  }
}

export class BlockStatementNode extends StatementNode {
  private _statementList: StatementNode[];
  constructor(_statementList: StatementNode[], _tok: moo.Token) {
    super(_tok);
    this._statementList = _statementList;
  }
  execute(): Command[] {
    const commands: Command[] = [];
    for (const statement of this._statementList) {
      commands.push(...statement.execute());
    }
    return commands;
  }
}

// ------------------------------------------------------------------
// Expression Nodes
// ------------------------------------------------------------------

/*
EXPRESSION NODE BASE CLASS

*/
export abstract class ExpressionNode {
  public _tok: moo.Token;
  constructor(_tok: moo.Token) {
    this._tok = _tok;
  }
  abstract evaluate(): Command[];
  public get lineNum() {
    return this._tok.line;
  }
  public get startLine() {
    return this._tok.line;
  }
  public get endLine() {
    return this._tok.line;
  }
  public get startCol() {
    return this._tok.col;
  }
  public get endCol() {
    return this._tok.col + (this._tok.text.length - 1);
  }
}

/*
NUMBER LITERAL EXPRESSION NODE

Handles:
  - 5, 102, 68, etc...
*/
export class NumberLiteralExpressionNode extends ExpressionNode {
  private _value: string;
  constructor(value: string, tok: moo.Token) {
    super(tok);
    this._value = value;
  }

  evaluate(): Command[] {
    const commands: Command[] = [];

    let numValue: number;
    if (this._value.startsWith("0x")) {
      // hexadecimal
      numValue = parseInt(this._value, 16);
    } else if (this._value.startsWith("0b")) {
      // binary
      numValue = parseInt(this._value.slice(2), 2);
    } else if (this._value.includes(".")) {
      // float
      numValue = parseFloat(this._value);
    } else {
      numValue = Number(this._value); // regular integer, base 10.
    }
    commands.push(new HighlightExpressionCommand(this));
    commands.push(new PushValueCommand(numValue));
    return commands;
  }
}

export class IdentifierExpressionNode extends ExpressionNode {
  public _tok: moo.Token;
  constructor(_tok: moo.Token) {
    super(_tok);
    this._tok = _tok;
  }
  evaluate(): Command[] {
    const commands: Command[] = [];
    commands.push(new HighlightExpressionCommand(this)); // highlight, no need for replace.
    commands.push(new RetrieveValueCommand(this._tok.text));
    return commands;
  }
}

export class FormalParamsListExpressionNode extends ExpressionNode {
  public _paramsList: IdentifierExpressionNode[];
  constructor(_paramsList: IdentifierExpressionNode[]) {
    // need to check if array is empty, probably need to do this for arg list too.
    if (
      _paramsList === null ||
      _paramsList === undefined ||
      _paramsList.length === 0
    ) {
      const dummy = {
        line: 0,
        col: 0,
        text: "",
        type: "",
        value: "",
      } as moo.Token;
      super(dummy); // pass empty token in here.
      this._paramsList = []; // nothing there.
    } else {
      super(_paramsList[0]._tok);
      this._paramsList = _paramsList;
    }
  }
  evaluate(): Command[] {
    const commands: Command[] = [];
    for (const param of this._paramsList) {
      commands.push(...param.evaluate());
    }
    return commands;
  }
  //  override public get endLine() {
  //   return this._paramsList[this._paramsList.length - 1]._tok.line
  // }
  //  override public get endCol() {
  //   let _lastTok = this._paramsList[this._paramsList.length - 1]._tok;
  //   return _lastTok.col + (_lastTok.text.length - 1);
  // }
}

/*
CONDITIONAL EXPRESSION NODE

Handles:
- If-Else
- If-Else-If
- If-Else-If-Else
*/

export class ConditionalExpressionNode extends ExpressionNode {
  private _left: ExpressionNode;
  private _condition: ExpressionNode;
  private _right: ExpressionNode;
  constructor(
    _left: ExpressionNode,
    _condition: ExpressionNode,
    _right: ExpressionNode,
  ) {
    super(_condition._tok); // pass conditions token.
    this._left = _left;
    this._condition = _condition;
    this._right = _right;
  }
  evaluate(): Command[] {
    const commands: Command[] = [];
    commands.push(...this._condition.evaluate());
    commands.push(...this._left.evaluate());
    commands.push(...this._right.evaluate());
    return commands;
  }
}

export class ArgListExpressionNode extends ExpressionNode {
  private _argsList: ExpressionNode[];
  constructor(_argsList: ExpressionNode[]) {
    if (
      _argsList === null ||
      _argsList === undefined ||
      _argsList.length === 0
    ) {
      const dummy = {
        line: 0,
        col: 0,
        text: "",
        type: "",
        value: "",
      } as moo.Token;
      super(dummy); // pass empty token in here.
      this._argsList = []; // nothing there.
    } else {
      super(_argsList[0]._tok);
      this._argsList = _argsList;
    }
  }

  get length(): number {
    return this._argsList.length;
  }

  get args(): ExpressionNode[] {
    return this._argsList;
  }

  evaluate(): Command[] {
    const commands: Command[] = [];
    for (const arg of this._argsList) {
      commands.push(...arg.evaluate());
    }
    return commands;
  }
}

/*
COMPARISON EXPRESSION NODE

Handles:
  - 5 < 10, x > y, x >= 1, x != 0, and so on.

*/

export class ComparisonExpressionNode extends ExpressionNode {
  private _left: ExpressionNode;
  private _operator: ComparisonOp;
  private _right: ExpressionNode;

  constructor(
    _left: ExpressionNode,
    _operator: ComparisonOp,
    _right: ExpressionNode,
  ) {
    super(_left._tok);
    this._left = _left;
    this._operator = _operator;
    this._right = _right;
  }
  evaluate(): Command[] {
    const commands: Command[] = [];
    commands.push(new HighlightExpressionCommand(this));
    commands.push(...this._left.evaluate());
    commands.push(...this._right.evaluate());
    commands.push(new ComparisonOpCommand(this._operator));
    return commands;
  }
}

export class BinaryExpressionNode extends ExpressionNode {
  private _left: ExpressionNode;
  private _operator: BinaryOp;
  private _right: ExpressionNode;

  constructor(
    _left: ExpressionNode,
    _operator: BinaryOp,
    _right: ExpressionNode,
    _tok: moo.Token,
  ) {
    super(_tok);
    this._left = _left;
    this._operator = _operator;
    this._right = _right;
  }
  evaluate(): Command[] {
    const commands: Command[] = [];
    commands.push(new HighlightExpressionCommand(this));
    commands.push(...this._left.evaluate());
    commands.push(...this._right.evaluate());
    commands.push(new BinaryOpCommand(this._operator));
    return commands;
  }
}

export class UnaryExpressionNode extends ExpressionNode {
  private _operator: UnaryOp;
  private _operand: ExpressionNode;
  constructor(_operator: UnaryOp, _operand: ExpressionNode, _tok: moo.Token) {
    super(_tok);
    this._operator = _operator;
    this._operand = _operand;
  }
  evaluate(): Command[] {
    const commands: Command[] = [];
    commands.push(new HighlightExpressionCommand(this));
    commands.push(...this._operand.evaluate());
    commands.push(new UnaryOpCommand(this._operator));
    return commands;
  }
}

export class FuncCallExpressionNode extends ExpressionNode {
  private _func_name: ExpressionNode;
  private _args_list: ArgListExpressionNode;
  constructor(_func_name: ExpressionNode, _args_list: ArgListExpressionNode) {
    super(_func_name._tok);
    this._func_name = _func_name;
    this._args_list = _args_list;
  }
  evaluate(): Command[] {
    const commands: Command[] = [];
    commands.push(new HighlightExpressionCommand(this));
    if (this._args_list) {
      commands.push(...this._args_list.evaluate());
    }

    const numArgs = this._args_list ? this._args_list.length : 0;

    // Grab function name and then deal with whatever we get. Built in functions first, then user defined after.

    // if function name is an identifier.
    if (this._func_name instanceof IdentifierExpressionNode) {
      const funcName = this._func_name._tok.text;
      if (funcName === "print") {
        commands.push(new PrintCommand());
        return commands;
      } else if (funcName === "len") {
        commands.push(new LenCommand());
        return commands;
      } else if (funcName === "type") {
        commands.push(new TypeCommand());
        return commands;
      } else if (funcName === "input") {
        commands.push(new InputCommand());
        return commands;
      } else if (funcName === "range") {
        commands.push(new RangeCommand(numArgs));
        return commands;
      } else if (funcName === "int") {
        commands.push(new IntCommand());
        return commands;
      } else if (funcName === "float") {
        commands.push(new FloatCommand());
        return commands;
      } else if (funcName === "str") {
        commands.push(new StrCommand());
        return commands;
      } else if (funcName === "bool") {
        commands.push(new BoolCommand());
        return commands;
      } else if (funcName === "list") {
        commands.push(new ListCommand());
        return commands;
      }
    }

    // if it is not a built-in func, it's user-defined.
    if (this._func_name instanceof IdentifierExpressionNode) {
      const funcName = this._func_name._tok.text;
      commands.push(new CallUserFunctionCommand(funcName, numArgs));
      return commands;
    }
  }
}

/*
LIST ACCESS EXPRESSION NODE

Handles:
  - arr[2], nums[i], etc...
*/
export class ListAccessExpressionNode extends ExpressionNode {
  public _list: IdentifierExpressionNode;
  public _index: ExpressionNode;
  constructor(_list: IdentifierExpressionNode, _index: ExpressionNode) {
    super(_list._tok);
    this._list = _list;
    this._index = _index;
  }
  evaluate(): Command[] {
    const commands: Command[] = [];
    commands.push(new HighlightExpressionCommand(this));
    commands.push(...this._list.evaluate());
    commands.push(...this._index.evaluate());
    commands.push(new IndexAccessCommand());
    return commands;
  }
}

/*

 */
export class MethodCallExpressionNode extends ExpressionNode {
  private _list: ListLiteralExpressionNode;
  private _methodName: IdentifierExpressionNode;
  private _argsList: ArgListExpressionNode;
  constructor(
    _list: ListLiteralExpressionNode,
    _methodName: IdentifierExpressionNode,
    _argsList: ArgListExpressionNode,
  ) {
    super(_list._tok);
    this._list = _list;
    this._methodName = _methodName;
    this._argsList = _argsList;
  }
  evaluate(): Command[] {
    const commands: Command[] = [];
    commands.push(new HighlightExpressionCommand(this));
    if (this._list) {
      commands.push(...this._list.evaluate());
    }
    if (this._argsList) {
      commands.push(...this._argsList.evaluate());
    }
    // append, count, pop, remove, sort
    if (this._methodName instanceof IdentifierExpressionNode) {
      const methodName = this._methodName._tok.text;
      if (methodName === "append") {
        commands.push(new AppendCommand());
      } else if (methodName === "count") {
        commands.push(new CountCommand()); // returning undefined.
      } else if (methodName === "pop") {
        commands.push(new PopCommand()); // printing undefined
      } else if (methodName === "remove") {
        commands.push(new RemoveCommand());
      } else if (methodName === "sort") {
        commands.push(new SortCommand()); // giving undefined
      } else if (methodName === "index") {
        commands.push(new IndexCommand());
      } else if (methodName === "reverse") {
        commands.push(new ReverseCommand()); // giving undefined
      } else if (methodName === "contains") {
        commands.push(new ContainsCommand());
      }
    }
    return commands;
  }
}

export class ListSliceExpressionNode extends ExpressionNode {
  private _list: ExpressionNode;
  private _start: ExpressionNode;
  private _stop: ExpressionNode;
  private _step: ExpressionNode;
  constructor(
    _list: ExpressionNode,
    _start: ExpressionNode,
    _stop: ExpressionNode,
    _step: ExpressionNode,
  ) {
    super(_list._tok);
    this._list = _list;
    this._start = _start;
    this._stop = _stop;
    this._step = _step;
  }
  evaluate(): Command[] {
    const commands: Command[] = [];
    commands.push(new HighlightExpressionCommand(this));
    commands.push(...this._list.evaluate());

    // if start exists, if stop exists, if step exists, otherwise push a null value and handle accordingly.
    if (this._start) {
      commands.push(...this._start.evaluate());
    } else {
      commands.push(new PushValueCommand(null));
    }

    if (this._stop) {
      commands.push(...this._stop.evaluate());
    } else {
      commands.push(new PushValueCommand(null));
    }

    if (this._step) {
      commands.push(...this._step.evaluate());
    } else {
      commands.push(new PushValueCommand(null));
    }

    commands.push(new ListSliceCommand());
    return commands;
  }
}

/*
LIST LITERAL EXPRESSION NODE

Handles:
  - [1, 2, 3], [1, x, y, 5, 2], [], etc...
*/

export class ListLiteralExpressionNode extends ExpressionNode {
  private _values: ArgListExpressionNode;
  constructor(_values: ArgListExpressionNode, _tok: moo.Token) {
    super(_tok);
    this._values = _values;
  }
  evaluate(): Command[] {
    const commands: Command[] = [];
    commands.push(new HighlightExpressionCommand(this));
    // if values empty, no values to push or evaluate.
    if (this._values) {
      commands.push(...this._values.evaluate());
    }
    // count values so we know how many elements to pop off stack.
    let count = this._values ? this._values.length : 0; // null check in case arg list is empty
    commands.push(new CreateListCommand(count));
    return commands;
  }
}

export class BooleanLiteralExpressionNode extends ExpressionNode {
  private _value: boolean;
  constructor(_value: boolean, _tok: moo.Token) {
    super(_tok);
    this._value = Boolean(_value);
  }
  evaluate(): Command[] {
    const commands: Command[] = [];
    commands.push(new HighlightExpressionCommand(this));
    commands.push(new PushValueCommand(Boolean(this._value)));
    return commands;
  }
}

export class StringLiteralExpressionNode extends ExpressionNode {
  private _value: moo.Token;
  constructor(_value: moo.Token) {
    super(_value);
    this._value = _value;
  }
  evaluate(): Command[] {
    const commands: Command[] = [];
    commands.push(new HighlightExpressionCommand(this)); // highlight
    let text = this._value.text;
    if (
      // needed to remove surrounding quotes, there was some double wrapping.
      (text.startsWith('"') && text.endsWith('"')) ||
      (text.startsWith("'") && text.endsWith("'"))
    ) {
      text = text.slice(1, -1); // remove front quote and back quote to "clean" string
    }
    commands.push(new PushValueCommand(text));
    // new ReplaceHighlightedExpressionCommand(this, new EvaluatedExpressionNode(this._value)) // replace
    return commands;
  }
}

export class EvaluatedExpressionNode extends ExpressionNode {
  private _value: PythonValue | PythonValue[] | ExpressionNode;
  constructor(
    _value: PythonValue | PythonValue[] | ExpressionNode,
    _tok: moo.Token,
  ) {
    super(_tok);
    this._value = _value;
  }
  evaluate(): Command[] {
    const commands: Command[] = [];
    // commands.push(new PushValueCommand(this._value));
    // TODO: figure out what to do with this node.
    return commands;
  }
}

export class FStringLiteralExpressionNode extends ExpressionNode {
  private _value: moo.Token;
  constructor(_value: moo.Token) {
    super(_value);
    this._value = _value;
  }

  evaluate(): Command[] {
    const commands: Command[] = [];
    commands.push(new HighlightExpressionCommand(this));

    let text = this._value.text;

    // remove f prefix and quotes
    if (text.startsWith("f'") || text.startsWith('f"')) {
      text = text.slice(2, -1); // remove f' and trailing quote
    }

    // parse and replace {variable} with actual values
    commands.push(new InterpolateFStringCommand(text));

    return commands;
  }
}
