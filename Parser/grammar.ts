// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d: any[]): any { return d[0]; }
declare var NL: any;
declare var BREAK: any;
declare var CONTINUE: any;
declare var PASS: any;
declare var IDENTIFIER: any;
declare var ASSIGNMENT: any;
declare var IF: any;
declare var COLON: any;
declare var ELIF: any;
declare var ELSE: any;
declare var FOR: any;
declare var IN: any;
declare var WHILE: any;
declare var DEF: any;
declare var LPAREN: any;
declare var RPAREN: any;
declare var COMMA: any;
declare var INDENT: any;
declare var DEDENT: any;
declare var RETURN: any;
declare var OR: any;
declare var AND: any;
declare var NOT: any;
declare var LT: any;
declare var GT: any;
declare var LTE: any;
declare var GTE: any;
declare var EQ: any;
declare var NEQ: any;
declare var PLUS: any;
declare var MINUS: any;
declare var MULT: any;
declare var INTDIV: any;
declare var DIV: any;
declare var MOD: any;
declare var POWER: any;
declare var LSQBRACK: any;
declare var RSQBRACK: any;
declare var DOT: any;
declare var NONE: any;
declare var TRUE: any;
declare var FALSE: any;
declare var HEX: any;
declare var BINARY: any;
declare var DECIMAL: any;
declare var FLOAT: any;

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
    FLOAT: /(?:[+-]?[0-9]+\.[0-9]*)/,
    DECIMAL: /0|[+-]?[1-9][0-9]*/,

    // ARITHMETIC
    PLUS: "+",
    MINUS: "-",
    POWER: "**",
    MULT: "*",
    INTDIV: "//",
    DIV: "/",
    NEQ: "!=",
    EQ: "==",
    ASSIGNMENT: "=",
    LTE: "<=",
    GTE: ">=",
    LT: "<",
    GT: ">",
    MOD: "%",

    //SYMBOLS
    DOT: ".",
    COMMA: ",",
    COLON: ":",
    LSQBRACK: "[",
    RSQBRACK: "]",
    LPAREN: "(",
    RPAREN: ")"
})});

// Overrides next method from lexer, automatically skips whitespace and comments.
lexer.next = (next => () => { // Captures the original next method, returns new func that becomes next method
    let tok;
    while ((tok = next.call(lexer)) && (tok.type === "WS" || tok.type === "COMMENT")) {} // keep getting tokens and disgard any tokens with type WS or NL
    return tok; // return first non WS token
})(lexer.next);


interface NearleyToken {
  value: any;
  [key: string]: any;
};

interface NearleyLexer {
  reset: (chunk: string, info: any) => void;
  next: () => NearleyToken | undefined;
  save: () => any;
  formatError: (token: never) => string;
  has: (tokenType: string) => boolean;
};

interface NearleyRule {
  name: string;
  symbols: NearleySymbol[];
  postprocess?: (d: any[], loc?: number, reject?: {}) => any;
};

type NearleySymbol = string | { literal: any } | { test: (token: any) => boolean };

interface Grammar {
  Lexer: NearleyLexer | undefined;
  ParserRules: NearleyRule[];
  ParserStart: string;
};

const grammar: Grammar = {
  Lexer: lexer,
  ParserRules: [
    {"name": "program", "symbols": ["statement_list"], "postprocess": id},
    {"name": "statement_list$ebnf$1", "symbols": ["statement"]},
    {"name": "statement_list$ebnf$1", "symbols": ["statement_list$ebnf$1", "statement"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "statement_list", "symbols": ["statement_list$ebnf$1"], "postprocess": d => ({ type: "statement_list", statements: d[0].filter( i => i !== null )})},
    {"name": "statement", "symbols": ["simple_statement", (lexer.has("NL") ? {type: "NL"} : NL)], "postprocess": d => [d[0]]},
    {"name": "statement", "symbols": ["compound_statement"], "postprocess": id},
    {"name": "statement", "symbols": [(lexer.has("NL") ? {type: "NL"} : NL)], "postprocess": d => null},
    {"name": "simple_statement", "symbols": ["assignment_statement"], "postprocess": id},
    {"name": "simple_statement", "symbols": ["return_statement"], "postprocess": id},
    {"name": "simple_statement", "symbols": [(lexer.has("BREAK") ? {type: "BREAK"} : BREAK)], "postprocess": d => ({ type: "break_statement"})},
    {"name": "simple_statement", "symbols": [(lexer.has("CONTINUE") ? {type: "CONTINUE"} : CONTINUE)], "postprocess": d => ({ type: "continue_statement"})},
    {"name": "simple_statement", "symbols": [(lexer.has("PASS") ? {type: "PASS"} : PASS)], "postprocess": d => ({ type: "pass_statement"})},
    {"name": "simple_statement", "symbols": ["expression"], "postprocess": d => ({ type: "expression_statement", expr: d[0]})},
    {"name": "compound_statement", "symbols": ["if_statement"], "postprocess": id},
    {"name": "compound_statement", "symbols": ["for_loop"], "postprocess": id},
    {"name": "compound_statement", "symbols": ["while_loop"], "postprocess": id},
    {"name": "compound_statement", "symbols": ["func_def"], "postprocess": id},
    {"name": "assignment_statement$subexpression$1", "symbols": [(lexer.has("IDENTIFIER") ? {type: "IDENTIFIER"} : IDENTIFIER)]},
    {"name": "assignment_statement$subexpression$1", "symbols": ["array_access"]},
    {"name": "assignment_statement", "symbols": ["assignment_statement$subexpression$1", (lexer.has("ASSIGNMENT") ? {type: "ASSIGNMENT"} : ASSIGNMENT), "expression"], "postprocess": d => ({ type: "assignment_statement", var: d[0], value: d[2] })},
    {"name": "if_statement$ebnf$1$subexpression$1", "symbols": ["elif_statement"]},
    {"name": "if_statement$ebnf$1$subexpression$1", "symbols": ["else_block"]},
    {"name": "if_statement$ebnf$1", "symbols": ["if_statement$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "if_statement$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "if_statement", "symbols": [(lexer.has("IF") ? {type: "IF"} : IF), "expression", (lexer.has("COLON") ? {type: "COLON"} : COLON), "block", "if_statement$ebnf$1"], "postprocess": d => ({ type: "if_statement", condition: d[1], then_branch: d[3], else_branch: d[4] })},
    {"name": "elif_statement$ebnf$1$subexpression$1", "symbols": ["elif_statement"]},
    {"name": "elif_statement$ebnf$1$subexpression$1", "symbols": ["else_block"]},
    {"name": "elif_statement$ebnf$1", "symbols": ["elif_statement$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "elif_statement$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "elif_statement", "symbols": [(lexer.has("ELIF") ? {type: "ELIF"} : ELIF), "expression", (lexer.has("COLON") ? {type: "COLON"} : COLON), "block", "elif_statement$ebnf$1"], "postprocess": d => ({ type: "if_statement", condition: d[1], then_branch: d[3], else_branch: d[4] })},
    {"name": "else_block", "symbols": [(lexer.has("ELSE") ? {type: "ELSE"} : ELSE), (lexer.has("COLON") ? {type: "COLON"} : COLON), "block"], "postprocess": d => d[2]},
    {"name": "for_loop", "symbols": [(lexer.has("FOR") ? {type: "FOR"} : FOR), (lexer.has("IDENTIFIER") ? {type: "IDENTIFIER"} : IDENTIFIER), (lexer.has("IN") ? {type: "IN"} : IN), "expression", (lexer.has("COLON") ? {type: "COLON"} : COLON), "block"], "postprocess": d => ({ type: "for_loop", temp_var: d[1], range: d[3], body: d[5] })},
    {"name": "while_loop", "symbols": [(lexer.has("WHILE") ? {type: "WHILE"} : WHILE), "expression", (lexer.has("COLON") ? {type: "COLON"} : COLON), "block"], "postprocess": d => ({ type: "while_loop", expression: d[1], body: d[3]})},
    {"name": "func_def$ebnf$1$subexpression$1", "symbols": ["arg_list"]},
    {"name": "func_def$ebnf$1", "symbols": ["func_def$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "func_def$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "func_def", "symbols": [(lexer.has("DEF") ? {type: "DEF"} : DEF), (lexer.has("IDENTIFIER") ? {type: "IDENTIFIER"} : IDENTIFIER), (lexer.has("LPAREN") ? {type: "LPAREN"} : LPAREN), "func_def$ebnf$1", (lexer.has("RPAREN") ? {type: "RPAREN"} : RPAREN), (lexer.has("COLON") ? {type: "COLON"} : COLON), "block"], "postprocess": d => ({type: "function_definition", func_name: d[1], args: d[3], body: d[6]})},
    {"name": "arg_list$ebnf$1", "symbols": []},
    {"name": "arg_list$ebnf$1$subexpression$1", "symbols": [(lexer.has("COMMA") ? {type: "COMMA"} : COMMA), "expression"]},
    {"name": "arg_list$ebnf$1", "symbols": ["arg_list$ebnf$1", "arg_list$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "arg_list", "symbols": ["expression", "arg_list$ebnf$1"], "postprocess": d => [d[0], ...(d[1] ? d[1].map(x => x[1]) : [])]},
    {"name": "block", "symbols": [(lexer.has("NL") ? {type: "NL"} : NL), (lexer.has("INDENT") ? {type: "INDENT"} : INDENT), "statement_list", (lexer.has("DEDENT") ? {type: "DEDENT"} : DEDENT)], "postprocess": d => ({type: "block", statements: d[2]})},
    {"name": "block", "symbols": ["simple_statement", (lexer.has("NL") ? {type: "NL"} : NL)], "postprocess": d => ({type: "block", statements: [d[0]]})},
    {"name": "return_statement$ebnf$1", "symbols": ["expression"], "postprocess": id},
    {"name": "return_statement$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "return_statement", "symbols": [(lexer.has("RETURN") ? {type: "RETURN"} : RETURN), "return_statement$ebnf$1"], "postprocess": d => ({ type: "return_statement", value: (d[1] ? d[1] : null) })},
    {"name": "expression", "symbols": ["conditional_expression"], "postprocess": id},
    {"name": "conditional_expression", "symbols": ["or_expression", (lexer.has("IF") ? {type: "IF"} : IF), "or_expression", (lexer.has("ELSE") ? {type: "ELSE"} : ELSE), "conditional_expression"], "postprocess": d => ({ type: "conditional_expression", left: d[0], condition: d[2], right: d[4]})},
    {"name": "conditional_expression", "symbols": ["or_expression"], "postprocess": id},
    {"name": "or_expression", "symbols": ["or_expression", (lexer.has("OR") ? {type: "OR"} : OR), "and_expression"], "postprocess": d => ({ type: "or_expression", left: d[0], right: d[2] })},
    {"name": "or_expression", "symbols": ["and_expression"], "postprocess": id},
    {"name": "and_expression", "symbols": ["and_expression", (lexer.has("AND") ? {type: "AND"} : AND), "not_expression"], "postprocess": d => ({ type: "and_expression", left: d[0], right: d[2] })},
    {"name": "and_expression", "symbols": ["not_expression"], "postprocess": id},
    {"name": "not_expression", "symbols": [(lexer.has("NOT") ? {type: "NOT"} : NOT), "not_expression"], "postprocess": d => ({ type: "not_expression", expression: d[1]})},
    {"name": "not_expression", "symbols": ["comparison_expression"], "postprocess": id},
    {"name": "comparison_expression$subexpression$1", "symbols": [(lexer.has("LT") ? {type: "LT"} : LT)]},
    {"name": "comparison_expression$subexpression$1", "symbols": [(lexer.has("GT") ? {type: "GT"} : GT)]},
    {"name": "comparison_expression$subexpression$1", "symbols": [(lexer.has("LTE") ? {type: "LTE"} : LTE)]},
    {"name": "comparison_expression$subexpression$1", "symbols": [(lexer.has("GTE") ? {type: "GTE"} : GTE)]},
    {"name": "comparison_expression$subexpression$1", "symbols": [(lexer.has("EQ") ? {type: "EQ"} : EQ)]},
    {"name": "comparison_expression$subexpression$1", "symbols": [(lexer.has("NEQ") ? {type: "NEQ"} : NEQ)]},
    {"name": "comparison_expression$subexpression$1", "symbols": [(lexer.has("IN") ? {type: "IN"} : IN)]},
    {"name": "comparison_expression$subexpression$1$subexpression$1", "symbols": [(lexer.has("NOT") ? {type: "NOT"} : NOT), (lexer.has("IN") ? {type: "IN"} : IN)]},
    {"name": "comparison_expression$subexpression$1", "symbols": ["comparison_expression$subexpression$1$subexpression$1"]},
    {"name": "comparison_expression", "symbols": ["additive", "comparison_expression$subexpression$1", "additive"], "postprocess": d => ({ type: "comparison_expression", left: d[0], operator: d[1], right: d[2] })},
    {"name": "comparison_expression", "symbols": ["additive"], "postprocess": id},
    {"name": "additive$subexpression$1", "symbols": [(lexer.has("PLUS") ? {type: "PLUS"} : PLUS)]},
    {"name": "additive$subexpression$1", "symbols": [(lexer.has("MINUS") ? {type: "MINUS"} : MINUS)]},
    {"name": "additive", "symbols": ["additive", "additive$subexpression$1", "multiplicative"], "postprocess": d => ({type: "additive", left: d[0], operator: d[1], right: d[2]})},
    {"name": "additive", "symbols": ["multiplicative"], "postprocess": id},
    {"name": "multiplicative$subexpression$1", "symbols": [(lexer.has("MULT") ? {type: "MULT"} : MULT)]},
    {"name": "multiplicative$subexpression$1", "symbols": [(lexer.has("INTDIV") ? {type: "INTDIV"} : INTDIV)]},
    {"name": "multiplicative$subexpression$1", "symbols": [(lexer.has("DIV") ? {type: "DIV"} : DIV)]},
    {"name": "multiplicative$subexpression$1", "symbols": [(lexer.has("MOD") ? {type: "MOD"} : MOD)]},
    {"name": "multiplicative", "symbols": ["multiplicative", "multiplicative$subexpression$1", "unary"], "postprocess": d => ({type: "multiplicative", left: d[0], operator: d[1], right: d[2]})},
    {"name": "multiplicative", "symbols": ["unary"], "postprocess": id},
    {"name": "unary$subexpression$1", "symbols": [(lexer.has("PLUS") ? {type: "PLUS"} : PLUS)]},
    {"name": "unary$subexpression$1", "symbols": [(lexer.has("MINUS") ? {type: "MINUS"} : MINUS)]},
    {"name": "unary", "symbols": ["unary$subexpression$1", "unary"], "postprocess": d => ({type: "unary", operator: d[0], operand: d[1]})},
    {"name": "unary", "symbols": ["power"]},
    {"name": "power", "symbols": ["primary", (lexer.has("POWER") ? {type: "POWER"} : POWER), "unary"], "postprocess": d => ({type: "power", left: d[0], right: d[2]})},
    {"name": "power", "symbols": ["primary"], "postprocess": id},
    {"name": "primary", "symbols": ["function_call"], "postprocess": id},
    {"name": "primary", "symbols": ["method_call"], "postprocess": id},
    {"name": "primary", "symbols": ["array_access"], "postprocess": id},
    {"name": "primary", "symbols": ["list_slice"], "postprocess": id},
    {"name": "primary", "symbols": ["atom"], "postprocess": id},
    {"name": "function_call$ebnf$1", "symbols": ["arg_list"], "postprocess": id},
    {"name": "function_call$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "function_call", "symbols": ["primary", (lexer.has("LPAREN") ? {type: "LPAREN"} : LPAREN), "function_call$ebnf$1", (lexer.has("RPAREN") ? {type: "RPAREN"} : RPAREN)], "postprocess": d => ({ type: "function_call", func_name: d[0], args: d[2]})},
    {"name": "array_access", "symbols": ["primary", (lexer.has("LSQBRACK") ? {type: "LSQBRACK"} : LSQBRACK), "expression", (lexer.has("RSQBRACK") ? {type: "RSQBRACK"} : RSQBRACK)], "postprocess": d => ({ type: "array_access", array: d[0], index: d[2] })},
    {"name": "method_call$ebnf$1", "symbols": ["arg_list"], "postprocess": id},
    {"name": "method_call$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "method_call", "symbols": ["primary", (lexer.has("DOT") ? {type: "DOT"} : DOT), (lexer.has("IDENTIFIER") ? {type: "IDENTIFIER"} : IDENTIFIER), (lexer.has("LPAREN") ? {type: "LPAREN"} : LPAREN), "method_call$ebnf$1", (lexer.has("RPAREN") ? {type: "RPAREN"} : RPAREN)], "postprocess": d => ({type: "method_call", list: d[0], action: d[2], args: d[4]})},
    {"name": "list_slice$ebnf$1", "symbols": ["expression"], "postprocess": id},
    {"name": "list_slice$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "list_slice$ebnf$2", "symbols": ["expression"], "postprocess": id},
    {"name": "list_slice$ebnf$2", "symbols": [], "postprocess": () => null},
    {"name": "list_slice$ebnf$3$subexpression$1$ebnf$1", "symbols": ["expression"], "postprocess": id},
    {"name": "list_slice$ebnf$3$subexpression$1$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "list_slice$ebnf$3$subexpression$1", "symbols": [(lexer.has("COLON") ? {type: "COLON"} : COLON), "list_slice$ebnf$3$subexpression$1$ebnf$1"]},
    {"name": "list_slice$ebnf$3", "symbols": ["list_slice$ebnf$3$subexpression$1"], "postprocess": id},
    {"name": "list_slice$ebnf$3", "symbols": [], "postprocess": () => null},
    {"name": "list_slice", "symbols": ["primary", (lexer.has("LSQBRACK") ? {type: "LSQBRACK"} : LSQBRACK), "list_slice$ebnf$1", (lexer.has("COLON") ? {type: "COLON"} : COLON), "list_slice$ebnf$2", "list_slice$ebnf$3", (lexer.has("RSQBRACK") ? {type: "RSQBRACK"} : RSQBRACK)], "postprocess": d => ({type: "list_slice", list: d[0], start: d[2], stop: d[4], step: d[5] ? d[5][1] : null})},
    {"name": "atom", "symbols": ["number"], "postprocess": id},
    {"name": "atom", "symbols": [(lexer.has("IDENTIFIER") ? {type: "IDENTIFIER"} : IDENTIFIER)], "postprocess": d => ({ type: "identifier", name: d[0]})},
    {"name": "atom", "symbols": ["list_literal"], "postprocess": id},
    {"name": "atom", "symbols": [(lexer.has("NONE") ? {type: "NONE"} : NONE)], "postprocess": d => ({ type: "none_literal"})},
    {"name": "atom", "symbols": [(lexer.has("TRUE") ? {type: "TRUE"} : TRUE)], "postprocess": d => ({ type: "bool_true"})},
    {"name": "atom", "symbols": [(lexer.has("FALSE") ? {type: "FALSE"} : FALSE)], "postprocess": d => ({ type: "bool_false"})},
    {"name": "atom", "symbols": ["group"], "postprocess": id},
    {"name": "number", "symbols": [(lexer.has("HEX") ? {type: "HEX"} : HEX)], "postprocess": d => ({type: "hex", number: d[0].value})},
    {"name": "number", "symbols": [(lexer.has("BINARY") ? {type: "BINARY"} : BINARY)], "postprocess": d => ({type: "binary", number: d[0].value})},
    {"name": "number", "symbols": [(lexer.has("DECIMAL") ? {type: "DECIMAL"} : DECIMAL)], "postprocess": d => ({type: "decimal", number: d[0].value})},
    {"name": "number", "symbols": [(lexer.has("FLOAT") ? {type: "FLOAT"} : FLOAT)], "postprocess": d => ({type: "float", number: d[0].value})},
    {"name": "list_literal$ebnf$1", "symbols": ["arg_list"], "postprocess": id},
    {"name": "list_literal$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "list_literal", "symbols": [(lexer.has("LSQBRACK") ? {type: "LSQBRACK"} : LSQBRACK), "list_literal$ebnf$1", (lexer.has("RSQBRACK") ? {type: "RSQBRACK"} : RSQBRACK)], "postprocess": d => ({type: "list_literal", args: d[1]})},
    {"name": "group", "symbols": [(lexer.has("LPAREN") ? {type: "LPAREN"} : LPAREN), "expression", (lexer.has("RPAREN") ? {type: "RPAREN"} : RPAREN)], "postprocess": d => ({ type: "grouped_expr", expr: d[1] })}
  ],
  ParserStart: "program",
};

export default grammar;
