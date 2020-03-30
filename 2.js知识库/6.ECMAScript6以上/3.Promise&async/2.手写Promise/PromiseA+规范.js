/*

* 1.Promise状态
    1)pending状态：可以转换到fulfilled或rejected状态。
    2)fulfilled状态：不能转换成任何其它状态。必须有一个值，且这个值不能被改变。
    3)rejected状态：不能转换成任何其它状态。必须有一个原因，且这个值不能被改变。

* 2.then 方法
一个Promise必须提供一个then方法来获取其值或原因。
Promise的then方法接受两个参数：
promise.then(onFulfilled, onRejected)
    1)
    2)
    3)
    4)
    5)
    6)

* 3.new Promise 接收一个函数 executor，像下面那样：
(resolve，reject) => {
  * 执行异步操作等，resolve(value)将状态转为fulfilled，或者reject(err)将状态转为rejected
}

* 4. promise对象的then方法来注册成功状态或者失败状态要执行的函数
    p.then(resolveFunc,rejectFunc)
    p.then(resolveFunc,rejectFunc)
    p.then(resolveFunc,rejectFunc)

    实现是一个promise对象调用多次then方法

* 5. then函数的链式操作：p.then().then().then()
    实现：then函数执行后返回一个promise对象就行

6. thenable
    拥有 then 方法的对象或函数
    {
        then(){}
    }

    promise对象也拥有then方法

7. 当给resolve传入一个promise对象的时候，只有等到promise对象装成成功或者失败，resolve才会成功

8.resovle要接受的参数
    1. 简单值
    2. 接收thenable对象

9.then中成功或失败执行的函数的返回值
    1. 有简单类型返回值，作为then方法返回的promise对象的成功状态的值

    2. 当返回一个thenable对象的时候，只有是成功状态才能执行下一个then

*/