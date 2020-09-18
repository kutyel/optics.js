import { curry } from './functions'
import { isNotFound, notFound } from './notFound'
import { partialGetter } from './PartialGetter'
import { setter } from './Setter'

/**
 * AKA: Affine Traversal
 */
class Optional {
  constructor(preview, set) {
    this.preview = preview
    this.set = set
  }

  over = (f, obj) => {
    const v = this.preview(obj)
    return isNotFound(v) ? obj : this.set(f(v), obj)
  }

  // setter = over + set
  get asSetter() {
    return setter(this.over)
  }

  // partial getter = preview
  get asPartialGetter() {
    return partialGetter(this.preview)
  }

  // itself
  get asOptional() {
    return this
  }
}

// optional : (s → Maybe a) → ((a, s) → s) → Optional s a
export const optional = curry((preview, set) => new Optional(preview, set))

// optionalProp : String → Optional s a
export const optionalProp = (key) =>
  optional(
    (obj) => (key in obj ? obj[key] : notFound),
    (val, obj) => (key in obj ? { ...obj, [key]: val } : obj),
  )

// optionalIx : Number → Optional s a
export const optionalIx = (index) =>
  optional(
    (obj) => (index in obj ? obj[index] : notFound),
    (val, obj) => (index in obj ? { ...obj, [index]: val } : obj),
  )
