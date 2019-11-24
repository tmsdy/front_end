// js中：函数作为一等公民，可以作为函数的参数和返回值,是异步中callback能执行的原因

/* 
function isString(param){ //判断是不是String类型
  return Object.prototype.toString.call(param) =='[object String]'
}
console.log(isString('123'),isString({})) //true false

function isArray(param){ //判断是不是Array类型
  return Object.prototype.toString.call(param) =='[object Array]'
}
console.log(isArray([]),isArray({})) //true false
*/

// 写一个批量生产上述函数（函数作为返回值）
function isType(type){
  return function (param) {
    return Object.prototype.toString.call(param) ==`[object ${type}]`
  }
}
let isString = isType('String')
let isArray = isType('Array')
console.log(isString('123'),isString({})) //true false
console.log(isArray([]),isArray({})) //true false
