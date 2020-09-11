import { curry, prop, assoc } from './functions'
import { affineFold } from './AffineFold'
import { setter } from './Setter'

class affineTraversalT {
  constructor(preview, set) {
    this.preview = preview
    this.set = set
  }

  over = (f, obj) => {
    const v = this.preview(obj)
    return v === null ? obj : this.set(f(v), obj)
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

// lens : (s → a) → ((a, s) → s) → Lens s a
export const lens = curry((get, set) => new lensT(get, set))

// lensProp : String → Lens s a
export const lensProp = (key) => lens(prop(key), assoc(key))

// lensIndex : Number → Lens s a
export const lensIndex = (index) => lens(prop(index), assoc(index))
