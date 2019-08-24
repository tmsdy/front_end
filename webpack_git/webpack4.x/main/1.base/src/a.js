import { isEmpty, lowerFirst, cloneDeep } from 'lodash-es'

let sum = (a, b) => {
  console.log('sum')
  console.log(isEmpty(111), lowerFirst('111'), cloneDeep({}))
  return a + b + 'sum'
}
let minus = (a, b) => {
  console.log('minus')
  return a - b + 'minus'
}

export {
  sum, minus
}