import { curry } from './functions'
import { partialGetter } from './PartialGetter'

class GetterT {
  constructor(get) {
    this.get = get
  }

  view = this.get

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
export const getter = curry((get) => new GetterT(get))
