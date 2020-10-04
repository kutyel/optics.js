import { fold } from './Fold'
import { curry, get, isNil, set, setIndex } from './functions'
import { getter } from './Getter'
import { isNotFound, notFound } from './notFound'
import { optional } from './Optional'
import { partialGetter } from './PartialGetter'
import { setter } from './Setter'
import { traversal } from './Traversal'

class Lens {
  constructor(get, set) {
    this.get = get
    this.set = set

    // derived operations
    this.over = (f, obj) => this.set(f(this.get(obj)), obj)
    this.reduce = (f, i, obj) => f(i, this.get(obj))
    this.toArray = obj => [this.get(obj)]
    this.preview = this.get
    this.matches = () => true
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

  // getter = get
  get asGetter() {
    return getter(this.get)
  }

  // partial getter = preview
  get asPartialGetter() {
    return partialGetter(this.get)
  }

  // itself
  get asLens() {
    return this
  }
}

// lens : (s → a) → ((a, s) → s) → Lens s a
export const lens = curry((get, set) => new Lens(get, set))

// ix : Number → Lens s a
export const ix = index => lens(get(index), setIndex(index))

// mustBePresent : String → Lens s a
export const mustBePresent = key => lens(get(key), set(key))

// alter : String → Lens (Maybe s) (Maybe a)
export const alter = key =>
  lens(
    obj => (isNotFound(obj) || isNil(obj[key]) ? notFound : obj[key]),
    (val, obj) => {
      if (isNotFound(val)) {
        if (typeof obj === 'object') {
          // eslint-disable-next-line no-unused-vars
          const { [key]: _, ...newObj } = obj
          return newObj
        } else return obj
      } else {
        return typeof obj === 'object' ? { ...obj, [key]: val } : { [key]: val }
      }
    },
  )
