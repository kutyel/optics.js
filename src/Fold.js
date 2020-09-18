import { curry } from './functions'

class Fold {
  constructor(reduce, toArray) {
    this.reduce = reduce ?? ((f, i, obj) => toArray(obj).reduce(f, i))
    this.toArray = toArray ?? ((obj) => reduce((acc, cur) => acc.concat(cur), [], obj))
  }

  // itself
  get asFold() {
    return this
  }
}

// fold : ((b -> a -> b) -> b -> s -> b) → Fold s a
export const foldFromReduce = curry((reduce) => new Fold(reduce, null))
// fold : (s -> [a]) -> Fold s a
export const foldFromToArray = curry((toArray) => new Fold(null, toArray))
// fold : ((b -> a -> b) -> b -> s -> b) -> (s -> [a]) -> Fold s a
export const fold = curry((reduce, toArray) => new Fold(reduce, toArray))
