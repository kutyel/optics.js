'use strict'

class lens {
  // Basic operations
  constructor(getter, setter) {
    this.get = getter
    this.set = setter
  }

  // Derived operations
  over = (f, o) => this.set(f(this.get(o)), o)

  // Composition with other optics
  then = (next) => {
    // lens + lens = lens
    if (next instanceof lens) {
      return new lens(
        (o) => next.get(this.get(o)),
        (newVal, o) => this.over((prev) => next.set(newVal, prev), o)
      )
    }
    // otherwise, bail out
    return undefined
  }

  // Point-style composition
  lens = (nextGetter, nextSetter) => this.next(new lens(nextGetter, nextSetter))
  lensFrom = (nextProp) => this.then(lensFrom(nextProp))

}

const lensFrom = (prop) => new lens(
  (o) => o[prop],
  (newVal, o) => {
    let newO = { ...o }
    newO[prop] = newVal
    return newO
  })

module.exports.lens = lens
module.exports.lensFrom = lensFrom
