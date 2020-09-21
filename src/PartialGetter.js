import { fold } from './Fold'
import { curry } from './functions'
import { notFoundToList } from './notFound'

/**
 * AKA: Affine Fold
 */
class PartialGetter {
  constructor(preview) {
    this.preview = preview
  }

  get __opticType() {
    return 'PartialGetter'
  }

  // fold = reduce + toArray
  get asFold() {
    return fold(this.reduce, this.toArray)
  }
  reduce = (f, i, obj) => notFoundToList(this.preview(obj)).reduce(f, i)
  toArray = (obj) => notFoundToList(this.preview(obj))

  // itself
  get asPartialGetter() {
    return this
  }
}

// partialGetter : (s → Maybe a) → AffineFold s a
export const partialGetter = curry((preview) => new PartialGetter(preview))
