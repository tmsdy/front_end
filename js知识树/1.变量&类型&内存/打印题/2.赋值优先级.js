var a = { n: 1 }
var b = a
a.x = a = { n: 2 } // 赋值是从右到左，但是.的优先级比=要高

console.log(a.x)
console.log(b.x)

/*
1.a b都指向{ n: 1 }
2.执行a.x -> a b指向 {n:1;x:undefined}
3.a = { n: 2 } -> a 指向 { n: 2 } b指向 {n:1;x:undefined}
4.a.x = a -> a.x从旧对象解析 {n:1;x:undefined}.x = a -> 旧对象：{n:1;x:{ n: 2 }}

最后：a 指向 { n: 2 } b指向 {n:1;x:{ n: 2 }}

*/