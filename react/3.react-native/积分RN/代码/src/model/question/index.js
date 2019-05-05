/**
 * 问答api
*/
import {isIOS} from '@iqiyi/rn-utils'
import {executeTask} from '../../api'
import {STORAGE_ENUM} from '../../constants/IntegralEnum'
import {getStorage, setStorage} from '../../common/util/index'
// import {GET_ENV} from '../../constants/configs'
// import {compare, formatQipuData, formatExts} from '../../common/util'

// const taskPromise = async (data, body) => {
//   const res = await executeTask(data, body)
//   if(res && res.code && ['A0000', 'A00000'].includes(res.code)) {
//     return res.data
//   }
//   return res
// }


const QUESTION_EXT_PARAMS = () => {
  return {
    deviceId: global.CLIENT_INFO.qyId || global.CLIENT_INFO.deviceId,
    verticalCode: 'iQIYI',
    typeCode: 'point',
    userId: global.USER_INFO.userId
  }
}
// 首页问答列表
export async function getQuestionList({pageNum = 1, pageSize = 8}) {
  const _data = {
    task_code: 'sphinx_question_list_home',
    timestamp: Date.now(),
    ...QUESTION_EXT_PARAMS()
  }
  const _body = {
    growthMedal2OutlineList: {
      agentversion: global.COMMON_PARAMS.agentversion,
      appver: global.COMMON_PARAMS.appver,
      agenttype: isIOS ? 20 : 21,
      srcplatform: isIOS ? 20 : 21
    },
    sphinx_question_list_home: {
      uid: global.USER_INFO.userId || global.CLIENT_INFO.qyId || global.CLIENT_INFO.deviceId,
      verticalCode: 'iQIYI',
      typeCode: 'point',
      pageNum,
      pageSize
    }
  }
  try {
    const data = await executeTask(_data, _body)
    return data
  } catch(e) {
    // 请求错误直接返回服务器错误
    return {code: 'S00001', msg: e}
  }
}

// 详情页列表
export async function getQuestionDetailList({pageNum = 1, pageSize = 8, qid}) {
  const _data = {
    task_code: 'sphinx_answer_list',
    timestamp: Date.now(),
    qid,
    ...QUESTION_EXT_PARAMS()
  }
  const _body = {
    growthMedal2OutlineList: {
        agentversion: global.COMMON_PARAMS.agentversion,
        appver: global.COMMON_PARAMS.appver,
        agenttype: isIOS ? 20 : 21,
        srcplatform: isIOS ? 20 : 21
    },
    sphinx_answer_list: {
      uid: global.USER_INFO.userId || global.CLIENT_INFO.qyId || global.CLIENT_INFO.deviceId,
      verticalCode: 'iQIYI',
      typeCode: 'point',
      pageNum,
      pageSize,
      qid
    }
  }
  try {
    const data = await executeTask(_data, _body)
    return data
  } catch(e) {
    // 请求错误直接返回服务器错误
    return {code: 'S00001', msg: e}
  }
}

// 点赞
export async function like({aid, qid}) {
  const _data = {
    task_code: 'sphinx_answer_like',
    timestamp: Date.now(),
    qid,
    ...QUESTION_EXT_PARAMS()
  }
  const _body = {
    sphinx_answer_like: {
      fromUserId: global.USER_INFO.userId || global.CLIENT_INFO.qyId || global.CLIENT_INFO.deviceId,
      verticalCode: 'iQIYI',
      typeCode: 'point',
      aid
    }
  }
  try {
    const data = await executeTask(_data, _body)
    return data
  } catch(e) {
    // 请求错误直接返回服务器错误
    return {code: 'S00001', msg: e}
  }
}
// 取消点赞
export async function unLike({aid, qid}) {
  const _data = {
    task_code: 'sphinx_answer_unlike',
    timestamp: Date.now(),
    qid,
    ...QUESTION_EXT_PARAMS()
  }
  const _body = {
    sphinx_answer_unlike: {
      fromUserId: global.USER_INFO.userId || global.CLIENT_INFO.qyId || global.CLIENT_INFO.deviceId,
      verticalCode: 'iQIYI',
      typeCode: 'point',
      aid
    }
  }
  try {
    const data = await executeTask(_data, _body)
    return data
  } catch(e) {
    // 请求错误直接返回服务器错误
    return {code: 'S00001', msg: e}
  }
}
// 发布答案
export async function publish({content, qid, riskLevel = 1}) {
  const _data = {
    task_code: 'sphinx_answer_publish',
    timestamp: Date.now(),
    entity_id: qid,
    qid,
    content,
    ...QUESTION_EXT_PARAMS()
  }
  const _body = {
    sphinx_answer_publish: {
      uid: global.USER_INFO.userId,
      verticalCode: 'iQIYI',
      typeCode: 'point',
      srcplatform: isIOS ? 24 : 23,
      content,
      qid,
      riskLevel
    },
    growthAddScoreWithSign: {
      agentversion: global.CLIENT_INFO.agentversion,
      appver: global.CLIENT_INFO.appver,
      verticalCode: 'iQIYI',
      agenttype: isIOS ? 24 : 23,
      typeCode: 'point',
      srcPlatform: isIOS ? 24 : 23,
    }
  }
  try {
    const data = await executeTask(_data, _body)
    return data
  } catch(e) {
    // 请求错误直接返回服务器错误
    return {code: 'S00001', msg: e}
  }
}

export async function getIsShowBubbleFromStory() {
  const key = STORAGE_ENUM.QUESTION_LSIT_BUBBLE
  let status = false
  try {
    const nowValue = global.USER_INFO.userId
    const value = await getStorage(key)
    status = nowValue === value
  } catch(e) {
    // do nothing
  }
  return status
}

export function setIsShowBubbleFromStory() {
  const key = STORAGE_ENUM.QUESTION_LSIT_BUBBLE
  const value = global.USER_INFO.userId
  setStorage(key, value)
}
