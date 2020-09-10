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

/**
 * The important stuff
 */

// view : Lens s a → s → a
export const view = curry((lens, obj) => lens.get(obj))

// set : Lens s a → a → s → s
export const set = curry((lens, val, obj) => lens.set(val, obj))

// over : Lens s a → (a → a) → s → s
export const over = curry((lens, f, obj) => lens.set(f(lens.get(obj)), obj))
