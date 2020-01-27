// import { createStore } from 'redux'
import { applyMiddleware, createStore } from '../redux'
import reducer from '../reducer'

let logger1 = function (store) {
    return function (next) {
        return function (action) {
            console.log('老状态1 ', store.getState())
            next(action) // 相当于释放拦截行为
            console.log('新状态1 ', store.getState())
        }
    }
}

let logger2 = function (store) {
    return function (next) {
        return function (action) {
            console.log('进入logger2')
            next(action) // 相当于释放拦截行为
            console.log('离开logger2')
        }
    }
}

const store = createStore(
    reducer,
    // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
    applyMiddleware(logger1)
)


export default store