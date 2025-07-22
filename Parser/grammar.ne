
@{%
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

%}

@lexer lexer

program -> statement_list {% id %}

statement_list -> statement:+ {% d => (new ProgramNode(new StatementNode(d[0]))) %}

statement -> simple_statement %NL {% d => [d[0]] %} 
           | compound_statement {% id %} # compound statement already eats newline. 
           | %NL {% d => null %}

# A simple statement is a standalone statement.
simple_statement -> assignment_statement {% id %}
                  | return_statement {% id %}
                  | %BREAK  {% d => (new BreakStatementNode(d[0])) %}
                  | %CONTINUE {% d => (new ContinueStatementNode(d[0])) %}
                  | %PASS {% d => (new PassStatementNode(d[0])) %}
                  | expression {% d => (new ExpressionNode(d[0])) %}

# A compound statement is a statement is a statement explitly followed by a block (or a list of statements).
compound_statement -> if_statement {% id %}
                    | for_loop {% id %}
                    | while_loop {% id %}
                    | func_def  {% id %}

assignment_statement -> (%IDENTIFIER | list_access) %ASSIGNMENT expression {% d => (new AssignmentStatementNode(d[0], d[2])) %}

if_statement -> %IF expression %COLON block (elif_statement | else_block):? {% d => (new IfStatementNode(d[1], d[3], d[4])) %}

elif_statement -> %ELIF expression %COLON block (elif_statement | else_block):? {% d => (new ElifStatementNode(d[1], d[3], d[4])) %}

else_block -> %ELSE %COLON block {% d => (new ElseBlockStatementNode(d[2])) %}

# may later need to deal with multiple assignment/unpacking (for x, y in enumerate()) may affect assignment statement
for_loop -> %FOR %IDENTIFIER %IN expression %COLON block {% d => (new ForStatementNode(d[1], d[3], d[5])) %}

while_loop -> %WHILE expression %COLON block {% d => (new WhileStatementNode(d[1], d[3])) %}

func_def -> %DEF %IDENTIFIER %LPAREN (formal_params_list):? %RPAREN (%ARROW expression):? %COLON block {% d => (new FuncDefStatementNode(d[1], d[3])) %}

formal_params_list -> %IDENTIFIER (%COMMA %IDENTIFIER):* {% d => new FormalParamsListExpressionNode(new IdentifierExpressionNode(d[0]), new IdentifierExpressionNode(...(d[1] ? d[1].map(x => x[1]) : []))) %}

arg_list -> expression (%COMMA expression):* {% d => [d[0], ...(d[1] ? d[1].map(x => x[1]) : [])] %}

block -> %NL %INDENT statement_list %DEDENT {% d => ({type: "block", statements: d[2]}) %}
       | simple_statement %NL {% d => ({type: "block", statements: [d[0]]}) %}

return_statement -> %RETURN expression:? {% d => ({ type: "return_statement", value: (d[1] ? d[1] : null) }) %} 

expression -> conditional_expression {% id %}

#-----------------------------------------------------------------------------------------
# CONDITIONAL EXPRESSIONS (LOWEST PRECEDENCE)
#-----------------------------------------------------------------------------------------

conditional_expression -> or_expression %IF or_expression %ELSE conditional_expression {% d => ({ type: "conditional_expression", left: d[0], condition: d[2], right: d[4]})  %}
                        | or_expression {% id %}

#-----------------------------------------------------------------------------------------
# LOGIC EXPRESSIONS 
#-----------------------------------------------------------------------------------------

# or_expression -> and_expression (%OR and_expression):* {% d => ({ type: "or_expression", left: d[0], right: [...(d[1] ? d[1].map(x => x[1]) : [])] })  %}
or_expression -> or_expression %OR and_expression {% d => ({ type: "or_expression", left: d[0], right: d[2] })  %}
               | and_expression {% id %}

and_expression -> and_expression %AND not_expression {% d => ({ type: "and_expression", left: d[0], right: d[2] })  %}
                | not_expression {% id %}

not_expression -> %NOT not_expression {% d => ({ type: "not_expression", expression: d[1]}) %}
                | comparison_expression {% id %}

#-----------------------------------------------------------------------------------------
# COMPARISON EXPRESSIONS
#-----------------------------------------------------------------------------------------

comparison_expression -> additive (%LT | %GT | %LTE | %GTE | %EQ | %NEQ | %IN | (%NOT %IN)) additive {% d => ({ type: "comparison_expression", left: d[0], operator: d[1], right: d[2] })  %}
            | additive {% id %}

#-----------------------------------------------------------------------------------------
# ARITHMETIC EXPRESSIONS
#-----------------------------------------------------------------------------------------

# + or - (binary)
# LOWEST PRECEDENCE
additive -> additive (%PLUS | %MINUS) multiplicative {% d => ({type: "additive", left: d[0], operator: d[1], right: d[2]}) %}
          | multiplicative {% id %}

# *, /, //, %
multiplicative -> multiplicative (%MULT | %INTDIV | %DIV | %MOD) unary {% d => ({type: "multiplicative", left: d[0], operator: d[1], right: d[2]}) %}
                | unary {% id %}

# + or - (unary)
unary -> (%PLUS | %MINUS) unary {% d => ({type: "unary", operator: d[0], operand: d[1]}) %}
       | power

# ** (power)
# HIGHEST PRECEDENCE
power -> primary %POWER unary {% d => ({type: "power", left: d[0], right: d[2]}) %}
       | primary {% id %}

#-----------------------------------------------------------------------------------------
# PRIMARY EXPRESSIONS (general expressions)
#-----------------------------------------------------------------------------------------

primary -> function_call {% id %}
         | method_call {% id %}
         | list_access {% id %}
         | list_slice {% id %}
         | atom {% id %}

function_call -> primary %LPAREN arg_list:? %RPAREN {% d => ({ type: "function_call", func_name: d[0], args: d[2]}) %}

list_access -> primary %LSQBRACK expression %RSQBRACK {% d => ({ type: "list_access", list: d[0], index: d[2] }) %} # nums[1]

method_call -> primary %DOT %IDENTIFIER %LPAREN arg_list:? %RPAREN {% d => ({type: "method_call", list: d[0], action: d[2], args: d[4]}) %}  # nums.remove(5) || nums.remove(num)

list_slice -> primary %LSQBRACK expression:? %COLON expression:? (%COLON expression:?):? %RSQBRACK {% d => ({type: "list_slice", list: d[0], start: d[2], stop: d[4], step: d[5] ? d[5][1] : null}) %}

atom -> number {% d => (new NumberLiteralExpressionNode(d[0])) %}
      | %STRING_SINGLE {% d => ({ type: "string_single", content: d[0].value}) %}
      | %STRING_DOUBLE {% d => ({ type: "string_double", content: d[0].value}) %}
      | %IDENTIFIER {% d => ({ type: "identifier", name: d[0]}) %}
      | list_literal {% id %}
      | %NONE {% d => ({ type: "none_literal"}) %}
      | %TRUE {% d => ({ type: "bool_true"}) %}
      | %FALSE {% d => ({ type: "bool_false"}) %}
      | group {% id %}

number -> %HEX {% d => ({type: "hex", number: d[0].value}) %}
        | %BINARY {% d => ({type: "binary", number: d[0].value}) %}
        | %DECIMAL {% d => ({type: "decimal", number: d[0].value}) %}
        | %FLOAT {% d => ({type: "float", number: d[0].value}) %}

list_literal -> %LSQBRACK arg_list:? %RSQBRACK {% d => ({type: "list_literal", args: d[1]}) %}

group -> %LPAREN expression %RPAREN {% d => ({ type: "grouped_expr", expr: d[1] }) %} 
