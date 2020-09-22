import { has, maybe, optic, values } from './index'

const people = [
  { name: { first: 'Alejandro', last: 'Serrano' }, birthmonth: 'april', age: 32 },
  { name: { first: 'Flavio', last: 'Corpa' }, birthmonth: 'august', age: 30 },
  { name: { first: 'Laura' }, birthmonth: 'april', age: 27 },
]

let res1 = optic(values, 'name', 'first').toArray(people)
res1

let res2 = optic(values, 'name', maybe('last')).toArray(people)
res2

let res3 = optic(values, has({ birthmonth: 'april' }), 'age').toArray(people)
res3

let o = optic(values, has({ birthmonth: 'april' }), 'age')
let res4 = o.over((x) => x + 1, people)
res4
