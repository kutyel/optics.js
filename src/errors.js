// define error classes as instructed in
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error

export class OpticCreationError extends Error {
  constructor(optic, ...params) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(...params)

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, OpticCreationError)
    }

    this.name = 'OpticCreationError'
    // Custom debugging information
    this.optic = optic
  }
}

export class OpticComposeError extends Error {
  constructor(combinator, optics, ...params) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(...params)

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, OpticComposeError)
    }

    this.name = 'OpticComposeError'
    // Custom debugging information
    this.combinator = combinator
    this.optics = optics
  }
}

export class UnavailableOpticOperationError extends Error {
  constructor(operation, optic, ...params) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(...params)

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UnavailableOpticOperationError)
    }

    this.name = 'UnavailableOpticOperationError'
    // Custom debugging information
    this.operation = operation
    this.optic = optic
  }
}
