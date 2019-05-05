/**
 * Created by xushichao on 2019-01-10.
 */
import {createSelector} from 'reselect';

import MyFlowerConfig from '../common/MyFlowerConfig';
import {formatCash} from '../components/utils';

const getGardenDetail = state => state.gardenDetail;
const getCurrUserInfo = (state, props) => ({currUserId: props.currUserId, isHistoryGarden: props.isHistoryGarden});

export const getUserGardenDetail = createSelector(
  [getGardenDetail, getCurrUserInfo],
  (gardenDetail, {currUserId, isHistoryGarden}) => {
    let {
      masterUserId,
      masterGardenMode,
      masterGardenInfo,
      friendGardenMode,
      friendsGardenPool,
      reviveNum,
      speederNum,
      isSwitchingScene,
      showReplantBox,
      showSuccessActive,
      cashCardNum
    } = gardenDetail,
      isMasterGarden = currUserId === masterUserId,
      gardenMode = isMasterGarden ? masterGardenMode : friendGardenMode,
      gardenInfo = (isMasterGarden ? masterGardenInfo : friendsGardenPool[currUserId]) || {},
      {theme} = MyFlowerConfig[gardenMode];

    if(isHistoryGarden) { // 历史花园展示固定的花园信息
      gardenInfo = {flowerInfo: theme.flower.vip, wateringInfo: {}};
    }

    let {flowerInfo, wateringInfo, gifts, beeCode, channelCode, drawInfo, propInfo, consumeEnd, consumeStart} = gardenInfo;
    return {
      isMasterGarden,
      masterUserId,
      gardenMode,
      theme,
      flowerInfo,
      wateringInfo,
      gifts,
      beeCode,
      channelCode,
      isHistoryGarden,
      reviveNum,
      speederNum,
      cashCardNum,
      isSwitchingScene,
      showSuccessActive,
      showReplantBox,
      drawInfo,
      propInfo,
      consumeEnd,
      consumeStart
    };
  }
);

export const getUserScoreInfo = createSelector(
  [getGardenDetail],
  (gardenDetail) => {
    const {totalCash, additionalCash, isWithdrawStatus} = gardenDetail
    return {
      totalCash: formatCash(totalCash),
      additionalCash: formatCash(additionalCash),
      isWithdrawStatus,
    }
  }
);
