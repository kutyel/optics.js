import { curry } from './functions'

class Setter {
  constructor(over) {
    this.over = over
  }

  // derived operations
  set = (val, x) => this.over((_) => val, x)

  // itself
  get asSetter() {
    return this
  }
}

// setter : ((a → a, s) → s) → Setter s a
export const setter = curry((over) => new Setter(over))
