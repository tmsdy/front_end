/**
 * Created by liuzhimeng.
 * @date 2018-12-10
 * @description 奇妙乐园API
 */
import {isIOS} from '@iqiyi/rn-utils'
import {
  executeTask,
  getQiangPaiReward,
  getTaskList,
  getTreasureList,
  getUserInfo,
  getTreasureNotice,
  askSubscribePush,
  askUnsubscribePush,
  fetchSubscribePushStatus
} from '../../api'
import {GET_ENV} from '../../constants/configs'
import {compare, formatQipuData, formatExts, blockDownload} from '../../common/util'
import {getPeriod, isCompleted, isDone} from './options'
import {filterTaskList} from '../../common/handleTaskClick'

// 热门兑换渠道码
const HOT_EXCHANGE_CODE = {
  test: 'QxAmLwi2HuQCaI17',
  pro: 'IlXgtU467lIZOKCu',
}

const TASK_PAGE_SIZE = 3

// 规则引擎API
const API = {
  park: 'page_integral_park',
  mallAdv: 'qipu_mall_ads_list',
  flowerSeed: 'mageStats', // 花儿种子信息
}

// 接口请求公共参数
const COMMON_PARAM = {
  agentversion: global.CLIENT_INFO.appVersion,
  appver: global.CLIENT_INFO.appVersion,
  verticalCode: 'iQIYI',
  agenttype: isIOS ? '20' : '21',
  typeCode: 'point',
  srcplatform: isIOS ? '20' : '21',
}

const taskPromise = async (data, body) => {
  const res = await executeTask(data, body)
  if(res && res.code && ['A0000', 'A00000'].includes(res.code)) {
    return res.data
  }
  return res
}

// 对乐高资源进行排序
const filterDataGenerator = (data) => {
  return (k, defaultValue = [], isSort = true) => {
    const item = data[k] || null
    if(item && !!item.elements_summary) {
      return isSort
        ? item.elements_summary
          .sort(compare('order'))
          .reverse()
        : item.elements_summary
    }
    return defaultValue
  }
}

// 获取乐高资源位数据
export async function getTotalData() {
  const _data = {
    task_code: 'qipu_wonderful_park',
    timestamp: Date.now(),
  }
  const _body = {};

  try {
    const data = await executeTask(_data, _body)
    const {resource_container: qipuData = []} = data
    let result = {}

    // 统一封装获取platforms 的方法

    if(!!qipuData && qipuData.length) {
      const finallyData = formatQipuData(qipuData);
      // 头部banner
      const banner = finallyData[0]
      // 抢拍开关
      const jingPai = finallyData[1];
      // 运营弹框
      const adv = finallyData[2].length ? finallyData[2] : {};
      // 乐园公告
      const notifications = finallyData[3];
      const legaoMessage = notifications.map((t) => ((t && t.title) ? t.title.proper_title : ''));
      // 益智游戏
      const games = finallyData[4];

      // 运营广告
      let showAuction = false
      let auctionCode = '';

      jingPai.forEach((item) => {
        const temp = item.title;
        // TODO 中文比对删除
        if(temp && temp.proper_title && temp.proper_title === '竞拍开关') {
          showAuction = item.values.auction === '1';
          auctionCode = item.values.clickEvent;
        }
      });

      result = {
        banner,
        showAuction,
        auctionCode,
        adv,
        legaoMessage,
        games,
      }
    }

    return result
  } catch(e) {
    throw e
  }
}

// 获取运营广告数据
export const getMallAdvData = async () => {
  const _data = {
    task_code: API.mallAdv,
    timestamp: Date.now(),
  }
  try {
    const result = await taskPromise(_data)
    return filterDataGenerator([result])(0)
      .map((i) => {
        const extMaps = formatExts(i.key_value_pair)
        return {
          pic: extMaps.defImg_webp,
          text: extMaps.text,
          url: extMaps.URL,
          name: extMaps.key,
        }
      })
  } catch(e) {
    // console.log('getMallAdvData err', e)
    return []
  }
}

// 获取用户信息
export const getUserInfoData = async () => {
  try {
    const userInfo = await getUserInfo({needExpire: 1})
    const {totalScore, lastPeriodScore} = userInfo[0]
    return {
      totalScore,
      lastPeriodScore,
    }
  } catch(e) {
    return {
      totalScore: -1,
      lastPeriodScore: 0,
    }
  }
}
export const getDfpScore = async () => {
  try {
    const _body = {
      growthDfpExtInfo: {
        need_ext: true,
        agentversion: global.CLIENT_INFO.appVersion,
        srcplatform: isIOS ? '20' : '21',
        agenttype: isIOS ? '20' : '21',
        qyid: global.CLIENT_INFO.qyId || global.CLIENT_INFO.deviceId,
        appver: global.CLIENT_INFO.appVersion,
        verticalCode: 'iQIYI',
        typeCode: 'point',
      }
    }

    const _data = {
      task_code: 'growthDfpExtInfo',
      timestamp: Date.now(),
    }
    const result = await taskPromise(_data, _body)
    const {todayScore, totalScore, lastPeriodScore} = result[0]
    return {
      todayScore,
      totalScore,
      lastPeriodScore,
    }
  } catch(e) {
    return {
      totalScore: -1,
      lastPeriodScore: 0,
    }
  }
}

// 获取夺宝数据
export const getSnatchData = async () => {
  try {
    const {list = {}} = await getTreasureList({
      verticalCode: 'iQIYI',
      typeCode: 'point',
      agenttype: isIOS ? 20 : 21,
      srcplatform: isIOS ? 20 : 21,
      pageSize: 3,
      pageNo: 0,
    })
    return {
      list: list.contents || []
    }
  } catch(e) {
    throw e
  }
}

export const askSubscribeSnatch = async (codeList = []) => {
  try {
    const data = await askSubscribePush({
      activity: 'treasure', // 夺宝
      userId: global.USER_INFO.userId,
      code: codeList.filter((i) => !!i).join(),
    })
    return data
  } catch(e) {
    return {}
  }
}

export const askUnsubscribeSnatch = async (codeList = []) => {
  try {
    const data = await askUnsubscribePush({
      activity: 'treasure', // 夺宝
      userId: global.USER_INFO.userId,
      code: codeList.filter((i) => !!i).join(),
    })
    return data
  } catch(e) {
    return {}
  }
}

export const fetchSnatchSubscribeState = async (codeList = []) => {
  try {
    const {subscribeStatus = {}} = await fetchSubscribePushStatus({
      activity: 'treasure', // 夺宝
      userId: global.USER_INFO.userId,
      code: codeList.filter((i) => !!i).join(),
    })
    return subscribeStatus
  } catch(e) {
    return {}
  }
}

// 查询预约提醒状态
export const getOrderState = async (list) => {
  let hasBefore = false
  const beforeSnatchCodes = list.map((i) => {
    const period = getPeriod(i)
    if(period === 'before') {
      hasBefore = true
      return i.code
    }
    return ''
  })
  try {
    if(hasBefore) {
      const data = await fetchSnatchSubscribeState(beforeSnatchCodes)
      return data
    }
    return {}
  } catch(e) {
    return {}
  }
}

// 获取夺宝最新夺奖信息
export const getSnatchNotice = async () => {
  if(!global.USER_INFO.isLogin) {
    return false
  }
  try {
    const data = await getTreasureNotice({
      verticalCode: 'iQIYI',
      typeCode: 'point',
      agenttype: isIOS ? 20 : 21,
      srcplatform: isIOS ? 20 : 21,
      view: false
    })
    return data || false
  } catch(e) {
    // console.log('getSnatchData err', e)
    return false
  }
}

// 获取道具渠道码
export const getDaojuCode = async () => {
  try {
    const _data = {
      task_code: 'daojuPartnerList',
      timestamp: Date.now(),
    }
    const _body = {
      daojuPartnerList: {
        vertical_code: 'iQIYI',
        tag: '移动端任务中心',
      },
    }
    const data = await taskPromise(_data, _body)
    // console.log('getDaojuCode', data)
    if(data.length) {
      return data[0].partnerCode
    }
    return ''
  } catch(e) {
    // console.log(e)
    return ''
  }
}

// 获取道具列表（热门兑换）
export const getDaojuData = async () => {
  try {
    const partnerCode = HOT_EXCHANGE_CODE[GET_ENV()]
    const _data = {
      task_code: 'daojuProductList',
      timestamp: Date.now(),
    }
    const _body = {
      daojuProductList: {
        vertical_code: 'iQIYI',
        platform: isIOS ? '2_22_221' : '2_22_222',
        need_ext: true,
        partner_code: partnerCode,
      },
    }

    const data = await taskPromise(_data, _body)
    // console.log('getDaojuData', data)
    if(data.length) {
      return {
        partnerCode,
        list: data.slice(0, 6),
      }
    }
    return {partnerCode, list: []}
  } catch(e) {
    // console.log('getDaojuData err', e)
    throw e
  }
}

// 获取未登录用户任务列表
export const getGuestTaskList = async () => {
  const _params = {
    typeCode: 'point',
    page: 1,
    pageSize: TASK_PAGE_SIZE,
    channelGroup: '20,21',
  }
  const data = await getTaskList(_params)
  // console.log('getGuestTaskList', data)
  return data
}

// 获取用户今日任务列表（将被遗弃，请使用本文件的 fetchTaskList）
export const getUserTaskList = async (userId) => {
  try {
    const _data = {
      task_code: 'task_center_list',
      timestamp: Date.now(),
    }
    const _body = {
      growth_task_list: {
        userId,
        agentversion: global.CLIENT_INFO.appVersion,
        appver: global.CLIENT_INFO.appVersion,
        srcplatform: isIOS ? '20' : '21',
        agenttype: isIOS ? '20' : '21',
        pageSize: TASK_PAGE_SIZE,
        verticalCode: 'iQIYI',
        typeCode: 'point',
        need_ext: true,
        page: 1,
        channelGroup: '20,21',
      },
      daoju_double_card: {
        vertical_code: 'iQIYI',
        user_id: userId,
      },
    }
    const data = await taskPromise(_data, _body)
    // console.log('getUserTaskList', data)
    return data
  } catch(e) {
    // console.log('getUserTaskList err', e)
  }
}

// 获取抢拍成功数据
export const getAuctionData = async () => {
  try {
    const data = await getQiangPaiReward()
    // console.log('getAuctionData', data)
    // data.cost = 888
    // data.needNotice = true
    // data.productName = 'VIPVIPVIP'
    return data
  } catch(e) {
    // console.log('getAuctionData err', e)
    return {}
  }
}

// 获取用户花儿种子提示
export const getFLowerData = async () => {
  try {
    const _data = {
      task_code: API.flowerSeed,
      timestamp: Date.now(),
    }
    const _body = {
      [API.flowerSeed]: {
        agentversion: global.CLIENT_INFO.appVersion,
        appver: global.CLIENT_INFO.appVersion,
        agenttype: isIOS ? '20' : '21',
        srcplatform: isIOS ? '20' : '21',
        qyid: global.CLIENT_INFO.qyid,
        userId: global.USER_INFO.userId,
        verticalCode: 'iQIYI',
        typeCode: 'point',
        detail: true,
      },
    }
    const data = await taskPromise(_data, _body)
    // console.log('getFLowerData', data)
    return data
  } catch(e) {
    // console.log('getFLowerData err', e)
    return {}
  }
}

export const getRewardScore = async () => {
  try {
    const _data = {
      task_code: 'growthDfpExtInfo',
      timestamp: Date.now(),
    }
    const _body = {
      growthDfpExtInfo: {
        need_ext: true,
        agentversion: global.CLIENT_INFO.appVersion,
        srcplatform: isIOS ? '20' : '21',
        agenttype: isIOS ? '20' : '21',
        qyid: global.CLIENT_INFO.qyId || global.CLIENT_INFO.deviceId,
        appver: global.CLIENT_INFO.appVersion,
        verticalCode: 'iQIYI',
        typeCode: 'point',
      }
    }
    const [data = {}] = await taskPromise(_data, _body)
    // console.log('getRewardScore', data)
    return data
  } catch(e) {
    // console.log('getRewardScore err', e)
    return {}
  }
}

/**
 * 获取任务列表（for TaskListUI）
 * @param {number|array} code channelGroup值，支持数字或数字数组
 */
export async function fetchTaskList(code = []) {
  const fetchData = {
    taskList: [],
    completedList: [],
    signData: {
      lastScore: 0,
      signScore: 0,
      signDay: 0,
    },
    hasDoubleCard: 0,
  }

  try {
    const codeList = typeof code === 'number' ? [code] : code
    const channelGroup = codeList.join(',')
    let taskData = {}

    if(parseInt(global.USER_INFO.userId)) {
      const requestHeader = {
        task_code: 'task_center_list',
        timestamp: Date.now()
      }
      const requestBody = {
        growth_task_list: {
          ...COMMON_PARAM,
          userId: global.USER_INFO.userId,
          pageSize: 5,
          need_ext: true,
          page: 1,
          channelGroup,
        },
      }
      const data = await executeTask(requestHeader, requestBody)

      taskData = data.taskList

      fetchData.hasDoubleCard = data.hasDoubleCard

    } else {
      const params = {
        typeCode: 'point',
        page: 1,
        pageSize: 5,
        channelGroup,
      }

      taskData = await getTaskList(params)

    }

    // 接口数据里，除taskList外的数据都保存到fetchData.signData
    Object.entries(taskData).forEach(([key, value]) => {
      if(key !== 'taskList') {
        fetchData.signData[key] = value
      }
    })

    const fliterList = filterTaskList(taskData.taskList)
    fetchData.taskList = blockDownload(fliterList).map((task) => {
      if(isCompleted(task) && !isDone(task)) {
        fetchData.completedList.push(task)
      }
      return task
    })

    return fetchData

  } catch(error) {
    return fetchData
  }
}
