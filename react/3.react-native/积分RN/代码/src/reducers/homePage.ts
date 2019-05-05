/**
 * 已完成未领取reducer
 */
import Immutable from 'seamless-immutable';

import ReduxUtil from '../common/ReduxUtil';
import * as Actions from '../actions/HomePageActions';

const initialState = Immutable({
  homePageTaskData: {
    taskList: [], // 任务列表
    deepList: [], // 深度任务
    allReceived: false,
    showDoubleCard: false,
    signData: {},
    expireTime: 0,
    completedList: []
  },
  homePageFlower: {
    channelCode: '', // 花儿类型
    status: -2, // 花儿生长状态 0=种子, 1=发芽, 2=成长中, 3=成熟了, 9=可以收获了, -1=死掉了
    waterToday: false, // <--- 今天是否浇过水
    hasLottery: false, // <--- 有没有没领取的礼物
    daysWhenLottery: 0 // <--- 下一次礼物天数
  }
});

export default ReduxUtil.createReducer(initialState, {
  [Actions.SET_HOME_PAGE_TASK]: (state, {homePageTaskData}) => {
    return state.merge(homePageTaskData);
  },

  [Actions.SET_HOME_PAGE_FLOWER]: (state, {homePageFlower}) => {
    return state.merge(homePageFlower);
  }
});
