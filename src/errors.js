// define error classes as instructed in
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error

export class OpticComposeError extends Error {
  constructor(optic1, optic2, ...params) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(...params)

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, OpticComposeError)
    }

    this.name = 'OpticComposeError'
    // Custom debugging information
    this.optic1 = optic1
    this.optic2 = optic2
  }
}

export class UnavailableOpticOperationError extends Error {
  constructor(operation, optic, ...params) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(...params)

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, OpticComposeError)
    }

    this.name = 'UnavailableOpticOperationError'
    // Custom debugging information
    this.operation = operation
    this.optic = optic
  }
}
