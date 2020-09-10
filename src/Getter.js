import { curry } from './functions'

class getterT {
  constructor(get) {
    this.get = get
  }

  view = this.get

  // affine fold = preview
  get asAffineFold() {
    return affineFold(this.get)
  }
  preview = this.get

  // itself
  get asGetter() {
    return this
  }
}

// getter : (s → a) → Getter s a
export const getter = curry((get) => new getterT(get))
