"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var nearley = require("nearley");
var grammar = require("./grammar");
var ASTVisualizer = /** @class */ (function () {
    function ASTVisualizer() {
        this.indent = '';
    }
    // Main entry point
    ASTVisualizer.prototype.visualize = function (node, name) {
        if (name === void 0) { name = 'Root'; }
        console.log(this.formatNode(node, name));
    };
    // Recursively format nodes
    ASTVisualizer.prototype.formatNode = function (node, name, isLast, prefix) {
        var _this = this;
        var _a;
        if (isLast === void 0) { isLast = true; }
        if (prefix === void 0) { prefix = ''; }
        if (node === null || node === undefined) {
            return "".concat(prefix).concat(this.getConnector(isLast)).concat(name, ": null\n");
        }
        // Handle primitives
        if (typeof node !== 'object') {
            return "".concat(prefix).concat(this.getConnector(isLast)).concat(name, ": ").concat(JSON.stringify(node), "\n");
        }
        // Handle arrays
        if (Array.isArray(node)) {
            if (node.length === 0) {
                return "".concat(prefix).concat(this.getConnector(isLast)).concat(name, ": []\n");
            }
            var result_1 = "".concat(prefix).concat(this.getConnector(isLast)).concat(name, ": Array(").concat(node.length, ")\n");
            var newPrefix_1 = prefix + (isLast ? '    ' : '│   ');
            node.forEach(function (item, idx) {
                result_1 += _this.formatNode(item, "[".concat(idx, "]"), idx === node.length - 1, newPrefix_1);
            });
            return result_1;
        }
        // Get node type
        var nodeType = ((_a = node.constructor) === null || _a === void 0 ? void 0 : _a.name) || 'Object';
        var result = "".concat(prefix).concat(this.getConnector(isLast)).concat(name, ": ").concat(nodeType, "\n");
        // Get all properties, filtering out private ones for cleaner output
        var props = Object.entries(node).filter(function (_a) {
            var key = _a[0];
            // Show private properties but skip some noise
            return !['_startTok', '_endTok'].includes(key);
        });
        if (props.length === 0)
            return result;
        var newPrefix = prefix + (isLast ? '    ' : '│   ');
        props.forEach(function (_a, idx) {
            var key = _a[0], value = _a[1];
            var isLastProp = idx === props.length - 1;
            result += _this.formatNode(value, key, isLastProp, newPrefix);
        });
        return result;
    };
    ASTVisualizer.prototype.getConnector = function (isLast) {
        return isLast ? '└── ' : '├── ';
    };
    // Compact version - shows only node types
    ASTVisualizer.prototype.visualizeCompact = function (node, depth) {
        var _this = this;
        var _a;
        if (depth === void 0) { depth = 0; }
        var indent = '  '.repeat(depth);
        if (node === null || node === undefined) {
            console.log("".concat(indent, "null"));
            return;
        }
        if (typeof node !== 'object') {
            console.log("".concat(indent).concat(JSON.stringify(node)));
            return;
        }
        if (Array.isArray(node)) {
            console.log("".concat(indent, "["));
            node.forEach(function (item) { return _this.visualizeCompact(item, depth + 1); });
            console.log("".concat(indent, "]"));
            return;
        }
        var nodeType = ((_a = node.constructor) === null || _a === void 0 ? void 0 : _a.name) || 'Object';
        console.log("".concat(indent).concat(nodeType));
        var props = Object.entries(node).filter(function (_a) {
            var key = _a[0];
            return !['_startTok', '_endTok', '_tok'].includes(key);
        });
        props.forEach(function (_a) {
            var key = _a[0], value = _a[1];
            console.log("".concat(indent, "  ").concat(key, ":"));
            _this.visualizeCompact(value, depth + 2);
        });
    };
    // Only show node types in a tree
    ASTVisualizer.prototype.visualizeTypes = function (node, prefix, isLast) {
        var _this = this;
        var _a;
        if (prefix === void 0) { prefix = ''; }
        if (isLast === void 0) { isLast = true; }
        if (node === null || node === undefined) {
            console.log("".concat(prefix).concat(this.getConnector(isLast), "null"));
            return;
        }
        if (typeof node !== 'object') {
            console.log("".concat(prefix).concat(this.getConnector(isLast)).concat(typeof node, ": ").concat(String(node).substring(0, 20)));
            return;
        }
        if (Array.isArray(node)) {
            console.log("".concat(prefix).concat(this.getConnector(isLast), "Array(").concat(node.length, ")"));
            var newPrefix_2 = prefix + (isLast ? '    ' : '│   ');
            node.forEach(function (item, idx) {
                _this.visualizeTypes(item, newPrefix_2, idx === node.length - 1);
            });
            return;
        }
        var nodeType = ((_a = node.constructor) === null || _a === void 0 ? void 0 : _a.name) || 'Object';
        // For leaf nodes (literals), show the value too
        if (node._value !== undefined) {
            console.log("".concat(prefix).concat(this.getConnector(isLast)).concat(nodeType, " (").concat(node._value, ")"));
            return;
        }
        console.log("".concat(prefix).concat(this.getConnector(isLast)).concat(nodeType));
        var props = Object.entries(node).filter(function (_a) {
            var key = _a[0];
            return !['_startTok', '_endTok', '_tok'].includes(key) && !key.startsWith('__');
        });
        var newPrefix = prefix + (isLast ? '    ' : '│   ');
        props.forEach(function (_a, idx) {
            var key = _a[0], value = _a[1];
            console.log("".concat(newPrefix).concat(key, ":"));
            _this.visualizeTypes(value, newPrefix + '  ', idx === props.length - 1);
        });
    };
    return ASTVisualizer;
}());
// Usage
function printAST(filename, mode) {
    if (mode === void 0) { mode = 'types'; }
    var code = fs.readFileSync(filename, 'utf-8');
    console.log('Code:');
    console.log(code);
    console.log('\n' + '='.repeat(60) + '\n');
    var parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
    parser.feed(code);
    if (parser.results.length === 0) {
        console.error('Parse error!');
        return;
    }
    var ast = parser.results[0];
    var viz = new ASTVisualizer();
    console.log('AST:\n');
    switch (mode) {
        case 'full':
            viz.visualize(ast);
            break;
        case 'compact':
            viz.visualizeCompact(ast);
            break;
        case 'types':
            viz.visualizeTypes(ast);
            break;
    }
}
// Run it
var args = process.argv.slice(2);
if (args.length === 0) {
    console.error('Usage: ts-node ast-printer.ts <file> [full|compact|types]');
    process.exit(1);
}
var mode = args[1] || 'types';
printAST(args[0], mode);
