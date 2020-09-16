import { lens, prop, ix } from '../src/Lens'
import { get, set as assoc, toUpper } from '../src/functions'
import { optic, preview, view, set, over } from '../src/operations'

const friends = ['Alejandro']
const user = { id: 1, name: 'Flavio' }
const userWithFriends = { ...user, friends }

describe('Lens', () => {
  test('lens should build a lens', () => {
    const propName = get('name')
    const assocName = assoc('name')
    const lense = lens(propName, assocName)

    expect(view(lense, user)).toBe('Flavio')
    expect(preview(lense, user)).toBe('Flavio')
    expect(set(lense, 'Alejandro', user)).toEqual({ id: 1, name: 'Alejandro' })
  })

  test('prop should build a lens', () => {
    const nameL = prop('name')

    expect(view(nameL, user)).toBe('Flavio')
  })

  test('ix should build a lens', () => {
    const idx0 = ix(0)

    expect(view(idx0, friends)).toBe('Alejandro')
  })

  test('over should lift a function over a Lens', () => {
    const nameL = prop('name')

    expect(over(nameL, toUpper, user)).toEqual({ id: 1, name: 'FLAVIO' })
  })

  test('lenses should compose', () => {
    const firstFriendL = optic(prop('friends'), ix(0))

    expect(view(firstFriendL, userWithFriends)).toBe('Alejandro')
    expect(preview(firstFriendL, userWithFriends)).toBe('Alejandro')
  })
})
