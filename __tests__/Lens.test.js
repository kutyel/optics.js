import { ocompose, view, set, over} from '../src/operations'
import { prop, assoc } from '../src/functions'
import { lens, lensProp, lensIndex } from '../src/Lens'

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

  test.skip('lenses should compose', () => {
    const friendsL = lensProp('friends')
    const idx0 = lensIndex(0)
    const firstFriendL = ocompose(friendsL, idx0)

    expect(view(firstFriendL, userWithFriends)).toBe('Alejandro')
  })
})
