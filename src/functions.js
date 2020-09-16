/**
 * This module should be private and only for internal use
 */

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

// get : s -> {s: a} -> Maybe a
export const get = curry((key, obj) => obj[key])

// set : String -> a -> {k: v} -> {k: v}
export const set = curry((key, val, obj) => (key in obj ? { ...obj, [key]: val } : obj))

// toUpper : String -> String
export const toUpper = (str) => str.toUpperCase()

// isNil : Nullable a => a -> Boolean
export const isNil = (x) => x === null || x === undefined
