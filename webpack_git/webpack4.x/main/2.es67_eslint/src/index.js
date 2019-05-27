
let str = require('./a')
let a= 1 ;

console.log(str)

let fn = ()=>{
  console.log('fn')
}
fn()

@log
class Parent{
  constructor(name){
    this.name = name
  }
}
let p = new Parent('feifei')
console.log(p.name)

function log(target){
  console.log(target)
}

async function aaa() {
  await setTimeout(() => {
    console.log('await')
  }, 1000);
}
aaa()

console.log('aaa'.includes('a'))

console.log(qw)

let md5 = require('../utils/md5')
console.log(md5('123'))