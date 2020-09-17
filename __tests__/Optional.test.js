import { optic, maybe, preview, set, over } from '../src/operations'
import { get, set as assoc, toUpper } from '../src/functions'
import { optional, optionalProp, optionalIx } from '../src/Optional'

const friends = ['Alejandro']
const user = { id: 1, name: 'Flavio' }
const userWithFriends = { ...user, friends }

describe('Optional', () => {
  test('optional should build a optional', () => {
    const propName = get('name')
    const assocName = assoc('name')
    const lense = optional(propName, assocName)

    expect(preview(lense, user)).toBe('Flavio')
    expect(set(lense, 'Alejandro', user)).toEqual({ id: 1, name: 'Alejandro' })
  })

  test('optionalProp should build a lens', () => {
    const nameL = optionalProp('name')

    expect(preview(nameL, user)).toBe('Flavio')
  })

  test('optionalIndex should build a lens', () => {
    const idx0 = optionalIx(0)

    expect(preview(idx0, friends)).toBe('Alejandro')
  })

  test('over should lift a function over a Lens', () => {
    const nameL = optionalProp('name')

    expect(over(nameL, toUpper, user)).toEqual({ id: 1, name: 'FLAVIO' })
  })

  test('optionals should compose', () => {
    const firstFriendL = optic(optionalProp('friends'), optionalIx(0))

    expect(preview(firstFriendL, userWithFriends)).toBe('Alejandro')
  })

  test('optionals should be created by optic', () => {
    const firstFriendL = optic(maybe('friends'), maybe(0))

    expect(preview(firstFriendL, userWithFriends)).toBe('Alejandro')
  })
})
