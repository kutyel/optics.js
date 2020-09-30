import { fold } from './Fold'
import { curry } from './functions'
import { isNotFound, notFoundToList } from './notFound'

/**
 * AKA: Affine Fold
 */
class PartialGetter {
  constructor(preview) {
    this.preview = preview

    // derived operations
    this.reduce = (f, i, obj) => notFoundToList(this.preview(obj)).reduce(f, i)
    this.toArray = (obj) => notFoundToList(this.preview(obj))
    this.matches = (obj) => !isNotFound(preview(obj))
  }

  // fold = reduce + toArray
  get asFold() {
    return fold(this.reduce, this.toArray)
  }

  // itself
  get asPartialGetter() {
    return this
  }
}

// partialGetter : (s → Maybe a) → AffineFold s a
export const partialGetter = curry((preview) => new PartialGetter(preview))
