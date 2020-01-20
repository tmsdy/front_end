export default (reducer) => {
    let state
    let listeners = []

    function getState() { // 取state
        return state
    }

    function dispatch(action) {
        state = reducer(state, action) // 走reducer生成新的state
        listeners.forEach(listener => listener()) // 触发所有的订阅
    }

    dispatch({ type: '@@REDUX_INIT' }) // 用reducer的initstate初始化state

    function subscribe(listener) { // 收集订阅
        listeners.push(listener)
        return function () { // 返回取消订阅函数
            listeners.filter(item => item !== listener)
        }
    }

    return {
        getState,
        dispatch,
        subscribe
    }
}