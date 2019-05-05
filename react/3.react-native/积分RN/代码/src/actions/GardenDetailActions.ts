/**
 * 花园页面actions
 * Created by xushichao on 2018-12-28.
 */
import ReduxUtil from '../common/ReduxUtil';
import {GARDEN_ENUM, STORAGE_ENUM} from '../constants/IntegralEnum';
import {getStorage, setStorage} from '../common/util';

export const SWITCH_MASTER_GARDEN_MODE = 'SWITCH_MASTER_GARDEN_MODE';
export const SWITCH_TO_MASTER_GARDEN_MODE = 'SWITCH_TO_MASTER_GARDEN_MODE';
export const SWITCH_TO_FRIEND_GARDEN_MODE = 'SWITCH_TO_FRIEND_GARDEN_MODE';
export const UPDATE_MASTER_USER_ID = 'UPDATE_MASTER_USER_ID';
export const UPDATE_MASTER_GARDEN_INFO = 'UPDATE_MASTER_GARDEN_INFO';
export const UPDATE_FRIEND_GARDEN_INFO = 'UPDATE_FRIEND_GARDEN_INFO';
export const CONCAT_FRIENDS_LIST = 'CONCAT_FRIENDS_LIST';
export const CLEAR_FRIENDS_LIST = 'CLEAR_FRIENDS_LIST';
export const UPDATE_FRIEND_INFO = 'UPDATE_FRIEND_INFO';
export const HISTORY_FLOWER_INFO = 'HISTORY_FLOWER_INFO';
export const SWITCH_HISTORY_GARDEN_MODE = 'SWITCH_HISTORY_GARDEN_MODE';
export const REQUEST_SWITCH_SCENE = 'REQUEST_SWITCH_SCENE';
export const FINISH_SWITCH_SCENE = 'FINISH_SWITCH_SCENE';
export const SWTICH_WITHDRAW_STATUS = 'SWTICH_WITHDRAW_STATUS';
export const UPDATE_REVIVE_NUM = 'UPDATE_REVIVE_NUM';
export const UPDATE_SPEEDER_NUM = 'UPDATE_SPEEDER_NUM';
export const UPDATE_COLLECT_NUM = 'UPDATE_COLLECT_NUM';
export const CONCAT_DIARY_LIST = 'CONCAT_DIARY_LIST';
export const CLEAR_DIARY_LIST = 'CLEAR_DIARY_LIST';
export const CHANGE_TOTAL_CASH = 'CHANGE_TOTAL_CASH';
export const SET_TOTAL_CASH = 'SET_TOTAL_CASH';
export const SELECT_ILLUSTRATION = 'SELECT_ILLUSTRATION'
export const SWITCH_SUCCESS_ACTIVE = 'SWITCH_SUCCESS_ACTIVE'
export const SWITCH_ISSHOW_REPLANTBOX = 'SWITCH_ISSHOW_REPLANTBOX'
export const UPDATE_FLOWER_SEEDS = 'UPDATE_FLOWER_SEEDS'
export const UPDATE_CASH_CARD_NUM = 'UPDATE_CASH_CARD_NUM'

// 切换主态花园场景模式
export const switchMasterGardenMode = ReduxUtil.createSimpleAction(SWITCH_MASTER_GARDEN_MODE, 'masterGardenMode');

// 更新主态的花园详情信息
export const updateMasterGardenInfo = ReduxUtil.createSimpleAction(UPDATE_MASTER_GARDEN_INFO, 'gardenInfo');

// 更新好友的花园详情信息
export const updateFriendGardenInfo = ReduxUtil.createSimpleAction(UPDATE_FRIEND_GARDEN_INFO, 'userId', 'gardenInfo');

// 追加好友列表
export const concatFriendsList = ReduxUtil.createSimpleAction(CONCAT_FRIENDS_LIST, 'friendsList');

// 追加好友列表
export const clearFriendsList = ReduxUtil.createSimpleAction(CLEAR_FRIENDS_LIST);

// 更新好友信息
export const updateFriendInfo = ReduxUtil.createSimpleAction(UPDATE_FRIEND_INFO, 'userId', 'info');

// 历史种花信息
export const historyInfo = ReduxUtil.createSimpleAction(HISTORY_FLOWER_INFO, 'historyList');

// 请求切换场景
export const requestSwitchScene = ReduxUtil.createSimpleAction(REQUEST_SWITCH_SCENE);

// 请求切换场景
export const finishSwitchScene = ReduxUtil.createSimpleAction(FINISH_SWITCH_SCENE);

// 切换提现状态
export const switchWithdrawStatus = ReduxUtil.createSimpleAction(SWTICH_WITHDRAW_STATUS, 'isWithdrawStatus')

// 更新复活化肥的数量
export const updateReviveNum = ReduxUtil.createSimpleAction(UPDATE_REVIVE_NUM, 'reviveNum')

// 更新加速液的数量
export const updateSpeederNum = ReduxUtil.createSimpleAction(UPDATE_SPEEDER_NUM, 'speederNum')

// 更新提现卡的数量
export const updateCashCardNum = ReduxUtil.createSimpleAction(UPDATE_CASH_CARD_NUM, 'cashCardNum')

// 更新金钱花碎片进度
export const updateCollectNum = ReduxUtil.createSimpleAction(UPDATE_COLLECT_NUM, 'collectNum')

// 追加日记列表
export const concatDiaryList = ReduxUtil.createSimpleAction(CONCAT_DIARY_LIST, 'diaryList');

// 清除日记列表
export const clearDiaryList = ReduxUtil.createSimpleAction(CLEAR_DIARY_LIST);

// 用户金币更新
export const changeTotalCash = ReduxUtil.createSimpleAction(CHANGE_TOTAL_CASH, 'additionalCash');

// 设置用户金币值
export const setTotalCash = ReduxUtil.createSimpleAction(SET_TOTAL_CASH, 'totalCash');

// 设置当前选中的图鉴
export const setIllustration = ReduxUtil.createSimpleAction(SELECT_ILLUSTRATION, 'illustration')

// 切换花儿种成功动效是否展示
export const switchSuccessActive = ReduxUtil.createSimpleAction(SWITCH_SUCCESS_ACTIVE, 'showSuccessActive')

// 切换花儿种成之后的重新种植按钮
export const switchShowReplantBox = ReduxUtil.createSimpleAction(SWITCH_ISSHOW_REPLANTBOX, 'showReplantBox')

// 更新可选种子
export const updateFlowerSeeds = ReduxUtil.createSimpleAction(UPDATE_FLOWER_SEEDS, 'seeds')

// 更新主态userid
export const updateMasterUserId = (userId) => {
  return (dispatch) => {
    return getStorage(STORAGE_ENUM.GARDEN_MODE).then((info = {}) => {
      dispatch({type: UPDATE_MASTER_USER_ID, userId});
      if(info && info[userId]) {
        dispatch(switchMasterGardenMode(info[userId]));
      }
      return Promise.resolve();
    });
  };
};

// 重置当前用户的花园
export const resetMasterGarden = () => {
  return (dispatch, getState) => {
    let {isMasterMode, isHistoryGardenMode, masterGardenMode} = getState().gardenDetail;
    if(isHistoryGardenMode) {
      dispatch({type: SWITCH_HISTORY_GARDEN_MODE});
      dispatch(switchMasterGardenMode(masterGardenMode === GARDEN_ENUM.MODE.Cash ? GARDEN_ENUM.MODE.Primary : GARDEN_ENUM.MODE.Cash));
    }
    if(!isMasterMode) {
      dispatch({type: SWITCH_TO_MASTER_GARDEN_MODE});
    }
    return Promise.resolve();
  };
};

// 根据userId更新花园信息
export const updateGardenInfo = (userId, gardenInfo) => {
  return (dispatch, getState) => {
    let {masterUserId} = getState().gardenDetail;
    if(masterUserId === userId) { // 主态更新
      dispatch(updateMasterGardenInfo(gardenInfo));
    } else { // 好友更新
      dispatch(updateFriendGardenInfo(userId, gardenInfo));
    }
    return Promise.resolve();
  };
};

// 修改当前展示历史花还是正在种植的花
export const switchHistoryGardenMode = (channelCode) => {
  return (dispatch) => {
    // 先请求切换场景, 以便播放云动效
    dispatch(requestSwitchScene());
    // 在云动效执行一半时切换历史模式和花园
    setTimeout(() => {
      dispatch({type: SWITCH_HISTORY_GARDEN_MODE});
      dispatch(finishSwitchScene());
      dispatch(switchMasterGardenMode(GARDEN_ENUM.CHANNELCODE_MODE[channelCode]))
    }, 1000);
  };
};

// 异步切换主态花园场景模式
export const switchMasterGardenModeAsync = (masterGardenMode) => {
  return (dispatch, getState) => {
    let {masterUserId} = getState().gardenDetail;
    getStorage(STORAGE_ENUM.GARDEN_MODE).then((info = {}) => {
      info[masterUserId] = masterGardenMode; // eslint-disable-line
      setStorage(STORAGE_ENUM.GARDEN_MODE, info);
    });
    // 先请求切换场景, 以便播放云动效
    dispatch(requestSwitchScene());
    // 在云动效执行一半时切换历史模式和花园
    return new Promise((resolve) => {
      setTimeout(() => {
        dispatch({type: SWITCH_MASTER_GARDEN_MODE, masterGardenMode});
        dispatch(finishSwitchScene());
        resolve();
      }, 1000);
    });
  };
};

// 切换到主态花园场景
export const switchToMasterGardenMode = () => {
  return (dispatch) => {
    // 先请求切换场景, 以便播放云动效
    dispatch(requestSwitchScene());
    // 在云动效执行一半时切换历史模式和花园
    setTimeout(() => {
      dispatch({type: SWITCH_TO_MASTER_GARDEN_MODE});
      dispatch(finishSwitchScene());
    }, 1000);
  };
};

// 切换当前花园展示为好友模式
export const switchToFriendGardenMode = (friendUserId, friendGardenMode) => {
  return (dispatch) => {
    // 先请求切换场景, 以便播放云动效
    dispatch(requestSwitchScene());
    // 在云动效执行一半时切换历史模式和花园
    setTimeout(() => {
      dispatch({type: SWITCH_TO_FRIEND_GARDEN_MODE, friendUserId, friendGardenMode});
      dispatch(finishSwitchScene());
    }, 1000);
  };
};
