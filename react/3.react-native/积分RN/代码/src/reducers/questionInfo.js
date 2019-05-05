/**
 * 脑洞打赏reducer
 */
import Immutable from 'seamless-immutable';

import ReduxUtil from '../common/ReduxUtil';
import * as Actions from '../actions/QuestionActions';

const initialState = Immutable({
  unreceiveScore: 0, // 用户问答剩余未领取积分数量
  selectImage: ''
});

export default ReduxUtil.createReducer(initialState, {
  [Actions.SET_UNRECEIVE_SCORE]: (state, {unreceiveScore}) => {
    return state.merge({unreceiveScore});
  },
  [Actions.USER_SELECT_PIC]: (state, {selectImage}) => {
    return state.merge({selectImage});
  },
});
