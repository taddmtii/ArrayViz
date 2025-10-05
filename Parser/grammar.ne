
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
        ListAccessExpressionNode,
        MethodCallExpressionNode,
        ListSliceExpressionNode,
        NumberLiteralExpressionNode,
        ListLiteralExpressionNode,
        BooleanLiteralExpressionNode,
        StringLiteralExpressionNode,
        IdentifierExpressionNode
        } = require('./Nodes.js');
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

statement_list -> statement:+ {% d => new ProgramNode(d[0].filter(statement => statement !== null)) %} # statements cannot be null.

statement -> simple_statement %NL {% d => d[0] %} 
           | compound_statement {% d => d[0] %} # compound statement already eats newline. 
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

assignment_statement -> %IDENTIFIER %ASSIGNMENT expression {% d => (new AssignmentStatementNode(d[0].text, d[2], d[0])) %}
                    #   | list_access %ASSIGNMENT expression {% d => (new AssignmentStatementNode(d[0], d[2], d[0])) %}

if_statement -> %IF expression %COLON block (elif_statement | else_block):? {% d => (new IfStatementNode(d[1], d[3], d[4] ? d[4][0] : null, d[0])) %}

elif_statement -> %ELIF expression %COLON block (elif_statement | else_block):? {% d => (new ElifStatementNode(d[1], d[3], d[4] ? d[4][0] : null, d[0])) %}

else_block -> %ELSE %COLON block {% d => (new ElseBlockStatementNode(d[2], d[0])) %}

for_loop -> %FOR %IDENTIFIER %IN expression %COLON block {% d => (new ForStatementNode(new IdentifierExpressionNode(d[1]), d[3], d[5], d[0])) %}

while_loop -> %WHILE expression %COLON block {% d => (new WhileStatementNode(d[1], d[3], d[0])) %}

func_def -> %DEF %IDENTIFIER %LPAREN (formal_params_list):? %RPAREN (%ARROW expression):? %COLON block {% d => (new FuncDefStatementNode(new IdentifierExpressionNode(d[1]), d[3], d[7], d[0])) %}

# come back, multiple params and args not working
formal_params_list -> %IDENTIFIER (%COMMA %IDENTIFIER):* {% d => new FormalParamsListExpressionNode(new IdentifierExpressionNode(d[0]), ...(d[1].map(x => new IdentifierExpressionNode(x[1])))) %} 

arg_list -> expression (%COMMA expression):* {% d => new ArgListExpressionNode(d[0], ...(d[1] ? d[1].map(x => x[1]) : [])) %}

block -> %NL %INDENT statement_list %DEDENT {% d => (new BlockStatementNode(d[2], d[1])) %}
       | simple_statement %NL {% d => (new BlockStatementNode([d[0]], d[0]._startTok)) %} 

return_statement -> %RETURN expression:? {% d => (new ReturnStatementNode(d[1], new Map(), d[0])) %} 

expression -> conditional_expression {% id %}

# TODO: figure out how many new nodes to create based on input.
#-----------------------------------------------------------------------------------------
# CONDITIONAL EXPRESSIONS (LOWEST PRECEDENCE)
#-----------------------------------------------------------------------------------------

conditional_expression -> or_expression %IF or_expression %ELSE conditional_expression {% d => (new ConditionalExpressionNode(d[0], d[2], d[4])) %}
                        | or_expression {% id %}

#-----------------------------------------------------------------------------------------
# LOGIC EXPRESSIONS 
#-----------------------------------------------------------------------------------------

or_expression -> or_expression %OR and_expression {% d => (new BinaryExpressionNode(d[0], d[1].value, d[2], d[1])) %} 
               | and_expression {% id %}

and_expression -> and_expression %AND not_expression {% d => (new BinaryExpressionNode(d[0], d[1].value, d[2], d[1])) %} 
                | not_expression {% id %} 

not_expression -> %NOT not_expression {% d => (new UnaryExpressionNode(d[0].value, d[1], d[0])) %}
                | comparison_expression {% id %}

#-----------------------------------------------------------------------------------------
# COMPARISON EXPRESSIONS
#-----------------------------------------------------------------------------------------

comparison_expression -> additive (%LT | %GT | %LTE | %GTE | %EQ | %NEQ | %IN | (%NOT %IN)) additive {% d => (new ComparisonExpressionNode(d[0], d[1], d[2], d[1])) %}
            | additive {% id %}

#-----------------------------------------------------------------------------------------
# ARITHMETIC EXPRESSIONS
#-----------------------------------------------------------------------------------------

# + or - (binary)
# LOWEST PRECEDENCE
additive -> additive (%PLUS | %MINUS) multiplicative {% d => (new BinaryExpressionNode(d[0], d[1], d[2], d[1])) %}
          | multiplicative {% id %}

# *, /, //, %
multiplicative -> multiplicative (%MULT | %INTDIV | %DIV | %MOD) unary {% d => (new BinaryExpressionNode(d[0], d[1], d[2], d[1])) %}
                | unary {% id %}

# + or - (unary)
unary -> (%PLUS | %MINUS) unary {% d => (new UnaryExpressionNode(d[0], d[1], d[0])) %}
       | power

# ** (power)
# HIGHEST PRECEDENCE
power -> primary %POWER unary {% d => (new BinaryExpressionNode(d[0], d[1], d[2], d[1])) %}
       | primary {% id %}

#-----------------------------------------------------------------------------------------
# PRIMARY EXPRESSIONS (general expressions)
#-----------------------------------------------------------------------------------------

primary -> function_call {% id %}
         | method_call {% id %}
         | list_access {% id %}
         | list_slice {% id %}
         | atom {% id %}

function_call -> primary %LPAREN arg_list:? %RPAREN {% d => (new FuncCallExpresssionNode(d[0], d[2] || null)) %}

list_access -> primary %LSQBRACK expression %RSQBRACK {% d => (new ListAccessExpresssionNode(d[0], d[2])) %}

method_call -> primary %DOT %IDENTIFIER %LPAREN arg_list:? %RPAREN {% d => (new MethodCallExpressionNode(d[0], new IdentifierExpressionNode(d[2]), d[4] || null)) %}  # nums.remove(5) || nums.remove(num)

list_slice -> primary %LSQBRACK expression %COLON expression %COLON expression %RSQBRACK {% d => new ListSliceExpressionNode(d[0], d[2], d[4], d[6]) %} # nums[1:2:1]
            | primary %LSQBRACK expression %COLON expression %RSQBRACK {% d => new ListSliceExpressionNode(d[0], d[2], d[4], null) %} # nums[2:5]
            | primary %LSQBRACK %COLON expression %COLON expression %RSQBRACK {% d => new ListSliceExpressionNode(d[0], null, d[3], d[5]) %} # nums[:1:2]
            | primary %LSQBRACK %COLON expression %RSQBRACK {% d => new ListSliceExpressionNode(d[0], null, d[3], null) %} # nums[:2]
            | primary %LSQBRACK expression %COLON %RSQBRACK {% d => new ListSliceExpressionNode(d[0], d[2], null, null) %} # nums[2:]
            | primary %LSQBRACK %COLON %COLON:? %RSQBRACK {% d => new ListSliceExpressionNode(d[0], null, null, null) %} # nums[:] || nums[::]

atom -> number {% id %}
      | %STRING_SINGLE {% d => (new StringLiteralExpressionNode(d[0])) %}
      | %STRING_DOUBLE {% d => (new StringLiteralExpressionNode(d[0])) %}
      | %IDENTIFIER {% d => (new IdentifierExpressionNode(d[0])) %}
      | list_literal {% id %}
      | %NONE {% d => null %}
      | %TRUE {% d => (new BooleanLiteralExpressionNode(d[0])) %}
      | %FALSE {% d => (new BooleanLiteralExpressionNode(d[0])) %}
      | group {% id %}

number -> %HEX {% d => (new NumberLiteralExpressionNode(d[0])) %}
        | %BINARY {% d => (new NumberLiteralExpressionNode(d[0])) %}
        | %DECIMAL {% d => (new NumberLiteralExpressionNode(d[0])) %}
        | %FLOAT {% d => (new NumberLiteralExpressionNode(d[0])) %}

list_literal -> %LSQBRACK arg_list:? %RSQBRACK {% d => (new ListLiteralExpressionNode(d[1] || null, d[0])) %}

group -> %LPAREN expression %RPAREN {% d => d[1] %} 
