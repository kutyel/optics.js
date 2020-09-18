import { curry } from './functions'
import { notFound, isNotFound } from './notFound'
import { setter } from './Setter'
import { optional } from './Optional'
import { reviewer } from './Reviewer'
import { partialGetter } from './PartialGetter'

class Prism {
  constructor(preview, set, review) {
    this.preview = preview
    this.set = set
    this.review = review
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
  Object.keys(mustBePresent).every((k) => k in obj && obj[k] === mustBePresent[k])

/**
 * Check that a subset of properties with their values are present.
 * Useful for working with Redux actions, or variants in general.
 *
 * @param {object} mustBePresent
 */
export const has = (mustBePresent) => prism(
  (obj)         => checkPresence(mustBePresent, obj) ? {...obj} : notFound,
  (newObj, obj) => checkPresence(mustBePresent, obj) ? {...newObj} : {...obj},
  (newObj)      => { return { ...newObj, ...mustBePresent } }
)
