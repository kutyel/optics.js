import * as T from './types'

type ComposeArg = string | number | T.Optic<any,any>

export function composeOptics<O>(...optics: ComposeArg[]): O;
export function composeOptics<O>(optics: ComposeArg[]): O;

export function optic<O>(...optics: ComposeArg[]): O;
export function optic<O>(optics: ComposeArg[]): O;

export function path<O>(...optics: ComposeArg[]): O;
export function path<O>(optics: ComposeArg[]): O;

type LensPathArg = string | number | T.Lens<any,any>;
export function lensPath<S,A>(...optics: LensPathArg[]): T.Lens<S,A>;
export function lensPath<S,A>(optics: LensPathArg[]): T.Lens<S,A>;

type OptionalPathArg = string | number | T.Optional<any,any>;
export function optionalPath<S,A>(...optics: OptionalPathArg[]): T.Optional<S,A>;
export function optionalPath<S,A>(optics: OptionalPathArg[]): T.Optional<S,A>;

/*
type TraversalPathArg = string | number | T.Traversal<any,any>;
export function traversalPath<S,A>(...optics: TraversalPathArg[]): T.Traversal<S,A>;
export function traversalPath<S,A>(optics: TraversalPathArg[]): T.Traversal<S,A>;
*/

export function preview<S,A>(l: T.PartialGetter<S, A>, obj: S): A | T.NotFound<A>;
export function view<S,A>(l: T.Getter<S, A>, obj: S): A;
export function set<S,A>(l: T.Setter<S,A>, val: A, obj: S): S;
export function over<S,A>(l: T.Setter<S,A>, f: (x: A) => A, obj: S): S;
export function review<S,A>(l: T.Reviewer<S,A>, val: A): S;

export function maybe<S,K extends keyof S>(key: K): T.Optional<S,S[K]>
export function maybe<S,A>(optic: T.Lens<S,A>): T.Optional<S,A>
export function maybe<S,A>(key: string | number): T.Optional<S,A>
