
import * as fs from 'fs';
import * as nearley from 'nearley';
import * as grammar from './grammar';
import { ProgramNode, StatementNode, ExpressionNode } from './Nodes';

class ASTVisualizer {
    private indent: string = '';

    // Main entry point
    visualize(node: any, name: string = 'Root'): void {
        console.log(this.formatNode(node, name));
    }

    // Recursively format nodes
    private formatNode(node: any, name: string, isLast: boolean = true, prefix: string = ''): string {
        if (node === null || node === undefined) {
            return `${prefix}${this.getConnector(isLast)}${name}: null\n`;
        }

        // Handle primitives
        if (typeof node !== 'object') {
            return `${prefix}${this.getConnector(isLast)}${name}: ${JSON.stringify(node)}\n`;
        }

        // Handle arrays
        if (Array.isArray(node)) {
            if (node.length === 0) {
                return `${prefix}${this.getConnector(isLast)}${name}: []\n`;
            }
            let result = `${prefix}${this.getConnector(isLast)}${name}: Array(${node.length})\n`;
            const newPrefix = prefix + (isLast ? '    ' : '│   ');
            node.forEach((item, idx) => {
                result += this.formatNode(item, `[${idx}]`, idx === node.length - 1, newPrefix);
            });
            return result;
        }

        // Get node type
        const nodeType = node.constructor?.name || 'Object';
        let result = `${prefix}${this.getConnector(isLast)}${name}: ${nodeType}\n`;
        
        // Get all properties, filtering out private ones for cleaner output
        const props = Object.entries(node).filter(([key]) => {
            // Show private properties but skip some noise
            return !['_startTok', '_endTok'].includes(key);
        });

        if (props.length === 0) return result;

        const newPrefix = prefix + (isLast ? '    ' : '│   ');
        props.forEach(([key, value], idx) => {
            const isLastProp = idx === props.length - 1;
            result += this.formatNode(value, key, isLastProp, newPrefix);
        });

        return result;
    }

    private getConnector(isLast: boolean): string {
        return isLast ? '└── ' : '├── ';
    }

    // Compact version - shows only node types
    visualizeCompact(node: any, depth: number = 0): void {
        const indent = '  '.repeat(depth);
        
        if (node === null || node === undefined) {
            console.log(`${indent}null`);
            return;
        }

        if (typeof node !== 'object') {
            console.log(`${indent}${JSON.stringify(node)}`);
            return;
        }

        if (Array.isArray(node)) {
            console.log(`${indent}[`);
            node.forEach(item => this.visualizeCompact(item, depth + 1));
            console.log(`${indent}]`);
            return;
        }

        const nodeType = node.constructor?.name || 'Object';
        console.log(`${indent}${nodeType}`);

        const props = Object.entries(node).filter(([key]) => 
            !['_startTok', '_endTok', '_tok'].includes(key)
        );

        props.forEach(([key, value]) => {
            console.log(`${indent}  ${key}:`);
            this.visualizeCompact(value, depth + 2);
        });
    }

    // Only show node types in a tree
    visualizeTypes(node: any, prefix: string = '', isLast: boolean = true): void {
        if (node === null || node === undefined) {
            console.log(`${prefix}${this.getConnector(isLast)}null`);
            return;
        }

        if (typeof node !== 'object') {
            console.log(`${prefix}${this.getConnector(isLast)}${typeof node}: ${String(node).substring(0, 20)}`);
            return;
        }

        if (Array.isArray(node)) {
            console.log(`${prefix}${this.getConnector(isLast)}Array(${node.length})`);
            const newPrefix = prefix + (isLast ? '    ' : '│   ');
            node.forEach((item, idx) => {
                this.visualizeTypes(item, newPrefix, idx === node.length - 1);
            });
            return;
        }

        const nodeType = node.constructor?.name || 'Object';
        
        // For leaf nodes (literals), show the value too
        if (node._value !== undefined) {
            console.log(`${prefix}${this.getConnector(isLast)}${nodeType} (${node._value})`);
            return;
        }
        
        console.log(`${prefix}${this.getConnector(isLast)}${nodeType}`);

        const props = Object.entries(node).filter(([key]) => 
            !['_startTok', '_endTok', '_tok'].includes(key) && !key.startsWith('__')
        );

        const newPrefix = prefix + (isLast ? '    ' : '│   ');
        props.forEach(([key, value], idx) => {
            console.log(`${newPrefix}${key}:`);
            this.visualizeTypes(value, newPrefix + '  ', idx === props.length - 1);
        });
    }
}

// Usage
function printAST(filename: string, mode: 'full' | 'compact' | 'types' = 'types') {
    const code = fs.readFileSync(filename, 'utf-8');
    console.log('Code:');
    console.log(code);
    console.log('\n' + '='.repeat(60) + '\n');

    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
    parser.feed(code);

    if (parser.results.length === 0) {
        console.error('Parse error!');
        return;
    }

    const ast = parser.results[0];
    const viz = new ASTVisualizer();

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
const args = process.argv.slice(2);
if (args.length === 0) {
    console.error('Usage: ts-node ast-printer.ts <file> [full|compact|types]');
    process.exit(1);
}

const mode = (args[1] as any) || 'types';
printAST(args[0], mode);