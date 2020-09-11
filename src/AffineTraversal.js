import { curry } from './functions'
import { affineFold } from './AffineFold'
import { setter } from './Setter'

class AffineTraversalT {
  constructor(preview, set) {
    this.preview = preview
    this.set = set
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

  // itself
  get asAffineTraversal() {
    return this
  }
}

// lens : (s → Maybe a) → ((a, s) → s) → AffineTraversal s a
export const affineTraversal = curry((preview, set) => new AffineTraversalT(preview, set))
