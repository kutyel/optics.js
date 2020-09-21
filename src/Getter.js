import { fold } from './Fold'
import { curry } from './functions'
import { partialGetter } from './PartialGetter'

class Getter {
  constructor(get) {
    this.get = get
  }

  // fold = reduce + toArray
  get asFold() {
    return fold(this.reduce, this.toArray)
  }
  reduce = (f, i, obj) => f(i, this.get(obj))
  toArray = (obj) => [this.get(obj)]

  // partial getter = preview
  get asPartialGetter() {
    return partialGetter(this.get)
  }
  preview = this.get

  // itself
  get asGetter() {
    return this
  }
}

// getter : (s → a) → Getter s a
export const getter = curry((get) => new Getter(get))
