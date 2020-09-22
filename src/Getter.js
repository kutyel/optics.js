import { fold } from './Fold'
import { curry } from './functions'
import { partialGetter } from './PartialGetter'

class Getter {
  constructor(get) {
    this.get = get

    // derived operations
    this.reduce = (f, i, obj) => f(i, this.get(obj))
    this.toArray = (obj) => [this.get(obj)]
    this.preview = this.get
  }

  // fold = reduce + toArray
  get asFold() {
    return fold(this.reduce, this.toArray)
  }

  // partial getter = preview
  get asPartialGetter() {
    return partialGetter(this.get)
  }

  // itself
  get asGetter() {
    return this
  }
}

// getter : (s → a) → Getter s a
export const getter = curry((get) => new Getter(get))
