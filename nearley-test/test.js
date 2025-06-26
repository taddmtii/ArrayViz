

const nearley = require("nearley");
const grammar = require("./grammar.js");

const examples = [
"i = 0",
"nums = [1, 2, 3]",
"nums[0] = 5",
"print(nums[0])"
];

examples.forEach((input, i) => {
  const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

  try {
    parser.feed(input);
    console.log(`\n[Example ${i + 1}] "${input}"`);
    console.log("AST:", JSON.stringify(parser.results[0], null, 2));
  } catch (err) {
    console.error(`Error parsing input "${input}":`, err.message);
  }
});