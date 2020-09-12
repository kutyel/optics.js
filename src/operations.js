import { curry } from './functions'
import { getter } from './Getter'
import { lens } from './Lens'
import { optional } from './Optional'
import { previewer } from './PartialGetter'
import { prism } from './Prism'
import { reviewer } from './Reviewer'
import { setter } from './Setter'

// iso, /prism, /lens,
// /affinetraversal, /getter,
// /affinefold, traversal,
// /reviewer, fold, /setter
const ocompose2 = (optic1, optic2) => {

  // combine two previews
  let combinePreviews = (p1, p2) => x => {
    const v = p1.preview(x)
    return v === null ? null : p2.preview(v)
  }

  // start from most specific (iso) to less specific (fold, setter, review)
  if ('asLens' in optic1 && 'asLens' in optic2) {
    const o1 = optic1.asLens
    const o2 = optic2.asLens
    return lens(x => o2.get(o1.get(x)),
                (v, x) => o1.over(inner => o2.set(v, inner), x))
  } else if ('asPrism' in optic1 && 'asPrism' in optic2) {
    const o1 = optic1.asPrism
    const o2 = optic2.asPrism
    return prism(
      combinePreviews(o1.preview, o2.preview),
      (v, x) => o1.over(inner => o2.set(v, inner), x),
      x => o2.review(o1.review(x)))
  } else if ('asOptional' in optic1 && 'asOptional' in optic2) {
    const o1 = optic1.asOptional
    const o2 = optic2.asOptional
    return optional(
      combinePreviews(o1.preview, o2.preview),
      (v, x) => o1.over(inner => o2.set(v, inner), x))
  } else if ('asGetter' in optic1 && 'asGetter' in optic2) {
    const o1 = optic1.asGetter
    const o2 = optic2.asGetter
    return getter(x => o2.get(o1.get(x)))
  } else if ('asPartialGetter' in optic1 && 'asPartialGetter' in optic2) {
    const o1 = optic1.asPartialGetter
    const o2 = optic2.asPartialGetter
    return partialGetter(combinePreviews(o1.preview, o2.preview))
  } else if ('asSetter' in optic1 && 'asSetter' in optic2) {
    const o1 = optic1.asSetter
    const o2 = optic2.asSetter
    return setter((f, x) => o2.over(inner => o1.over(f, inner), x))
  } else if ('asReviewer' in optic1 && 'asReviewer' in optic2) {
    const o1 = optic1.asReviewer
    const o2 = optic2.asReviewer
    return reviewer(x => o2.review(o1.review(x)))
  }
}

/**
 * Optics composition!
 *
 * @param  {...any} fns - Comma-separated list of optics to be composed
 */
export const composeOptics = (...optics) => optics.reduce(ocompose2)

/**
 * Optics composition!
 *
 * @param  {...any} fns - Comma-separated list of optics to be composed
 */
export const path = composeOptics

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
