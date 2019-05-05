/**
 * Created by liuzhimeng.
 * @date 2019-01-07
 * @description 花儿页面公用方法
 */

import {findNodeHandle} from 'react-native'
import {SHARE_PARAM} from '../common/MyFlowerConfig'
import {GET_ENV} from '../constants/configs'
import {shareSNS, isURL} from '../common/util'

/**
 * 花儿分享好友
 * @param {string} type // 值为 custom: 读取 customConfigs
 * @param {object} customConfigs 自定义配置
 */
export const shareToFriends = (type, customConfigs = {}) => { // 分享方法
  const shareParam = {
    sharerUid: global.USER_INFO.userId,
    shareName: global.USER_INFO.userName,
    shareAvatar: global.USER_INFO.userIcon,
  }

  const shareOptions = type === 'custom' ? customConfigs : SHARE_PARAM[type]

  const {smallPic, largePic, entityId, title, text} = shareOptions

  const queryParams = `?qipuid=${entityId}&extInfo=${encodeURIComponent(JSON.stringify(shareParam))}&channel=integral`
  const url = GET_ENV() === 'test'
    ? `http://h5-test.m.iqiyi.com/integralh5/rnshare/index${queryParams}`
    : `https://h5.m.iqiyi.com/integralh5/rnshare/index${queryParams}`

  const pic = isURL(smallPic) ? smallPic : `https://statics-web.iqiyi.com/patch_bundle/rn/IntegralRN/assets/${smallPic}.png`
  const mpImageUrl = isURL(largePic) ? largePic : `https://statics-web.iqiyi.com/patch_bundle/rn/IntegralRN/assets/${largePic}.png`

  shareSNS({
    title,
    text,
    pic,
    url,
    rpage: '',
    shareType: 5,
    mp_imageUrl: mpImageUrl,
    mp_path: `pages/rnShare/rnShare${queryParams}`,
  });
}

/**
 * 格式化金额 如：1 => 0; 12 => 0.1; 123 => 1.2; 3456 => 34.5
 * @param count 金额
 * @param digit 缩小倍数
 * @param ignore 忽略的尾数位数（目前会直接舍弃掉忽略的尾数，不会四舍五入）如：6789 => 67.8
 * @returns {number}
 */
export const formatCash = (count, digit = 2, ignore = 1) => {
  const _count = Number.isNaN(Number(count)) ? 0 : Number(count)
  const _ignore = Math.pow(10, ignore)
  const _fixNum = Math.floor(_count / _ignore)
  return _fixNum / Math.pow(10, digit - 1)
}

/**
 * 显示半屏弹窗内的气泡提示
 * @param {node} refModal 半屏弹窗ref实例
 * @param {node} targetTaskList 任务列表ref实例
 * @param {number} index 气泡出现的任务所在数组的index
 * @param {string} tip 气泡文案
 */
export const showModalTaskBubble = async ({refModal, targetTaskList, index, tip}) => {
  if(tip) {
    const _refTaskList = await targetTaskList.getInstance()
    const refItemIcon = await _refTaskList.getItemIconRefAsync(index)
    if(refItemIcon) {
      const refHalfScreen = await refModal.getInstance()
      const itemIconNode = await refItemIcon.getInstance()
      refHalfScreen.showTipBubble({
        target: findNodeHandle(itemIconNode),
        tip,
        tipColor: 'black',
        duration: 3000,
        opacityAnimConfig: {from: 0, to: 1, duration: 300, loop: true},
      })
    }
  }
}
