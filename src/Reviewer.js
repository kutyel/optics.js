import { curry } from './functions'

class Reviewer {
  constructor(review) {
    this.review = review
  }

  // itself
  get asReviewer() {
    return this
  }
}

// reviewer : (a → s) → Prism s a
export const reviewer = curry(review => new Reviewer(review))
