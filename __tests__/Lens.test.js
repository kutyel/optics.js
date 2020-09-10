import { lens, lensProp, lensIndex } from '../src/Lens'
import { view, set, over, prop, assoc, compose, curry } from '../src/functions'

const friends = ['Alejandro']
const user = { id: 1, name: 'Flavio' }
const userWithFriends = { ...user, friends }

const toUpper = (str) => str.toUpperCase()

describe('Lens', () => {
  test('lens should build a lens', () => {
    const propName = prop('name')
    const assocName = assoc('name')
    const lense = lens(propName, assocName)

    expect(view(lense, user)).toBe('Flavio')
    expect(set(lense, 'Alejandro', user)).toEqual({ id: 1, name: 'Alejandro' })
  })

  test('lensProp should build a lens', () => {
    const nameL = lensProp('name')

    expect(view(nameL, user)).toBe('Flavio')
  })

  test('lensIndex should build a lens', () => {
    const idx0 = lensIndex(0)

    expect(view(idx0, friends)).toBe('Alejandro')
  })

  test('over should lift a function over a Lens', () => {
    const nameL = lensProp('name')

    expect(over(nameL, toUpper, user)).toEqual({ id: 1, name: 'FLAVIO' })
  })

  test('curry should curry functions', () => {
    // TODO: move this test to another folder
    const cubed = (num, exp) => num ** exp

    const curried = curry(cubed)
    expect(curried(5)(3)).toBe(125)
  })

  test.skip('TODO: lenses should compose', () => {
    const friendsL = lensProp('friends')
    const idx0 = lensIndex(0)
    const firstFriendL = compose(friendsL, idx0)

    expect(view(firstFriendL, userWithFriends)).toBe('Alejandro')
  })
})
