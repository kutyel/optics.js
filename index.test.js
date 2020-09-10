const { lens, lensFrom } = require('./index')

const o1 = { thing: 3, thang: 'a' }
const o2 = { pie: o1, milk: 6 }

// functional lens
const lf1 = new lens((o) => o.thing,
                     (newVal, o) => { return { ...o, thing: newVal } })
const lf2 = new lens((o) => o.pie,
                     (newVal, o) => { return { ...o, pie: newVal } })

test('get using function', () => {
  expect(lf1.get(o1)).toBe(3)
})
test('set using function', () => {
  expect(lf1.set(4, o1)).toStrictEqual({ thing: 4, thang: 'a' })
})
test('over using function', () => {
  expect(lf1.over(x => x + 1, o1)).toStrictEqual({ thing: 4, thang: 'a' })
})

test('get using property name', () => {
  expect(lensFrom('thing').get(o1)).toBe(3)
})
test('set using property name', () => {
  expect(lensFrom('thing').set(4, o1)).toStrictEqual({ thing: 4, thang: 'a' })
})
test('over using property name', () => {
  expect(lensFrom('thing').over(x => x + 1, o1)).toStrictEqual({ thing: 4, thang: 'a' })
})

test('over using composition', () => {
  expect(lf2.then(lf1).over(x => x + 1, o2))
    .toStrictEqual({ pie: { thing: 4, thang: 'a' }, milk: 6 })
})
test('over using point-style composition', () => {
  expect(lf2.lensFrom('thing').over(x => x + 1, o2))
    .toStrictEqual({ pie: { thing: 4, thang: 'a' }, milk: 6 })
})
