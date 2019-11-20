var mod = require('./counter');

console.log(mod.counter);  // 3
mod.incCounter();
console.log(mod.counter); // 3

console.log(mod.obj) // { name: 'aaa' }
mod.changeObj()
console.log(mod.obj) // { name: 'feifei' }