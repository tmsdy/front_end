/*
缓冲区buffer(存16进制): 是暂时存放输入输出数据的一段内存，可以当作取池子水的桶。
定义buffer：创建buffer会自动转成16进制。

*/
// 1）通过长度定义：定义了就不能变
let buffer1 = Buffer.alloc(6) //效率低些，拿一个100大小的桶还得清零。一般用这个
let buffer2 = Buffer.allocUnsafe(10) //效率高，拿一个100大小的桶不做清零
console.log(buffer1) //<Buffer 00 00 00 00 00 00>
console.log(buffer2) //<Buffer 89 76 28 9b b9 20 00 00 60 70>

// 2）通过数组定义buffer
let buffer3 = Buffer.from([1, 2, 23, 24])
console.log(buffer3) //<Buffer 01 02 17 18>

// 3)字符串创建，字母对应ascii码，一个汉字3个buffer
let buffer4 = Buffer.from('hello飞飞')
console.log(buffer4) //<Buffer 68 65 6c 6c 6f e9 a3 9e e9 a3 9e>
console.log(buffer4.toString()) //hello飞飞





