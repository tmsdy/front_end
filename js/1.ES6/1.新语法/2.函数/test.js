this.a = 2
let arrowFunc = () => {
    console.log(this.a)
}
let obj = {
    a: 'aaa'
}
arrowFunc.bind(obj)() // 2

/*
因为箭头函数也是函数，所有可以用bind、call、apply
但是箭头函数没有this，所以即便用了bind这些也改变不了this
相当于变成了
obj = {
    fn: () => {
        console.log(this.a) //这个this和没有bind处理时候指向的this还是一样的，都是外层的this
    }
}
*/