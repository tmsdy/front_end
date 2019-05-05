/**
 * 花儿页pingback
 */

import {GARDEN_ENUM} from '../constants/IntegralEnum';

const PrimaryPage = 'flower_page'
const CashPage = 'moneyRN'
const CashGuest = 'moneyRN_guest'
const TalentPage = 'genius_page'

export default {
  // 初代花
  [GARDEN_ENUM.MODE.Primary]: {
    page: PrimaryPage,
    waterGuest: {page: PrimaryPage, block: '', rseat: 'water_friend'},
    beeGuest: {page: PrimaryPage, block: '800612', rseat: 'bee_friend'},
    friendList: {
      inviteBtn: {page: PrimaryPage, block: '', rseat: 'invite_1'},
    },
    diaryButton: {page: PrimaryPage, block: '800607', rseat: 'diarybtn'}, // 日记按钮点击
    revive: {page: PrimaryPage, block: '800604', rseat: 'revivebtn', blockRseat: 'revivebtn_show'}, // 复活花儿
    replant: {page: PrimaryPage, block: '800604', rseat: 'restartbtn', blockRseat: 'restartbtn_show'}, // 重新种植
    getFertilizer: {page: PrimaryPage, block: '800604', rseat: 'fuhuofeineedbtn_click', blockRseat: 'fuhuofeineedbtn_show'}, // 获取复活肥
    rewardBubble: {page: PrimaryPage, block: '', rseat: 'gift_bubble'}, // 气泡 抽奖
  },

  // 金钱花
  [GARDEN_ENUM.MODE.Cash]: {
    page: CashPage,
    waterMaster: {page: CashPage, block: '801003', rseat: 'moneywater'},
    waterGuest: {page: CashGuest, block: '801003', rseat: 'moneywater_friend'},
    beeGuest: {page: CashGuest, block: '801003', rseat: 'moneybee_friend'},
    friendList: {
      inviteBtn: {page: CashPage, block: '801010', rseat: 'moneyinvite_1'},
    },
    diaryButton: {page: CashPage, block: '801011', rseat: 'moneydiarybtn'},
    revive: {page: CashPage, block: '801009', rseat: 'moneyrevivebtn_click', blockRseat: 'moneyrevivebtn_show'}, // 复活花儿
    replant: {page: CashPage, block: '801009', rseat: 'moneyrestartbtn_click', blockRseat: 'moneyrestartbtn_show'}, // 重新种植
    getFertilizer: {page: CashPage, block: '801009', rseat: 'fuhuofeineedbtn_click', blockRseat: 'fuhuofeineedbtn_show'}, // 获取复活肥
    rewardBubble: {page: CashPage, block: '801007', rseat: 'hongbao_click'}, // 气泡 红包
  },

  // 有才花
  [GARDEN_ENUM.MODE.Talent]: {
    page: TalentPage,
    waterGuest: {page: TalentPage, block: '801003', rseat: 'guniuswater_friend'},
    beeGuest: {page: TalentPage, block: '801003', rseat: 'guniuswater_friend'},
    friendList: {
      inviteBtn: {page: TalentPage, block: '801010', rseat: 'geniusinvite_1'},
    },
    diaryButton: {page: TalentPage, block: '801011', rseat: 'geniusdiarybtn'},
    revive: {page: TalentPage, block: '801009', rseat: 'geniusrevivebtn_click', blockRseat: 'geniusrevivebtn_show'}, // 复活花儿
    replant: {page: TalentPage, block: '801009', rseat: 'geniusrestartbtn_click', blockRseat: 'geniusrestartbtn_show'}, // 重新种植
    getFertilizer: {page: TalentPage, block: '801009', rseat: 'fuhuofeineedbtn_click', blockRseat: 'fuhuofeineedbtn_show'}, // 获取复活肥
    rewardBubble: {page: TalentPage, block: '', rseat: 'gift_bubble'}, // 气泡 抽奖
  },

};
