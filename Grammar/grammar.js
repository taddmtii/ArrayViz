// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

const moo = require("moo");
const IndentationLexer = require('moo-indentation-lexer')
const lexer = new IndentationLexer({ 
    indentationType: 'WS', 
    newlineType: 'NL',
    commentType: 'COMMENT',
    indentName: 'INDENT',
    dedentName: 'DEDENT',
    lexer: moo.compile({
    // WHITESPACE
    WS: /[ \t]+/,

    // NEWLINES
    NL: {match: /\r?\n/, lineBreaks: true},

    // COMMENTS
    COMMENT: {match: /#.*/},

    // IDENTIFIER / KEYWORDS
    IDENTIFIER: {
        match: /[a-zA-Z_][a-zA-Z0-9_]*/,
        type: moo.keywords({
            IF: "if",
            ELSE: "else",
            ELIF: "elif",
            WHILE: "while",
            FOR: "for",
            IN: "in",
            RANGE: "range",
            RETURN: "return",
            DEF: "def",
            TRUE: "True",
            FALSE: "False",
            NONE: "None",
            AND: "and",
            OR: "or",
            NOT: "not",
            BREAK: "break",
            CONTINUE: "continue",
            PASS: "pass"
        })
    },

    // NUMBERS
    HEX: /0x[0-9a-fA-F]+/,
    BINARY: /0b[01]+/,
    FLOAT: /[+-]?(?:[0-9]+\.[0-9]*)/,
    DECIMAL: /0|[+-]?[1-9][0-9]*/,

    // ARITHMETIC
    PLUS: "+",
    MINUS: "-",
    MULT: "*",
    DIV: "/",
    LTHAN: "<",
    GRTHAN: ">",
    MOD: "%",
    INTDIV: "//",
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
})});


// Overrides next method from lexer, automatically skips whitespace tokens.
lexer.next = (next => () => { // Captures the original next method, returns new func that becomes next method
    let tok;
    while ((tok = next.call(lexer)) && (tok.type === "WS")) {} // keep getting tokens and disgard any tokens with type WS or NL
    return tok; // return first non WS token
})(lexer.next);

var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "program", "symbols": ["statement_list"], "postprocess": id},
    {"name": "number", "symbols": [(lexer.has("HEX") ? {type: "HEX"} : HEX)], "postprocess": id},
    {"name": "number", "symbols": [(lexer.has("BINARY") ? {type: "BINARY"} : BINARY)], "postprocess": id},
    {"name": "number", "symbols": [(lexer.has("DECIMAL") ? {type: "DECIMAL"} : DECIMAL)], "postprocess": id},
    {"name": "number", "symbols": [(lexer.has("FLOAT") ? {type: "FLOAT"} : FLOAT)], "postprocess": id},
    {"name": "expression", "symbols": ["or_expression"]},
    {"name": "or_expression$ebnf$1", "symbols": []},
    {"name": "or_expression$ebnf$1$subexpression$1", "symbols": [(lexer.has("OR") ? {type: "OR"} : OR), "and_expression"]},
    {"name": "or_expression$ebnf$1", "symbols": ["or_expression$ebnf$1", "or_expression$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "or_expression", "symbols": ["and_expression", "or_expression$ebnf$1"]},
    {"name": "and_expression$ebnf$1", "symbols": []},
    {"name": "and_expression$ebnf$1$subexpression$1", "symbols": [(lexer.has("AND") ? {type: "AND"} : AND), "not_expression"]},
    {"name": "and_expression$ebnf$1", "symbols": ["and_expression$ebnf$1", "and_expression$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "and_expression", "symbols": ["not_expression", "and_expression$ebnf$1"]},
    {"name": "not_expression", "symbols": [(lexer.has("NOT") ? {type: "NOT"} : NOT), "not_expression"]},
    {"name": "not_expression", "symbols": ["comparison"]},
    {"name": "comparison$ebnf$1", "symbols": []},
    {"name": "comparison$ebnf$1$subexpression$1$subexpression$1", "symbols": [(lexer.has("LTHAN") ? {type: "LTHAN"} : LTHAN)]},
    {"name": "comparison$ebnf$1$subexpression$1$subexpression$1", "symbols": [(lexer.has("GRTHAN") ? {type: "GRTHAN"} : GRTHAN)]},
    {"name": "comparison$ebnf$1$subexpression$1$subexpression$1", "symbols": [(lexer.has("LTHAN_EQ") ? {type: "LTHAN_EQ"} : LTHAN_EQ)]},
    {"name": "comparison$ebnf$1$subexpression$1$subexpression$1", "symbols": [(lexer.has("GRTHAN_EQ") ? {type: "GRTHAN_EQ"} : GRTHAN_EQ)]},
    {"name": "comparison$ebnf$1$subexpression$1$subexpression$1", "symbols": [(lexer.has("EQUALITY") ? {type: "EQUALITY"} : EQUALITY)]},
    {"name": "comparison$ebnf$1$subexpression$1", "symbols": ["comparison$ebnf$1$subexpression$1$subexpression$1", "additive"]},
    {"name": "comparison$ebnf$1", "symbols": ["comparison$ebnf$1", "comparison$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "comparison", "symbols": ["additive", "comparison$ebnf$1"]},
    {"name": "additive", "symbols": ["additive", (lexer.has("PLUS") ? {type: "PLUS"} : PLUS), "multiplicative"]},
    {"name": "additive", "symbols": ["additive", (lexer.has("MINUS") ? {type: "MINUS"} : MINUS), "multiplicative"]},
    {"name": "additive", "symbols": ["multiplicative"]},
    {"name": "multiplicative", "symbols": ["multiplicative", (lexer.has("MULT") ? {type: "MULT"} : MULT), "unary"]},
    {"name": "multiplicative", "symbols": ["multiplicative", (lexer.has("DIV") ? {type: "DIV"} : DIV), "unary"]},
    {"name": "multiplicative", "symbols": ["multiplicative", (lexer.has("INTDIV") ? {type: "INTDIV"} : INTDIV), "unary"]},
    {"name": "multiplicative", "symbols": ["multiplicative", (lexer.has("MOD") ? {type: "MOD"} : MOD), "unary"]},
    {"name": "multiplicative", "symbols": ["unary"]},
    {"name": "unary", "symbols": [(lexer.has("PLUS") ? {type: "PLUS"} : PLUS), "unary"]},
    {"name": "unary", "symbols": [(lexer.has("MINUS") ? {type: "MINUS"} : MINUS), "unary"]},
    {"name": "unary", "symbols": ["primary"]},
    {"name": "primary", "symbols": ["number"]},
    {"name": "primary", "symbols": ["function_call"]},
    {"name": "primary", "symbols": ["method_call"]},
    {"name": "primary", "symbols": ["assignable_expression"]},
    {"name": "primary", "symbols": ["list"]},
    {"name": "primary", "symbols": ["list_slice"]},
    {"name": "primary", "symbols": [(lexer.has("NONE") ? {type: "NONE"} : NONE)]},
    {"name": "primary", "symbols": [(lexer.has("TRUE") ? {type: "TRUE"} : TRUE)]},
    {"name": "primary", "symbols": [(lexer.has("FALSE") ? {type: "FALSE"} : FALSE)]},
    {"name": "primary", "symbols": [(lexer.has("BREAK") ? {type: "BREAK"} : BREAK)]},
    {"name": "primary", "symbols": [(lexer.has("CONTINUE") ? {type: "CONTINUE"} : CONTINUE)]},
    {"name": "primary", "symbols": [(lexer.has("PASS") ? {type: "PASS"} : PASS)]},
    {"name": "primary", "symbols": [(lexer.has("LPAREN") ? {type: "LPAREN"} : LPAREN), "expression", (lexer.has("RPAREN") ? {type: "RPAREN"} : RPAREN)]},
    {"name": "list$ebnf$1$subexpression$1", "symbols": ["arg_list"]},
    {"name": "list$ebnf$1", "symbols": ["list$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "list$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "list", "symbols": [(lexer.has("LSQBRACK") ? {type: "LSQBRACK"} : LSQBRACK), "list$ebnf$1", (lexer.has("RSQBRACK") ? {type: "RSQBRACK"} : RSQBRACK)], "postprocess": d => ({type: "list_literal", args: d[1]})},
    {"name": "list_slice$ebnf$1$subexpression$1", "symbols": [(lexer.has("COLON") ? {type: "COLON"} : COLON), "number"]},
    {"name": "list_slice$ebnf$1", "symbols": ["list_slice$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "list_slice$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "list_slice", "symbols": [(lexer.has("IDENTIFIER") ? {type: "IDENTIFIER"} : IDENTIFIER), (lexer.has("LSQBRACK") ? {type: "LSQBRACK"} : LSQBRACK), "number", (lexer.has("COLON") ? {type: "COLON"} : COLON), "number", "list_slice$ebnf$1", (lexer.has("RSQBRACK") ? {type: "RSQBRACK"} : RSQBRACK)], "postprocess": d => ({type: "list_slice", list: d[0], start: d[2], stop: d[4], step: d[6]})},
    {"name": "statement", "symbols": ["assignment_statement"]},
    {"name": "statement", "symbols": ["expression"]},
    {"name": "statement", "symbols": ["if_statement"]},
    {"name": "statement", "symbols": ["else_block"]},
    {"name": "statement", "symbols": ["for_loop"]},
    {"name": "statement", "symbols": ["while_loop"]},
    {"name": "statement", "symbols": ["func_def"]},
    {"name": "statement", "symbols": ["return_statement"]},
    {"name": "statement", "symbols": [(lexer.has("NL") ? {type: "NL"} : NL)]},
    {"name": "for_loop", "symbols": [(lexer.has("FOR") ? {type: "FOR"} : FOR), (lexer.has("IDENTIFIER") ? {type: "IDENTIFIER"} : IDENTIFIER), (lexer.has("IN") ? {type: "IN"} : IN), (lexer.has("RANGE") ? {type: "RANGE"} : RANGE), (lexer.has("LPAREN") ? {type: "LPAREN"} : LPAREN), "number", (lexer.has("RPAREN") ? {type: "RPAREN"} : RPAREN), (lexer.has("COLON") ? {type: "COLON"} : COLON), "block"], "postprocess": d => ({ type: "for_in_range_loop", temp_var: d[1], range: d[5], body: d[8] })},
    {"name": "for_loop", "symbols": [(lexer.has("FOR") ? {type: "FOR"} : FOR), (lexer.has("IDENTIFIER") ? {type: "IDENTIFIER"} : IDENTIFIER), (lexer.has("IN") ? {type: "IN"} : IN), (lexer.has("IDENTIFIER") ? {type: "IDENTIFIER"} : IDENTIFIER), (lexer.has("COLON") ? {type: "COLON"} : COLON), "block"], "postprocess": d => ({ type: "for_loop", temp_var: d[1], range: d[3], body: d[5] })},
    {"name": "while_loop", "symbols": [(lexer.has("WHILE") ? {type: "WHILE"} : WHILE), "expression", (lexer.has("COLON") ? {type: "COLON"} : COLON), "block"], "postprocess": d => ({ type: "while_loop", expression: d[1], body: d[3]})},
    {"name": "if_statement", "symbols": [(lexer.has("IF") ? {type: "IF"} : IF), "expression", (lexer.has("COLON") ? {type: "COLON"} : COLON), "block"], "postprocess": d => ({ type: "if_statement", expression: d[1], body: d[3] })},
    {"name": "if_statement", "symbols": [(lexer.has("IF") ? {type: "IF"} : IF), "expression", (lexer.has("COLON") ? {type: "COLON"} : COLON), "block", "elif_statement"], "postprocess": d => ({ type: "if_statement", expression: d[1], body: d[3] })},
    {"name": "if_statement", "symbols": [(lexer.has("IF") ? {type: "IF"} : IF), "expression", (lexer.has("COLON") ? {type: "COLON"} : COLON), "block", "else_block"], "postprocess": d => ({ type: "if_statement", expression: d[1], body: d[3] })},
    {"name": "elif_statement", "symbols": [(lexer.has("ELIF") ? {type: "ELIF"} : ELIF), "expression", (lexer.has("COLON") ? {type: "COLON"} : COLON), "block", "elif_statement"], "postprocess": d => ({ type: "elif_statement", expression: d[1], body: d[3] })},
    {"name": "elif_statement", "symbols": [(lexer.has("ELIF") ? {type: "ELIF"} : ELIF), "expression", (lexer.has("COLON") ? {type: "COLON"} : COLON), "block", "else_block"], "postprocess": d => ({ type: "elif_statement", expression: d[1], body: d[3] })},
    {"name": "elif_statement", "symbols": [(lexer.has("ELIF") ? {type: "ELIF"} : ELIF), "expression", (lexer.has("COLON") ? {type: "COLON"} : COLON), "block"], "postprocess": d => ({ type: "elif_statement", expression: d[1], body: d[3] })},
    {"name": "else_block", "symbols": [(lexer.has("ELSE") ? {type: "ELSE"} : ELSE), (lexer.has("COLON") ? {type: "COLON"} : COLON), "block"], "postprocess": d => ({ type: "else_block", body: d[2] })},
    {"name": "assignment_statement", "symbols": ["assignable_expression", (lexer.has("EQ") ? {type: "EQ"} : EQ), "expression"], "postprocess": d => ({ type: "assignment_statement", var: d[0], value: d[2] })},
    {"name": "array_access", "symbols": [(lexer.has("IDENTIFIER") ? {type: "IDENTIFIER"} : IDENTIFIER), (lexer.has("LSQBRACK") ? {type: "LSQBRACK"} : LSQBRACK), "expression", (lexer.has("RSQBRACK") ? {type: "RSQBRACK"} : RSQBRACK)], "postprocess": d => ({ type: "array_access", array: d[0], index: d[2] })},
    {"name": "assignable_expression", "symbols": [(lexer.has("IDENTIFIER") ? {type: "IDENTIFIER"} : IDENTIFIER)], "postprocess": id},
    {"name": "assignable_expression", "symbols": ["array_access"]},
    {"name": "return_statement$ebnf$1$subexpression$1", "symbols": ["expression"]},
    {"name": "return_statement$ebnf$1", "symbols": ["return_statement$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "return_statement$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "return_statement", "symbols": [(lexer.has("RETURN") ? {type: "RETURN"} : RETURN), "return_statement$ebnf$1"], "postprocess": d => ({ type: "return_statement", value: d[1]})},
    {"name": "func_def$ebnf$1$subexpression$1", "symbols": ["arg_list"]},
    {"name": "func_def$ebnf$1", "symbols": ["func_def$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "func_def$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "func_def", "symbols": [(lexer.has("DEF") ? {type: "DEF"} : DEF), (lexer.has("IDENTIFIER") ? {type: "IDENTIFIER"} : IDENTIFIER), (lexer.has("LPAREN") ? {type: "LPAREN"} : LPAREN), "func_def$ebnf$1", (lexer.has("RPAREN") ? {type: "RPAREN"} : RPAREN), (lexer.has("COLON") ? {type: "COLON"} : COLON), "block"], "postprocess": d => ({type: "function_definition", func_name: d[1], args: d[3], body: d[6]})},
    {"name": "function_call$ebnf$1$subexpression$1", "symbols": ["arg_list"]},
    {"name": "function_call$ebnf$1", "symbols": ["function_call$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "function_call$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "function_call", "symbols": [(lexer.has("IDENTIFIER") ? {type: "IDENTIFIER"} : IDENTIFIER), (lexer.has("LPAREN") ? {type: "LPAREN"} : LPAREN), "function_call$ebnf$1", (lexer.has("RPAREN") ? {type: "RPAREN"} : RPAREN)], "postprocess": d => ({ type: "function_call", func_name: d[0], args: d[2]})},
    {"name": "method_call$ebnf$1$subexpression$1", "symbols": ["arg_list"]},
    {"name": "method_call$ebnf$1", "symbols": ["method_call$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "method_call$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "method_call", "symbols": ["expression", (lexer.has("DOT") ? {type: "DOT"} : DOT), (lexer.has("IDENTIFIER") ? {type: "IDENTIFIER"} : IDENTIFIER), (lexer.has("LPAREN") ? {type: "LPAREN"} : LPAREN), "method_call$ebnf$1", (lexer.has("RPAREN") ? {type: "RPAREN"} : RPAREN)], "postprocess": d => ({type: "method_call", list: d[0], action: d[2], args: d[4]})},
    {"name": "arg_list$ebnf$1", "symbols": []},
    {"name": "arg_list$ebnf$1$subexpression$1", "symbols": [(lexer.has("COMMA") ? {type: "COMMA"} : COMMA), "expression"]},
    {"name": "arg_list$ebnf$1", "symbols": ["arg_list$ebnf$1", "arg_list$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "arg_list", "symbols": ["expression", "arg_list$ebnf$1"], "postprocess": d => [d[0], ...(d[1] ? d[1].map(x => x[1]) : [])]},
    {"name": "block", "symbols": [(lexer.has("NL") ? {type: "NL"} : NL), (lexer.has("INDENT") ? {type: "INDENT"} : INDENT), "statement_list", (lexer.has("DEDENT") ? {type: "DEDENT"} : DEDENT)], "postprocess": d => ({type: "block", statements: d[2]})},
    {"name": "block", "symbols": ["statement"]},
    {"name": "statement_list", "symbols": ["statement"], "postprocess": d => [d[0]]},
    {"name": "statement_list", "symbols": ["statement", "statement_list"], "postprocess": d => [d[0], ...d[1]]}
]
  , ParserStart: "program"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
