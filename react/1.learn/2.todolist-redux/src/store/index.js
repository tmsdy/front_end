// import { createStore } from 'redux'
import createStore from '../redux/createStore'

import reducer from './reducer'

// const store = createStore(
//     reducer,
//     window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
// )

const store = createStore(reducer)


export default store