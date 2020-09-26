import { OpticCreationError } from './errors'
import { fold } from './Fold'
import { curry, setIndex } from './functions'
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

    // derived operations
    this.over = (f, obj) => {
      const v = this.preview(obj)
      return isNotFound(v) ? obj : this.set(f(v), obj)
    }
    this.reduce = (f, i, obj) => notFoundToList(this.preview(obj)).reduce(f, i)
    this.toArray = (obj) => notFoundToList(this.preview(obj))
    this.matches = (obj) => !isNotFound(preview(obj))
  }

  // setter = over + set
  get asSetter() {
    return setter(this.over)
  }

  // fold = reduce + toArray
  get asFold() {
    return fold(this.reduce, this.toArray)
  }

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
    (obj) => obj[key] || notFound,
    (val, obj) => (obj[key] ? { ...obj, [key]: val } : obj),
  )

// optionalIx : Number → Optional s a
export const optionalIx = (index) =>
  optional(
    (obj) => obj[index] || notFound,
    (val, obj) => (obj[index] ? setIndex(index, val, obj) : obj),
  )

// maybe : (String | Int | Lens s a) -> Optional s a
export const maybe = (optic) => {
  if (typeof optic == 'string' || optic instanceof String) {
    return optionalProp(optic)
  }
  if (typeof optic == 'number' && !isNaN(optic)) {
    return optionalIx(optic)
  }
  if (optic.asLens) {
    const l = optic.asLens
    return optional(l.get, l.set)
  }
  throw new OpticCreationError('Optional', typeof optic + ' cannot be turned into optional')
}

// never : Optional s a
export const never = optional(
  () => notFound,
  (_, obj) => obj,
)
