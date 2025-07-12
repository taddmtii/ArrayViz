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
    DECIMAL: /0|[1-9][0-9]*/,

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

%}

@lexer lexer

program -> statement_list {% id %}

number -> %HEX {% id %}
        | %BINARY {% id %}
        | %DECIMAL {% id %}

expression -> or_expression

#-----------------------------------------------------------------------------------------
# LOGIC EXPRESSIONS (LOWEST PRECEDENCE)
#-----------------------------------------------------------------------------------------

or_expression -> and_expression (%OR and_expression):*

and_expression -> not_expression (%AND not_expression):*

not_expression -> %NOT not_expression
                | comparison

#-----------------------------------------------------------------------------------------
# COMPARISON EXPRESSIONS
#-----------------------------------------------------------------------------------------

comparison -> additive ((%LTHAN | %GRTHAN | %LTHAN_EQ | %GRTHAN_EQ | %EQUALITY) additive):*

#-----------------------------------------------------------------------------------------
# ARITHMETIC EXPRESSIONS
#-----------------------------------------------------------------------------------------

# + or - (binary)
# LOWEST PRECEDENCE
additive -> additive %PLUS multiplicative 
          | additive %MINUS multiplicative
          | multiplicative

# *, /, //, %
multiplicative -> multiplicative %MULT unary
                | multiplicative %DIV unary
                | multiplicative %INTDIV unary
                | multiplicative %MOD unary
                | unary

# + or - (unary)
# HIGHEST PRECEDENCE
unary -> %PLUS unary
       | %MINUS unary
       | primary

#-----------------------------------------------------------------------------------------
# PRIMARY EXPRESSIONS (general expressions)
#-----------------------------------------------------------------------------------------

primary -> number
         | %IDENTIFIER
         | function_call
         | method_call
         | list
         | %NONE
         | %TRUE
         | %FALSE
         | %LPAREN expression %RPAREN # FOR GROUPING EXPRESSIONS

number_list -> number {% d => [d[0]] %}
             | number %COMMA number_list {% d => [d[0], ...d[2]] %} # 3 OR 3, OR 3, 4 OR 3, 4, 

list -> %LSQBRACK number_list %RSQBRACK {% d => ({ type: "list", values: d[1] }) %} # [1, 2, 3] 

statement -> assignment_statement
           | expression
           | if_statement
           | else_block 
           | for_loop 
           | while_loop 
           | func_def 
           | return_statement 
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

assignment_statement -> assignable_expression %EQ expression {% d => ({ type: "assignment_statement", var: d[0], value: d[2] }) %}  # i = 5, num = 2, nums[1] = 5 

array_access -> %IDENTIFIER %LSQBRACK expression %RSQBRACK {% d => ({ type: "array_access", array: d[0], index: d[2] }) %} # nums[1]

assignable_expression -> %IDENTIFIER {% id %} |
            array_access

return_statement -> %RETURN (expression):? {% d => ({ type: "return_statement", value: d[1]}) %} 

func_def -> %DEF %IDENTIFIER %LPAREN (arg_list):? %RPAREN %COLON block {% d => ({type: "function_definition", func_name: d[1], args: d[3], body: d[6]}) %}

function_call -> expression %LPAREN (arg_list):? %RPAREN {% d => ({ type: "function_call", func_name: d[0], args: d[2]}) %}

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
# 5. Slices
# 6. Grouping () (CHECK)
# 7. Expressions in list literal [1+2, 5+6]
# 8. Add floor division + Mod (remainder) (//, %) (CHECK)
# 9. Add float support
# 10. and, or, not keyword implementation
# 11. break, continue, pass keywords