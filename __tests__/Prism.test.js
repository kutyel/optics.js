import { notFound } from '../src/notFound'
import { toUpper } from '../src/functions'
import { optic, preview, over } from '../src/operations'
import { has } from '../src/prism'

const user = { id: 1, name: 'Flavio' }

describe('Prism', () => {
  test('has returns itself if ok', () => {
    expect(preview(has({id : 1}), user)).toEqual(user)
  })

  test('has returns nothing if not found', () => {
    expect(preview(has({id : 2}), user)).toEqual(notFound)
  })

  test('has works correctly in composition', () => {
    expect(over(optic(has({id: 1}), 'name'), toUpper, user)).toEqual({ id: 1, name: 'FLAVIO' })
  })
})
