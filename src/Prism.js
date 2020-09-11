import { curry, prop, assoc } from './functions'
import { affineFold } from './AffineFold'
import { affineTraversal } from './AffineTraversal'
import { setter } from './Setter'
import { reviewer } from './Reviewer'

class PrismT {
  constructor(preview, set, review) {
    this.preview = preview
    this.set = set
    this.review = review
  }

  over = (f, obj) => {
    const v = this.preview(obj)
    return v === undefined ? obj : this.set(f(v), obj)
  }

  // setter = over + set
  get asSetter() {
    return setter(this.over)
  }

  // affine fold = preview
  get asAffineFold() {
    return affineFold(this.preview)
  }

  // affine traversal = preview + set
  get asAffineTraversal() {
    return affineTraversal(this.preview, this.set)
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
