// References:
// https://medium.com/@alessandro.traversi/understanding-the-command-design-pattern-in-typescript-1d2ee3615da8
// https://refactoring.guru/design-patterns/command

// Command: interface that tells us how to carry out an operation.
// Each step that needs to be executed.
interface Command {
  execute(): void;
}

// Receiver: component that knows how to perform operations.
class Interpreter {
  public HandleAssignmentStatementCommand() {
    console.log("this is an assignment statement for testing");
  }
}

// Sender/Invoker: initiates requests, triggers command instead of sending request to receiver directly.



// Commands: 

class AssignmentStatementCommand implements Command {
  private interpreter: Interpreter; // reference to Interpreter (receiver)
  private var: String; // variable name
  private value: Number; // value to be connected to variable

  constructor(interpreter: Interpreter, var: String, value: Number) {
    this.interpreter = interpreter;
    this.var = var;
    this.value = value;
  } 

  public execute() {
    HandleAssignmentStatementCommand(); // placeholder for logic in Interpreter when encountered with an assignment statement
  }
}

// QUESTIONS:
// 1. Create a command for each specific rule?
// 2. What to do for invoker?
// 3. Ask to go over structure and how things work.
