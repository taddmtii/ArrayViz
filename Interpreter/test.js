"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Interpreter_1 = require("./Interpreter");
function createState() {
    return new Interpreter_1.State(0, 0, null, [], [], new Map(), [], 1, []);
}
function simpleTest() {
    var state = createState();
    // Create push value command.
    var pushCmd1 = new Interpreter_1.PushValueCommand(42);
    pushCmd1.do(state);
    var pushCmd2 = new Interpreter_1.PushValueCommand(51);
    pushCmd2.do(state);
    console.log("Stack has:", state.evaluationStack);
    var assignCmd = new Interpreter_1.AssignVariableCommand("x");
    assignCmd.do(state);
    var assignCmd2 = new Interpreter_1.AssignVariableCommand("y");
    assignCmd2.do(state);
    console.log("Variable x =", state.getVariable("x"));
    console.log("Variable y =", state.getVariable("y"));
    console.log("Variables map: ", state.variables);
    console.log("Stack after assignment:", state.evaluationStack);
}
simpleTest();
