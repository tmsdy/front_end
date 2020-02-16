/**
 * 这个接口描述的是一个包含有fn并且值的类型
 */

// 1.不能随便的把一个函数赋值给事件
function fn( x: Event){ //这x的类型只能是Event事件对象不能是别的
    console.log('xxx')
}

document.onclick = fn ;

// 2.我们也可以使用 interface 来约定定义函数的结构
interface IFn { //定义一个函数的结构，而不是包含一个函数的结构
    (x:number,y:number):number
}

// 3.定义了一个接受一个MouseEvent类型参数的函数结构
interface MouseEventCallBack {
    (e: MouseEvent): any
}
let fnA:MouseEventCallBack= function(opts:MouseEvent){

}
document.onclick = fnA

// 4.定义一个规定的callback函数
interface ResponseCallBack{ //比一般函数签名好处是方便复用
    (rs:Response): any
}

function todo(callback:ResponseCallBack){
    callback(new Response) ;
}
todo(function(x:Response){ //只能传Response类型

})

// 5.fetch请求resolve成功后返回Response对象
fetch('http://xxx').then((rs:Response) =>{
    rs.json() ;//Response对象的方法
})

// 6.ajax中的应用
interface AjaxData {
    code: number ,
    data: any
}
interface AjaxCallBack{
    (rs: AjaxData): any
}

function ajax(callback:AjaxCallBack){
    callback({
        code:1 ,
        data:[]
    })
}
ajax(function(x:AjaxData){
    x.code
    x.data
})
