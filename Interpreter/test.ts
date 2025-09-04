
import { State, PushValueCommand, AssignVariableCommand } from './Interpreter';

function createState() {
    return new State(0, 0, null as any, [], [], new Map(), [], 1, []);
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

}

simpleTest();