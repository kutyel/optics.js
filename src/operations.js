import { curry } from './functions'
import { Lens, lens } from './Lens'
import { Prism, prism } from './Prism'
import { Getter, getter } from './Getter'
import { Setter, setter } from './Setter'
import { Reviewer, reviewer } from './Reviewer'
import { Optional, optional } from './Optional'
import { PartialGetter } from './PartialGetter'

// combine two previews
const combinePreviews = (p1, p2) => (x) => p1.preview(x) && p2.preview(v)

/**
 * iso/prism/lens/affinetraversal/getter/affinefold/traversal/reviewer/fold/setter
 *
 * @param {*} optic1
 * @param {*} optic2
 */
const compose2Optics = (optic1, optic2) => {
  // start from most specific (iso) to less specific (fold, setter, review)
  if (optic1 instanceof Lens && optic2 instanceof Lens) {
    const o1 = optic1.asLens
    const o2 = optic2.asLens
    return lens(
      (x) => o2.get(o1.get(x)),
      (v, x) => o1.over((inner) => o2.set(v, inner), x),
    )
  } else if (optic1 instanceof Prism && optic2 instanceof Prism) {
    const o1 = optic1.asPrism
    const o2 = optic2.asPrism
    return prism(
      combinePreviews(o1.preview, o2.preview),
      (v, x) => o1.over((inner) => o2.set(v, inner), x),
      (x) => o2.review(o1.review(x)),
    )
  } else if (optic1 instanceof Optional && optic2 instanceof Optional) {
    const o1 = optic1.asOptional
    const o2 = optic2.asOptional
    return optional(combinePreviews(o1.preview, o2.preview), (v, x) =>
      o1.over((inner) => o2.set(v, inner), x),
    )
  } else if (optic1 instanceof Getter && optic2 instanceof Getter) {
    const o1 = optic1.asGetter
    const o2 = optic2.asGetter
    return getter((x) => o2.get(o1.get(x)))
  } else if (optic1 instanceof PartialGetter && optic2 instanceof PartialGetter) {
    const o1 = optic1.asPartialGetter
    const o2 = optic2.asPartialGetter
    return partialGetter(combinePreviews(o1.preview, o2.preview))
  } else if (optic1 instanceof Setter && optic2 instanceof Setter) {
    const o1 = optic1.asSetter
    const o2 = optic2.asSetter
    return setter((f, x) => o2.over((inner) => o1.over(f, inner), x))
  } else if (optic1 instanceof Reviewer && optic2 instanceof Reviewer) {
    const o1 = optic1.asReviewer
    const o2 = optic2.asReviewer
    return reviewer((x) => o2.review(o1.review(x)))
  }
}

/**
 * Optics composition!
 *
 * @param  {...any} fns - Comma-separated list of optics to be composed
 */
export const composeOptics = (...optics) => optics.reduce(compose2Optics)

/**
 * Optics composition!
 *
 * @param  {...any} fns - Comma-separated list of optics to be composed
 */
export const optics = composeOptics

// preview : AffineFold s a → s → Maybe a
export const preview = curry((optic, obj) => optic.asPartialGetter.preview(obj))

// view : Getter s a → s → a
export const view = curry((optic, obj) => optic.asGetter.get(obj))

// set : Setter s a → a → s → s
export const set = curry((optic, val, obj) => optic.asSetter.set(val, obj))

// over : Setter s a → (a → a) → s → s
export const over = curry((optic, f, obj) => optic.asSetter.over(f, obj))

// review : Reviewer s a → a → s
export const review = curry((optic, obj) => optic.asReviewer.review(obj))
