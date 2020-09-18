import { get, set as assoc, toUpper } from '../src/functions'
import { prop } from '../src/Lens'
import { notFound } from '../src/notFound'
import { maybe, optic, over, preview, set } from '../src/operations'
import { optional, optionalIx, optionalProp } from '../src/Optional'

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

  test('optionals should be created by optic', () => {
    const firstFriendL = optic(maybe(prop('friends')), maybe(0))

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
    expect(maybe([1, 2])).toBe(undefined)
  })
})
