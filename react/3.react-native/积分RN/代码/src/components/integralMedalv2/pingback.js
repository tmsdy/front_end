/**
 * Created by liuzhimeng.
 * @date 2018/11/12
 * @description 积分勋章v2 pingback
 */
import {
  sendPagePingback,
  sendBlockPingback,
  sendClickPingback,
} from '../../common/pingback'

export const GUEST_RPAGE = 'medalRN_guest'

// 客态页
export const GUEST_MY_MEDAL_BLOCK = 150100
export const GUEST_LIST_BLOCK = 150200

export const GUEST_MY_MEDAL_CLICK = 'mymedalbtn'
export const GUEST_MEDAL_LIST_CLICK = 'mymedallist'

export const sendGuestPagePingback = () => sendPagePingback(GUEST_RPAGE)
export const sendGuestBlockPingback = (block, options) => sendBlockPingback(GUEST_RPAGE, block, options)
export const sendGuestClickPingback = (block, rseat, options) => sendClickPingback(GUEST_RPAGE, block, rseat, options)

// 主态页
export const RPAGE = 'medalRN'

export const TOP_MEDAL_GROUP_BLOCK = 150300 // 顶部佩戴坑
export const DETAIL_MODAL_BLOCK = 150400 // 勋章详情弹窗
export const MEDAL_LIST_BLOCK = 150500 // 勋章墙
export const WEAR_MEDAL_BLOCK = 150600 // 勋章佩戴编辑态
export const GET_MEDAL_MODAL_BLOCK = 150700 // 勋章动效弹窗
export const SHOPPING_RECOMMEND_MEDAL_MODAL_BLOCK = 150800 // 购物勋章推荐弹窗
export const SHOPPING_MASTER_MEDAL_HOT_BLOCK = 150900 // 大家都在抢标签
// 勋章详情页
export const SHOPPING_MASTER_MEDAL_DETAIL_BLOCK = 150901 // 购物达人勋章详情页

export const RULE_MODAL_CLICK = 'rulebtn' // 规则按钮
export const UNLOCK_CLICK = 'unlockedpitbtn' // 已解锁坑点击
export const LOCK_CLICK = 'lockedpitbtn' // 未解锁坑点击
export const GO_DANMU_HOME_CLICK = 'danmu_qwzy' // 去弹幕主页
export const GO_SHOPPING_CLICK = 'shopping_btn' // 去商场薅羊毛按钮
// 勋章详情页
export const SHOPPING_MASTER_MEDAL_DETAIL_CLICK = 'medalRN_gouwudetail' // 1 2 3
export const GO_SHOPPING_MALL_CLICK = 'gouwudetail_btn' // 详情页前往积分商城按钮
export const sendMainPagePingback = options => sendPagePingback(RPAGE, options)
export const sendMainBlockPingback = (block, options) => sendBlockPingback(RPAGE, block, options)
export const sendMainClickPingback = (block, rseat, options) => sendClickPingback(RPAGE, block, rseat, options)

const OLD_PINGBACK_NAME_MAP = {
  danmu_fasong10: 'fasong1_dm',
  danmu_fasong50: 'fasong2_dm',
  danmu_fasong200: 'fasong3_dm',

  danmu_jubao2: 'jubao1_dm',
  danmu_jubao5: 'jubao2_dm',
  danmu_jubao20: 'jubao3_dm',

  danmu_dianzan10: 'dianzan1_dm',
  danmu_dianzan30: 'dianzan2_dm',
  danmu_dianzan120: 'dianzan3_dm',

  pinglun_huifu70: 'huifu1_pl',
  pinglun_huifu1800: 'huifu2_pl',
  pinglun_huifu3600: 'huifu3_pl',

  pinglun_dianzan350: 'dianzan1_pl',
  pinglun_dianzan9000: 'dianzan2_pl',
  pinglun_dianzan18000: 'dianzan3_pl',
}

const PINGBACK_BLOCK_MAP = {
  list: '', // 勋章墙
  detail: 'xq', // 详情弹窗
  wear: 'pd', // 佩戴
  unwear: 'xz', // 卸载
  getNew: 'dx', // 获得动效弹窗
}

export const getMedalPingbackById = (id, block) => {
  const blockId = PINGBACK_BLOCK_MAP[block]
  if(id && OLD_PINGBACK_NAME_MAP[id]) {
    return `${blockId}${OLD_PINGBACK_NAME_MAP[id]}`
  }
  return `${blockId}${id}`
}
