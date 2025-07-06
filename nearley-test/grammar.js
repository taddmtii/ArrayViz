// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

const moo = require("moo");
const lexer = moo.compile({
    // WHITESPACE
    WS: /[ \t]+/,

    // NEWLINES
    NL: {match: /\r?\n/, lineBreaks: true},

    // COMMENTS
    COMMENT: {match: /#.*/},

    // KEYWORDS
    PRINT: "print",
    IF: "if",
    ELSE: "else",
    WHILE: "while",
    FOR: "for",
    RANGE: "range",
    IN: "in",

    // LIST METHODS
    APPEND: "append",
    SORT: "sort",
    REMOVE: "remove",
    COUNT: "count",
    INSERT: "insert",

    // NUMBERS
    HEX: /0x[0-9a-fA-F]+/,
    BINARY: /0b[01]+/,
    DECIMAL: /0|[1-9][0-9]*/,

    // IDENTIFIER
    IDENTIFIER: /[a-zA-Z_][a-zA-Z0-9_]*/,

    // ARITHMETIC
    PLUS: "+",
    SUB: "-",
    MULT: "*",
    DIV: "/",
    LTHAN: "<",
    GRTHAN: ">",
    LTHAN_EQ: "<=",
    GRTHAN_EQ: ">=",
    EQUALITY: "==",

    //SYMBOLS
    DOT: ".",
    COMMA: ",",
    COLON: ":",
    LSQBRACK: "[",
    RSQBRACK: "]",
    LPAREN: "(",
    RPAREN: ")",
    EQ: "="
});

// Overrides next method from lexer, automatically skips whitespace tokens.
lexer.next = (next => () => { // Captures the original next method, returns new func that becomes next method
    let tok;
    while ((tok = next.call(lexer)) && (tok.type === "WS" || tok.type === "NL")) {} // keep getting tokens and disgard any tokens with type WS
    return tok; // return first non WS token
})(lexer.next);

var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "program", "symbols": ["statement_list"], "postprocess": id},
    {"name": "number", "symbols": [(lexer.has("HEX") ? {type: "HEX"} : HEX)], "postprocess": id},
    {"name": "number", "symbols": [(lexer.has("BINARY") ? {type: "BINARY"} : BINARY)], "postprocess": id},
    {"name": "number", "symbols": [(lexer.has("DECIMAL") ? {type: "DECIMAL"} : DECIMAL)], "postprocess": id},
    {"name": "number", "symbols": [(lexer.has("ZERO") ? {type: "ZERO"} : ZERO)], "postprocess": id},
    {"name": "arithmetic_operand", "symbols": [(lexer.has("PLUS") ? {type: "PLUS"} : PLUS)], "postprocess": id},
    {"name": "arithmetic_operand", "symbols": [(lexer.has("SUB") ? {type: "SUB"} : SUB)], "postprocess": id},
    {"name": "arithmetic_operand", "symbols": [(lexer.has("MULT") ? {type: "MULT"} : MULT)], "postprocess": id},
    {"name": "arithmetic_operand", "symbols": [(lexer.has("DIV") ? {type: "DIV"} : DIV)], "postprocess": id},
    {"name": "comparison_operand", "symbols": [(lexer.has("LTHAN") ? {type: "LTHAN"} : LTHAN)], "postprocess": id},
    {"name": "comparison_operand", "symbols": [(lexer.has("GRTHAN") ? {type: "GRTHAN"} : GRTHAN)], "postprocess": id},
    {"name": "comparison_operand", "symbols": [(lexer.has("LTHAN_EQ") ? {type: "LTHAN_EQ"} : LTHAN_EQ)], "postprocess": id},
    {"name": "comparison_operand", "symbols": [(lexer.has("GRTHAN_EQ") ? {type: "GRTHAN_EQ"} : GRTHAN_EQ)], "postprocess": id},
    {"name": "comparison_operand", "symbols": [(lexer.has("EQUALITY") ? {type: "EQUALITY"} : EQUALITY)], "postprocess": id},
    {"name": "number_list", "symbols": ["number"], "postprocess": d => [d[0]]},
    {"name": "number_list", "symbols": ["number", (lexer.has("COMMA") ? {type: "COMMA"} : COMMA), "number_list"], "postprocess": d => [d[0], ...d[2]]},
    {"name": "list", "symbols": [(lexer.has("LSQBRACK") ? {type: "LSQBRACK"} : LSQBRACK), "number_list", (lexer.has("RSQBRACK") ? {type: "RSQBRACK"} : RSQBRACK)], "postprocess": d => ({ type: "list", values: d[1] })},
    {"name": "list", "symbols": [(lexer.has("LSQBRACK") ? {type: "LSQBRACK"} : LSQBRACK), (lexer.has("RSQBRACK") ? {type: "RSQBRACK"} : RSQBRACK)], "postprocess": d => ({ type: "list", values: [] })},
    {"name": "statement", "symbols": ["assignment_statement"]},
    {"name": "statement", "symbols": ["expression"]},
    {"name": "statement", "symbols": ["if_statement"]},
    {"name": "statement", "symbols": ["else_statement"]},
    {"name": "statement", "symbols": ["for_loop"]},
    {"name": "statement", "symbols": ["while_loop"]},
    {"name": "statement", "symbols": ["print_func"], "postprocess": id},
    {"name": "statement", "symbols": ["list_method_call"]},
    {"name": "for_loop", "symbols": [(lexer.has("FOR") ? {type: "FOR"} : FOR), (lexer.has("IDENTIFIER") ? {type: "IDENTIFIER"} : IDENTIFIER), (lexer.has("IN") ? {type: "IN"} : IN), (lexer.has("RANGE") ? {type: "RANGE"} : RANGE), (lexer.has("LPAREN") ? {type: "LPAREN"} : LPAREN), "number", (lexer.has("RPAREN") ? {type: "RPAREN"} : RPAREN), (lexer.has("COLON") ? {type: "COLON"} : COLON)], "postprocess": d => ({ type: "for_in_range_loop", temp_var: d[1], range: d[5] })},
    {"name": "for_loop", "symbols": [(lexer.has("FOR") ? {type: "FOR"} : FOR), (lexer.has("IDENTIFIER") ? {type: "IDENTIFIER"} : IDENTIFIER), (lexer.has("IN") ? {type: "IN"} : IN), (lexer.has("IDENTIFIER") ? {type: "IDENTIFIER"} : IDENTIFIER), (lexer.has("COLON") ? {type: "COLON"} : COLON)], "postprocess": d => ({ type: "for_loop", temp_var: d[1], range: d[3] })},
    {"name": "while_loop", "symbols": [(lexer.has("WHILE") ? {type: "WHILE"} : WHILE), "conditional_statement", (lexer.has("COLON") ? {type: "COLON"} : COLON)], "postprocess": d => ({ type: "while_loop", conditional_statement: d[1]})},
    {"name": "if_statement", "symbols": [(lexer.has("IF") ? {type: "IF"} : IF), "conditional_statement", (lexer.has("COLON") ? {type: "COLON"} : COLON)], "postprocess": d => ({ type: "if_statement", conditional: d[1] })},
    {"name": "else_statement", "symbols": [(lexer.has("ELSE") ? {type: "ELSE"} : ELSE), (lexer.has("COLON") ? {type: "COLON"} : COLON)], "postprocess": d => ({ type: "else_statement" })},
    {"name": "conditional_statement", "symbols": [(lexer.has("IDENTIFIER") ? {type: "IDENTIFIER"} : IDENTIFIER), "comparison_operand", "number"], "postprocess": d => ({ type: "conditional_statement", value1: d[0], operand: d[1], value2: d[2] })},
    {"name": "conditional_statement", "symbols": ["number", "comparison_operand", "number"], "postprocess": d => ({ type: "conditional_statement", value1: d[0], operand: d[1], value2: d[2] })},
    {"name": "conditional_statement", "symbols": ["assignable_expression", "comparison_operand", "assignable_expression"], "postprocess": d => ({ type: "conditional_statement", value1: d[0], operand: d[1], value2: d[2] })},
    {"name": "assignment_statement", "symbols": ["assignable_expression", (lexer.has("EQ") ? {type: "EQ"} : EQ), "expression"], "postprocess": d => ({ type: "assignment_statement", var: d[0], value: d[2] })},
    {"name": "array_access", "symbols": [(lexer.has("IDENTIFIER") ? {type: "IDENTIFIER"} : IDENTIFIER), (lexer.has("LSQBRACK") ? {type: "LSQBRACK"} : LSQBRACK), "expression", (lexer.has("RSQBRACK") ? {type: "RSQBRACK"} : RSQBRACK)], "postprocess": d => ({ type: "array_access", array: d[0], index: d[2] })},
    {"name": "assignable_expression", "symbols": [(lexer.has("IDENTIFIER") ? {type: "IDENTIFIER"} : IDENTIFIER)], "postprocess": id},
    {"name": "assignable_expression", "symbols": ["array_access"]},
    {"name": "list_method", "symbols": [(lexer.has("APPEND") ? {type: "APPEND"} : APPEND)]},
    {"name": "list_method", "symbols": [(lexer.has("SORT") ? {type: "SORT"} : SORT)]},
    {"name": "list_method", "symbols": [(lexer.has("REMOVE") ? {type: "REMOVE"} : REMOVE)]},
    {"name": "list_method", "symbols": [(lexer.has("COUNT") ? {type: "COUNT"} : COUNT)]},
    {"name": "list_method", "symbols": [(lexer.has("INSERT") ? {type: "INSERT"} : INSERT)]},
    {"name": "list_method_call$subexpression$1", "symbols": [(lexer.has("APPEND") ? {type: "APPEND"} : APPEND)]},
    {"name": "list_method_call$subexpression$1", "symbols": [(lexer.has("REMOVE") ? {type: "REMOVE"} : REMOVE)]},
    {"name": "list_method_call$subexpression$1", "symbols": [(lexer.has("INSERT") ? {type: "INSERT"} : INSERT)]},
    {"name": "list_method_call$subexpression$2", "symbols": [(lexer.has("IDENTIFIER") ? {type: "IDENTIFIER"} : IDENTIFIER)]},
    {"name": "list_method_call$subexpression$2", "symbols": ["number"]},
    {"name": "list_method_call", "symbols": [(lexer.has("IDENTIFIER") ? {type: "IDENTIFIER"} : IDENTIFIER), (lexer.has("DOT") ? {type: "DOT"} : DOT), "list_method_call$subexpression$1", (lexer.has("LPAREN") ? {type: "LPAREN"} : LPAREN), "list_method_call$subexpression$2", (lexer.has("RPAREN") ? {type: "RPAREN"} : RPAREN)], "postprocess": d => ({type: "append_method_call", list: d[0], type: d[2], value: d[4]})},
    {"name": "list_method_call$subexpression$3", "symbols": [(lexer.has("SORT") ? {type: "SORT"} : SORT)]},
    {"name": "list_method_call$subexpression$3", "symbols": [(lexer.has("COUNT") ? {type: "COUNT"} : COUNT)]},
    {"name": "list_method_call", "symbols": [(lexer.has("IDENTIFIER") ? {type: "IDENTIFIER"} : IDENTIFIER), (lexer.has("DOT") ? {type: "DOT"} : DOT), "list_method_call$subexpression$3", (lexer.has("LPAREN") ? {type: "LPAREN"} : LPAREN), (lexer.has("RPAREN") ? {type: "RPAREN"} : RPAREN)], "postprocess": d => ({type: "append_method_call", list: d[0], type: d[2]})},
    {"name": "arithmetic_expression", "symbols": [(lexer.has("IDENTIFIER") ? {type: "IDENTIFIER"} : IDENTIFIER), "arithmetic_operand", "number"], "postprocess": d => ({ type: "arithmetic_expression", value1: d[0], operand: d[1], value2: d[2] })},
    {"name": "arithmetic_expression", "symbols": ["number", "arithmetic_operand", "number"], "postprocess": d => ({ type: "arithmetic_expression", value1: d[0], operand: d[1], value2: d[2] })},
    {"name": "arithmetic_expression", "symbols": ["assignable_expression", "arithmetic_operand", "assignable_expression"], "postprocess": d => ({ type: "arithmetic_expression", value1: d[0], operand: d[1], value2: d[2] })},
    {"name": "expression", "symbols": ["assignable_expression"]},
    {"name": "expression", "symbols": ["list"]},
    {"name": "expression", "symbols": ["number"]},
    {"name": "expression", "symbols": ["arithmetic_expression"]},
    {"name": "statement_list", "symbols": ["statement"], "postprocess": d => [d[0]]},
    {"name": "statement_list", "symbols": ["statement", "statement_list"], "postprocess": d => [d[0], ...d[1]]},
    {"name": "print_func", "symbols": [(lexer.has("PRINT") ? {type: "PRINT"} : PRINT), (lexer.has("LPAREN") ? {type: "LPAREN"} : LPAREN), (lexer.has("RPAREN") ? {type: "RPAREN"} : RPAREN)], "postprocess": d => ({ type: "print", args: [] })},
    {"name": "print_func", "symbols": [(lexer.has("PRINT") ? {type: "PRINT"} : PRINT), (lexer.has("LPAREN") ? {type: "LPAREN"} : LPAREN), "expression", (lexer.has("RPAREN") ? {type: "RPAREN"} : RPAREN)], "postprocess": d => ({ type: "print", args: [d[2]] })}
]
  , ParserStart: "program"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
