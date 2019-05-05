import {isIOS} from '@iqiyi/rn-utils'
import {isCompleted} from '../components/TaskItem'
import {completeTask, getReward, getVipRewards} from '../api'
import {getAES, goToLogin, iosOpenRnPage, filterExts} from './util'
import {showToast} from './QYNativeBridge'
import {IOS_GAME_CENTER_URL, IQI_HOME_URL, QIXIU} from '../constants/configs'
import {taskClickPingback} from '../components/home/Pingback';
import {sendClickPingback} from './pingback';
import {shareToFriends} from '../components/utils'

const VIP_TASK_MAP = {
  vip_sixcharge: '8a2186bb5f7bedd4',
  vip_wechatmp: '843376c6b3e2bf00',
  vip_autocharge: 'acf8adbb5870eb29',
  vip_memberclub: 'b6e688905d4e7184',
}

/**
 * 处理task任务跳转
 * case 1 : url = qx / url = gameios  指定的特殊跳转处理
 * case 2 : url = platform ,取扩展信息 url_ios 和 ios_android 分别跳转
 * case 3 : openweb 跳转普通url
 */
export const handleTaskItemClick = (task, isLogin, openWeb, uniqueID, {rpage = '', popCallBack = () => null} = {}) => {
  const {exts, channelCode} = task
  if(channelCode === 'Sign') {
    // 签到属于特殊任务
    return false
  }
  const {url} = task
  if(!isLogin && !isCompleted(task)) {
    goToLogin()
    return
  }

  taskClickPingback(channelCode, task, rpage);

  let clickEvent = _filterValue(exts, 'clickEvent')
  if(clickEvent) {
    // 产品数据配置大小写很混乱
    clickEvent = clickEvent.toLocaleLowerCase()
    // 点击pingback
    if(clickEvent === 'vipclub') {
      completeTask({
        channelCode: task.channelCode,
      })
        .then()
        .catch(err => showToast(err.message))
    } else if(clickEvent === 'pop') {
      // 弹二维码任务比较特殊，不需要跳转 所以直接return
      return popCallBack()
    }
  }
  // 通过url 去跳转
  if(url) {
    const urlString = url.toLocaleLowerCase()
    if(urlString === 'qx') {
      // 奇秀
      const qxurl = {
        ...QIXIU,
        biz_params: {
          ...QIXIU.biz_params,
          biz_params: `authcookie=${global.USER_INFO.authCookie}`,
        },
      }
      iosOpenRnPage(uniqueID, qxurl)
    } else if(urlString === 'platform') {
      let platformUrl = ''
      if(isIOS) {
        platformUrl = _filterValue(exts, 'url_ios')
      } else {
        platformUrl = _filterValue(exts, 'url_android')
      }
      if(!platformUrl) {
        platformUrl = IQI_HOME_URL
      }
      openWeb(platformUrl)
    } else if(urlString === 'gameios') {
      // 游戏中心跳转处理
      iosOpenRnPage(uniqueID, IOS_GAME_CENTER_URL)
    } else if(channelCode === 'downqbb' && _filterValue(exts, 'trans_uid') === 1) {
      // 加密动画屋url特殊处理  后台配置数据混乱，有时候是 1 有时候是 ‘1’
      const uid = {uid: `${getAES(global.USER_INFO.userId, '3e3acd08bb05bb1d', 'bb05bb1d3e3acd08')}`}
      const URL = `${url}&iqyiInfo=${encodeURIComponent(JSON.stringify(uid))}`
      openWeb(URL)
    } else {
      openWeb(url)
    }
  } else {
    // @产品龚腾特殊需求，如果没有配置url 跳转首页
    openWeb(IQI_HOME_URL)
  }
}
// 筛选key value
const _filterValue = (arr, keyName) => {
  const data = arr.filter(item => item.name && item.name === keyName)[0]
  return data ? data.value : null
}

/**
 * 处理task任务跳转（异步纯净版）
 * case 1 : url = qx / url = gameios  指定的特殊跳转处理
 * case 2 : url = platform ,取扩展信息 url_ios 和 ios_android 分别跳转
 * case 3 : openweb 跳转普通url
 * todo: getReward 方法接入
 */
export const handleTaskItemClickAsync = (task, configs = {}) => {
  const {openWeb, type = 'score', rpage = 'homeRN', block = '200400'} = configs

  return new Promise((resolve) => {
    let resource = {
      type: ''
    }

    const {exts, channelCode} = task
    const extMaps = filterExts(exts)

    if(channelCode === 'Sign') {
      // 签到属于特殊任务
      resource.type = 'sign'
      return resolve(resource)
    }

    const {url} = task
    if(!parseInt(global.USER_INFO.userId) && !isCompleted(task)) {
      goToLogin()
      resource.type = 'login'
      return resolve(resource)
    }

    sendClickPingback(rpage, block, `rseat_${channelCode}`)

    if(extMaps.clickEvent) {
      // 产品数据配置大小写很混乱
      const clickEvent = extMaps.clickEvent.toLocaleLowerCase()
      // 点击pingback
      if(clickEvent === 'vipclub') {
        completeTask({channelCode: task.channelCode})
          .then((res) => {
            resource.type = 'vipclub'
            resource.data = res
            resolve(resource)
          })
          .catch((err) => {
            showToast(err.message)
          })
      }

      // 花儿分享好友操作
      if(clickEvent === 'share' && type === 'flower' && extMaps.flowerShareEntityId) {
        const {
          flowerShareEntityId: entityId = '',
          flowerShareTitle: title = '',
          flowerShareText: text = '',
          flowerShareSmallPic: smallPic = '',
          flowerShareLargePic: largePic = '',
        } = extMaps

        shareToFriends('custom', {smallPic, largePic, entityId, title, text})
        resource.type = 'share'
        return resolve(resource)
      }
    }

    // 通过url 去跳转
    if(url) {
      const urlString = url.toLocaleLowerCase()
      if(urlString === 'qx') {
        // 奇秀
        const qxurl = {
          ...QIXIU,
          biz_params: {
            ...QIXIU.biz_params,
            biz_params: `authcookie=${global.USER_INFO.authCookie}`,
          },
        }
        iosOpenRnPage(global.uniqueID, qxurl)
        resource.type = 'qixiu'
        return resolve(resource)
      } else if(urlString === 'platform') {
        let platformUrl = ''
        if(isIOS) {
          platformUrl = filterExts(exts, 'url_ios')
        } else {
          platformUrl = filterExts(exts, 'url_android')
        }
        if(!platformUrl) {
          platformUrl = IQI_HOME_URL
        }
        openWeb(platformUrl)
        resource.type = 'platform'
        return resolve(resource)
      } else if(urlString === 'gameios') {
        // 游戏中心跳转处理
        iosOpenRnPage(global.uniqueID, IOS_GAME_CENTER_URL)
        resource.type = 'gameios'
        return resolve(resource)
      } else if(channelCode === 'downqbb' && filterExts(exts, 'trans_uid') === 1) {
        // 加密动画屋url特殊处理  后台配置数据混乱，有时候是 1 有时候是 ‘1’
        const uid = {uid: `${getAES(global.USER_INFO.userId, '3e3acd08bb05bb1d', 'bb05bb1d3e3acd08')}`}
        const URL = `${url}&iqyiInfo=${encodeURIComponent(JSON.stringify(uid))}`
        openWeb(URL)
        resource.type = 'downqbb'
        return resolve(resource)
      } else {
        openWeb(url)
        resource.type = 'url'
        return resolve(resource)
      }
    } else {
      // @产品龚腾特殊需求，如果没有配置url 跳转首页
      openWeb(IQI_HOME_URL)
      resource.type = 'home'
      return resolve(resource)
    }
  })
}

/**
 * 领取任务奖励
 */
interface GetTaskReward {
  type: 'default' | 'vip';
  data: any;
}
export const getTaskRewardAsync = (task: any): Promise<GetTaskReward> => {
  return new Promise((resolve) => {
    let resource: GetTaskReward = {
      type: 'default',
      data: null,
    }

    const {channelCode} = task

    sendClickPingback('homeRN', 200400, `getreward_${channelCode}`);

    if(channelCode && VIP_TASK_MAP[channelCode]) {
      getVipRewards({taskCode: VIP_TASK_MAP[channelCode]})
        .then((data) => {
          resource = {
            type: 'vip',
            data,
          }
          resolve(resource)
        })
        .catch((err) => {
          showToast(err.message)
        })
    } else {
      getReward({channelCode})
        .then((data) => {
          resource = {
            type: 'default',
            data,
          }
          resolve(resource)
        })
        .catch(() => {
          showToast('系统繁忙，请稍后再试')
        })
    }
  })
}

// 一键领取所有奖励
export const getAllTaskRewardAsync = (taskList: any[]): Promise<any> => {
  return new Promise((resolve) => {
    const channelCode = taskList.map(t => t.channelCode).join(',')

    if(channelCode) {
      // 一键领取只是把任务通知后台去排队，返回的结果不耍真正的领取结果，不具有参考性
      getReward({channelCode})
        .then(() => {
          resolve()
        })
        .catch(() => {
          showToast('系统繁忙，请稍后再试')
        })
    }
  })
}

// 过滤每日任务，会员任务有特殊逻辑不展示
export function filterTaskList(list: any[]) {
  const {isVIP} = global.USER_INFO

  return list.filter((task) => {
    const {channelGroup} = task

    if(channelGroup === 21) {
      // 挑战任务
      const isvip = task.exts.filter(e => e.name === 'isvip')[0]

      if(isvip) {
        return (isVIP && isvip.value === '1')
          || (isVIP && isvip.value === '0' && isCompleted(task))
          || (!isVIP && isvip.value === '0')
      }
      return true
    }
    return true
  })
}
