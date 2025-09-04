"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Interpreter_1 = require("./Interpreter");
function createState() {
    return new Interpreter_1.State(1, 0, null, [], [], new Map(), [], 1, []);
}
function simpleTest() {
    var state = createState();
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
    console.log("changing x's value to 12...");
    var changevarcmd = new Interpreter_1.ChangeVariableCommand("x", 12);
    changevarcmd.do(state);
    console.log("Variable x =", state.getVariable("x"));
    console.log("Variables map: ", state.variables);
    console.log("increment program counter, current: ", state.programCounter);
    var incrementpccmd = new Interpreter_1.IncrementProgramCounterCommand();
    incrementpccmd.do(state);
    console.log("PC now: ", state.programCounter);
}
simpleTest();
