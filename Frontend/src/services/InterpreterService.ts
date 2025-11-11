// const grammar = require("../../../Parser/grammar.js");
import { default as grammar } from "../../../Parser/grammar";
import nearley from "nearley";

import { State, Command } from "../../../Parser/Interpreter";
import { ProgramNode } from "../../../Parser/Nodes";
import type { SimplifiedState } from "../App";

export class InterpreterService {
  private commands: Command[] = [];
  private state: State;
  private currentStep: number = 0;
  private outputs: string[] = [];

  constructor() {
    this.state = new State(
      0, // programCounter
      0, // lineCount
      null, // currentExpression
      null, // currentStatement
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
    console.log("parser created");

    console.log("about to feed stuff");
    parser.feed(code);
    console.log("parser is fed");
    // if parse results are 0, code did not parse.
    if (parser.results.length === 0) {
      return false;
    }

    // initialize program itself, commands via executing the program, setting currentStep to start at 0.
    const program: ProgramNode = parser.results[0];
    this.commands = program.execute();
    console.log(this.commands);
    this.currentStep = 0;
    this.state = new State(0, 0, null, null, [], [], new Map(), 1, [], [], []);
    this.outputs = [];

    return true;
  }

  stepForward(): boolean {
    // if current step execeeds commands length, we are out of bounds.
    if (this.currentStep >= this.commands.length) {
      return false; // no more steps
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
    return true;
  }
  // returns a modified state snapshot that we can then send to the UI with only things is cares about.
  getState(): SimplifiedState {
    return {
      variables: Object.fromEntries(this.state.variables),
      currentLine: this.state.currentLine,
      // currentExpression: this.state.currentExpression,
      outputs: this.outputs,
      canStepForward: this.currentStep < this.commands.length, // are there any more steps remaining?
      canStepBackward: this.currentStep > 0, // are we out of bounds?
      currentStep: this.currentStep,
      totalSteps: this.commands.length,
    };
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
