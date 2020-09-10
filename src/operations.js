import { curry } from './functions'
import { setter } from './Setter'
import { getter } from './Getter'
import { lens } from './Lens'


// iso, prism, /lens,
// review, /affinetraversal, /getter,
// affinefold, traversal, fold, /setter
const ocompose2 = (optic1, optic2) => {
  // start from most specific (iso) to less specific (getter, setter, review)
  if ('asLens' in optic1 && 'asLens' in optic2) {
    const o1 = optic1.asLens
    const o2 = optic2.asLens
    return lens(x => o2.get(o1.get(x)),
                (v, x) => o1.over(inner => o2.set(v, inner), x))
  } else if ('asAffineTraversal' in optic1 && 'asAffineTraversal' in optic2) {
    const o1 = optic1.asAffineTraversal
    const o2 = optic2.asAffineTraversal
    return affineTraversal(
      x => {
        const v = o1.preview(x)
        if (v === null) {
          return null
        } else {
          return o2.preview(v)
        }
      },
      (v, x) => o1.over(inner => o2.set(v, inner), x))
  } else if ('asGetter' in optic1 && 'asGetter' in optic2) {
    const o1 = optic1.asGetter
    const o2 = optic2.asGetter
    return getter(x => o2.get(o1.get(x)))
  } else if ('asSetter' in optic1 && 'asSetter' in optic2) {
    const o1 = optic1.asSetter
    const o2 = optic2.asSetter
    return setter((f, x) => o2.over(inner => o1.over(f, inner), x))
  }
}

/**
 * Optics composition!
 *
 * @param  {...any} fns - Comma-separated list of optics to be composed
 */
export const ocompose = (...optics) => optics.reduce(ocompose2)

// preview : AffineFold s a → s → Maybe a
export const preview = curry((optic, obj) => optic.asAffineFold.get(obj))

// view : Getter s a → s → a
export const view = curry((optic, obj) => optic.asGetter.get(obj))

// set : Setter s a → a → s → s
export const set = curry((optic, val, obj) => optic.asSetter.set(val, obj))

// over : Setter s a → (a → a) → s → s
export const over = curry((optic, f, obj) => optic.asSetter.over(f, obj))
