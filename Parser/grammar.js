// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

//import * as moo from 'moo';
//import IndentationLexer from 'moo-indentation-lexer';
const moo = require("moo");
const IndentationLexer = require('moo-indentation-lexer')
const { ProgramNode, 
        StatementNode, 
        AssignmentStatementNode, 
        ReturnStatementNode,
        BreakStatementNode, 
        ContinueStatementNode, 
        PassStatementNode,
        IfStatementNode,
        ForStatementNode,
        WhileStatementNode,
        FuncDefStatementNode,
        ElifStatementNode,
        ElseBlockStatementNode,
        ExpresssionStatementNode,
        BlockStatementNode,
        ExpressionNode,
        FormalParamsListExpressionNode,
        ConditionalExpressionNode,
        ArgListExpressionNode,
        ComparisonExpressionNode,
        BinaryExpressionNode,
        UnaryExpressionNode,
        FuncCallExpresssionNode,
        ListAccessExpresssionNode,
        MethodCallExpressionNode,
        ListSliceExpressionNode,
        NumberLiteralExpressionNode,
        ListLiteralExpressionNode,
        BooleanLiteralExpressionNode,
        StringLiteralExpressionNode,
        IdentifierExpressionNode
        } = require('./parse_tree.js');
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

    // STRINGS

    // also account for escape single and double quotes within string
    // also add f-strings
    STRING_SINGLE: /'(?:[^'\\]|\\.)*'/, // matches anything but single quotes and backslashes.
    STRING_DOUBLE: /"(?:[^"\\]|\\.)*"/, // matches anything but double quotes and backslashes.
    STRING_TRIPLE: /'''(?:[^"\\]|\\.)*'''/, // come back to this, triple double and single + allow for new lines

    ARROW: "->",

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

var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "program", "symbols": ["statement_list"], "postprocess": id},
    {"name": "statement_list$ebnf$1", "symbols": ["statement"]},
    {"name": "statement_list$ebnf$1", "symbols": ["statement_list$ebnf$1", "statement"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "statement_list", "symbols": ["statement_list$ebnf$1"], "postprocess": d => (new ProgramNode(new StatementNode(d[0])))},
    {"name": "statement", "symbols": ["simple_statement", (lexer.has("NL") ? {type: "NL"} : NL)], "postprocess": d => [d[0]]},
    {"name": "statement", "symbols": ["compound_statement"], "postprocess": id},
    {"name": "statement", "symbols": [(lexer.has("NL") ? {type: "NL"} : NL)], "postprocess": d => null},
    {"name": "simple_statement", "symbols": ["assignment_statement"], "postprocess": id},
    {"name": "simple_statement", "symbols": ["return_statement"], "postprocess": id},
    {"name": "simple_statement", "symbols": [(lexer.has("BREAK") ? {type: "BREAK"} : BREAK)], "postprocess": d => (new BreakStatementNode(d[0]))},
    {"name": "simple_statement", "symbols": [(lexer.has("CONTINUE") ? {type: "CONTINUE"} : CONTINUE)], "postprocess": d => (new ContinueStatementNode(d[0]))},
    {"name": "simple_statement", "symbols": [(lexer.has("PASS") ? {type: "PASS"} : PASS)], "postprocess": d => (new PassStatementNode(d[0]))},
    {"name": "simple_statement", "symbols": ["expression"], "postprocess": d => (new ExpressionNode(d[0]))},
    {"name": "compound_statement", "symbols": ["if_statement"], "postprocess": id},
    {"name": "compound_statement", "symbols": ["for_loop"], "postprocess": id},
    {"name": "compound_statement", "symbols": ["while_loop"], "postprocess": id},
    {"name": "compound_statement", "symbols": ["func_def"], "postprocess": id},
    {"name": "assignment_statement$subexpression$1", "symbols": [(lexer.has("IDENTIFIER") ? {type: "IDENTIFIER"} : IDENTIFIER)]},
    {"name": "assignment_statement$subexpression$1", "symbols": ["list_access"]},
    {"name": "assignment_statement", "symbols": ["assignment_statement$subexpression$1", (lexer.has("ASSIGNMENT") ? {type: "ASSIGNMENT"} : ASSIGNMENT), "expression"], "postprocess": d => (new AssignmentStatementNode(d[0], new ExpressionNode(d[2])))},
    {"name": "if_statement$ebnf$1$subexpression$1", "symbols": ["elif_statement"]},
    {"name": "if_statement$ebnf$1$subexpression$1", "symbols": ["else_block"]},
    {"name": "if_statement$ebnf$1", "symbols": ["if_statement$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "if_statement$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "if_statement", "symbols": [(lexer.has("IF") ? {type: "IF"} : IF), "expression", (lexer.has("COLON") ? {type: "COLON"} : COLON), "block", "if_statement$ebnf$1"], "postprocess": d => (new IfStatementNode(new ExpressionNode(d[1]), new BlockStatementNode(d[3]), new ElseBlockStatementNode(d[4])))},
    {"name": "elif_statement$ebnf$1$subexpression$1", "symbols": ["elif_statement"]},
    {"name": "elif_statement$ebnf$1$subexpression$1", "symbols": ["else_block"]},
    {"name": "elif_statement$ebnf$1", "symbols": ["elif_statement$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "elif_statement$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "elif_statement", "symbols": [(lexer.has("ELIF") ? {type: "ELIF"} : ELIF), "expression", (lexer.has("COLON") ? {type: "COLON"} : COLON), "block", "elif_statement$ebnf$1"], "postprocess": d => (new ElifStatementNode(new ExpressionNode(d[1]), new BlockStatementNode(d[3]), new ElseBlockStatementNode(d[4])))},
    {"name": "else_block", "symbols": [(lexer.has("ELSE") ? {type: "ELSE"} : ELSE), (lexer.has("COLON") ? {type: "COLON"} : COLON), "block"], "postprocess": d => (new ElseBlockStatementNode(new BlockStatementNode(d[2])))},
    {"name": "for_loop", "symbols": [(lexer.has("FOR") ? {type: "FOR"} : FOR), (lexer.has("IDENTIFIER") ? {type: "IDENTIFIER"} : IDENTIFIER), (lexer.has("IN") ? {type: "IN"} : IN), "expression", (lexer.has("COLON") ? {type: "COLON"} : COLON), "block"], "postprocess": d => (new ForStatementNode(new IdentifierExpressionNode(d[1]), new ExpressionNode(d[3]), new BlockStatementNode(d[5])))},
    {"name": "while_loop", "symbols": [(lexer.has("WHILE") ? {type: "WHILE"} : WHILE), "expression", (lexer.has("COLON") ? {type: "COLON"} : COLON), "block"], "postprocess": d => (new WhileStatementNode(new ExpressionNode(d[1]), new BlockStatementNode(d[3])))},
    {"name": "func_def$ebnf$1$subexpression$1", "symbols": ["formal_params_list"]},
    {"name": "func_def$ebnf$1", "symbols": ["func_def$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "func_def$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "func_def$ebnf$2$subexpression$1", "symbols": [(lexer.has("ARROW") ? {type: "ARROW"} : ARROW), "expression"]},
    {"name": "func_def$ebnf$2", "symbols": ["func_def$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "func_def$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "func_def", "symbols": [(lexer.has("DEF") ? {type: "DEF"} : DEF), (lexer.has("IDENTIFIER") ? {type: "IDENTIFIER"} : IDENTIFIER), (lexer.has("LPAREN") ? {type: "LPAREN"} : LPAREN), "func_def$ebnf$1", (lexer.has("RPAREN") ? {type: "RPAREN"} : RPAREN), "func_def$ebnf$2", (lexer.has("COLON") ? {type: "COLON"} : COLON), "block"], "postprocess": d => (new FuncDefStatementNode(new IdentifierExpressionNode(d[1]), new FormalParamsListExpressionNode(d[3]), new BlockStatementNode(d[7])))},
    {"name": "formal_params_list$ebnf$1", "symbols": []},
    {"name": "formal_params_list$ebnf$1$subexpression$1", "symbols": [(lexer.has("COMMA") ? {type: "COMMA"} : COMMA), (lexer.has("IDENTIFIER") ? {type: "IDENTIFIER"} : IDENTIFIER)]},
    {"name": "formal_params_list$ebnf$1", "symbols": ["formal_params_list$ebnf$1", "formal_params_list$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "formal_params_list", "symbols": [(lexer.has("IDENTIFIER") ? {type: "IDENTIFIER"} : IDENTIFIER), "formal_params_list$ebnf$1"], "postprocess": d => new FormalParamsListExpressionNode(new IdentifierExpressionNode(d[0]), new IdentifierExpressionNode(...(d[1] ? d[1].map(x => x[1]) : [])))},
    {"name": "arg_list$ebnf$1", "symbols": []},
    {"name": "arg_list$ebnf$1$subexpression$1", "symbols": [(lexer.has("COMMA") ? {type: "COMMA"} : COMMA), "expression"]},
    {"name": "arg_list$ebnf$1", "symbols": ["arg_list$ebnf$1", "arg_list$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "arg_list", "symbols": ["expression", "arg_list$ebnf$1"], "postprocess": d => [d[0], ...(d[1] ? d[1].map(x => x[1]) : [])]},
    {"name": "block", "symbols": [(lexer.has("NL") ? {type: "NL"} : NL), (lexer.has("INDENT") ? {type: "INDENT"} : INDENT), "statement_list", (lexer.has("DEDENT") ? {type: "DEDENT"} : DEDENT)], "postprocess": d => (new BlockStatementNode(d[2]))},
    {"name": "block", "symbols": ["simple_statement", (lexer.has("NL") ? {type: "NL"} : NL)], "postprocess": d => (new BlockStatementNode(d[0]))},
    {"name": "return_statement$ebnf$1", "symbols": ["expression"], "postprocess": id},
    {"name": "return_statement$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "return_statement", "symbols": [(lexer.has("RETURN") ? {type: "RETURN"} : RETURN), "return_statement$ebnf$1"], "postprocess": d => (new ReturnStatementNode(d[1]))},
    {"name": "expression", "symbols": ["conditional_expression"], "postprocess": id},
    {"name": "conditional_expression", "symbols": ["or_expression", (lexer.has("IF") ? {type: "IF"} : IF), "or_expression", (lexer.has("ELSE") ? {type: "ELSE"} : ELSE), "conditional_expression"], "postprocess": d => (new ConditionalExpressionNode(new ExpressionNode(d[0]), new ExpressionNode(d[2]), new ExpressionNode(d[4])) )},
    {"name": "conditional_expression", "symbols": ["or_expression"], "postprocess": id},
    {"name": "or_expression", "symbols": ["or_expression", (lexer.has("OR") ? {type: "OR"} : OR), "and_expression"], "postprocess": d => (new BinaryExpressionNode(new ExpressionNode(d[0]), d[1], new ExpressionNode(d[2])))},
    {"name": "or_expression", "symbols": ["and_expression"], "postprocess": id},
    {"name": "and_expression", "symbols": ["and_expression", (lexer.has("AND") ? {type: "AND"} : AND), "not_expression"], "postprocess": d => (new BinaryExpressionNode(new ExpressionNode(d[0]), d[1], new ExpressionNode(d[2])))},
    {"name": "and_expression", "symbols": ["not_expression"], "postprocess": id},
    {"name": "not_expression", "symbols": [(lexer.has("NOT") ? {type: "NOT"} : NOT), "not_expression"], "postprocess": d => (new UnaryExpressionNode(d[0], new ExpressionNode(d[1])))},
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
    {"name": "comparison_expression", "symbols": ["additive", "comparison_expression$subexpression$1", "additive"], "postprocess": d => (new ComparisonExpressionNode(new ExpressionNode(d[0]), d[1], new ExpressionNode(d[2])))},
    {"name": "comparison_expression", "symbols": ["additive"], "postprocess": id},
    {"name": "additive$subexpression$1", "symbols": [(lexer.has("PLUS") ? {type: "PLUS"} : PLUS)]},
    {"name": "additive$subexpression$1", "symbols": [(lexer.has("MINUS") ? {type: "MINUS"} : MINUS)]},
    {"name": "additive", "symbols": ["additive", "additive$subexpression$1", "multiplicative"], "postprocess": d => (new BinaryExpressionNode(new ExpressionNode(d[0]), d[1], new ExpressionNode(d[2])))},
    {"name": "additive", "symbols": ["multiplicative"], "postprocess": id},
    {"name": "multiplicative$subexpression$1", "symbols": [(lexer.has("MULT") ? {type: "MULT"} : MULT)]},
    {"name": "multiplicative$subexpression$1", "symbols": [(lexer.has("INTDIV") ? {type: "INTDIV"} : INTDIV)]},
    {"name": "multiplicative$subexpression$1", "symbols": [(lexer.has("DIV") ? {type: "DIV"} : DIV)]},
    {"name": "multiplicative$subexpression$1", "symbols": [(lexer.has("MOD") ? {type: "MOD"} : MOD)]},
    {"name": "multiplicative", "symbols": ["multiplicative", "multiplicative$subexpression$1", "unary"], "postprocess": d => (new BinaryExpressionNode(new ExpressionNode(d[0]), d[1], new ExpressionNode(d[2])))},
    {"name": "multiplicative", "symbols": ["unary"], "postprocess": id},
    {"name": "unary$subexpression$1", "symbols": [(lexer.has("PLUS") ? {type: "PLUS"} : PLUS)]},
    {"name": "unary$subexpression$1", "symbols": [(lexer.has("MINUS") ? {type: "MINUS"} : MINUS)]},
    {"name": "unary", "symbols": ["unary$subexpression$1", "unary"], "postprocess": d => (new UnaryExpressionNode(d[0].value, new ExpressionNode(d[1])))},
    {"name": "unary", "symbols": ["power"]},
    {"name": "power", "symbols": ["primary", (lexer.has("POWER") ? {type: "POWER"} : POWER), "unary"], "postprocess": d => (new BinaryExpressionNode(new ExpressionNode(d[0]), d[1], new ExpressionNode(d[2])))},
    {"name": "power", "symbols": ["primary"], "postprocess": id},
    {"name": "primary", "symbols": ["function_call"], "postprocess": id},
    {"name": "primary", "symbols": ["method_call"], "postprocess": id},
    {"name": "primary", "symbols": ["list_access"], "postprocess": id},
    {"name": "primary", "symbols": ["list_slice"], "postprocess": id},
    {"name": "primary", "symbols": ["atom"], "postprocess": id},
    {"name": "function_call$ebnf$1", "symbols": ["arg_list"], "postprocess": id},
    {"name": "function_call$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "function_call", "symbols": ["primary", (lexer.has("LPAREN") ? {type: "LPAREN"} : LPAREN), "function_call$ebnf$1", (lexer.has("RPAREN") ? {type: "RPAREN"} : RPAREN)], "postprocess": d => (new FuncCallExpresssionNode(new ExpressionNode(d[0]), new ArgListExpressionNode(d[2])))},
    {"name": "list_access", "symbols": ["primary", (lexer.has("LSQBRACK") ? {type: "LSQBRACK"} : LSQBRACK), "expression", (lexer.has("RSQBRACK") ? {type: "RSQBRACK"} : RSQBRACK)], "postprocess": d => (new ListAccessExpresssionNode(new ExpressionNode(d[0]), new ExpressionNode(d[2])))},
    {"name": "method_call$ebnf$1", "symbols": ["arg_list"], "postprocess": id},
    {"name": "method_call$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "method_call", "symbols": ["primary", (lexer.has("DOT") ? {type: "DOT"} : DOT), (lexer.has("IDENTIFIER") ? {type: "IDENTIFIER"} : IDENTIFIER), (lexer.has("LPAREN") ? {type: "LPAREN"} : LPAREN), "method_call$ebnf$1", (lexer.has("RPAREN") ? {type: "RPAREN"} : RPAREN)], "postprocess": d => (new MethodCallExpressionNode(new ExpressionNode(d[0]), new IdentifierExpressionNode(d[2]), new ArgListExpressionNode(d[4])))},
    {"name": "list_slice$ebnf$1", "symbols": ["expression"], "postprocess": id},
    {"name": "list_slice$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "list_slice$ebnf$2", "symbols": ["expression"], "postprocess": id},
    {"name": "list_slice$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "list_slice$ebnf$3$subexpression$1$ebnf$1", "symbols": ["expression"], "postprocess": id},
    {"name": "list_slice$ebnf$3$subexpression$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "list_slice$ebnf$3$subexpression$1", "symbols": [(lexer.has("COLON") ? {type: "COLON"} : COLON), "list_slice$ebnf$3$subexpression$1$ebnf$1"]},
    {"name": "list_slice$ebnf$3", "symbols": ["list_slice$ebnf$3$subexpression$1"], "postprocess": id},
    {"name": "list_slice$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "list_slice", "symbols": ["primary", (lexer.has("LSQBRACK") ? {type: "LSQBRACK"} : LSQBRACK), "list_slice$ebnf$1", (lexer.has("COLON") ? {type: "COLON"} : COLON), "list_slice$ebnf$2", "list_slice$ebnf$3", (lexer.has("RSQBRACK") ? {type: "RSQBRACK"} : RSQBRACK)], "postprocess": d => (new ListSliceExpressionNode(new ExpressionNode(d[0]), new ExpressionNode(d[2]), new ExpressionNode(d[5]), new ExpressionNode(d[6]) ))},
    {"name": "atom", "symbols": ["number"], "postprocess": id},
    {"name": "atom", "symbols": [(lexer.has("STRING_SINGLE") ? {type: "STRING_SINGLE"} : STRING_SINGLE)], "postprocess": d => (new StringLiteralExpressionNode(d[0].value))},
    {"name": "atom", "symbols": [(lexer.has("STRING_DOUBLE") ? {type: "STRING_DOUBLE"} : STRING_DOUBLE)], "postprocess": d => (new StringLiteralExpressionNode(d[0].value))},
    {"name": "atom", "symbols": [(lexer.has("IDENTIFIER") ? {type: "IDENTIFIER"} : IDENTIFIER)], "postprocess": d => (new IdentifierExpressionNode(d[0].value))},
    {"name": "atom", "symbols": ["list_literal"], "postprocess": id},
    {"name": "atom", "symbols": [(lexer.has("NONE") ? {type: "NONE"} : NONE)], "postprocess": d => null},
    {"name": "atom", "symbols": [(lexer.has("TRUE") ? {type: "TRUE"} : TRUE)], "postprocess": d => (new BooleanLiteralExpressionNode(d[0].value))},
    {"name": "atom", "symbols": [(lexer.has("FALSE") ? {type: "FALSE"} : FALSE)], "postprocess": d => (new BooleanLiteralExpressionNode(d[0].value))},
    {"name": "atom", "symbols": ["group"], "postprocess": id},
    {"name": "number", "symbols": [(lexer.has("HEX") ? {type: "HEX"} : HEX)], "postprocess": d => (new NumberLiteralExpressionNode(d[0].value))},
    {"name": "number", "symbols": [(lexer.has("BINARY") ? {type: "BINARY"} : BINARY)], "postprocess": d => (new NumberLiteralExpressionNode(d[0].value))},
    {"name": "number", "symbols": [(lexer.has("DECIMAL") ? {type: "DECIMAL"} : DECIMAL)], "postprocess": d => (new NumberLiteralExpressionNode(d[0].value))},
    {"name": "number", "symbols": [(lexer.has("FLOAT") ? {type: "FLOAT"} : FLOAT)], "postprocess": d => (new NumberLiteralExpressionNode(d[0].value))},
    {"name": "list_literal$ebnf$1", "symbols": ["arg_list"], "postprocess": id},
    {"name": "list_literal$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "list_literal", "symbols": [(lexer.has("LSQBRACK") ? {type: "LSQBRACK"} : LSQBRACK), "list_literal$ebnf$1", (lexer.has("RSQBRACK") ? {type: "RSQBRACK"} : RSQBRACK)], "postprocess": d => (new ListLiteralExpressionNode(d[1]))},
    {"name": "group", "symbols": [(lexer.has("LPAREN") ? {type: "LPAREN"} : LPAREN), "expression", (lexer.has("RPAREN") ? {type: "RPAREN"} : RPAREN)], "postprocess": d => d[1]}
]
  , ParserStart: "program"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
