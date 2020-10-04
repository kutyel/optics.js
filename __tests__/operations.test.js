import { OpticComposeError, UnavailableOpticOperationError } from '../src/errors'
import { curry, toUpper } from '../src/functions'
import { getter } from '../src/Getter'
import { alter } from '../src/Lens'
import { collect, compose, optic, over, path, set, view } from '../src/operations'
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

const themeWithoutFontFamily = {
  styles: {
    CodeSurfer: {
      code: {
        color: 'red',
      },
    },
  },
}

describe('Operations over Optics', () => {
  test('compose -> should compose N functions correctly', () => {
    const inc = x => x + 1
    const cubed = (num, exp) => num ** exp
    const exp = curry(cubed)

    expect(compose(inc, exp(5))(1)).toBe(inc(exp(5, 1)))
  })

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

  test('set should create new keys', () => {
    const font = '"Dank Mono", "Fira Code", Consolas, "Roboto Mono", monospace'
    const newTheme = set(fontLense, font)(themeWithoutFontFamily)

    expect(themeWithoutFontFamily.styles.CodeSurfer.code.fontFamily).toBeUndefined()
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

  test('set should create new keys', () => {
    const hardLense = optic('styles', 'CodeSurfer', 'code', 'fontFamily')
    const font = '"Dank Mono", "Fira Code", Consolas, "Roboto Mono", monospace'
    const newTheme = set(hardLense, font)(themeWithoutFontFamily)

    expect(themeWithoutFontFamily.styles.CodeSurfer.code.fontFamily).toBeUndefined()
    expect(newTheme.styles.CodeSurfer.code.fontFamily).toBe(font)
  })

  test('incompatible optics', () => {
    expect(() =>
      optic(
        setter((f, x) => f(x)),
        getter(x => x),
      ),
    ).toThrow(OpticComposeError)
  })

  test('unavailable operations', () => {
    expect(() =>
      set(
        getter(x => x),
        1,
        1,
      ),
    ).toThrow(UnavailableOpticOperationError)
  })

  test('collect + transform', () => {
    const o = optic(collect({ a: optic('one'), b: optic('two') }), x => x.a + x.b)
    const obj = { one: 1, two: 2 }
    expect(view(o, obj)).toBe(3)
  })
})
