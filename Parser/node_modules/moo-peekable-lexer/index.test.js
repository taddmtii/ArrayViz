const moo = require('moo')
const PeekableLexer = require('./')

describe('PeekableLexer', () => {

    it('runs on Moo example input', () => {
        const mooLexer = moo.compile({
            WS:      /[ \t]+/,
            comment: /\/\/.*?$/,
            number:  /0|[1-9][0-9]*/,
            string:  /"(?:\\["\\]|[^\n"\\])*"/,
            lparen:  '(',
            rparen:  ')',
            keyword: ['while', 'if', 'else', 'moo', 'cows'],
            NL:      { match: /\n/, lineBreaks: true },
        })
        const lexer = new PeekableLexer({ lexer: mooLexer })

        lexer.reset('while (10) cows\nmoo')

        expect(lexer.next().text).toBe('while')
        expect(lexer.peek().text).toBe(' ')
        expect(lexer.next().text).toBe(' ')
        expect(lexer.next().text).toBe('(')
        expect(lexer.next().text).toBe('10')
        expect(lexer.next().text).toBe(')')
        expect(lexer.next().text).toBe(' ')
        expect(lexer.next().text).toBe('cows')
        expect(lexer.next().text).toBe('\n')
        expect(lexer.peek().text).toBe('moo')
        expect(lexer.next().text).toBe('moo')
        expect(lexer.peek()).toBe(undefined)
        expect(lexer.next()).toBe(undefined)
        expect(lexer.peek()).toBe(undefined)
        expect(lexer.next()).toBe(undefined)
    })
})