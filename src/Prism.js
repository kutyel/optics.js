import { fold } from './Fold'
import { curry } from './functions'
import { isNotFound, notFound, notFoundToList } from './notFound'
import { optional } from './Optional'
import { partialGetter } from './PartialGetter'
import { reviewer } from './Reviewer'
import { setter } from './Setter'
import { traversal } from './Traversal'

class Prism {
  constructor(preview, set, review) {
    this.preview = preview
    this.set = set
    this.review = review
  }

  get __opticType() {
    return 'Prism'
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

  // optional = preview + set
  get asOptional() {
    return optional(this.preview, this.set)
  }

  // reviewer = review
  get asReviewer() {
    return reviewer(this.review)
  }

  // itself
  get asPrism() {
    return this
  }
}

// prism : (s → Maybe a) → ((a, s) → s) → (a → s) → Prism s a
export const prism = curry((preview, set, review) => new Prism(preview, set, review))

const checkPresence = (mustBePresent, obj) =>
  Object.keys(mustBePresent).every((k) => obj[k] && obj[k] === mustBePresent[k])

/**
 * Check that a subset of properties with their values are present.
 * Useful for working with Redux actions, or variants in general.
 *
 * @param {object} mustBePresent
 */
export const has = (mustBePresent) =>
  prism(
    (obj) => (checkPresence(mustBePresent, obj) ? { ...obj } : notFound),
    (newObj, obj) => (checkPresence(mustBePresent, obj) ? { ...newObj } : { ...obj }),
    (newObj) => ({ ...newObj, ...mustBePresent }),
  )
