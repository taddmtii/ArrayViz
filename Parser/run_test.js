const fs = require("fs"); // file system, allows reading wirign and managing files and directories.
const path = require("path"); // provides utiltiies for working with file and directory paths
const nearley = require("nearley"); 
const grammar = require("./grammar.js");
const testdir = "./test_programs"; // directory that contains all test files


fs.readdirSync(testdir).forEach(file => {
    const input = fs.readFileSync(path.join(testdir, file), "utf8"); // utf8 -> standard text encoding for source files. Without specifiying this node returns Buffer object which is a stream of bytes instead of a string.
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

    try {
        parser.feed(input + '\n');
        console.log(`${file}: parsed successfully.`);
        console.log("Parses:", parser.results.length);
    } catch (err) {
        console.error(`${file}: parse error.`);
        console.error(err.message);
    }
});