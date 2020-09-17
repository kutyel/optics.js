import * as O from '../index'

const shoppingList = { pie: 3, milk: { whole: 6, skimmed: 3 } }

const wholeMilk   // you have to annotate the optic kind
  = O.optic<O.Optional<typeof shoppingList, number>>('milk', O.maybe('whole'))
const wholeMilkO  // or use one of the specific overloads
  = O.optionalPath<typeof shoppingList, number>('milk', O.maybe('whole'))
// the following does not compile (as expected)
// const wrong = O.optic({ 'milk': 2 }, O.maybe('whole'))


O.preview(wholeMilk, shoppingList)
// the following does not compile (as expected)
// O.view(wholeMilk, shoppingList)
O.over(wholeMilk, (x) => x + 1, shoppingList)
