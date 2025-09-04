
import { State, PushValueCommand, AssignVariableCommand, ChangeVariableCommand, IncrementProgramCounterCommand } from './Interpreter';

function createState() {
    return new State(1, 0, null as any, [], [], new Map(), [], 1, []);
}

function simpleTest() {
  const state = createState();

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

}

simpleTest();