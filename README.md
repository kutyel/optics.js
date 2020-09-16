# optics.js

![Last version](https://img.shields.io/github/tag/kutyel/optics.js.svg?style=flat-square)
[![Build Status](https://img.shields.io/travis/com/kutyel/optics.js/master.svg?style=flat-square)](https://travis-ci.com/kutyel/optics.js)
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

## Install

```bash
$ npm install optics.js --save
```

## Usage

```js
import { optic, maybe, over } from 'optics.js'

const shoppingList = { pie: 3, milk: { whole: 6, skimmed: 3 } }

// just use the name of the properties to create a lens
over(optic('milk', 'whole'), (x) => x + 1, shoppingList)
  // > { pie: 3, milk: { whole: 7, skimmed: 3 } }

// if you are not sure, use 'maybe'
over(optic(maybe('milk'), maybe('whole')), (x) => x + 1, shoppingList)
  // > { pie: 3, milk: { whole: 7, skimmed: 3 } }
```

## License

**optics.js** © [Flavio Corpa](https://twitter.com/FlavioCorpa), released under the [MIT](https://github.com/kutyel/optics.js/blob/master/LICENSE.md) License.<br>

Authored and maintained by [Flavio Corpa](https://twitter.com/FlavioCorpa) and [Alejandro Serrano](https://twitter.com/trupill) with help from [contributors](https://github.com/kutyel/optics.js/contributors).

> GitHub [Flavio Corpa](https://github.com/kutyel) · Twitter [@FlavioCorpa](https://twitter.com/FlavioCorpa) · GitHub [Alejandro Serrano](https://github.com/serras) · Twitter [@trupill](https://twitter.com/trupill)
