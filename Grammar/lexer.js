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

// Overrides next method from lexer, automatically skips whitespace and comments.
lexer.next = (next => () => { // Captures the original next method, returns new func that becomes next method
    let tok;
    while ((tok = next.call(lexer)) && (tok.type === "WS" || tok.type === "COMMENT")) {} // keep getting tokens and disgard any tokens with type WS or NL
    return tok; // return first non WS token
})(lexer.next);

lexer.reset(`a = [1, 2]
b = [3, 4]
for x in a:
   for y in b:
      print(x)
   

while True and not x:
   print(1)

`)

// no newline between dedents

for (let tok of lexer) {
    console.log(tok.type);
}