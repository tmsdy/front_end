export default (reducer) => {
    let state = undefined
    let listeners = []

    function getState() {
        return state
    }

    function dispatch(action) {
        state = reducer(state, action)
        listeners.forEach(listener => listener(state))
    }

    dispatch({ type: '@@REACT_INIT' })

    function subscribe(listener) {
        listeners.push(listener)
        return () => {
            listeners.filter(l => l !== listener)
        }
    }

    return {
        getState,
        dispatch,
        subscribe
    }
}