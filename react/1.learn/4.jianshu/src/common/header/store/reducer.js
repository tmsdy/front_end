import {actionTypes} from './index'
import { fromJS } from 'immutable'

const defaultState = fromJS({ //把js对象转化为immutable对象(不可改变)
  focused: false
})

export default (state=defaultState,action) => {
  // state(immutable对象)的set会结合之前的值和设置的值返回一个全新的state(immutable对象)
  switch(action.type){
    case actionTypes.SEARCH_FOCUS: return state.set('focused',true) ;break;
    case actionTypes.SEARCH_BLUR: return state.set('focused',false) ;break;
    default: return state ;break;
  }

}