import { OpticComposeError, UnavailableOpticOperationError } from './errors'
import { fold, foldFromToArray } from './Fold'
import { curry } from './functions'
import { getter } from './Getter'
import { iso } from './Iso'
import { alter, ix, lens } from './Lens'
import { isNotFound, notFound } from './notFound'
import { optional } from './Optional'
import { partialGetter } from './PartialGetter'
import { prism } from './Prism'
import { reviewer } from './Reviewer'
import { setter } from './Setter'
import { traversal, traversalFromToArray } from './Traversal'

// COMBINATORS
// ===========

const combineGets = (g1, g2) => x => g2(g1(x))
const combineSets = (o1, s2) => (v, x) => o1(inner => s2(v, inner), x)
const combineOvers = (o1, o2) => (f, x) => o1(inner => o2(f, inner), x)
const combinePreviews = (p1, p2) => x => {
  const v = p1(x)
  return isNotFound(v) ? notFound : p2(v)
}
// r1 comes from Fold a b => ((r -> b -> r) -> r -> a -> r)
// r2 comes from Fold b c => ((r -> c -> r) -> r -> b -> r)
// and we want to get Fold a c => ((r -> c -> r) -> r -> a -> r)
const combineReduces = (r1, r2) => (f, i, obj) => r2((acc, cur) => r1(f, acc, cur), i, obj)
const combineToArrays = (t1, t2) => obj => t1(obj).flatMap(t2)
const combineReviews = (r1, r2) => x => r1(r2(x))

/**
 * Compose two optics
 *
 * @param {*} optic1
 * @param {*} optic2
 */
const compose2Optics = (optic1, optic2) => {
  // start from most specific (iso) to less specific (fold, setter, reviewer)
  if (optic1.asIso && optic2.asIso) {
    const o1 = optic1.asIso
    const o2 = optic2.asIso
    return iso(combineGets(o1.get, o2.get), combineReviews(o1.review, o2.review))
  } else if (optic1.asLens && optic2.asLens) {
    const o1 = optic1.asLens
    const o2 = optic2.asLens
    return lens(combineGets(o1.get, o2.get), combineSets(o1.over, o2.set))
  } else if (optic1.asPrism && optic2.asPrism) {
    const o1 = optic1.asPrism
    const o2 = optic2.asPrism
    return prism(
      combinePreviews(o1.preview, o2.preview),
      combineSets(o1.over, o2.set),
      combineReviews(o1.review, o2.review),
    )
  } else if (optic1.asOptional && optic2.asOptional) {
    const o1 = optic1.asOptional
    const o2 = optic2.asOptional
    return optional(combinePreviews(o1.preview, o2.preview), combineSets(o1.over, o2.set))
  } else if (optic1.asTraversal && optic2.asTraversal) {
    const o1 = optic1.asTraversal
    const o2 = optic2.asTraversal
    return traversal(
      combineReduces(o1.reduce, o2.reduce),
      combineToArrays(o1.toArray, o2.toArray),
      combineOvers(o1.over, o2.over),
    )
  } else if (optic1.asGetter && optic2.asGetter) {
    const o1 = optic1.asGetter
    const o2 = optic2.asGetter
    return getter(combineGets(o1.get, o2.get))
  } else if (optic1.asPartialGetter && optic2.asPartialGetter) {
    const o1 = optic1.asPartialGetter
    const o2 = optic2.asPartialGetter
    return partialGetter(combinePreviews(o1.preview, o2.preview))
  } else if (optic1.asFold && optic2.asFold) {
    const o1 = optic1.asFold
    const o2 = optic2.asFold
    return fold(combineReduces(o1.reduce, o2.reduce), combineToArrays(o1.toArray, o2.toArray))
  } else if (optic1.asSetter && optic2.asSetter) {
    const o1 = optic1.asSetter
    const o2 = optic2.asSetter
    return setter(combineOvers(o1.over, o2.over))
  } else if (optic1.asReviewer && optic2.asReviewer) {
    const o1 = optic1.asReviewer
    const o2 = optic2.asReviewer
    return reviewer(combineReviews(o1.review, o2.review))
  }

  throw new OpticComposeError(
    'compose',
    [optic1.constructor.name, optic2.constructor.name],
    'incompatible optics',
  )
}

const toOptic = optic => {
  if (typeof optic == 'string' || optic instanceof String) {
    return alter(optic)
  }
  if (typeof optic == 'number' && !isNaN(optic)) {
    return ix(optic)
  }
  // any other case means it was already an optic
  return optic
}

/**
 * Create a new optic by composition.
 *
 * You can use a string or integer to directly create a lens,
 * or wrap it with 'maybe' to create an optional
 *
 * @param  {...any} optics - Comma-separated or array of optics to be composed
 *
 * flatten the arguments to account for composeOptics(['this', 'that'])
 */
export const composeOptics = (...optics) => optics.flat().map(toOptic).reduce(compose2Optics)
export const optic = composeOptics
export const path = composeOptics

export const sequence = (...optics) => {
  const optics1 = optics.flat().map(toOptic)
  if (optics1.every(o => o.asFold)) {
    return foldFromToArray(obj => optics1.flatMap(o => toArray(o, obj)))
  } else {
    throw new OpticComposeError(
      'sequence',
      optics1.map(o => o.constructor.name),
      'incompatible optics',
    )
  }
}

const firstOfPreviews = optics => obj => {
  for (const o of optics) {
    const v = preview(o, obj)
    if (!isNotFound(v)) return v
  }
  return notFound
}

const firstOfToArrays = optics => obj => {
  for (const o of optics) {
    const v = toArray(o, obj)
    if (v.length > 0) return v
  }
  return []
}

const firstOfSets = optics => (v, obj) => {
  for (const o of optics) {
    if (matches(o, obj)) return set(o, v, obj)
  }
  return obj
}

const firstOfOvers = optics => (f, obj) => {
  for (const o of optics) {
    if (matches(o, obj)) return over(o, f, obj)
  }
  return obj
}

export const firstOf = (...optics) => {
  const optics1 = optics.flat().map(toOptic)

  if (optics1.every(o => o.asOptional)) {
    return optional(firstOfPreviews(optics1), firstOfSets(optics1))
  } else if (optics1.every(o => o.asTraversal)) {
    return traversalFromToArray(firstOfToArrays(optics1), firstOfOvers(optics1))
  } else if (optics1.every(o => o.asPartialGetter)) {
    return partialGetter(firstOfPreviews(optics1))
  } else if (optics1.every(o => o.asFold)) {
    return foldFromToArray(firstOfToArrays(optics1))
  } else {
    throw new OpticComposeError(
      'firstOf',
      optics1.map(o => o.constructor.name),
      'incompatible optics',
    )
  }
}

// OPERATIONS
// ==========

// reduce : Fold s a → (r -> a -> r) -> r -> s -> r
export const reduce = curry((optic, f, i, obj) => {
  if (optic.asFold) {
    return optic.asFold.reduce(f, i, obj)
  } else {
    throw new UnavailableOpticOperationError(
      'reduce',
      optic.constructor.name,
      'reduce is not supported by ' + optic.constructor.name,
    )
  }
})

// toArray : Fold s a → s → [a]
export const toArray = curry((optic, obj) => {
  if (optic.asFold) {
    return optic.asFold.toArray(obj)
  } else {
    throw new UnavailableOpticOperationError(
      'toArray',
      optic.constructor.name,
      `toArray is not supported by ${optic.constructor.name}`,
    )
  }
})

// preview : Optional s a → s → Maybe a
export const preview = curry((optic, obj) => {
  if (optic.asPartialGetter) {
    return optic.asPartialGetter.preview(obj)
  } else {
    throw new UnavailableOpticOperationError(
      'preview',
      optic.constructor.name,
      `preview is not supported by ${optic.constructor.name}`,
    )
  }
})

// view : Getter s a → s → a
export const view = curry((optic, obj) => {
  if (optic.asGetter) {
    return optic.asGetter.get(obj)
  } else {
    throw new UnavailableOpticOperationError(
      'view/get',
      optic.constructor.name,
      'view/get is not supported by ' + optic.constructor.name,
    )
  }
})

// set : Setter s a → a → s → s
export const set = curry((optic, val, obj) => {
  if (optic.asSetter) {
    return optic.asSetter.set(val, obj)
  } else {
    throw new UnavailableOpticOperationError(
      'set',
      optic.constructor.name,
      'set is not supported by ' + optic.constructor.name,
    )
  }
})

// over : Setter s a → (a → a) → s → s
export const over = curry((optic, f, obj) => {
  if (optic.asSetter) {
    return optic.asSetter.over(f, obj)
  } else {
    throw new UnavailableOpticOperationError(
      'over',
      optic.constructor.name,
      'over is not supported by ' + optic.constructor.name,
    )
  }
})

// review : Reviewer s a → a → s
export const review = curry((optic, obj) => {
  if (optic.asReviewer) return optic.asReviewer.review(obj)
  else
    throw new UnavailableOpticOperationError(
      'review',
      optic.constructor.name,
      'review is not supported by ' + optic.constructor.name,
    )
})

// matches : Fold s a -> s -> Bool
export const matches = curry((optic, obj) => {
  if (optic.asPartialGetter) return !isNotFound(preview(optic, obj))
  else if (optic.asFold) return reduce(optic, () => true, false, obj)
  else
    throw new UnavailableOpticOperationError(
      'matches',
      optic.constructor.name,
      'matches is not supported by ' + optic.constructor.name,
    )
})
