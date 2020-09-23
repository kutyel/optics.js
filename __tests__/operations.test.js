import { OpticComposeError, UnavailableOpticOperationError } from '../src/errors'
import { toUpper } from '../src/functions'
import { getter } from '../src/Getter'
import { alter } from '../src/Lens'
import { optic, over, path, set, view } from '../src/operations'
import { setter } from '../src/Setter'

const theme = {
  styles: {
    CodeSurfer: {
      code: {
        fontFamily: 'monospaced',
      },
    },
  },
}
const fontLense = path(['styles', 'CodeSurfer', 'code', 'fontFamily'])

describe('Operations over Optics', () => {
  test('view should read from a lens', () => {
    const codeLens = path(['styles', 'CodeSurfer', 'code'])
    const codeSurferLens = path(['styles', 'CodeSurfer'])

    expect(view(fontLense, theme)).toBe('monospaced')
    expect(view(codeLens, theme)).toEqual(theme.styles.CodeSurfer.code)
    expect(view(codeSurferLens, theme)).toEqual(theme.styles.CodeSurfer)
  })

  test('set should write over a lens', () => {
    const font = '"Dank Mono", "Fira Code", Consolas, "Roboto Mono", monospace'
    const newTheme = set(fontLense, font)(theme)

    expect(theme.styles.CodeSurfer.code.fontFamily).toBe('monospaced')
    expect(newTheme.styles.CodeSurfer.code.fontFamily).toBe(font)
  })

  test('over should apply a function over a lens', () => {
    const newTheme = over(fontLense, toUpper, theme)

    expect(view(fontLense, newTheme)).toBe('MONOSPACED')
  })

  test('path should create the same lense as a manually defined one', () => {
    const hardLense = optic(
      alter('styles'),
      alter('CodeSurfer'),
      alter('code'),
      alter('fontFamily'),
    )

    expect(view(hardLense, theme)).toBe(view(fontLense, theme))
  })

  test('path short-hand should create the same lense as a manually defined one', () => {
    const hardLense = optic('styles', 'CodeSurfer', 'code', 'fontFamily')

    expect(view(hardLense, theme)).toBe(view(fontLense, theme))
  })

  test('path short-hand and setting creates values', () => {
    const hardLense = optic('styles', 'CodeSurfer', 'code', 'fontFamily')

    expect(set(hardLense, 'monospaced', {})).toStrictEqual(theme)
  })

  test('incompatible optics', () => {
    expect(() =>
      optic(
        setter((f, x) => f(x)),
        getter((x) => x),
      ),
    ).toThrow(OpticComposeError)
  })

  test('unavailable operations', () => {
    expect(() =>
      set(
        getter((x) => x),
        1,
        1,
      ),
    ).toThrow(UnavailableOpticOperationError)
  })
})
