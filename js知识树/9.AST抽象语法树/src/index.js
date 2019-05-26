
// import _ from 'lodash'
import {flatten,cloneDeep} from 'lodash'
/*
上面两种打包都把整个lodash打包下来是70.3kb，下面只引入flatten打包只有2.85kb(production,dev分别是482kb和131kb)
我们要写个插件，起到用import {flatten} from 'lodash'写法的也能做到tree shaking的效果
*/
// import flatten from 'lodash/flatten'
// import cloneDeep from 'lodash/cloneDeep'

let arr = [1,[2,3],[4,[5]]]

let resArr = flatten(arr)
console.log(resArr)