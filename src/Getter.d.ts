import * as T from './types'

export function getter<S, A>(fn: (x: S) => A): T.Getter<S,A>;
