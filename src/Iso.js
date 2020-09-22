import { fold } from './Fold'
import { curry } from './functions'
import { getter } from './Getter'
import { lens } from './Lens'
import { optional } from './Optional'
import { partialGetter } from './PartialGetter'
import { prism } from './Prism'
import { reviewer } from './Reviewer'
import { setter } from './Setter'
import { traversal } from './Traversal'

class Iso {
  constructor(get, review) {
    this.get = get
    this.review = review

    // derived operations
    this.set = (x) => this.review(x)
    this.over = (f, obj) => this.review(f(this.get(obj)))
    this.reduce = (f, i, obj) => f(i, this.get(obj))
    this.toArray = (obj) => [this.get(obj)]
    this.preview = this.get
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

  // optional = preview + set
  get asOptional() {
    return optional(this.get, this.set)
  }

  // prism = preview + set + review
  get asPrism() {
    return prism(this.get, this.set, this.review)
  }

  // reviewer = review
  get asReviewer() {
    return reviewer(this.review)
  }

  // getter = get
  get asGetter() {
    return getter(this.get)
  }

  // partial getter = preview
  get asPartialGetter() {
    return partialGetter(this.get)
  }

  // lens
  get asLens() {
    return lens(this.get, this.set)
  }

  // itself
  get asIso() {
    return this
  }
}

// iso : (s → a) → (a → s) → Iso s a
export const iso = curry((get, review) => new Iso(get, review))
