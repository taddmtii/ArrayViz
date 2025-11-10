import grammar from "../../../Parser/grammar.js";
import { State, Command } from "../../../Parser/Interpreter.js";
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
}
