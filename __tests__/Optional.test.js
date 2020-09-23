import { OpticCreationError } from '../src/errors'
import { get, set as assoc, toUpper } from '../src/functions'
import { alter } from '../src/Lens'
import { notFound } from '../src/notFound'
import { optic, over, preview, set } from '../src/operations'
import { maybe, optional, optionalIx, optionalProp } from '../src/Optional'

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

  test('optionalProp should build an optional', () => {
    const nameL = optionalProp('name')
    expect(preview(nameL, user)).toBe('Flavio')
  })

  test('optionalIndex should build an optional', () => {
    const idx0 = optionalIx(0)
    expect(preview(idx0, friends)).toBe('Alejandro')
    expect(set(idx0, 'Alex', friends)).toStrictEqual(['Alex'])
  })

  test('over should lift a function over an optional', () => {
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

  test('optionals should be created by optic', () => {
    const firstFriendL = optic(maybe(alter('friends')), maybe(0))
    expect(preview(firstFriendL, userWithFriends)).toBe('Alejandro')
  })

  test('optionals with non-existing key should return notFound', () => {
    const serventesioL = optionalProp('serventesio')
    expect(preview(serventesioL, user)).toBe(notFound)
  })

  test('optionals with non-existing key should not change the value', () => {
    const serventesioL = optionalProp('serventesio')
    expect(over(serventesioL, toUpper, user)).toEqual(user)
  })

  test('optionals with one non-existing key should return notFound', () => {
    const firstFriendL = optic(optionalProp('friends'), optionalIx(1000))
    expect(preview(firstFriendL, userWithFriends)).toBe(notFound)
  })

  test('maybe should fail for wrong types', () => {
    expect(() => maybe([1, 2])).toThrow(OpticCreationError)
  })
})
