# optics.js

![Last version](https://img.shields.io/github/tag/kutyel/optics.js.svg?style=flat-square)
[![Build Status](https://img.shields.io/github/workflow/status/kutyel/optics.js/Node.js%20CI/master.svg?style=flat-square)](https://github.com/kutyel/optics.js/actions?query=workflow%3A%22Node.js+CI%22)
[![Coverage Status](https://img.shields.io/coveralls/kutyel/optics.js.svg?style=flat-square)](https://coveralls.io/github/kutyel/optics.js)
[![Dependency status](https://img.shields.io/david/kutyel/optics.js.svg?style=flat-square)](https://david-dm.org/kutyel/optics.js)
[![Dev Dependencies Status](https://img.shields.io/david/dev/kutyel/optics.js.svg?style=flat-square)](https://david-dm.org/kutyel/optics.js#info=devDependencies)
[![NPM Status](https://img.shields.io/npm/dm/optics.js.svg?style=flat-square)](https://www.npmjs.org/package/optics.js)

> Lenses, Prisms and Traversals in JavaScript!

<p align="center">
  <br>
  <img src="./optics.png" alt="optics.js">
  <br>
</p>

Inspired by Haskell's [`optics`](https://hackage.haskell.org/package/optics) package

- [Meet it!](#meet-it)
- [Get it!](#get-it)
- [How it is made!](#how-it-is-made)
- [Use it!](#use-it)
  - [Amount of values](#amount-of-values)
  - [Builders](#builders)
  - [The whole hierarchy](#the-whole-hierarchy)

## Get it!

```bash
$ npm install optics.js --save
```

## How it is made!

If you want to know more about the implementation, you can check this talk by [myself](https://twitter.com/FlavioCorpa) at [Lambda World](https://cadiz.lambda.world/).

[![lw](https://img.youtube.com/vi/IoVaArsh6tM/0.jpg)](https://www.youtube.com/watch?v=IoVaArsh6tM)

## Meet it!

Optics provide a _language_ for data _access_ and _manipulation_ in a concise and compositional way. It excels when you want to code in an _immutable_ way.

There are very few moving parts in `optics.js`, the power comes from the ability to create long combinations or _paths_ by composing small primitive optics. Let's look at an example:

```js
import { optic, maybe, view, over } from 'optics.js'

const wholeMilk = optic('milk', maybe('whole'))
```

In most cases, the `optic` function will be your starting point. It takes any amount of arguments describing primitive optics, and fuses them together. In this case, we are creating an optic which accesses the `milk` key, and then accesses the `whole` key if available (notice that the name is wrapped with `maybe`).

Intuitively, optics simply point to one (or more) positions within your data. You can then _operate_ at that position in a particular piece of data. In the following example we obtain the value within the shopping list, and then increment it.

```js
const shoppingList = { pie: 3, milk: { whole: 6, skimmed: 3 } }

view(wholeMilk, shoppingList) // > 6
over(wholeMilk, (x) => x + 1, shoppingList)
// > { pie: 3, milk: { whole: 7, skimmed: 3 } }
```

As mentioned above, the result of `over` is a _fresh_ object, so immutability is guaranteed.

## Use it!

As discussed while meeting the library, `optics.js` is based around a few primitive optics, which are composed using the `optic` function. Different _kinds_ of optics support different _operations_; that is one of the key ideas. You can apply those operations in two ways, depending on your preferred coding style:

```js
operation(optic, ...other args, value)
optic.operation(...other args, value)
```

In any case, the optic always goes first, and the value to which the operation should be applied goes last.

### Amount of values

An optic can target zero, one, or an unrestricted amount of positions within your data. This allows us, for example, to provide an optic which targets every value within an array (unrestricted amount) or targets an optional value (zero or one). The operations are called differently depending on this fact:

- `view` targets exactly _one_ value, like a property in an object which we are guaranteed to have.
- `preview` targets _zero_ or _one_ values, which essentially amounts to an optional value, like an index in an array which may go out of bounds.
- `reduce` and `toArray` target an _unrestricted_ amount, like the aforementioned array or the values within an object.

It is always safe to treat an optic in a less restricted way. For example, if your optic targets exactly one value, you can also use `preview` or `toArray` over it.

In any of the three cases you may be able to _modify_ the values targeted by the optic. You can do so in two ways:

- `set` takes a single value, and _replaces_ every position pointed by the data with it.
- `over` takes a function which is applied at each position targeted by the optic.

Since we have three "levels of amounts" and two possibilities about setting (we are able or not), we get _six_ different kinds of optics, plus an additional one for setting without access. Those receive different names, as shown in the following table (names in parentheses are those used by other similar libraries.)

| **`set`?** | **Exactly 1** | **0 or 1**                      | **Unrestricted** | **No access**  |
| ---------- | ------------- | ------------------------------- | ---------------- | -------------- |
| **Yes**    | `Lens`        | `Optional` (`AffineTraversal`)  | `Traversal`      | `Setter`       |
|  **No**    | `Getter`      | `PartialGetter` (`AffineFold`)  | `Fold`           | does not exist |

### Builders

The previous six kinds of optics can only access or modify values. There is one additional capability an optic may have: being able to _create_ values. Take for example the `Optional` which accesses a certain key `k`, `maybe(k)`. If we give this optic a value, it can create a new object with that single key:

```js
import { optic, maybe, review } from 'optics.js'

review(optic(maybe('say'), 'hi!')  // > { say: 'hi!' }
```

This adds yet another axis to our previous table, depending on whether when accessing you are guaranteed to have a value or not.

| **Exactly 1** | **0 or 1** | **Unrestricted** | **No access** |
| ------------- | ---------- | ---------------- | ------------- |
| `Iso`         | `Prism`    | does not exist   | `Reviewer`    |

### The whole hierarchy

The different kinds of optics can be arranged into a hierarchy. Going up means weakening the restrictions, either by set of operations or by amount of elements.

> The image has been produced from the diagram in the [`optics`](https://hackage.haskell.org/package/optics) package.

## License

**optics.js** © [Flavio Corpa](https://twitter.com/FlavioCorpa), released under the [MIT](https://github.com/kutyel/optics.js/blob/master/LICENSE.md) License.<br>

Authored and maintained by [Flavio Corpa](https://twitter.com/FlavioCorpa) and [Alejandro Serrano](https://twitter.com/trupill) with help from [contributors](https://github.com/kutyel/optics.js/contributors).

> GitHub [Flavio Corpa](https://github.com/kutyel) · Twitter [@FlavioCorpa](https://twitter.com/FlavioCorpa) · GitHub [Alejandro Serrano](https://github.com/serras) · Twitter [@trupill](https://twitter.com/trupill)
