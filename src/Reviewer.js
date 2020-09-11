import { curry } from './functions'

class ReviewerT {
  constructor(review) {
    this.review = review
  }

  // itself
  get asReviewer() {
    return this
  }
}

// reviewer : (a → s) → Prism s a
export const reviewer = curry((review) => new ReviewerT(review))
