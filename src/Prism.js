import { setter } from './Setter'
import { curry, isNil } from './functions'
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
    return isNil(v) ? obj : this.set(f(v), obj)
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
