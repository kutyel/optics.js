import { curry } from './functions'

export class PartialGetter {
  constructor(preview) {
    this.preview = preview
  }

  // itself
  get asPreviewer() {
    return this
  }
}

// partialGetter : (s → Maybe a) → AffineFold s a
export const partialGetter = curry((preview) => new PartialGetter(preview))
