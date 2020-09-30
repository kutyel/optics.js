import { OpticComposeError, OpticCreationError } from '../src/errors'
import { get, set as assoc, toUpper } from '../src/functions'
import { alter } from '../src/Lens'
import { notFound } from '../src/notFound'
import { firstOf, matches, optic, over, preview, set, toArray } from '../src/operations'
import { maybe, never, optional, optionalIx, optionalProp } from '../src/Optional'

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
    expect(matches(nameL, user)).toBe(true)
  })

  test('optionalProp should works as a traversal', () => {
    const nameL = optionalProp('name')
    expect(toArray(nameL, user)).toStrictEqual(['Flavio'])
    expect(toArray(nameL.asTraversal, user)).toStrictEqual(['Flavio'])
  })

  test('optionalIndex should build an optional', () => {
    const idx0 = optionalIx(0)
    expect(preview(idx0, friends)).toBe('Alejandro')
    expect(matches(idx0, friends)).toBe(true)
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
    expect(set(serventesioL, 'Pi', user)).toStrictEqual(user)
    expect(serventesioL.set('Pi', user)).toStrictEqual(user)
    expect(preview(serventesioL, user)).toBe(notFound)
    expect(matches(serventesioL, user)).toBe(false)
  })

  test('optionals with non-existing as traversal should return []', () => {
    const serventesioL = optionalProp('serventesio')
    expect(toArray(serventesioL, user)).toStrictEqual([])
    expect(toArray(serventesioL.asTraversal, user)).toStrictEqual([])
    expect(matches(serventesioL.asTraversal, user)).toBe(false)
  })

  test('optionals with non-existing key should not change the value', () => {
    const serventesioL = optionalProp('serventesio')
    expect(over(serventesioL, toUpper, user)).toEqual(user)
  })

  test('optionals with one non-existing key should return notFound', () => {
    const firstFriendL = optic(optionalProp('friends'), optionalIx(1000))
    expect(set(firstFriendL, 'Pi', userWithFriends)).toStrictEqual(userWithFriends)
    expect(firstFriendL.set('Pi', userWithFriends)).toStrictEqual(userWithFriends)
    expect(preview(firstFriendL, userWithFriends)).toBe(notFound)
    expect(matches(firstFriendL, userWithFriends)).toBe(false)
  })

  test('maybe should fail for wrong types', () => {
    expect(() => maybe([1, 2])).toThrow(OpticCreationError)
  })

  test('never should always return notFound', () => {
    expect(matches(never, user)).toBe(false)
    expect(never.matches(user)).toBe(false)
    expect(matches(never, [1, 2])).toBe(false)

    expect(set(never, 'A', user)).toStrictEqual(user)
    expect(never.set('A', user)).toStrictEqual(user)
    expect(set(never, 'A', [1, 2])).toStrictEqual([1, 2])
    expect(never.set('A', [1, 2])).toStrictEqual([1, 2])
  })

  test('first of works for viewing', () => {
    expect(preview(firstOf('name', 'toli'), user)).toBe('Flavio')
    expect(preview(firstOf('toli', 'name'), user)).toBe('Flavio')
    expect(preview(firstOf('name', 'id'), user)).toBe('Flavio')
    expect(preview(firstOf('id', 'name'), user)).toBe(1)
    expect(preview(firstOf('toli', 'moli'), user)).toBe(notFound)
  })

  test('first of works for viewing as traversals', () => {
    const nameL = optionalProp('name').asTraversal
    const idL = optionalProp('id').asTraversal
    const toliL = optionalProp('toli').asTraversal
    const moliL = optionalProp('moli').asTraversal
    expect(toArray(firstOf(nameL, toliL), user)).toStrictEqual(['Flavio'])
    expect(toArray(firstOf(toliL, nameL), user)).toStrictEqual(['Flavio'])
    expect(toArray(firstOf(nameL, idL), user)).toStrictEqual(['Flavio'])
    expect(toArray(firstOf(idL, nameL), user)).toStrictEqual([1])
    expect(toArray(firstOf(toliL, moliL), user)).toStrictEqual([])
  })

  test('first of works for setting', () => {
    expect(over(firstOf('name', 'toli'), toUpper, user)).toStrictEqual({ id: 1, name: 'FLAVIO' })
    expect(over(firstOf('toli', 'name'), toUpper, user)).toStrictEqual({ id: 1, name: 'FLAVIO' })
    expect(over(firstOf('name', 'id'), toUpper, user)).toStrictEqual({ id: 1, name: 'FLAVIO' })
    expect(over(firstOf('id', 'name'), x => x + 1, user)).toStrictEqual({ id: 2, name: 'Flavio' })
    expect(over(firstOf('toli', 'moli'), toUpper, user)).toStrictEqual(user)
    expect(firstOf('toli', 'moli').set('chorizo', user)).toStrictEqual(user)
  })

  test('first of works for modifying as traversals', () => {
    const nameL = optionalProp('name').asTraversal
    const idL = optionalProp('id').asTraversal
    const toliL = optionalProp('toli').asTraversal
    const moliL = optionalProp('moli').asTraversal
    expect(over(firstOf(nameL, toliL), toUpper, user)).toStrictEqual({ id: 1, name: 'FLAVIO' })
    expect(over(firstOf(toliL, nameL), toUpper, user)).toStrictEqual({ id: 1, name: 'FLAVIO' })
    expect(over(firstOf(nameL, idL), toUpper, user)).toStrictEqual({ id: 1, name: 'FLAVIO' })
    expect(over(firstOf(idL, nameL), x => x + 1, user)).toStrictEqual({ id: 2, name: 'Flavio' })
    expect(over(firstOf(toliL, moliL), toUpper, user)).toStrictEqual(user)
  })

  test('first of works for viewing as everything', () => {
    const nameL = optionalProp('name')
    const toliL = optionalProp('toli')
    expect(toArray(firstOf(nameL.asTraversal, toliL.asTraversal), user)).toStrictEqual(['Flavio'])
    expect(toArray(firstOf(nameL.asPartialGetter, toliL.asPartialGetter), user)).toStrictEqual([
      'Flavio',
    ])
    expect(toArray(firstOf(nameL.asFold, toliL.asFold), user)).toStrictEqual(['Flavio'])
  })

  test('first of works for modifying as everything', () => {
    const nameL = optionalProp('name')
    const toliL = optionalProp('toli')
    expect(over(firstOf(nameL.asTraversal, toliL.asTraversal), toUpper, user)).toStrictEqual({
      id: 1,
      name: 'FLAVIO',
    })
    // cannot compose setters this way
    expect(() => over(firstOf(nameL.asSetter, toliL.asSetter), toUpper, user)).toThrow(
      OpticComposeError,
    )
  })
})
