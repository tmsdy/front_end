export default function createStore(reducer, enhancer) {
    if (enhancer && typeof enhancer == 'function') {
        return enhancer(createStore)(reducer)
    }

    let currentState
    let listeners = []

    function getState() {
        return currentState
    }

    function dispatch(action) {
        currentState = reducer(currentState, action)
        //然后通过所有的监听函数执行
        listeners.forEach(listener => listener());
    }

    dispatch({ type: '@@redux/INIT' })

    function subscribe(listener) {
        listeners.push(listener)
        return function () {
            listeners = listeners.filter(item => item !== listener)
        }
    }
    return {
        getState, dispatch, subscribe
    }
}