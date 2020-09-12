import { curry, prop, assoc } from './functions'
import { getter } from './Getter'
import { optional } from './Optional'
import { partialGetter } from './PartialGetter'
import { setter } from './Setter'

class LensT {
  constructor(get, set) {
    this.get = get
    this.set = set
  }

  // derived operations
  view = this.get
  over = (f, obj) => this.set(f(this.get(obj)), obj)

  // setter = over + set
  get asSetter() {
    return setter(this.over)
  }

  // optional = preview + set
  get asOptional() {
    return optional(this.get, this.set)
  }

  // getter = get
  get asGetter() {
    return getter(this.get)
  }

  // partial getter = preview
  get asPartialGetter() {
    return partialGetter(this.get)
  }
  preview = this.get

  // itself
  get asLens() {
    return this
  }
}

// lens : (s → a) → ((a, s) → s) → Lens s a
export const lens = curry((get, set) => new LensT(get, set))

// lensProp : String → Lens s a
export const lensProp = (key) => lens(prop(key), assoc(key))

// lensIndex : Number → Lens s a
export const lensIndex = (index) => lens(prop(index), assoc(index))
