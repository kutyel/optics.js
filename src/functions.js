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

// get : s -> {s: a} -> Maybe a
export const get = curry((key, obj) => {
  return obj instanceof Map ? obj.get(key) : obj[key]
})

// set : String -> a -> {k: v} -> {k: v}
export const set = curry((key, val, obj) => {
  if (obj instanceof Map) {
    if (obj.has(key)) {
      const newMap = new Map(obj)
      const keyVal = newMap.get(key)
      newMap.delete(key)
      newMap.set(val, keyVal)

      return newMap
    }
    return obj
  }
  return obj[key] ? { ...obj, [key]: val } : obj
})

// setIndex : Index -> a -> [a] -> [a]
export const setIndex = curry((index, val, array) => array.map((v, i) => (i == index ? val : v)))

// toUpper : String -> String
export const toUpper = str => str.toUpperCase()

export const isNil = x => x === null || x === undefined
