import { get, set as assoc, toUpper } from '../src/functions'
import { alter, ix, lens, prop } from '../src/Lens'
import { notFound } from '../src/notFound'
import { optic, over, preview, set, toArray, view } from '../src/operations'

const friends = ['Alejandro']
const user = { id: 1, name: 'Flavio' }
const userWithFriends = { ...user, friends }

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

  test('lenses should compose (using short-hand)', () => {
    const firstFriendL = optic('friends', 0)

    expect(view(firstFriendL, userWithFriends)).toBe('Alejandro')
    expect(preview(firstFriendL, userWithFriends)).toBe('Alejandro')
  })

  test('alter should build a lens', () => {
    const nameL = alter('name')
    expect(view(nameL, user)).toBe('Flavio')
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

  test('Lens.asOptional -> should convert to an Optional correctly', () => {
    const ageOptional = prop('age').asOptional
    expect(preview(ageOptional, user)).toBeUndefined()
  })

  test('should convert to an Optional correctly', () => {
    const nameOptional = prop('name').asOptional
    expect(preview(nameOptional, user)).toEqual('Flavio')
    expect(nameOptional.preview(user)).toEqual('Flavio')
  })

  test('should convert to an Traversal correctly', () => {
    const nameOptional = prop('name').asTraversal
    expect(toArray(nameOptional, user)).toEqual(['Flavio'])
    expect(nameOptional.toArray(user)).toEqual(['Flavio'])
  })

  test('should convert to a Getter correctly', () => {
    const nameOptional = prop('name').asGetter
    expect(view(nameOptional, user)).toEqual('Flavio')
    expect(nameOptional.get(user)).toEqual('Flavio')
  })

  test('should convert to a PartialGetter correctly', () => {
    const nameOptional = prop('name').asPartialGetter
    expect(preview(nameOptional, user)).toEqual('Flavio')
    expect(nameOptional.preview(user)).toEqual('Flavio')
    expect(toArray(nameOptional, user)).toEqual(['Flavio'])
    expect(nameOptional.toArray(user)).toEqual(['Flavio'])
  })

  test('should convert to a Fold correctly', () => {
    const nameOptional = prop('name').asFold
    expect(toArray(nameOptional, user)).toEqual(['Flavio'])
    expect(nameOptional.toArray(user)).toEqual(['Flavio'])
  })
})
