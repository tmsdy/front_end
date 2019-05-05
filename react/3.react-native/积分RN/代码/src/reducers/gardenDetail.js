/**
 * 花儿页状态数据reducer
 * Created by xushichao on 2018-12-28.
 */
import Immutable from 'seamless-immutable';

import {GARDEN_ENUM} from '../constants/IntegralEnum';
import ReduxUtil from '../common/ReduxUtil';
import * as Actions from '../actions/GardenDetailActions';

const initialState = Immutable({
  isMasterMode: true, // 是否为主态模式
  masterGardenMode: GARDEN_ENUM.MODE.Primary, // 主态花园场景模式
  friendGardenMode: GARDEN_ENUM.MODE.Primary, // 客态花园场景模式
  masterUserId: -1, // 主态用户id(默认为一个非法值, 页面获取合法之后更新之, 以避免页面在获取userId前的冗余渲染)
  friendUserId: 0, // 当前好友的用户id
  masterGardenInfo: {}, // 主态花园信息: {flowerInfo, wateringInfo, gifts, beeCode, channelCode, name, drawInfo, daysInfo}
  friendsGardenPool: {}, // 好友的花园信息: {userId: {flowerInfo, wateringInfo, gifts, beeCode}}
  friendsList: [], // 好友列表
  isHistoryGardenMode: false, // 当前是否为展示历史花园模式
  historyList: [], // 历史种花记录
  isSwitchingScene: false, // 场景是否正在切换
  isWithdrawStatus: false, // 用户是否提现
  reviveNum: 0, // 用户复活化肥的数量
  speederNum: 0, // 用户加速液的数量
  collectNum: 0, // 金钱花集宝卡进度
  cashCardNum: 0, // 提现卡数量
  diaryList: [], // 花儿日记列表
  seeds: [], // 可种植的种子列表
  totalCash: 0, // 花儿页面用户总金币值
  additionalCash: 0, // 花儿页面最新一次的变化金币值
  illustrationSelected: {},
  showSuccessActive: false,
  showReplantBox: false,
});

export default ReduxUtil.createReducer(initialState, {
  [Actions.SWITCH_MASTER_GARDEN_MODE]: (state, {masterGardenMode}) => {
    return state.merge({masterGardenMode});
  },

  [Actions.SWITCH_TO_MASTER_GARDEN_MODE]: (state) => {
    return state.merge({isMasterMode: true});
  },

  [Actions.SWITCH_TO_FRIEND_GARDEN_MODE]: (state, {friendUserId, friendGardenMode}) => {
    return state.merge({isMasterMode: false, friendUserId, friendGardenMode});
  },

  [Actions.UPDATE_MASTER_USER_ID]: (state, {userId}) => {
    return initialState.merge({masterUserId: userId}); // 主态用户id改变后, 整个redux结构需要重新初始化
  },

  [Actions.UPDATE_MASTER_GARDEN_INFO]: (state, {gardenInfo}) => {
    return state.merge({masterGardenInfo: gardenInfo}, {deep: true});
  },

  [Actions.UPDATE_FRIEND_GARDEN_INFO]: (state, {userId, gardenInfo}) => {
    return state.merge({friendsGardenPool: {[userId]: gardenInfo}}, {deep: true});
  },

  [Actions.CONCAT_FRIENDS_LIST]: (state, {friendsList}) => {
    let newFriendsList = [].concat(state.friendsList).concat(friendsList);
    return state.merge({friendsList: newFriendsList});
  },

  [Actions.UPDATE_FRIEND_INFO]: (state, {userId, info}) => {
    let friendIdx = state.friendsList.findIndex(item => item.userId === userId);
    if(friendIdx >= 0) {
      let friendInfo = state.friendsList[friendIdx].merge(info);
      return state.setIn(['friendsList', friendIdx], friendInfo);
    }
    return state;
  },

  [Actions.CLEAR_FRIENDS_LIST]: (state) => {
    return state.merge({friendsList: []});
  },

  [Actions.HISTORY_FLOWER_INFO]: (state, {historyList}) => {
    return state.merge({historyList});
  },

  [Actions.SWITCH_HISTORY_GARDEN_MODE]: (state) => {
    return state.merge({isHistoryGardenMode: !state.isHistoryGardenMode});
  },

  [Actions.REQUEST_SWITCH_SCENE]: (state) => {
    return state.merge({isSwitchingScene: true});
  },

  [Actions.FINISH_SWITCH_SCENE]: (state) => {
    return state.merge({isSwitchingScene: false});
  },

  [Actions.SWTICH_WITHDRAW_STATUS]: (state, {isWithdrawStatus}) => {
    return state.merge({isWithdrawStatus});
  },

  [Actions.UPDATE_REVIVE_NUM]: (state, {reviveNum}) => {
    return state.merge({reviveNum});
  },

  [Actions.UPDATE_SPEEDER_NUM]: (state, {speederNum}) => {
    return state.merge({speederNum});
  },

  [Actions.UPDATE_CASH_CARD_NUM]: (state, {cashCardNum}) => {
    return state.merge({cashCardNum});
  },

  [Actions.UPDATE_COLLECT_NUM]: (state, {collectNum}) => {
    return state.merge({collectNum});
  },

  [Actions.CONCAT_DIARY_LIST]: (state, {diaryList}) => {
    let newDiaryList = [].concat(state.diaryList).concat(diaryList)
    return state.merge({diaryList: newDiaryList});
  },

  [Actions.CLEAR_DIARY_LIST]: (state) => {
    return state.merge({diaryList: []});
  },

  [Actions.CHANGE_TOTAL_CASH]: (state, {additionalCash}) => {
    let validCash = parseInt(additionalCash) || 0;
    return state.merge({totalCash: state.totalCash + validCash, additionalCash: validCash});
  },

  [Actions.SET_TOTAL_CASH]: (state, {totalCash}) => {
    let validTotalCash = parseInt(totalCash) || 0;
    return state.merge({totalCash: validTotalCash, additionalCash: validTotalCash - state.totalCash});
  },

  [Actions.SET_TOTAL_CASH]: (state, {totalCash}) => {
    let validTotalCash = parseInt(totalCash) || 0;
    return state.merge({totalCash: validTotalCash, additionalCash: validTotalCash - state.totalCash});
  },

  [Actions.SELECT_ILLUSTRATION]: (state, {illustration}) => {
    return state.merge({illustrationSelected: illustration});
  },

  [Actions.SWITCH_SUCCESS_ACTIVE]: (state, {showSuccessActive}) => {
    return state.merge({showSuccessActive});
  },

  [Actions.SWITCH_ISSHOW_REPLANTBOX]: (state, {showReplantBox}) => {
    return state.merge({showReplantBox});
  },

  [Actions.UPDATE_FLOWER_SEEDS]: (state, {seeds}) => {
    return state.merge({seeds});
  },
});
