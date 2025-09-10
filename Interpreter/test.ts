
import { State, PushValueCommand, AssignVariableCommand, ChangeVariableCommand, IncrementProgramCounterCommand, PrintCommand, CreateListCommand, LenCommand, InputCommand, ComparisonOpCommand } from './Interpreter';
import { AssignmentStatementNode, ExpressionNode, IdentifierExpressionNode } from './Nodes'

function createState() {
    return new State(1, 0, null as any, [], [], new Map(), [], 1, []);
}

function createMockToken() {
    return
}

function simpleTest() {
  let state = createState();
  let token = createMockToken();

  const pushCmd1 = new PushValueCommand(42);
  pushCmd1.do(state);
  const pushCmd2 = new PushValueCommand(51);
  pushCmd2.do(state);
  console.log("Stack has:", state.evaluationStack); 
  const assignCmd = new AssignVariableCommand("x");
  assignCmd.do(state);
  const assignCmd2 = new AssignVariableCommand("y");
  assignCmd2.do(state);
  console.log("Variable x =", state.getVariable("x"));
  console.log("Variable y =", state.getVariable("y"));
  console.log("Variables map: ", state.variables);
  console.log("Stack after assignment:", state.evaluationStack); 
  console.log("changing x's value to 12...");
  const changevarcmd = new ChangeVariableCommand("x", 12);
  changevarcmd.do(state);
  console.log("Variable x =", state.getVariable("x"));
  console.log("Variables map: ", state.variables);
  console.log("increment program counter, current: ", state.programCounter);
  const incrementpccmd = new IncrementProgramCounterCommand();
  incrementpccmd.do(state);
  console.log("PC now: ", state.programCounter);
  const printcmd = new PrintCommand("printable value");
  printcmd.do(state);
  const createlistcmd = new CreateListCommand("data", [1, 2, 3, 4, 5]);
  createlistcmd.do(state);
  console.log("Variables: ", state.variables);
  const lencommand = new LenCommand("hello there");
  lencommand.do(state);
  console.log("Length of the string should be 11: ", state.evaluationStack.pop());
  // const inputcommand = new InputCommand("Enter a number: ");
  // let ans = inputcommand.do(state);
  // console.log(ans);
  let left = state.evaluationStack.push(3);
  let right = state.evaluationStack.push(4);
  console.log("evaluation stack: ", state.evaluationStack);
  console.log("Left: ", state.evaluationStack.pop())
  console.log("Right: ", state.evaluationStack.pop());
  const compopcmd = new ComparisonOpCommand("!=");
  compopcmd.do(state);
  console.log("Comparison operand result between left and right is: ", state.evaluationStack.pop());
  let assignment_statement_node = new AssignmentStatementNode("Hello there!", new IdentifierExpressionNode(token));

}

simpleTest();