/**
 * 用户积分actions
 * Created by xushichao on 2019-01-08.
 */
import ReduxUtil from '../common/ReduxUtil';

export const CHANGE_TOTAL_SCORE = 'CHANGE_TOTAL_SCORE';
export const SET_TOTAL_SCORE = 'SET_TOTAL_SCORE';

// 积分获得或消费变化
export const changeTotalScore = ReduxUtil.createSimpleAction(CHANGE_TOTAL_SCORE, 'additionalScore');

// 直接设置当前总积分
export const setTotalScore = ReduxUtil.createSimpleAction(SET_TOTAL_SCORE, 'totalScore');
