
@{%

const moo = require("moo");
const lexer = moo.compile({
    // WHITESPACE
    WS: /[ \t]+/,

    // COMMENTS (talk to Prof O about this one)
    COMMENT: {match: /#.*?/}

    // KEYWORDS
    PRINT: "print",

    // NUMBERS
    HEX: /0x[0-9a-fA-F]+/,
    BINARY: /0b[01]+/,
    DECIMAL: /[1-9][0-9]*/,

    // IDENTIFIER
    IDENTIFIER: /[a-zA-Z_] [a-zA-Z0-9_]*/,

    //SYMBOLS
    COMMA: ",",
    LSQBRACK: "[",
    RSQBRACK: "]",
    LPAREN: "(",
    RPAREN: ")",
    EQ: "="
});

// Overrides next method from lexer, automatically skips whitespace tokens.
// IIFE (Immediately Invoked Function Expression)
lexer.next = (next => () => { // Captures the original next method, returns new func that becomes next method
    let tok;
    while ((tok = next.call(lexer)) && tok.type === "WS") {} // keep getting tokens and disgard any tokens with type WS
    return tok; // return first non WS token
})(lexer.next);

%}

@lexer lexer

# {% id %} = semantic action, tell nearley what to do with data. how we built our AST, id is nearleys built in identtity function
# "return whatever was matched and not altered"

# d (data) -> when a rule matches, nearley passes this array containing all matched parts
# example -> if we match NUMBER -> %DECIMAL {% id %}, d = [Token{ type: "DECIMAL", value: "5" }], so {% id %} returns d[0] which is the DECIMAL tok

main -> statement_list {% id %}

NUMBER -> %HEX {% id %}
        | %BINARY {% id %}
        | %DECIMAL {% id %}

number_list -> NUMBER (%COMMA number_list):? # 3 OR 3, OR 3, 4 OR 3, 4, 

list -> %LSQBRACK number_list %RSQBRACK {% d => ({ type: "list", values: d[1] }) %} | # [1, 2, 3] 
         %LSQBRACK %RSQBRACK {% d => ({ type: "list", values: [] }) %} # [] (or empty list) 

statement -> %IDENTIFIER %EQ NUMBER {% d => ({ type: "statement", var: d[0], value: d[2] }) %} | # i = 5, num = 2 
              %IDENTIFIER %EQ %IDENTIFIER {% d => ({ type: "statement", var: d[0], value: d[2] }) %} | # i = num, num = other_num 
              %IDENTIFIER %EQ %IDENTIFIER %LSQBRACK NUMBER %RSQBRACK | # num = nums[1] 
              %IDENTIFIER %LSQBRACK NUMBER %RSQBRACK %EQ NUMBER | # nums[1] = 5 
              %IDENTIFIER %LSQBRACK NUMBER %RSQBRACK %EQ %IDENTIFIER %LSQBRACK NUMBER %RSQBRACK | # nums[1] = nums[4] 
              %IDENTIFIER %EQ list | # nums = [1, 2, 3]
              %IDENTIFIER %LSQBRACK NUMBER %RSQBRACK # nums[1] 

statement_list -> statement statement_list

print_func -> %PRINT %LPAREN %RPAREN {% d => ({ type: "print", args: [] }) %} | # print() 
               %PRINT %LPAREN NUMBER %RPAREN {% d => ({ type: "print", args: [d[2]] }) %} | # print(5) 
               %PRINT %LPAREN %IDENTIFIER %LSQBRACK NUMBER %RSQBRACK %RPAREN # print(nums[0]) 