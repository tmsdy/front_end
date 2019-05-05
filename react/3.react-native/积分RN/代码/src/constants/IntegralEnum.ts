/**
 * 积分枚举
 * Created by xushichao on 2018-12-28.
 */

import {isIOS, isLikeX} from '@iqiyi/rn-utils'

// 花儿页相关枚举
export const GARDEN_ENUM = {
  // 花园模式
  MODE: {
    Primary: 'primary', // 初代花
    Cash: 'cash', // 金钱花
    Talent: 'talent', // 有才花
  },

  // 礼物状态
  GIFT_STATUS: {
    locked: 0, // 未解锁
    unlocked: 1, // 已解锁
    received: 9, // 已领取
    expired: -1, // 已过期
  },

  // 花儿的渠道号
  CHANNEL_CODE: {
    Rose: 'rose', // 初代花
    Money: 'money', // 金钱花
    Genius: 'genius', // 有才花
  },

  CHANNELCODE_MODE: {
    rose: 'primary',
    money: 'cash',
    genius: 'talent'
  },

};

// 奇妙乐园顶部导航颜色状态
export const PARK_NAV_BAR_STYLES = {
  [GARDEN_ENUM.MODE.Primary]: {
    statusBar: 'dark-content',
    navBar: 'black'
  },
  [GARDEN_ENUM.MODE.Cash]: {
    statusBar: 'light-content',
    navBar: 'white'
  },
  [GARDEN_ENUM.MODE.Talent]: {
    statusBar: 'dark-content',
    navBar: 'black'
  },
}


// storage 存储名称相关枚举
export const STORAGE_ENUM = {
  // 用户花园模式
  GARDEN_MODE: 'gardenMode',
  // 用户日历内容
  DIARY_CONTENT: 'diaryContent',
  // 用户初次进入花儿页面展示集宝卡
  FIRST_SHOW_COLLECTION: 'firstTimeToShowCollection',
  // 用户初次展示日记封面，只展示一次
  HASSHOW_DIARY_COVER: 'hasShowDiaryCover',
  // 用户每次进入花儿主态页面气泡问候
  FIRST_GREETING_PER_DAY: 'firstGreetingPerDay',
  // 抽奖上线zhi'hou
  NEW_PLAY_GUIDE: 'newPlayGuide',
  // 选种子有才花上线new提醒
  TALENT_NEW_ICON: 'talentNewIcon',
  // 打卡赢积分 打卡失败
  PUNCH_FAIL: 'punchFail',
  // 打卡赢积分 展示开奖预告弹窗
  PUNCH_NOTICE: 'punchNotice',
  // 打卡赢积分 展示瓜分积分弹窗
  PUNCH_GET_SCORE: 'punchGetScore',
  // 金钱花首次浇水后新手引导
  CASH_NEW_GUIDE: 'cashNewGuide',
  // 问答列表首次提示用户去投稿
  QUESTION_LSIT_BUBBLE: 'goToSubmitQuestion',
};

// 顶部导航栏
export const NAV_BAR_ENUM = {
  HEIGHT: isIOS ? isLikeX() ? 95 : 65 : 51, // eslint-disable-line
}

// 抽奖
export const DRAW_ENUM = {
  // 适用场景
  SCOPE: [
    GARDEN_ENUM.MODE.Primary,
    GARDEN_ENUM.MODE.Talent,
  ],
  // 适用场景（渠道码）
  CHANNEL_CODE_SCOPE: [
    GARDEN_ENUM.CHANNEL_CODE.Rose,
    GARDEN_ENUM.CHANNEL_CODE.Genius,
  ],
  // 抽奖类型
  MODE: {
    Score: 'score',
    Vip: 'vip',
  },
  // 抽奖周期
  PERIOD: {
    Before: 'before',
    In: 'in',
    After: 'after',
  },
}
