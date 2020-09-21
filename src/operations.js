import { OpticComposeError, UnavailableOpticOperationError } from './errors'
import { fold } from './Fold'
import { curry } from './functions'
import { getter } from './Getter'
import { ix, lens, prop } from './Lens'
import { isNotFound, notFound } from './notFound'
import { optional, optionalIx, optionalProp } from './Optional'
import { partialGetter } from './PartialGetter'
import { prism } from './Prism'
import { reviewer } from './Reviewer'
import { setter } from './Setter'
import { traversal } from './Traversal'

// combine two previews
const combinePreviews = (p1, p2) => (x) => {
  const v = p1(x)
  return isNotFound(v) ? notFound : p2(v)
}

// r1 comes from Fold a b => ((r -> b -> r) -> r -> a -> r)
// r2 comes from Fold b c => ((r -> c -> r) -> r -> b -> r)
// and we want to get Fold a c => ((r -> c -> r) -> r -> a -> r)
const combineReduces = (r1, r2) => (f, i, obj) => r2((acc, cur) => r1(f, acc, cur), i, obj)

/**
 * Compose two optics
 *
 * @param {*} optic1
 * @param {*} optic2
 */
const compose2Optics = (optic1, optic2) => {
  // start from most specific (iso) to less specific (fold, setter, reviewer)
  if ('asLens' in optic1 && 'asLens' in optic2) {
    const o1 = optic1.asLens
    const o2 = optic2.asLens
    return lens(
      (x) => o2.get(o1.get(x)),
      (v, x) => o1.over((inner) => o2.set(v, inner), x),
    )
  } else if ('asPrism' in optic1 && 'asPrism' in optic2) {
    const o1 = optic1.asPrism
    const o2 = optic2.asPrism
    return prism(
      combinePreviews(o1.preview, o2.preview),
      (v, x) => o1.over((inner) => o2.set(v, inner), x),
      (x) => o2.review(o1.review(x)),
    )
  } else if ('asOptional' in optic1 && 'asOptional' in optic2) {
    const o1 = optic1.asOptional
    const o2 = optic2.asOptional
    return optional(combinePreviews(o1.preview, o2.preview), (v, x) =>
      o1.over((inner) => o2.set(v, inner), x),
    )
  } else if ('asTraversal' in optic1 && 'asTraversal' in optic2) {
    const o1 = optic1.asTraversal
    const o2 = optic2.asTraversal
    return traversal(
      combineReduces(o1.reduce, o2.reduce),
      (obj) => o1.toArray(obj).flatMap((x) => o2.toArray(x)),
      (f, x) => o1.over((inner) => o2.over(f, inner), x),
    )
  } else if ('asGetter' in optic1 && 'asGetter' in optic2) {
    const o1 = optic1.asGetter
    const o2 = optic2.asGetter
    return getter((x) => o2.get(o1.get(x)))
  } else if ('asPartialGetter' in optic1 && 'asPartialGetter' in optic2) {
    const o1 = optic1.asPartialGetter
    const o2 = optic2.asPartialGetter
    return partialGetter(combinePreviews(o1.preview, o2.preview))
  } else if ('asFold' in optic1 && 'asFold' in optic2) {
    const o1 = optic1.asFold
    const o2 = optic2.asFold
    return fold(combineReduces(o1.reduce, o2.reduce), (obj) =>
      o1.toArray(obj).flatMap((x) => o2.toArray(x)),
    )
  } else if ('asSetter' in optic1 && 'asSetter' in optic2) {
    const o1 = optic1.asSetter
    const o2 = optic2.asSetter
    return setter((f, x) => o1.over((inner) => o2.over(f, inner), x))
  } else if ('asReviewer' in optic1 && 'asReviewer' in optic2) {
    const o1 = optic1.asReviewer
    const o2 = optic2.asReviewer
    return reviewer((x) => o2.review(o1.review(x)))
  }

  throw new OpticComposeError(optic1.__opticType, optic2.__opticType, 'incompatible optics')
}

const toOptic = (optic) => {
  if (typeof optic == 'string' || optic instanceof String) {
    return prop(optic)
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

// reduce : Fold s a → (r -> a -> r) -> r -> s -> r
export const reduce = curry((optic, f, i, obj) => {
  if ('asFold' in optic) return optic.asFold.reduce(f, i, obj)
  else
    throw new UnavailableOpticOperationError(
      'reduce',
      optic.__opticType,
      'reduce is not supported by ' + optic.__opticType,
    )
})

// toArray : Fold s a → s → [a]
export const toArray = curry((optic, obj) => {
  if ('asFold' in optic) return optic.asFold.toArray(obj)
  else
    throw new UnavailableOpticOperationError(
      'toArray',
      optic.__opticType,
      'toArray is not supported by ' + optic.__opticType,
    )
})

// preview : Optional s a → s → Maybe a
export const preview = curry((optic, obj) => {
  if ('asPartialGetter' in optic) return optic.asPartialGetter.preview(obj)
  else
    throw new UnavailableOpticOperationError(
      'preview',
      optic.__opticType,
      'preview is not supported by ' + optic.__opticType,
    )
})

// view : Getter s a → s → a
export const view = curry((optic, obj) => {
  if ('asGetter' in optic) return optic.asGetter.get(obj)
  else
    throw new UnavailableOpticOperationError(
      'view/get',
      optic.__opticType,
      'view/get is not supported by ' + optic.__opticType,
    )
})

// set : Setter s a → a → s → s
export const set = curry((optic, val, obj) => {
  if ('asSetter' in optic) return optic.asSetter.set(val, obj)
  else
    throw new UnavailableOpticOperationError(
      'set',
      optic.__opticType,
      'set is not supported by ' + optic.__opticType,
    )
})

// over : Setter s a → (a → a) → s → s
export const over = curry((optic, f, obj) => {
  if ('asSetter' in optic) return optic.asSetter.over(f, obj)
  else
    throw new UnavailableOpticOperationError(
      'over',
      optic.__opticType,
      'over is not supported by ' + optic.__opticType,
    )
})

// review : Reviewer s a → a → s
export const review = curry((optic, obj) => {
  if ('asReviewer' in optic) return optic.asReviewer.review(obj)
  else
    throw new UnavailableOpticOperationError(
      'review',
      optic.__opticType,
      'review is not supported by ' + optic.__opticType,
    )
})

// maybe : (String | Int | Lens s a) -> Optional s a
export const maybe = (optic) => {
  if (typeof optic == 'string' || optic instanceof String) {
    return optionalProp(optic)
  }
  if (typeof optic == 'number' && !isNaN(optic)) {
    return optionalIx(optic)
  }
  if ('asLens' in optic) {
    const l = optic.asLens
    return optional(l.get, l.set)
  }
  return undefined
}
