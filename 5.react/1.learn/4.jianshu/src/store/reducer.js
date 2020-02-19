import { combineReducers } from 'redux-immutable';
import { reducer as headerReducer } from '../common/header/store';

// 把每
const rootReducer = combineReducers({
  header: headerReducer
})

export default rootReducer
