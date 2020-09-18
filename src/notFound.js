/**
 * The special value for 'not found'
 */
export const notFound = Symbol('notFound')

export const isNotFound = (x) => x === notFound

export const notFoundToList = (v) => (isNotFound(v) ? [] : [v])
