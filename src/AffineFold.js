import { curry } from './functions'

class AffineFoldT {
  constructor(preview) {
    this.preview = preview
  }

  // itself
  get asAffineFold() {
    return this
  }
}

// affineFold : (s → Maybe a) → AffineFold s a
export const affineFold = curry((preview) => new AffineFoldT(preview))
