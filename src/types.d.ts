export interface NotFound<A> { }

export interface PartialGetterI<S, A> {
  preview: (obj: S) => A | NotFound<A>
}

export interface GetterI<S,A> {
  view: (obj: S) => A
}

export interface SetterI<S, A> {
  set:  (val: A, obj: S) => S
  over: (fn: (A) => A, obj: S) => S
}

export interface ReviewerI<S, A> {
  review: (val: A) => S
}

export type PartialGetter<S, A> = PartialGetterI<S, A>;
export type Getter<S, A>        = PartialGetterI<S, A> & GetterI<S, A>;

export type Setter<S, A>        = SetterI<S, A>;
export type Optional<S, A>      = SetterI<S, A> & PartialGetterI<S, A>;
export type Lens<S, A>          = SetterI<S, A> & PartialGetterI<S, A> & GetterI<S, A>;

export type Reviewer<S,A>       = ReviewerI<S, A>;
export type Prism<S, A>         = SetterI<S, A> & PartialGetterI<S, A> & ReviewerI<S, A>;

export type Optic<S, A>         = PartialGetter<S,A> | Getter<S,A>
                                | Setter<S,A> | Optional<S,A> | Lens<S,A>
                                | Reviewer<S,A> | Prism<S,A>

