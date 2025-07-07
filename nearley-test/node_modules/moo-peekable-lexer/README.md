# moo-peekable-lexer
## Usage
```js
const moo = require('moo')
const PeekableLexer = require('moo-peekable-lexer')

// Create a mooLexer from rules
const mooLexer = moo.compile({ ... })
// Create a peekable lexer using the Moo lexer
const lexer = new PeekableLexer({ lexer: mooLexer })

// Specify the data
lexer.reset('...')

// In addition to the normal Moo methods, peek is available
lexer.peek()
lexer.next()
```
