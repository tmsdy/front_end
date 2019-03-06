import { createStore, compose, applyMiddleware } from 'redux';
// import thunk from 'redux-thunk';
import reducer from './reducer';

// 提供redux的调试功能
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(reducer,composeEnhancers(

));

export default store;