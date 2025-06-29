
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

number_list : NUMBER (COMMA number_list):? # 3 OR 3, OR 3, 4 OR 3, 4, 

list : LSQBRACK number_list RSQBRACK | # [1, 2, 3] 
         LSQBRACK RSQBRACK # [] (or empty list) 

assignment_statement : IDENTIFIER EQ NUMBER | # i = 5, num = 2 
              IDENTIFIER EQ IDENTIFIER | # i = num, num = other_num 
              IDENTIFIER EQ IDENTIFIER LSQBRACK NUMBER RSQBRACK | # num = nums[1] 
              IDENTIFIER LSQBRACK NUMBER RSQBRACK EQ NUMBER | # nums[1] = 5 
              IDENTIFIER LSQBRACK NUMBER RSQBRACK EQ IDENTIFIER LSQBRACK NUMBER RSQBRACK | # nums[1] = nums[4] 
              IDENTIFIER EQ list # nums = [1, 2, 3] 
              

statement : IDENTIFIER LSQBRACK NUMBER RSQBRACK # nums[1] 

print_func : PRINT LPAREN RPAREN | # print() 
               PRINT LPAREN NUMBER RPAREN | # print(5) 
               PRINT LPAREN IDENTIFIER LSQBRACK NUMBER RSQBRACK RPAREN # print(nums[0]) 