import { get, set as assoc, toUpper } from '../src/functions'
import { ix, lens, prop } from '../src/Lens'
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
