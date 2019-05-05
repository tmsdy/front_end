import {isIOS} from '@iqiyi/rn-utils'
import {executeTask, getQiChuanToken} from '../../api'
import {FetchMySubmitList} from '../../typings/apis/question'
import {getObjectValueSafely, creatShareUrl} from '../../common/util';

const TASK_CODE = {
  UnreceiveScore: 'sphinx_question_unreceive_score_count', // 积分未领取数量
  ReceiveScore: 'sphinx_question_receive_score', // 领取投稿积分
  PublishUserCount: 'sphinx_question_publish_user_count', // 已投稿人数
  MyPublishList: 'sphinx_question_publish_list', // 我的投稿列表
  Publish: 'sphinx_question_publish', // 用户投稿
}

const COMMON_PARAM = {
  agentversion: global.CLIENT_INFO.appVersion,
  appver: global.CLIENT_INFO.appVersion,
  verticalCode: 'iQIYI',
  agenttype: isIOS ? '20' : '21',
  typeCode: 'point',
  srcplatform: isIOS ? '20' : '21',
}

export async function fetchPublishUserCount(): Promise<string> {
  const requestHeader = {
    task_code: TASK_CODE.PublishUserCount,
    timestamp: Date.now(),
  }
  const requestBody = {
    sphinx_question_publish_user_count: {
      uid: global.USER_INFO.userId
    }
  }
  let resData = ''
  try {
    const {data} = await executeTask(requestHeader, requestBody)
    if(data) {
      resData = data > 10000 ? `${(data / 10000).toFixed(1)}万` : data
    }
    return resData
  } catch(e) {
    return resData
  }
}

// 用户未领取积分数量
export async function fetchUnreceiveScore(): Promise<number> {
  const requestHeader = {
    task_code: TASK_CODE.UnreceiveScore,
    timestamp: Date.now(),
  }
  const requestBody = {
    sphinx_question_unreceive_score_count: {
      uid: global.USER_INFO.userId
    }
  }

  let resData = 0

  try {
    const {data} = await executeTask(requestHeader, requestBody)

    if(data) {
      resData = data
    }
    return resData

  } catch(e) {
    return resData
  }
}

// 领取积分
export async function askToReceiveScore(qid: string): Promise<boolean> {
  const requestHeader = {
    task_code: TASK_CODE.ReceiveScore,
    timestamp: Date.now(),
  }
  const requestBody = {
    sphinx_question_receive_score: {...COMMON_PARAM, qid}
  }
  let resData = false
  try {
    await executeTask(requestHeader, requestBody)
    resData = true
    return resData
  } catch(e) {
    return resData
  }
}

// 已投稿人数接口
export async function fetchQuestionUserCount(): Promise<number> {
  const requestHeader = {
    task_code: TASK_CODE.ReceiveScore,
    timestamp: Date.now(),
  }
  const requestBody = {
    sphinx_question_receive_score: {}
  }

  let resData = 0

  try {
    const {data} = await executeTask(requestHeader, requestBody)

    if(data) {
      resData = data
    }
    return resData

  } catch(e) {
    return resData
  }
}

function formatTimeText(timestamp): string {
    const dateTime = new Date(timestamp);
    const year = dateTime.getFullYear();
    const month = dateTime.getMonth() + 1;
    const day = dateTime.getDate();
    const hour = `0${dateTime.getHours()}`.substr(-2);
    const minute = `0${dateTime.getMinutes()}`.substr(-2);

    const today = new Date()
    const toayDay = today.getDate();

    const now = Date.now();
    let milliseconds = 0;
    let timeSpanStr;
    milliseconds = now - timestamp;
    if(milliseconds <= 60 * 1000) {
      timeSpanStr = '刚刚';
    } else if(60 * 1000 < milliseconds && milliseconds <= 60 * 60 * 1000) {
      timeSpanStr = `${Math.floor((milliseconds / (60 * 1000)))}分钟前`;
    } else if(60 * 60 * 1000 < milliseconds && milliseconds <= 60 * 60 * 48 * 1000) {
      if(toayDay - day === 1) {
        timeSpanStr = `昨天${hour}:${minute}`;
      } else if(toayDay - day === 0) {
        timeSpanStr = `${Math.floor(milliseconds / (60 * 60 * 1000))}小时前`;
      } else {
        timeSpanStr = `${month}月${day}日`;
      }
    } else if(60 * 60 * 48 * 1000 < milliseconds && milliseconds <= 60 * 60 * 24 * 365 * 1000) {
      timeSpanStr = `${month}月${day}日`;
    } else {
      timeSpanStr = `${year}年${month}月${day}日`;
    }
    return timeSpanStr
}

// 我的投稿列表
export async function fetchMySubmitList(pageSize: number, pageNum: number): Promise<FetchMySubmitList> {
  const requestHeader = {
    task_code: TASK_CODE.MyPublishList,
    timestamp: Date.now(),
  }
  const requestBody = {
    sphinx_question_publish_list: {...COMMON_PARAM, pageSize, uid: global.USER_INFO.userId, pageNum}
  }
  let resData: FetchMySubmitList = {
    contentList: [],
    total: 0,
    isEnd: true
  }

  // 问题状态：0启用，1禁用，2草稿，3审核中，4审核不通过（前端根绝产品定义具体进行状态判断及稿件类型显示）
  const STATUS = {
    0: 'approved',
    1: 'approved',
    2: 'review',
    3: 'review',
    4: 'fail'
  }
  // 领取积分状态：0未领取，1已领取，审核通过之后被禁用也可以领取积分
  // 0、1 表示采纳  2、3表示审核中 4审核不通过
  const SCORE_STATUS = {
    0: 'unreceive',
    1: 'receive'
  }
  return executeTask(requestHeader, requestBody).then((data) => {
    const {contentList = [], total, isEnd} = data.data
    const _contentList = []
    if(contentList.length) {
      contentList.forEach((item) => {
        const _item = item
        _item.type = STATUS[item.status]
        _item.scoreType = SCORE_STATUS[item.jifenStatus]
        _item.timeText = formatTimeText(item.ctime)
        _contentList.push(_item)
      })
    }
    resData.contentList = _contentList
    resData.total = total
    resData.isEnd = isEnd
    return resData
  })
}

export async function getUploadPicToken(): Promise<string> {
  const param = {
    client_id: '7982f83803d54059951e558cc1b4ca86',
    client_secret: 'ec149c81ef89418e86389b9de21c93ac',
    uid: global.USER_INFO.userId,
    authtoken: global.USER_INFO.authCookie

  }
  let resData = ''
  try {
    let data = await getQiChuanToken(param)
    if(data && data.code === 'A00000') {
      const {access_token: accessToken} = data.data
      if(accessToken) {
        resData = accessToken
      }
    }
    return resData

  } catch(e) {
    return resData
  }
}

// 投稿接口分为两个步骤，先将图片上传到奇传平台，奇传平台返回一个图片的url，再将url传给后端
export async function askToUploadPic(_file): Promise<any> {
  const accessToken = await getUploadPicToken()
  let formData = new FormData()
    formData.append('file', {uri: _file, type: 'multipart/form-data', name: 'image'})
    formData.append('access_token', accessToken)
    formData.append('auth_token', global.USER_INFO.authCookie)
    formData.append('file_type', 'png')
    let option = {
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
    },
      method: 'post'
    }
    let result = {}
    const url = creatShareUrl('http://secupload.iqiyi.com/common_upload', {
      share_type: 'external',
      business_type: 'image',
      share_expire: 1903418563
    })
    try {
      const _result = await fetch(url, option)
      result = _result.json()
      return result
    } catch(e) {
      return result
    }
}

// 用户投稿接口
export async function askToPublish(content: string, pic: string): Promise<any> {
  const requestHeader = {
    task_code: TASK_CODE.Publish,
    timestamp: Date.now(),
  }
  const requestBody = {
    sphinx_question_publish: {...COMMON_PARAM, uid: global.USER_INFO.userId, content}
  }
  let resData = 0
  if(pic) {
    const param = await askToUploadPic(pic)
    const httpInnerUrl = getObjectValueSafely(param, 'data.share_url', '')
    if(httpInnerUrl) {
      requestBody.sphinx_question_publish.pic = httpInnerUrl
    }
  }
  try {
    return executeTask(requestHeader, requestBody).then((data) => {
      if(data) {
        resData = data
      }
      return resData
    })
  } catch(e) {
    return resData
  }
}
