import { get, set as assoc, toUpper } from '../src/functions'
import { alter, duo, ix, lens, mustBePresent } from '../src/Lens'
import { notFound } from '../src/notFound'
import { matches, optic, over, preview, sequence, set, toArray, view } from '../src/operations'

const friends = ['Alejandro', 'Pepe']
const user = { id: 1, name: 'Flavio' }
const userWithFriends = { ...user, friends }
const userMap = new Map([['Flavio', { id: user.id }]])

describe('Lens', () => {
  test('lens should build a lens', () => {
    const propName = get('name')
    const assocName = assoc('name')
    const lense = lens(propName, assocName)
    const alex = { id: 1, name: 'Alejandro' }

    expect(view(lense, user)).toBe('Flavio')
    expect(lense.get(user)).toBe('Flavio')
    expect(preview(lense, user)).toBe('Flavio')
    expect(set(lense, 'Alejandro', user)).toEqual(alex)
    expect(matches(lense, user)).toBe(true)
  })

  test('mustBePresent should build a lens', () => {
    const nameL = mustBePresent('name')
    expect(view(nameL, user)).toBe('Flavio')
  })

  test('mustBePresent should lift a function over a Lens', () => {
    const nameL = mustBePresent('name')
    expect(over(nameL, toUpper, user)).toEqual({ id: 1, name: 'FLAVIO' })
  })

  test('ix should build a lens', () => {
    const idx0 = ix(0)
    expect(view(idx0, friends)).toBe('Alejandro')
  })

  test('lenses should compose', () => {
    const firstFriendL = optic(mustBePresent('friends'), ix(0))
    expect(view(firstFriendL, userWithFriends)).toBe('Alejandro')
    expect(preview(firstFriendL, userWithFriends)).toBe('Alejandro')
  })

  test('alter should build a lens', () => {
    const nameL = alter('name')
    expect(view(nameL, user)).toBe('Flavio')
  })

  test('alter over notFound works', () => {
    const nameL = alter('name')
    expect(view(nameL, notFound)).toBe(notFound)
  })

  test('over should lift a function over an alter lens', () => {
    const nameL = alter('name')
    expect(over(nameL, toUpper, user)).toEqual({ id: 1, name: 'FLAVIO' })
  })

  test('set over alter should create a property', () => {
    const nameL = alter('flip')
    expect(set(nameL, 'flop', user)).toEqual({ ...user, flip: 'flop' })
  })

  test('alter should return not found', () => {
    const nameL = optic(alter('flip'), alter('mix'))
    expect(view(nameL, {})).toEqual(notFound)
  })

  test('set over alter at two level', () => {
    const nameL = optic(alter('flip'), alter('mix'))
    expect(set(nameL, 'flop', {})).toEqual({ flip: { mix: 'flop' } })
  })

  test('set over alter at two level', () => {
    const nameL = optic('flip', 'mix')
    expect(set(nameL, 'flop', {})).toEqual({ flip: { mix: 'flop' } })
  })

  test('set over alter at two level', () => {
    const nameL = optic('flip', 'mix')
    expect(set(nameL, 'flop', { flip: 'A' })).toEqual({ flip: { mix: 'flop' } })
  })

  test('set over alter at two level', () => {
    const nameL = optic('flip', 'mix')
    expect(set(nameL, notFound, { flip: 'A' })).toEqual({ flip: 'A' })
  })

  test('over over alter at two level', () => {
    const nameL = optic(alter('flip'), alter('mix'))
    expect(over(nameL, () => 1, {})).toEqual({ flip: { mix: 1 } })
  })

  test('set over alter removes', () => {
    const nameL = alter('name')
    expect(set(nameL, notFound, user)).toStrictEqual({ id: 1 })
  })

  test('lenses should compose (using short-hand)', () => {
    const firstFriendL = optic('friends', 0)
    expect(view(firstFriendL, userWithFriends)).toBe('Alejandro')
    expect(preview(firstFriendL, userWithFriends)).toBe('Alejandro')
  })

  test('mustBePresent as Optional returns undefined if not found', () => {
    const ageOptional = mustBePresent('age').asOptional
    expect(preview(ageOptional, user)).toBeUndefined()
    expect(ageOptional.preview(user)).toBeUndefined()
  })

  test('alter as Optional returns notFound if not found', () => {
    const ageOptional = alter('age').asOptional
    expect(preview(ageOptional, user)).toEqual(notFound)
    expect(ageOptional.preview(user)).toEqual(notFound)
  })

  test('mustBePresent as Optional if found', () => {
    const nameOptional = mustBePresent('name').asOptional
    expect(preview(nameOptional, user)).toEqual('Flavio')
    expect(nameOptional.preview(user)).toEqual('Flavio')
  })

  test('alter as Optional if found', () => {
    const nameOptional = alter('name').asOptional
    expect(preview(nameOptional, user)).toEqual('Flavio')
    expect(nameOptional.preview(user)).toEqual('Flavio')
  })

  test('should convert to an Traversal correctly', () => {
    const nameOptional = mustBePresent('name').asTraversal
    expect(toArray(nameOptional, user)).toEqual(['Flavio'])
    expect(nameOptional.toArray(user)).toEqual(['Flavio'])
  })

  test('should convert to a Getter correctly', () => {
    const nameOptional = mustBePresent('name').asGetter
    expect(view(nameOptional, user)).toEqual('Flavio')
    expect(nameOptional.get(user)).toEqual('Flavio')
  })

  test('should convert to a PartialGetter correctly', () => {
    const nameOptional = mustBePresent('name').asPartialGetter
    expect(preview(nameOptional, user)).toEqual('Flavio')
    expect(nameOptional.preview(user)).toEqual('Flavio')
    expect(toArray(nameOptional, user)).toEqual(['Flavio'])
    expect(nameOptional.toArray(user)).toEqual(['Flavio'])
  })

  test('should convert to a Fold correctly', () => {
    const nameOptional = mustBePresent('name').asFold
    expect(toArray(nameOptional, user)).toEqual(['Flavio'])
    expect(nameOptional.toArray(user)).toEqual(['Flavio'])
  })

  test('should sequence lenses correctly', () => {
    expect(toArray(sequence('id', 'name'), user)).toEqual([1, 'Flavio'])
  })

  test('useState-like lens works', () => {
    let x = 1
    const duoLens = duo([x, v => (x = v)])
    expect(view(duoLens, {})).toBe(1)
    expect(set(duoLens, 2, {})).toStrictEqual({})
    expect(x).toBe(2)
  })

  test('should work with Map', () => {
    const getByName = get('Flavio')
    const setByName = assoc('Flavio')
    const lense = lens(getByName, setByName)
    const alexMap = new Map([['Alejandro', { id: 1 }]])

    expect(view(lense, userMap)).toStrictEqual({ id: 1 })
    expect(set(lense, 'Alejandro', userMap)).toEqual(alexMap)
    // Check that the the map is not mutated
    expect(userMap).not.toEqual(alexMap)
  })
})
