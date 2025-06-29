// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }


const moo = require("moo");
const lexer = moo.compile({
    // WHITESPACE
    WS: /[ \t]+/,

    // COMMENTS (talk to Prof O about this one)
    COMMENT: {match: /#.*?/},

    // KEYWORDS
    PRINT: "print",

    // NUMBERS
    HEX: /0x[0-9a-fA-F]+/,
    BINARY: /0b[01]+/,
    DECIMAL: /[1-9][0-9]*/,

    // IDENTIFIER
    IDENTIFIER: /[a-zA-Z_][a-zA-Z0-9_]*/,

    //SYMBOLS
    COMMA: ",",
    LSQBRACK: "[",
    RSQBRACK: "]",
    LPAREN: "(",
    RPAREN: ")",
    EQ: "="
});

// Overrides next method from lexer, automatically skips whitespace tokens.
// IIFE (Immediately Invoked Function Expression)
lexer.next = (next => () => { // Captures the original next method, returns new func that becomes next method
    let tok;
    while ((tok = next.call(lexer)) && tok.type === "WS") {} // keep getting tokens and disgard any tokens with type WS
    return tok; // return first non WS token
})(lexer.next);

var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "main", "symbols": ["statement_list"], "postprocess": id},
    {"name": "NUMBER", "symbols": [(lexer.has("HEX") ? {type: "HEX"} : HEX)], "postprocess": id},
    {"name": "NUMBER", "symbols": [(lexer.has("BINARY") ? {type: "BINARY"} : BINARY)], "postprocess": id},
    {"name": "NUMBER", "symbols": [(lexer.has("DECIMAL") ? {type: "DECIMAL"} : DECIMAL)], "postprocess": id},
    {"name": "number_list", "symbols": ["NUMBER"], "postprocess": d => [d[0]]},
    {"name": "number_list", "symbols": ["NUMBER", (lexer.has("COMMA") ? {type: "COMMA"} : COMMA), "number_list"], "postprocess": d => [d[0], ...d[2]]},
    {"name": "list", "symbols": [(lexer.has("LSQBRACK") ? {type: "LSQBRACK"} : LSQBRACK), "number_list", (lexer.has("RSQBRACK") ? {type: "RSQBRACK"} : RSQBRACK)], "postprocess": d => ({ type: "list", values: d[1] })},
    {"name": "list", "symbols": [(lexer.has("LSQBRACK") ? {type: "LSQBRACK"} : LSQBRACK), (lexer.has("RSQBRACK") ? {type: "RSQBRACK"} : RSQBRACK)], "postprocess": d => ({ type: "list", values: [] })},
    {"name": "statement", "symbols": [(lexer.has("IDENTIFIER") ? {type: "IDENTIFIER"} : IDENTIFIER), (lexer.has("EQ") ? {type: "EQ"} : EQ), "NUMBER"], "postprocess": d => ({ type: "statement", var: d[0], value: d[2] })},
    {"name": "statement", "symbols": [(lexer.has("IDENTIFIER") ? {type: "IDENTIFIER"} : IDENTIFIER), (lexer.has("EQ") ? {type: "EQ"} : EQ), (lexer.has("IDENTIFIER") ? {type: "IDENTIFIER"} : IDENTIFIER)], "postprocess": d => ({ type: "statement", var: d[0], value: d[2] })},
    {"name": "statement", "symbols": [(lexer.has("IDENTIFIER") ? {type: "IDENTIFIER"} : IDENTIFIER), (lexer.has("EQ") ? {type: "EQ"} : EQ), (lexer.has("IDENTIFIER") ? {type: "IDENTIFIER"} : IDENTIFIER), (lexer.has("LSQBRACK") ? {type: "LSQBRACK"} : LSQBRACK), "NUMBER", (lexer.has("RSQBRACK") ? {type: "RSQBRACK"} : RSQBRACK)], "postprocess": d => ({ type: "statement", var: d[0], value: { type: "array_access", array: d[2], index: d[4] } })},
    {"name": "statement", "symbols": [(lexer.has("IDENTIFIER") ? {type: "IDENTIFIER"} : IDENTIFIER), (lexer.has("LSQBRACK") ? {type: "LSQBRACK"} : LSQBRACK), "NUMBER", (lexer.has("RSQBRACK") ? {type: "RSQBRACK"} : RSQBRACK), (lexer.has("EQ") ? {type: "EQ"} : EQ), "NUMBER"], "postprocess": d => ({ type: "statement", array: d[0], index: d[2], value: d[5] })},
    {"name": "statement", "symbols": [(lexer.has("IDENTIFIER") ? {type: "IDENTIFIER"} : IDENTIFIER), (lexer.has("LSQBRACK") ? {type: "LSQBRACK"} : LSQBRACK), "NUMBER", (lexer.has("RSQBRACK") ? {type: "RSQBRACK"} : RSQBRACK), (lexer.has("EQ") ? {type: "EQ"} : EQ), (lexer.has("IDENTIFIER") ? {type: "IDENTIFIER"} : IDENTIFIER), (lexer.has("LSQBRACK") ? {type: "LSQBRACK"} : LSQBRACK), "NUMBER", (lexer.has("RSQBRACK") ? {type: "RSQBRACK"} : RSQBRACK)], "postprocess": d => ({ type: "statement", array: d[0], index: d[2], value: { type: "array_access", array: d[5], index: d[7] } })},
    {"name": "statement", "symbols": [(lexer.has("IDENTIFIER") ? {type: "IDENTIFIER"} : IDENTIFIER), (lexer.has("EQ") ? {type: "EQ"} : EQ), "list"], "postprocess": d => ({ type: "statement", var: d[0], value: d[2] })},
    {"name": "statement", "symbols": [(lexer.has("IDENTIFIER") ? {type: "IDENTIFIER"} : IDENTIFIER), (lexer.has("LSQBRACK") ? {type: "LSQBRACK"} : LSQBRACK), "NUMBER", (lexer.has("RSQBRACK") ? {type: "RSQBRACK"} : RSQBRACK)], "postprocess": d => ({ type: "statement", array: d[0], index: d[2] })},
    {"name": "statement", "symbols": ["print_func"], "postprocess": id},
    {"name": "statement_list", "symbols": ["statement"], "postprocess": d => [d[0]]},
    {"name": "statement_list", "symbols": ["statement", "statement_list"], "postprocess": d => [d[0], ...d[1]]},
    {"name": "print_func", "symbols": [(lexer.has("PRINT") ? {type: "PRINT"} : PRINT), (lexer.has("LPAREN") ? {type: "LPAREN"} : LPAREN), (lexer.has("RPAREN") ? {type: "RPAREN"} : RPAREN)], "postprocess": d => ({ type: "print", args: [] })},
    {"name": "print_func", "symbols": [(lexer.has("PRINT") ? {type: "PRINT"} : PRINT), (lexer.has("LPAREN") ? {type: "LPAREN"} : LPAREN), "NUMBER", (lexer.has("RPAREN") ? {type: "RPAREN"} : RPAREN)], "postprocess": d => ({ type: "print", args: [d[2]] })},
    {"name": "print_func", "symbols": [(lexer.has("PRINT") ? {type: "PRINT"} : PRINT), (lexer.has("LPAREN") ? {type: "LPAREN"} : LPAREN), (lexer.has("IDENTIFIER") ? {type: "IDENTIFIER"} : IDENTIFIER), (lexer.has("RPAREN") ? {type: "RPAREN"} : RPAREN)], "postprocess": d => ({ type: "print", args: [d[2]] })},
    {"name": "print_func", "symbols": [(lexer.has("PRINT") ? {type: "PRINT"} : PRINT), (lexer.has("LPAREN") ? {type: "LPAREN"} : LPAREN), (lexer.has("IDENTIFIER") ? {type: "IDENTIFIER"} : IDENTIFIER), (lexer.has("LSQBRACK") ? {type: "LSQBRACK"} : LSQBRACK), "NUMBER", (lexer.has("RSQBRACK") ? {type: "RSQBRACK"} : RSQBRACK), (lexer.has("RPAREN") ? {type: "RPAREN"} : RPAREN)], "postprocess": d => ({ type: "print", args: [{ type: "array_access", array: d[2], index: d[4] }] })}
]
  , ParserStart: "main"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
