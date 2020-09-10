import { curry, prop, assoc } from './functions'

// lens : (s → a) → ((a, s) → s) → Lens s a
export const lens = curry((get, set) => ({ get, set }))

// lensProp : String → Lens s a
export const lensProp = (key) => lens(prop(key), assoc(key))

// lensIndex : Number → Lens s a
export const lensIndex = (index) => lens(prop(index), assoc(index))
