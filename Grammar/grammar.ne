@{%
const moo = require("moo");
const IndentationLexer = require('moo-indentation-lexer')
const lexer = new IndentationLexer({ 
    indentationType: 'WS', 
    newlineType: 'NL',
    commentType: 'comment',
    indentName: 'INDENT',
    dedentName: 'DEDENT',
    lexer: moo.compile({
    // WHITESPACE
    WS: /[ \t]+/,

    // NEWLINES
    NL: {match: /\r?\n/, lineBreaks: true},

    // COMMENTS
    COMMENT: {match: /#.*/},

    // KEYWORDS
    IF: "if",
    ELSE: "else",
    WHILE: "while",
    FOR: "for",
    IN: "in",

    // BUILT IN FUNCTIONS
    PRINT: "print",
    RANGE: "range",

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
})});


// Overrides next method from lexer, automatically skips whitespace tokens.
lexer.next = (next => () => { // Captures the original next method, returns new func that becomes next method
    let tok;
    while ((tok = next.call(lexer)) && (tok.type === "WS")) {} // keep getting tokens and disgard any tokens with type WS or NL
    return tok; // return first non WS token
})(lexer.next);

%}

@lexer lexer

# {% id %} = semantic action, tell nearley what to do with data. how we built our AST, id is nearleys built in identtity function
# "return whatever was matched and not altered"

# d (data) -> when a rule matches, nearley passes this array containing all matched parts
# example -> if we match number -> %DECIMAL {% id %}, d = [Token{ type: "DECIMAL", value: "5" }], so {% id %} returns d[0] which is the DECIMAL tok

program -> statement_list {% id %}

number -> %HEX {% id %}
        | %BINARY {% id %}
        | %DECIMAL {% id %}
        | %ZERO {% id %}

arithmetic_operand -> %PLUS {% id %}
                    | %SUB {% id %}
                    | %MULT {% id %}
                    | %DIV {% id %}

comparison_operand -> %LTHAN {% id %}
                    | %GRTHAN {% id %}
                    | %LTHAN_EQ {% id %}
                    | %GRTHAN_EQ {% id %}
                    | %EQUALITY {% id %}

number_list -> number {% d => [d[0]] %} |
               number %COMMA number_list {% d => [d[0], ...d[2]] %} # 3 OR 3, OR 3, 4 OR 3, 4, 

list -> %LSQBRACK number_list %RSQBRACK {% d => ({ type: "list", values: d[1] }) %} | # [1, 2, 3] 
         %LSQBRACK %RSQBRACK {% d => ({ type: "list", values: [] }) %} # [] (or empty list) 

statement -> assignment_statement |
            expression %NL |
            if_statement |
            else_statement |
            for_loop |
            while_loop |
            print_func %NL |
            list_method_call

for_loop -> %FOR %IDENTIFIER %IN %RANGE %LPAREN number %RPAREN %COLON {% d => ({ type: "for_in_range_loop", temp_var: d[1], range: d[5] }) %} |
            %FOR %IDENTIFIER %IN %IDENTIFIER %COLON {% d => ({ type: "for_loop", temp_var: d[1], range: d[3] }) %}

while_loop -> %WHILE expression %COLON {% d => ({ type: "while_loop", expression: d[1]}) %}

if_statement -> %IF expression %COLON block {% d => ({ type: "if_statement", expression: d[1], body: d[3] }) %} 

# elif_statement

else_statement -> %ELSE %COLON  {% d => ({ type: "else_statement" }) %}

conditional_expression -> expression comparison_operand expression {% d => ({ type: "conditional_expression", value1: d[0], operand: d[1], value2: d[2] }) %} # i < 1

assignment_statement -> assignable_expression %EQ expression {% d => ({ type: "assignment_statement", var: d[0], value: d[2] }) %}  # i = 5, num = 2, nums[1] = 5 

array_access -> %IDENTIFIER %LSQBRACK expression %RSQBRACK {% d => ({ type: "array_access", array: d[0], index: d[2] }) %} # nums[1]

assignable_expression -> %IDENTIFIER {% id %} |
            array_access

list_method -> %APPEND |
                %SORT |
                %REMOVE |
                %COUNT |
                %INSERT

list_method_call -> %IDENTIFIER %DOT (%APPEND | %REMOVE | %INSERT) %LPAREN (%IDENTIFIER | number) %RPAREN {% d => ({type: "append_method_call", list: d[0], type: d[2], value: d[4]}) %} | #list.append(num)
                    %IDENTIFIER %DOT (%SORT | %COUNT) %LPAREN %RPAREN {% d => ({type: "append_method_call", list: d[0], type: d[2]}) %} #list.sort() -> sort and count do not take arguments

arithmetic_expression -> %IDENTIFIER arithmetic_operand number {% d => ({ type: "arithmetic_expression", value1: d[0], operand: d[1], value2: d[2] }) %} | # i - 1
                         number arithmetic_operand number {% d => ({ type: "arithmetic_expression", value1: d[0], operand: d[1], value2: d[2] }) %} | # 5 - 1
                         assignable_expression arithmetic_operand assignable_expression {% d => ({ type: "arithmetic_expression", value1: d[0], operand: d[1], value2: d[2] }) %} # i - j, num1 - num2

block -> %NL %INDENT statement_list %DEDENT {% d => ({type: "block", statements: d[2]}) %} |
         statement

expression -> assignable_expression |
            list |
            number |
            arithmetic_expression |
            conditional_expression

statement_list -> statement {% d => [d[0]] %} |
                  statement statement_list {% d => [d[0], ...d[1]] %} # ... (spread syntax) use array

print_func -> %PRINT %LPAREN %RPAREN {% d => ({ type: "print", args: [] }) %} | # print() 
              %PRINT %LPAREN expression %RPAREN {% d => ({ type: "print", args: [d[2]] }) %} # print(5) 


#parser - write a function, give it a string, throw errors based on empty results | bad return