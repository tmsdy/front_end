/**
 * 用户积分reducer
 * Created by xushichao on 2019-01-08.
 */
import Immutable from 'seamless-immutable';

import ReduxUtil from '../common/ReduxUtil';
import * as Actions from '../actions/TotalScoreActions';

const initialState = Immutable({
  totalScore: 0, // 用户总积分
  additionalScore: 0, // 最新一次的变化积分值
});

export default ReduxUtil.createReducer(initialState, {
  [Actions.CHANGE_TOTAL_SCORE]: (state, {additionalScore}) => {
    let validScore = parseInt(additionalScore) || 0;
    return state.merge({totalScore: state.totalScore + validScore, additionalScore: validScore});
  },

  [Actions.SET_TOTAL_SCORE]: (state, {totalScore}) => {
    let validTotalScore = parseInt(totalScore) || 0;
    return state.merge({totalScore: validTotalScore, additionalScore: validTotalScore - state.totalScore});
  },
});
