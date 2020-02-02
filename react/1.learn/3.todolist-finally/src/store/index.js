// import { createStore } from 'redux'
import { applyMiddleware, createStore } from '../redux'
import reducer from '../reducer'

const logger1 = (store) => (next) => (action) => {
    console.log('进入logger1')
    next(action)
    console.log('离开logger1')
}

const logger2 = (store) => (next) => (action) => {
    console.log('进入logger2')
    next(action)
    console.log('离开logger2')
}

const logger3 = (store) => (next) => (action) => {
    console.log('进入logger3')
    next(action)
    console.log('离开logger3')
}

const store = createStore(
    reducer,
    // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
    applyMiddleware(logger1, logger2, logger3)
)


export default store