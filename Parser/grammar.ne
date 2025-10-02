
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
        } = require('../Interpreter/Nodes.js');
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

assignment_statement -> (%IDENTIFIER | list_access) %ASSIGNMENT expression {% d => (new AssignmentStatementNode(d[0], new ExpressionNode(d[2]))) %}

if_statement -> %IF expression %COLON block (elif_statement | else_block):? {% d => (new IfStatementNode(new ExpressionNode(d[1]), new BlockStatementNode(d[3]), new ElseBlockStatementNode(d[4]))) %}

elif_statement -> %ELIF expression %COLON block (elif_statement | else_block):? {% d => (new ElifStatementNode(new ExpressionNode(d[1]), new BlockStatementNode(d[3]), new ElseBlockStatementNode(d[4]))) %}

else_block -> %ELSE %COLON block {% d => (new ElseBlockStatementNode(new BlockStatementNode(d[2]))) %}

# may later need to deal with multiple assignment/unpacking (for x, y in enumerate()) may affect assignment statement
for_loop -> %FOR %IDENTIFIER %IN expression %COLON block {% d => (new ForStatementNode(new IdentifierExpressionNode(d[1]), new ExpressionNode(d[3]), new BlockStatementNode(d[5]))) %}

while_loop -> %WHILE expression %COLON block {% d => (new WhileStatementNode(new ExpressionNode(d[1]), new BlockStatementNode(d[3]))) %}

func_def -> %DEF %IDENTIFIER %LPAREN (formal_params_list):? %RPAREN (%ARROW expression):? %COLON block {% d => (new FuncDefStatementNode(new IdentifierExpressionNode(d[1]), d[3], new BlockStatementNode(d[7]))) %}

# come back, multiple params and args not working
formal_params_list -> %IDENTIFIER (%COMMA %IDENTIFIER):* {% d => new FormalParamsListExpressionNode(new IdentifierExpressionNode(d[0]), ...(d[1].map(x => new IdentifierExpressionNode(x[1])))) %} 

arg_list -> expression (%COMMA expression):* {% d => new ArgListExpressionNode(new ExpressionNode(d[0]), ...(d[1] ? d[1].map(x => new ExpressionNode(x[1])) : [])) %}

block -> %NL %INDENT statement_list %DEDENT {% d => (new BlockStatementNode(d[2])) %}
       | simple_statement %NL {% d => (new BlockStatementNode(d[0])) %}

return_statement -> %RETURN expression:? {% d => (new ReturnStatementNode(d[1])) %} 

expression -> conditional_expression {% id %}
# TODO: figure out how many new nodes to create based on input.
#-----------------------------------------------------------------------------------------
# CONDITIONAL EXPRESSIONS (LOWEST PRECEDENCE)
#-----------------------------------------------------------------------------------------

conditional_expression -> or_expression %IF or_expression %ELSE conditional_expression {% d => (new ConditionalExpressionNode(new ExpressionNode(d[0]), new ExpressionNode(d[2]), new ExpressionNode(d[4])) ) %}
                        | or_expression {% id %}

#-----------------------------------------------------------------------------------------
# LOGIC EXPRESSIONS 
#-----------------------------------------------------------------------------------------

or_expression -> or_expression %OR and_expression {% d => (new BinaryExpressionNode(new ExpressionNode(d[0]), d[1], new ExpressionNode(d[2]))) %}
               | and_expression {% id %}

and_expression -> and_expression %AND not_expression {% d => (new BinaryExpressionNode(new ExpressionNode(d[0]), d[1], new ExpressionNode(d[2]))) %}
                | not_expression {% id %} 

not_expression -> %NOT not_expression {% d => (new UnaryExpressionNode(d[0], new ExpressionNode(d[1]))) %}
                | comparison_expression {% id %}

#-----------------------------------------------------------------------------------------
# COMPARISON EXPRESSIONS
#-----------------------------------------------------------------------------------------

comparison_expression -> additive (%LT | %GT | %LTE | %GTE | %EQ | %NEQ | %IN | (%NOT %IN)) additive {% d => (new ComparisonExpressionNode(new ExpressionNode(d[0]), d[1], new ExpressionNode(d[2]))) %}
            | additive {% id %}

#-----------------------------------------------------------------------------------------
# ARITHMETIC EXPRESSIONS
#-----------------------------------------------------------------------------------------

# + or - (binary)
# LOWEST PRECEDENCE
additive -> additive (%PLUS | %MINUS) multiplicative {% d => (new BinaryExpressionNode(new ExpressionNode(d[0]), d[1], new ExpressionNode(d[2]))) %}
          | multiplicative {% id %}

# *, /, //, %
multiplicative -> multiplicative (%MULT | %INTDIV | %DIV | %MOD) unary {% d => (new BinaryExpressionNode(new ExpressionNode(d[0]), d[1], new ExpressionNode(d[2]))) %}
                | unary {% id %}

# + or - (unary)
unary -> (%PLUS | %MINUS) unary {% d => (new UnaryExpressionNode(d[0], new ExpressionNode(d[1]))) %}
       | power

# ** (power)
# HIGHEST PRECEDENCE
power -> primary %POWER unary {% d => (new BinaryExpressionNode(new ExpressionNode(d[0]), d[1], new ExpressionNode(d[2]))) %}
       | primary {% id %}

#-----------------------------------------------------------------------------------------
# PRIMARY EXPRESSIONS (general expressions)
#-----------------------------------------------------------------------------------------

primary -> function_call {% id %}
         | method_call {% id %}
         | list_access {% id %}
         | list_slice {% id %}
         | atom {% id %}

function_call -> primary %LPAREN arg_list:? %RPAREN {% d => (new FuncCallExpresssionNode(new ExpressionNode(d[0]), new ArgListExpressionNode(d[2]))) %}

list_access -> primary %LSQBRACK expression %RSQBRACK {% d => (new ListAccessExpresssionNode(new ExpressionNode(d[0]), new ExpressionNode(d[2]))) %}

method_call -> primary %DOT %IDENTIFIER %LPAREN arg_list:? %RPAREN {% d => (new MethodCallExpressionNode(new ExpressionNode(d[0]), new IdentifierExpressionNode(d[2]), new ArgListExpressionNode(d[4]))) %}  # nums.remove(5) || nums.remove(num)

list_slice -> primary %LSQBRACK expression %COLON expression %COLON expression %RSQBRACK {% d => new ListSliceExpressionNode(new ExpressionNode(d[0]), new ExpressionNode(d[2]), new ExpressionNode(d[4]), new ExpressionNode(d[6])) %} # nums[1:2:1]
            | primary %LSQBRACK expression %COLON expression %RSQBRACK {% d => new ListSliceExpressionNode(new ExpressionNode(d[0]), new ExpressionNode(d[2]), new ExpressionNode(d[4]), null) %} # nums[2:5]
            | primary %LSQBRACK %COLON expression %COLON expression %RSQBRACK {% d => new ListSliceExpressionNode(new ExpressionNode(d[0]), null, new ExpressionNode(d[3]), new ExpressionNode(d[5])) %} # nums[:1:2]
            | primary %LSQBRACK %COLON expression %RSQBRACK {% d => new ListSliceExpressionNode(new ExpressionNode(d[0]), null, new ExpressionNode(d[3]), null) %} # nums[:2]
            | primary %LSQBRACK expression %COLON %RSQBRACK {% d => new ListSliceExpressionNode(new ExpressionNode(d[0]), new ExpressionNode(d[2]), null, null) %} # nums[2:]
            | primary %LSQBRACK %COLON %COLON:? %RSQBRACK {% d => new ListSliceExpressionNode(new ExpressionNode(d[0]), null, null, null) %} # nums[:] || nums[::]

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

list_literal -> %LSQBRACK arg_list:? %RSQBRACK {% d => (new ListLiteralExpressionNode(d[1])) %}

group -> %LPAREN expression %RPAREN {% d => d[1] %} 
