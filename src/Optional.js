import { fold } from './Fold'
import { curry } from './functions'
import { isNotFound, notFound, notFoundToList } from './notFound'
import { partialGetter } from './PartialGetter'
import { setter } from './Setter'
import { traversal } from './Traversal'

/**
 * AKA: Affine Traversal
 */
class Optional {
  constructor(preview, set) {
    this.preview = preview
    this.set = set
  }

  get __opticType() {
    return 'Optional'
  }

  over = (f, obj) => {
    const v = this.preview(obj)
    return isNotFound(v) ? obj : this.set(f(v), obj)
  }

  // setter = over + set
  get asSetter() {
    return setter(this.over)
  }

  // fold = reduce + toArray
  get asFold() {
    return fold(this.reduce, this.toArray)
  }
  reduce = (f, i, obj) => notFoundToList(this.preview(obj)).reduce(f, i)
  toArray = (obj) => notFoundToList(this.preview(obj))

  // traversal = reduce + toArray + over
  get asTraversal() {
    return traversal(this.reduce, this.toArray, this.over)
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
    (obj) => {
      if (key in obj) return obj[key]
      else return notFound
    },
    (val, obj) => (obj[key] ? { ...obj, [key]: val } : obj),
  )

// optionalIx : Number → Optional s a
export const optionalIx = (index) =>
  optional(
    (obj) => {
      if (index in obj) return obj[index]
      else return notFound
    },
    (val, obj) => (obj[index] ? { ...obj, [index]: val } : obj),
  )
