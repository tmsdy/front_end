
export default (reducer) => {
    let state = undefined // 保证reducer在init时候取的是initstate
    let listeners = []

    function getState() {
        return state
    }

    function dispatch(action) {
        state = reducer(state, action)
        listeners.forEach(listener => listener())
    }

    dispatch({ type: '@@REDUX_INIT' })

    function subscribe(listener) {
        listeners.push(listener)
        return function () {
            listeners.filter(item => item !== listener)
        }
    }

    return {
        getState,
        dispatch,
        subscribe
    }
}