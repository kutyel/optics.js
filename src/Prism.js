import { curry, prop, assoc } from './functions'
import { optional } from './Optional'
import { partialGetter } from './PartialGetter'
import { reviewer } from './Reviewer'
import { setter } from './Setter'

class PrismT {
  constructor(preview, set, review) {
    this.preview = preview
    this.set = set
    this.review = review
  }

  over = (f, obj) => {
    const v = this.preview(obj)
    return v === null ? obj : this.set(f(v), obj)
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
export const prism = curry((preview, set, review) => new PrismT(preview, set, review))
