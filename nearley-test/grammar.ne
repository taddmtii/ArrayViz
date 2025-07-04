@{%
const moo = require("moo");
const lexer = moo.compile({
    // WHITESPACE
    WS: /[ \t]+/,

    // NEWLINES
    NL: {match: /\r?\n/, lineBreaks: true},

    // COMMENTS
    COMMENT: {match: /#.*/},

    // KEYWORDS
    PRINT: "print",
    IF: "if",
    ELSE: "else",

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
});

// Overrides next method from lexer, automatically skips whitespace tokens.
lexer.next = (next => () => { // Captures the original next method, returns new func that becomes next method
    let tok;
    while ((tok = next.call(lexer)) && (tok.type === "WS" || tok.type === "NL")) {} // keep getting tokens and disgard any tokens with type WS
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
            expression |
            if_statement |
            print_func {% id %} |
            list_method_call

if_statement -> %IF conditional_statement %COLON {% d => ({ type: "if_statement", conditional: d[1] }) %}

else_statement -> %ELSE %COLON {% d => ({ type: "else_statement" }) %}

conditional_statement -> %IDENTIFIER comparison_operand number {% d => ({ type: "conditional_statement", value1: d[0], operand: d[1], value2: d[2] }) %} | # i < 1
                         number comparison_operand number {% d => ({ type: "conditional_statement", value1: d[0], operand: d[1], value2: d[2] }) %} | # 5 > 1
                         assignable_expression comparison_operand assignable_expression {% d => ({ type: "conditional_statement", value1: d[0], operand: d[1], value2: d[2] }) %} # i == j, num1 < num2

assignment_statement -> assignable_expression %EQ expression {% d => ({ type: "assignment_statement", var: d[0], value: d[2] }) %}  # i = 5, num = 2, nums[1] = 5 

array_access -> %IDENTIFIER %LSQBRACK expression %RSQBRACK {% d => ({ type: "array_access", array: d[0], index: d[2] }) %} # nums[1]

assignable_expression -> %IDENTIFIER {% id %} |
            array_access

list_method -> %APPEND |
                %SORT |
                %REMOVE |
                %COUNT |
                %INSERT

list_method_call -> %IDENTIFIER %DOT list_method %LPAREN (%IDENTIFIER | number) %RPAREN {% d => ({type: "append_method_call", list: d[0], type: d[2], value: d[4]}) %} #list.append(num)

arithmetic_expression -> %IDENTIFIER arithmetic_operand number {% d => ({ type: "arithmetic_expression", value1: d[0], operand: d[1], value2: d[2] }) %} | # i - 1
                         number arithmetic_operand number {% d => ({ type: "arithmetic_expression", value1: d[0], operand: d[1], value2: d[2] }) %} | # 5 - 1
                         assignable_expression arithmetic_operand assignable_expression {% d => ({ type: "arithmetic_expression", value1: d[0], operand: d[1], value2: d[2] }) %} # i - j, num1 - num2

expression -> assignable_expression |
            list |
            number |
            arithmetic_expression

statement_list -> statement {% id %} |
                    statement statement_list {% d => [d[0], ...d[1]] %} # ... (spread syntax) use array

print_func -> %PRINT %LPAREN %RPAREN {% d => ({ type: "print", args: [] }) %} | # print() 
              %PRINT %LPAREN expression %RPAREN {% d => ({ type: "print", args: [d[2]] }) %} # print(5) 