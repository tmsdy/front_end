/**
 * Created by liuzhimeng.
 * @date 2018/10/19
 * @description 勋章页接口
 */

import {isIOS} from '@iqiyi/rn-utils'
import {executeTask, getReward, sendGeoInfo} from '../api'
import {getSign} from '../common/util'
import {GET_ENV, PASSPORT_SIGN} from '../constants/configs'
import {
  addPercentageList,
  addPlaceholderToMedalLists,
  getGuestMedalItemOptions,
  getMedalDetailOptions,
  getUserMedalItemOptions,
  getWearedMedalOptions,
} from '../components/integralMedalv2/src/medalOptions'

const TASK_CODE = {
  userInfo: 'passportProfileByUidAction', // 获取用户信息（头像、昵称）
  list: 'growth_medal2_outlines', // 主态页/客态页勋章列表
  initList: 'growth_medal2_outlines_available', // 主态页勋章初始列表
  weared: 'growth_medal2_getWearMedals', // 用户已佩戴勋章
  medalDetail: 'growth_medal2_details', // 勋章详情卡片接口
  danmu: 'danmu_badge_process', // 获取用户弹幕进度
  paopao: 'paopao_badge_process', // 获取用户泡泡评论进度
  dianshang: 'dianshang_dingdan_process', // 获取电商勋章进度
  shipin: 'watchTime_badge_process', // 点播视频时长勋章进度
  wearOn: 'growth_medal2_wearOn', // 佩戴勋章
  wearOff: 'growth_medal2_wearOff', // 佩戴勋章
  position: 'growth_user_geo_send', // 发送地理位置信息
  wenda: 'sphinxMedalProcess',
  genMetrics: 'growth_medal2_geo_metrics', // 勋章地域人数
}

const PUBLIC_PARAMS = {
  verticalCode: 'iQIYI',
  typeCode: 'Point_EXP',
  channelGroup: 200,
  srcplatform: isIOS ? '20' : '21',
  agenttype: isIOS ? '20' : '21',
  agentversion: global.CLIENT_INFO.appVersion,
  appver: global.CLIENT_INFO.appVersion,
}

const PROCESS_BODY_MAP = {
  danmu: 'danmu_userStatMedal',
  paopao: 'redis_hgetall',
  dianshang: 'mallScoreOrdercounts',
  shipin: 'watchTime',
  wenda: 'sphinx_userStat'
}

const taskPromise = (data, body) => new Promise((resolve, reject) => (
  executeTask(data, body)
    .then((res) => {
      if(res && res.code && ['A0000', 'A00000'].includes(res.code)) {
        return resolve(res.data)
      }
      if(res && !res.code) {
        return resolve(res)
      }
      return reject(res)
    })
    .catch((err) => reject(err))
))

// 查询执行任务参数
// export const getExecuteTaskBody = (taskCode) => executeTaskBody({
//   task_code: taskCode,
//   timestamp: Date.now()
// })

// 获取用户信息（头像、昵称）
export const getUserInfoFromPassport = (uid = global.USER_INFO.userId) => {
  const data = {
    appKey: 'basic_h5',
    task_code: TASK_CODE.userInfo,
    timestamp: Date.now(),
  }

  const bodyData = {
    uid,
    source: PASSPORT_SIGN.source,
    timestamp: Date.now(),
  }

  const body = {
    [TASK_CODE.userInfo]: {
      ...bodyData,
      sign: getSign(bodyData, PASSPORT_SIGN.secretKey),
    }
  }

  return taskPromise(data, body)
}

/**
 * 主态页/客态页勋章列表接口
 * @param user      oneself：主态页；guest：客态页
 * @param userId    用户ID
 * @returns {Promise<T | never>}
 */
export const getMedalList = (user = 'oneself', userId = global.USER_INFO.userId, extParams = {}) => {
  const params = {
    appKey: 'basic_h5',
    task_code: TASK_CODE.list,
    timestamp: Date.now(),
  }

  const body = {
    [TASK_CODE.list]: {
      ...PUBLIC_PARAMS,
      userId,
      ...extParams
    }
  }

  return taskPromise(params, body)
    .then((data) => {
      // // console.log('getMedalList', data)

      let hasOwnMedal = 0 // 用户拥有的勋章数
      let medalList = [] // 用户勋章总列表
      const willWearMedalIds = [] // 用户可佩戴的勋章列表
      const newMedalList = [] // 获得新勋章列表

      if(user === 'oneself') {
        // // ===== falseData
        // data = data.map(i => {
        //   // const r = Math.random()
        //   // if(r > .9) i.star = 3
        //   // else if(r > .6) i.star = 2
        //   // else if(r > .4) i.star = 1
        //   // else i.star = 0
        //
        //   // i.star = 0
        //
        //   if(i.star > 0) {
        //     i.newborn = true
        //   }
        //   return i
        // })
        // // ===== end data

        hasOwnMedal = data.reduce((t, i) => ((i.star > 0) ? t + 1 : t), 0)

        for(const _medal of data) {
          const item = getUserMedalItemOptions(_medal)
          medalList.push(item)

          if(hasOwnMedal > 0) {
            if(item.star > 0 && item.canBeWeared) {
              willWearMedalIds.push(item.id)
            }
            // 获取1级以上新勋章，用于展示动效
            if(item.star > 0 && item.newborn) {
              newMedalList.push(item)
            }
          }
        }
      } else if(user === 'guest') {
        medalList = data.map(getGuestMedalItemOptions).filter((i) => i.star > 0)
      }

      return {
        hasOwnMedal,
        medalList,
        willWearMedalIds,
        newMedalList,
      }
    })
    .catch((err) => {
      // console.log('getMedalList err |', err)
      throw err
    })
}

// 主态页勋章初始列表
export const getMedalInitList = () => {
  const data = {
    appKey: 'basic_h5',
    task_code: TASK_CODE.initList,
    timestamp: Date.now(),
  }

  const body = {
    [TASK_CODE.initList]: {
      userId: global.USER_INFO.userId,
      ...PUBLIC_PARAMS,
    }
  }

  return taskPromise(data, body)
    .then((res) => {
      // console.log('getMedalInitList', res)
      return addPlaceholderToMedalLists(res.map(getUserMedalItemOptions))
    })
}

// 主态页勋章详情
export const getMedalDetail = (channelCode) => {
  const params = {
    appKey: 'basic_h5',
    task_code: TASK_CODE.medalDetail,
    timestamp: Date.now(),
  }

  const body = {
    [TASK_CODE.medalDetail]: {
      ...PUBLIC_PARAMS,
      userId: global.USER_INFO.userId,
      channelCode,
    }
  }

  return taskPromise(params, body)
    .then((data) => {
      // console.log('getMedalDetail', data)

      // // ===== falseData
      // let temp = true
      // data = data.map(i => {
      //   const r = Math.random()
      //   if(temp && r > .4) {
      //     i.finish = true
      //     temp = true
      //   } else {
      //     i.finish = false
      //     temp = false
      //   }
      //   i.finishAt = 1541074330306
      //   return i
      // })
      // // ===== end data

      // 0：已完成，1：进行中，2：未开始
      let userStatus = 0
      let initialPage = 0
      const details = data.map((i, k) => {
        if(i.finish) {
          userStatus = 0
          initialPage = k
        } else {
          userStatus = userStatus > 1 ? userStatus : userStatus + 1
        }
        // if([0, 1].includes(userStatus)) {
        //   initialPage = k
        // }
        return getMedalDetailOptions(i, k, {userStatus})
      })
      const source = !!details[0] && details[0].medalSource

      return {
        details,
        source,
        initialPage,
      }
    })
    .catch((err) => {
      // console.log('getMedalDetail err |', err)
      throw err
    })
}

/**
 * 获取用户弹幕进度，并将进度数据添加至勋章详情
 * @param medalDetails  勋章详情
 * @returns {Promise<Array | never>}
 */
export const getProcess = (source, medalDetails) => {
  if(!TASK_CODE[source]) {
    // console.error(source, 'process err | 没有此业务方的进度接口')
    return Promise.reject(new Error('没有此业务方的进度接口'))
  }
  const params = {
    appKey: 'basic_h5',
    task_code: TASK_CODE[source],
    timestamp: Date.now(),
  }

  let body = {}
  if(source === 'shipin') {
    body = {
      watchTime: {
        agentversion: PUBLIC_PARAMS.agentversion,
        srcplatform: PUBLIC_PARAMS.srcplatform,
        agenttype: PUBLIC_PARAMS.agenttype,
        appver: PUBLIC_PARAMS.appver,
        authCookie: global.USER_INFO.authCookie,
        userId: global.USER_INFO.userId,
      }
    }
    if(GET_ENV() === 'test') {
      body.watchTime.debugMode = 'mdb'
    }
  } else {
    body = {
      [PROCESS_BODY_MAP[source]]: {
        uid: global.USER_INFO.userId,
        qypid: isIOS ? '02032001010000000000' : '02022001010000000000',
      }
    }
  }

  return taskPromise(params, body)
    .then((data) => {
      // console.log(source, 'process', data)
      return addPercentageList(medalDetails, data)
    })
    .catch(() => {
      // console.log(source, 'process err |', err)
      return false
    })
}

// 用户已佩戴勋章
export const getWearedMedalList = (userId = global.USER_INFO.userId, page = 'oneself') => {
  const params = {
    appKey: 'basic_h5',
    task_code: TASK_CODE.weared,
    timestamp: Date.now(),
  }

  const body = {
    [TASK_CODE.weared]: {
      ...PUBLIC_PARAMS,
      userId,
    }
  }

  return taskPromise(params, body)
    .then((data) => {
      // console.log('getWearedMedalList |', data)
      if(data && data.length) {
        const medals = data[0].medals || []
        return medals.map((i, k) => getWearedMedalOptions(i, k, page))
      }
      return []
    })
    .catch((err) => {
      // console.log('getMedalList err |', err)
      throw err
    })
}

// 佩戴勋章
export const wearMedalOn = (channelCode, index) => {
  const params = {
    appKey: 'basic_h5',
    task_code: TASK_CODE.wearOn,
    timestamp: Date.now(),
  }

  const body = {
    [TASK_CODE.wearOn]: {
      ...PUBLIC_PARAMS,
      userId: global.USER_INFO.userId,
      channelCode,
      index,
    }
  }

  return taskPromise(params, body)
    .then((data) => {
      // console.log('wearMedalOn |', data)
      return data
    })
    .catch((err) => {
      // console.log('wearMedalOn err |', err)
      throw err
    })
}

// 卸载勋章
export const wearMedalOff = (channelCode) => {
  const params = {
    appKey: 'basic_h5',
    task_code: TASK_CODE.wearOff,
    timestamp: Date.now(),
  }

  const body = {
    [TASK_CODE.wearOff]: {
      ...PUBLIC_PARAMS,
      userId: global.USER_INFO.userId,
      channelCode,
    }
  }

  return taskPromise(params, body)
    .then((data) => {
      // console.log('wearMedalOff |', data)
      return data
    })
    .catch((err) => {
      // console.log('wearMedalOff err |', err)
      throw err
    })
}

// 获取新勋章，领取奖励
export const getMedalReward = (channelCode) => {
  const params = {
    channelCode,
    typeCode: PUBLIC_PARAMS.typeCode,
  }
  // 测试环境取消风控校验
  if(GET_ENV() === 'test') {
    params.debugMode = 'mdb'
  }
  return getReward(params)
    .then((data) => {
      // console.log('getMedalReward |', data)
      return data
    })
    .catch((err) => {
      // console.log('getMedalReward err |', err)
      throw err
    })
}

// 发送地理位置信息
export const sendGeoPosition = (city = '', province = '') => {
  const verticalCode = 'iQIYI'
  const _params = {
    task_code: TASK_CODE.position,
    timestamp: Date.now()
  }
  const _data = {
    [TASK_CODE.position]: {
      userId: global.USER_INFO.userId,
      agentversion: global.CLIENT_INFO.appVersion,
      typeCode: 'Point_EXP',
      verticalCode,
      province,
      city,
    }
  }
  return sendGeoInfo(_params, _data)
}

// 获取勋章地域人数
export const fetchRegionCount = () => {
  const params = {
    appKey: 'basic_h5',
    task_code: TASK_CODE.genMetrics,
    timestamp: Date.now(),
  }
  const body = {
    [TASK_CODE.genMetrics]: {
      // ...PUBLIC_PARAMS
      verticalCode: 'iQIYI',
      typeCode: 'Point_EXP',
      srcplatform: isIOS ? '20' : '21',
      agenttype: isIOS ? '20' : '21',
      agentversion: global.CLIENT_INFO.appVersion,
      appver: global.CLIENT_INFO.appVersion,
    }
  }
  return taskPromise(params, body)
    .then((data) => {
      return data
    })
    .catch((err) => {
      throw err
    })
}
