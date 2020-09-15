import { setter } from './Setter'
import { partialGetter } from './PartialGetter'
import { curry, prop, assoc } from './functions'

export class Optional {
  constructor(preview, set) {
    this.preview = preview
    this.set = set
  }

  over = (f, obj) => {
    const v = this.preview(obj)
    return !v ? obj : this.set(f(v), obj)
  }

  // setter = over + set
  get asSetter() {
    return setter(this.over)
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
export const optionalProp = (key) => optional(prop(key), assoc(key))

// optionalIndex : Number → Optional s a
export const optionalIndex = (index) => optional(prop(index), assoc(index))
