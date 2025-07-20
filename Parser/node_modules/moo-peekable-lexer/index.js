
class LexerIterator {
    constructor(lexer) {
        this._lexer = lexer
    }

    next() {
        const token = this._lexer.next()
        return { value: token, done: !token }
    }

    [Symbol.iterator]() {
        return this
    }
}

class PeekableLexer {
    constructor({ lexer, queuedToken }) {
        this._lexer = lexer
        this._queuedToken = queuedToken || null
    }

    reset(data, info) {
        this._queuedToken = info ? info.queuedToken : null
        return this._lexer.reset(data, info && info.lexerInfo)
    }

    save() {
        return {
            queuedToken: this._queuedToken,
            lexerInfo: this._lexer.save()
        }
    }

    setState(state) {
        return this._lexer.setState(state)
    }

    popState() {
        return this._lexer.popState()
    }

    pushState(state) {
        return this._lexer.pushState(state)
    }

    peek() {
        if (!this._queuedToken) {
            this._queuedToken = this.next()
        }
        return this._queuedToken
    }

    next() {
        if (this._queuedToken) {
            const token = this._queuedToken
            this._queuedToken = null
            return token
        }
        return this._lexer.next()
    }

    [Symbol.iterator]() {
        return new LexerIterator(this)
    }

    formatError(token, message) {
        return this._lexer.formatError(token, message)
    }

    clone() {
        const lexer = this._lexer.clone()
        const queuedToken = this._queuedToken
        return new PeekableLexer({ lexer, queuedToken })
    }

    has(tokenType) {
        return this._lexer.has(tokenType)
    }
}

module.exports = PeekableLexer
