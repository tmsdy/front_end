/**
 * store creator
 * Created by xushichao on 2019-1-7.
 */
import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import Immutable from 'seamless-immutable';

import rootReducer from '../reducers/rootReducer';

// 中间件配置
let middleWares = [thunk];
let composeEnhancers = compose;

if(__DEV__) {
  const createLogger = require('redux-logger');
  const logger = createLogger({
    stateTransformer: (state) => {
      // 在打印state时把immutable对象转换成普通的JSON, 方便查看
      return Object.keys(state).reduce((plainState, key) => {
        return {...plainState, [key]: Immutable.isImmutable(state[key]) ? state[key].asMutable({deep: true}) : state[key]};
      }, {});
    },
  });
  middleWares.push(logger);

  // redux 开发工具配置
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
}

// 生成 enhancer
const enhancer = composeEnhancers(applyMiddleware(...middleWares));

export default function configureStore(initialState) {
    return createStore(rootReducer, initialState, enhancer);
}
