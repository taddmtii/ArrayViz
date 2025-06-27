// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "IDENTIFIER$ebnf$1", "symbols": []},
    {"name": "IDENTIFIER$ebnf$1", "symbols": ["IDENTIFIER$ebnf$1", /[a-zA-Z0-9_]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "IDENTIFIER", "symbols": [/[a-zA-Z_]/, "IDENTIFIER$ebnf$1"]},
    {"name": "DECIMAL$ebnf$1", "symbols": []},
    {"name": "DECIMAL$ebnf$1", "symbols": ["DECIMAL$ebnf$1", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "DECIMAL", "symbols": [/[1-9]/, "DECIMAL$ebnf$1"]},
    {"name": "HEX$string$1", "symbols": [{"literal":"0"}, {"literal":"x"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "HEX$ebnf$1", "symbols": [/[0-9a-fA-F]/]},
    {"name": "HEX$ebnf$1", "symbols": ["HEX$ebnf$1", /[0-9a-fA-F]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "HEX", "symbols": ["HEX$string$1", "HEX$ebnf$1"]},
    {"name": "BINARY$string$1", "symbols": [{"literal":"0"}, {"literal":"b"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "BINARY$ebnf$1", "symbols": [/[0-1]/]},
    {"name": "BINARY$ebnf$1", "symbols": ["BINARY$ebnf$1", /[0-1]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "BINARY", "symbols": ["BINARY$string$1", "BINARY$ebnf$1"]},
    {"name": "NUMBER", "symbols": ["DECIMAL"]},
    {"name": "NUMBER", "symbols": ["HEX"]},
    {"name": "NUMBER", "symbols": ["BINARY"]},
    {"name": "COMMA", "symbols": [{"literal":","}]},
    {"name": "LSQBRACK", "symbols": [{"literal":"["}]},
    {"name": "RSQBRACK", "symbols": [{"literal":"]"}]},
    {"name": "LPAREN", "symbols": [{"literal":"("}]},
    {"name": "RPAREN", "symbols": [{"literal":")"}]},
    {"name": "PRINT$string$1", "symbols": [{"literal":"p"}, {"literal":"r"}, {"literal":"i"}, {"literal":"n"}, {"literal":"t"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "PRINT", "symbols": ["PRINT$string$1"]},
    {"name": "EQ", "symbols": [{"literal":"="}]},
    {"name": "number_list$ebnf$1$subexpression$1", "symbols": ["COMMA", "number_list"]},
    {"name": "number_list$ebnf$1", "symbols": ["number_list$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "number_list$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "number_list", "symbols": ["NUMBER", "number_list$ebnf$1"]},
    {"name": "list", "symbols": ["LSQBRACK", "number_list", "RSQBRACK"]},
    {"name": "list", "symbols": ["LSQBRACK", "RSQBRACK"]},
    {"name": "assignment_statement", "symbols": ["IDENTIFIER", "EQ", "NUMBER"]},
    {"name": "assignment_statement", "symbols": ["IDENTIFIER", "EQ", "IDENTIFIER"]},
    {"name": "assignment_statement", "symbols": ["IDENTIFIER", "EQ", "IDENTIFIER", "LSQBRACK", "NUMBER", "RSQBRACK"]},
    {"name": "assignment_statement", "symbols": ["IDENTIFIER", "LSQBRACK", "NUMBER", "RSQBRACK", "EQ", "NUMBER"]},
    {"name": "assignment_statement", "symbols": ["IDENTIFIER", "LSQBRACK", "NUMBER", "RSQBRACK", "EQ", "IDENTIFIER", "LSQBRACK", "NUMBER", "RSQBRACK"]},
    {"name": "assignment_statement", "symbols": ["IDENTIFIER", "EQ", "list"]},
    {"name": "statement", "symbols": ["IDENTIFIER", "LSQBRACK", "NUMBER", "RSQBRACK"]},
    {"name": "print_func", "symbols": ["PRINT", "LPAREN", "RPAREN"]},
    {"name": "print_func", "symbols": ["PRINT", "LPAREN", "NUMBER", "RPAREN"]},
    {"name": "print_func", "symbols": ["PRINT", "LPAREN", "IDENTIFIER", "LSQBRACK", "NUMBER", "RSQBRACK", "RPAREN"]}
]
  , ParserStart: "IDENTIFIER"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
