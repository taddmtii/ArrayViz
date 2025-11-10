// @ts-ignore
const grammar = require("../../../Parser/grammar.js");

import nearley from "nearley";
import { State, Command, PrintCommand } from "../../../Parser/Interpreter.js";
import { ProgramNode } from "../../../Parser/Nodes.js";

export class InterpreterService {
  private commands: Command[] = [];
  private state: State;
  private currentStep: number = 0;
  private outputs: string[] = [];

  constructor() {
    this.state = new State(
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

  // parse and compile the code.
  parseCode(code: string): boolean {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
    parser.feed(code);

    // if parse results are 0, code did not parse.
    if (parser.results.length === 0) {
      return false;
    }

    // initialize program itself, commands via executing the program, setting currentStep to start at 0.
    const program: ProgramNode = parser.results[0];
    this.commands = program.execute();
    this.currentStep = 0;
    this.state = new State(
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
      [],
    );
    this.outputs = [];

    return true;
  }

  stepForward(): boolean {
    // if current step execeeds commands length, we are out of bounds.
    if (this.currentStep >= this.commands.length) {
      return false;
    }

    // get current command based on current step.
    const command = this.commands[this.currentStep];

    // if we are printing, need to get that value from evaluation stack and then send to outputs array.
    if (command.constructor.name === "PrintCommand") {
      const value =
        this.state.evaluationStack[this.state.evaluationStack.length - 1];
      this.outputs.push(String(value));
    }

    command.do(this.state);
    this.currentStep++;
    this.state.programCounter++;

    return true;
  }

  stepBack(): boolean {
    if (this.currentStep <= 0) {
      return false;
    }

    this.currentStep--;
    const command = this.commands[this.currentStep];
    command.undo(this.state);
    this.state.programCounter--;

    if (command.constructor.name === "PrintCommand") {
      this.outputs.pop();
    }
  }

  toEnd(): void {
    while (this.stepForward()) {
      // empty
    }
  }

  toBeg(): void {
    while (this.stepBack()) {
      // empty
    }
  }
}
