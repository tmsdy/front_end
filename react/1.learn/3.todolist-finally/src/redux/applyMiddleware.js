import compose from './compose';
export default (...middlewares) => (createStore) => (reducer) => {
    let store = createStore(reducer)
    let dispatch
    let middlewareAPI = {
        getState: store.getState,
        dispatch: action => dispatch(action)
        //直接使用dispatch会产生闭包,导致所有中间件都共享同一个dispatch,如果有中间件修改了dispatch或者进行异步dispatch就可能出错
    }

    middlewares = middlewares.map(middleware => middleware(middlewareAPI))
    dispatch = compose(...middlewares)(store.dispatch)

    return { ...store, dispatch }
}