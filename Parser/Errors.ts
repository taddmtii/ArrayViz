// Base class.
export class InterpreterError extends Error {
  constructor(
    message: string,
    public line?: number,
    public col?: number,
  ) {
    super(message);
    this.name = "InterpreterError";
  }

  toString(): string {
    if (this.line !== undefined) {
      return `${this.name} at line ${this.line}: ${this.message}`;
    }
    return `${this.name}: ${this.message}`;
  }
}

export class RuntimeError extends InterpreterError {
  constructor(message: string, line?: number, col?: number) {
    super(message, line, col);
    this.name = "RuntimeError";
  }
}

export class TypeError extends InterpreterError {
  constructor(message: string, line?: number, col?: number) {
    super(message, line, col);
    this.name = "TypeError";
  }
}

export class NameError extends InterpreterError {
  constructor(message: string, line?: number, col?: number) {
    super(message, line, col);
    this.name = "NameError";
  }
}

export class IndexError extends InterpreterError {
  constructor(message: string, line?: number, col?: number) {
    super(message, line, col);
    this.name = "IndexError";
  }
}

export class ValueError extends InterpreterError {
  constructor(message: string, line?: number, col?: number) {
    super(message, line, col);
    this.name = "ValueError";
  }
}

export class ZeroDivisionError extends InterpreterError {
  constructor(message: string, line?: number, col?: number) {
    super(message, line, col);
    this.name = "ZeroDivisionError";
  }
}
