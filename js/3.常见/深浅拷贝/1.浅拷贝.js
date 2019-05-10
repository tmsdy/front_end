// 浅复制常用 对象大，深复制会带来性能上的问题
// 浅复制只会将对象的各个属性进行依次复制，并不会进行递归复制，而 JavaScript 存储对象都是存地址的
// 浅复制会导致 obj1.arr 和 obj2.arr 指向同一块内存地址
var obj1 = { a:1, arr: [2,3] };
var obj2 = {} ;

for(let i in obj1){
    obj2[i] = obj1[i] ;
}

obj1.a = 5 ;
obj1.arr[1] = 5 ;
console.log(obj2.a) ;// 1
console.log(obj2.arr[1]) ;// 5

// function shallowCopy(src) { //浅拷贝函数封装
//   var dst = {};
//   for (var prop in src) {
//     if (src.hasOwnProperty(prop)) {
//       dst[prop] = src[prop];
//     }
//   }
//   return dst;
// }