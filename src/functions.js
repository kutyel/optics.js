/**
 * Currify any function you need!
 *
 * @param {*} f - Function to be currified
 * @param {number} arity - Initial arity of the function to currify
 * @param  {...any} args - Additional arguments to be passed (optional)
 */
export const curry = (f, arity = f.length, ...args) =>
  arity <= args.length ? f(...args) : (...argz) => curry(f, arity, ...args, ...argz)

/**
 * Function composition!
 *
 * @param  {...any} fns - Comma-separated list of functions to be composed (right -> left)
 */
export const compose = (...fns) => (args) => fns.reduceRight((x, f) => f(x), args)

// prop : s -> {s: a} -> TODO: Maybe a
export const prop = curry((key, obj) => obj[key])

// assoc : String -> a -> {k: v} -> {k: v}
export const assoc = curry((key, val, obj) => ({ ...obj, [key]: val }))
