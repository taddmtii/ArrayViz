// const grammar = require("../../../Parser/grammar.js");
import { default as grammar } from "../../../Parser/grammar";
import nearley from "nearley";
import { InterpreterError } from "../../../Parser/Errors";
import { State, Command } from "../../../Parser/Interpreter";
import { ProgramNode } from "../../../Parser/Nodes";
import type { SimplifiedState } from "../App";

export class InterpreterService {
  private commands: Command[] = [];
  private state: State;
  private currentStep: number = 0;

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
      [], // outputs
      new Map(),
    );
  }

  setPredictMode(enabled: boolean) {
    this.state.isPredictMode = enabled;
  }

  parseCode(code: string): boolean {
    try {
      const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
      parser.feed(code + "\n");
      // if parse results are 0, code did not parse.
      if (parser.results.length === 0) {
        return false;
      }

      // initialize program itself, commands via executing the program, setting currentStep to start at 0.
      const program: ProgramNode = parser.results[0];
      console.log(program);
      this.commands = program.execute();
      console.log(this.commands);
      this.currentStep = 0;
      const savedPredictMode = this.state.isPredictMode;

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
        [], // outputs
        new Map(), // loopIterationState
        null, // error
        new Map(), // functionDefinitions
        [new Map()], // scopeStack
        ["Global"], // scopeNames
        savedPredictMode, // isPredictMode
        false, // waitingForPrediction
        null, // predictionVariable
        null, // predictionCorrectValue
      );

      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  stepForward(): boolean {
    if (this.state.programCounter >= this.commands.length) {
      return false;
    }
    if (this.state.error) {
      return false;
    }

    const command = this.commands[this.state.programCounter];

    try {
      command.do(this.state);

      if (!this.state.waitingForPrediction) {
        this.state.programCounter++;
        this.currentStep = this.state.programCounter;
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  // clears all prediction related state when we submit prediction.
  submitPrediction(variable: string, predictedValue: string): boolean {
    if (!this.state.waitingForPrediction) return false;

    this.state.waitingForPrediction = false;
    this.state.predictionVariable = null;
    this.state.predictionCorrectValue = null;

    this.state.programCounter++;
    this.currentStep = this.state.programCounter;

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

    return true;
  }
  // returns a modified state snapshot that we can then send to the UI with only things is cares about.
  getState(): SimplifiedState {
    const result = {
      variables: Object.fromEntries(this.state.variables),
      currentLine: this.state.currentLine,
      outputs: [...this.state.outputs],
      canStepForward: this.currentStep < this.commands.length,
      canStepBackward: this.currentStep > 0,
      currentStep: this.currentStep,
      totalSteps: this.commands.length,
      highlightedStatement: this.state.getCurrentStatementHighlight(),
      highlightedExpression: this.state.getCurrentExpressionHighlight(),
      functionDefinitions: this.state.functionDefinitions,
      error: this.state.error,
      waitingForPrediction: this.state.waitingForPrediction,
      predictionVariable: this.state.predictionVariable,
      predictionCorrectValue: this.state.predictionCorrectValue,
    };
    return result;
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
