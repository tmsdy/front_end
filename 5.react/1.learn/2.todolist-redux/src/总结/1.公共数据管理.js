/*

1.最简单的直接弄个store.js如下，引入进行读取操作
const state = {
    count: 0
}
不可取的点：1.容易误操作这个状态 2.可读性差，别人还得结合上下文猜测你是在干什么。

2.如何设计公共状态管理器？
我们希望公共状态既能够被全局访问到，又是私有的不能被直接修改，闭包是最好的选择

3.存取状态，有getter和setter，当状态发生改变时，我们得进行广播，通知组件状态发生了变更。
export const createStore = () => {
    let state = {}       // 公共状态
    function getState() {}      // getter
    function dispatch() {}      // setter
    function subscribe() {}     // 发布订阅
    return { getState, dispatch, subscribe }
}


*/