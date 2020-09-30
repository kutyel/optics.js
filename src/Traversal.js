import { fold } from './Fold'
import { curry } from './functions'
import { setter } from './Setter'

class Traversal {
  constructor(reduce, toArray, over) {
    if (!reduce) this.reduce = (f, i, obj) => toArray(obj).reduce(f, i)
    else this.reduce = reduce

    if (!toArray) this.toArray = obj => reduce((acc, cur) => acc.concat([cur]), [], obj)
    else this.toArray = toArray

    this.over = over

    // derived operations
    this.set = (val, x) => this.over(() => val, x)
    this.matches = obj => reduce(() => true, false, obj)
  }

  // setter = over + set
  get asSetter() {
    return setter(this.over)
  }

  // fold = reduce + toArray
  get asFold() {
    return fold(this.reduce, this.toArray)
  }

  // itself
  get asTraversal() {
    return this
  }
}

// traversal : ((b -> a -> b) -> b -> s -> b) → ((a -> a) -> s -> s) -> Traversal s a
export const traversalFromReduce = curry((reduce, over) => new Traversal(reduce, null, over))
// traversal : (s -> [a]) -> ((a -> a) -> s -> s) -> Traversal s a
export const traversalFromToArray = curry((toArray, over) => new Traversal(null, toArray, over))
// traversal : ((b -> a -> b) -> b -> s -> b) -> (s -> [a])
//           -> ((a -> a) -> s -> s) -> Traversal s a
export const traversal = curry((reduce, toArray, over) => new Traversal(reduce, toArray, over))

// values : Traversal [a] a
export const values = traversal(
  (f, i, obj) => obj.reduce(f, i),
  obj => [...obj],
  (f, obj) => obj.map(f),
)

// entries : Traversal Object [K, V]
export const entries = traversalFromToArray(
  obj => [...Object.entries(obj)],
  (f, obj) => Object.fromEntries([...Object.entries(obj)].map(f)),
)
