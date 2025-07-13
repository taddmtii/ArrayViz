@{%
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
    FLOAT: /(?:[0-9]+\.[0-9]*)/,
    DECIMAL: /0|[1-9][0-9]*/,

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

// Overrides next method from lexer, automatically skips whitespace tokens.
lexer.next = (next => () => { // Captures the original next method, returns new func that becomes next method
    let tok;
    while ((tok = next.call(lexer)) && (tok.type === "WS" || tok.type === "COMMENT")) {} // keep getting tokens and disgard any tokens with type WS or NL
    return tok; // return first non WS token
})(lexer.next);

%}

@lexer lexer

program -> statement_list 

number -> %HEX {% d => ({type: "hex", number: d[0].value}) %}
        | %BINARY {% d => ({type: "binary", number: d[0].value}) %}
        | %DECIMAL {% d => ({type: "decimal", number: d[0].value}) %}
        | %FLOAT {% d => ({type: "float", number: d[0].value}) %}

expression -> conditional_expression

#-----------------------------------------------------------------------------------------
# CONDITIONAL EXPRESSIONS (LOWEST PRECEDENCE)
#-----------------------------------------------------------------------------------------

conditional_expression -> or_expression %IF or_expression %ELSE conditional_expression {% d => ({ type: "conditional_expression", left: d[0], condition: d[2], right: d[4]})  %}
                        | or_expression

#-----------------------------------------------------------------------------------------
# LOGIC EXPRESSIONS 
#-----------------------------------------------------------------------------------------

# or_expression -> and_expression (%OR and_expression):* {% d => ({ type: "or_expression", left: d[0], right: [...(d[1] ? d[1].map(x => x[1]) : [])] })  %}
or_expression -> or_expression %OR and_expression {% d => ({ type: "or_expression", left: d[0], right: d[2] })  %}
               | and_expression

# dos ame thing from or to (and + comparison)

and_expression -> and_expression %AND not_expression {% d => ({ type: "and_expression", left: d[0], right: d[2] })  %}
                | not_expression

not_expression -> %NOT not_expression {% d => ({ type: "not_expression", expression: d[1]}) %}
                | comparison_expression

#-----------------------------------------------------------------------------------------
# COMPARISON EXPRESSIONS
#-----------------------------------------------------------------------------------------

comparison_expression -> additive (%LT | %GT | %LTE | %GTE | %EQ | %NEQ | %IN | (%NOT %IN)) additive {% d => ({ type: "comparison_expression", left: d[0], operator: d[1], right: d[2] })  %}
            | additive

#-----------------------------------------------------------------------------------------
# ARITHMETIC EXPRESSIONS
#-----------------------------------------------------------------------------------------

# + or - (binary)
# LOWEST PRECEDENCE
additive -> additive (%PLUS | %MINUS) multiplicative {% d => ({type: "additive", left: d[0], operator: d[1], right: d[2]}) %}
          | multiplicative

# *, /, //, %
multiplicative -> multiplicative (%MULT | %INTDIV | %DIV | %MOD) unary {% d => ({type: "multiplicative", left: d[0], operator: d[1], right: d[2]}) %}
                | unary

# + or - (unary)
unary -> (%PLUS | %MINUS) unary {% d => ({type: "unary", operator: d[0], operand: d[1]}) %}
       | power

# ** (power)
# HIGHEST PRECEDENCE
power -> primary %POWER unary {% d => ({type: "power", left: d[0], right: d[2]}) %}
       | primary 

#-----------------------------------------------------------------------------------------
# PRIMARY EXPRESSIONS (general expressions)
#-----------------------------------------------------------------------------------------

primary -> function_call
         | method_call
         | array_access
         | list_slice
         | atom

list_slice -> primary %LSQBRACK expression:? %COLON expression:? (%COLON expression):? %RSQBRACK {% d => ({type: "list_slice", list: d[0], start: d[2], stop: d[4], step: d[6]}) %}

atom -> number
      | %IDENTIFIER
      | list
      | %NONE
      | %TRUE
      | %FALSE
      | group

group -> %LPAREN expression %RPAREN {% d => ({type: "grouped_expression", expression: d[1]}) %} # FOR GROUPING EXPRESSIONS

list -> %LSQBRACK (arg_list):? %RSQBRACK {% d => ({type: "list_literal", args: d[1]}) %}

statement -> assignment_statement
           | expression
           | if_statement
           | else_block 
           | for_loop 
           | while_loop 
           | func_def 
           | return_statement 
           | %BREAK
           | %CONTINUE
           | %PASS
           | %NL

for_loop -> %FOR %IDENTIFIER %IN %RANGE %LPAREN number %RPAREN %COLON block {% d => ({ type: "for_in_range_loop", temp_var: d[1], range: d[5], body: d[8] }) %} |
            %FOR %IDENTIFIER %IN %IDENTIFIER %COLON block {% d => ({ type: "for_loop", temp_var: d[1], range: d[3], body: d[5] }) %}

while_loop -> %WHILE expression %COLON block {% d => ({ type: "while_loop", expression: d[1], body: d[3]}) %}

if_statement -> %IF expression %COLON block {% d => ({ type: "if_statement", expression: d[1], body: d[3] }) %} |
                %IF expression %COLON block elif_statement {% d => ({ type: "if_statement", expression: d[1], body: d[3] }) %} |
                %IF expression %COLON block else_block {% d => ({ type: "if_statement", expression: d[1], body: d[3] }) %}

elif_statement -> %ELIF expression %COLON block elif_statement {% d => ({ type: "elif_statement", expression: d[1], body: d[3] }) %} |
                  %ELIF expression %COLON block else_block {% d => ({ type: "elif_statement", expression: d[1], body: d[3] }) %} |
                  %ELIF expression %COLON block {% d => ({ type: "elif_statement", expression: d[1], body: d[3] }) %}

else_block -> %ELSE %COLON block {% d => ({ type: "else_block", body: d[2] }) %}

assignment_statement -> (%IDENTIFIER | array_access) %ASSIGNMENT expression {% d => ({ type: "assignment_statement", var: d[0], value: d[2] }) %}  # i = 5, num = 2, nums[1] = 5 

array_access -> %IDENTIFIER %LSQBRACK expression %RSQBRACK {% d => ({ type: "array_access", array: d[0], index: d[2] }) %} # nums[1]

return_statement -> %RETURN (expression):? {% d => ({ type: "return_statement", value: d[1]}) %} 

func_def -> %DEF %IDENTIFIER %LPAREN (arg_list):? %RPAREN %COLON block {% d => ({type: "function_definition", func_name: d[1], args: d[3], body: d[6]}) %}

function_call -> %IDENTIFIER %LPAREN (arg_list):? %RPAREN {% d => ({ type: "function_call", func_name: d[0], args: d[2]}) %}

method_call -> expression %DOT %IDENTIFIER %LPAREN (arg_list):? %RPAREN {% d => ({type: "method_call", list: d[0], action: d[2], args: d[4]}) %}  # nums.remove(5) || nums.remove(num)

arg_list -> expression (%COMMA expression):* {% d => [d[0], ...(d[1] ? d[1].map(x => x[1]) : [])] %}

block -> %NL %INDENT statement_list %DEDENT {% d => ({type: "block", statements: d[2]}) %}
       | statement

statement_list -> statement {% d => [d[0]] %} |
                  statement statement_list {% d => [d[0], ...d[1]] %}

# TODO:
# 1a. Precedence (CHECK)
# 1. True/False (CHECK)
# 2. None (CHECK)
# 3. Unary +/- (CHECK)
# 5. Slices (CHECK)
# 6. Grouping () (CHECK)
# 7. Expressions in list literal [1+2, 5+6] (CHECK)
# 8. Add floor division + Mod (remainder) (//, %) (CHECK)
# 9. Add float support (CHECK)
# 10. and, or, not keyword implementation (CHECK)
# 11. break, continue, pass keywords (CHECK)