/**
 * Created by liuzhimeng.
 * @date 2019-04-07
 * @description 积分中心apis
 */

import {isIOS} from '@iqiyi/rn-utils'
import {formatQipuData, filterPic, filterExts, getImageByPropExts, blockDownload, formatQipuDataElementsSummary, getObjectValueSafely} from '../../common/util'
import {executeTask, getAwardsInfo, getAwardResult, getTaskList, getQiangPaiReward, userCheckin, getIntegralShopping} from '../../api'
import {
  FetchQiPuData,
  FetchPropCodeItem,
  FetchPropsProductItem,
  DrawBoxData,
  AwardResultInfo,
  FlowerMageStatusBarResult,
  FlowerMageStatusBarInfo,
  FetchTaskList,
  BaoxiangResource,
  HomePageNotice,
  FetchFLowerData,
  FetchAuctionData,
  AskToSignIn,
  FetchDeviceScoreInfo,
  AskToTransferDeviceScore,
} from '../../typings/apis/homePage'
import {handleAwardsList, handleDrawBoxData, getDrawBoxResource} from './lottery'
import {filterTaskList} from '../../common/handleTaskClick'
import {isCompleted, isDone} from './task'
import {showToast} from '../../common/QYNativeBridge'

const TASK_CODE = {
  QiPuData: 'qipu_page_integral_center',
  PropCode: 'daojuPartnerList',
  PropList: 'daojuProductListWithPage',
  ActivityCard: 'activity_card',
  MageStatusBar: 'mageStatusBar',
  Tasklist: 'task_center_list',
  DeepGroup: 'qipu_deep_task_list',
  DeepTasklist: 'growth_task_sequence_list',
  ActivityCardResource: 'qipu_functions_card',
  Notice: 'task_center_notice',
  FlowerSeed: 'mageStats', // 花儿种子信息
  DeviceInfo: 'growthDfpExtInfo', // 获取设备积分
  DeviceToUser: 'getDeviceUidAndScore', // 查询可转移的设备积分
  TransferDevice: 'growthDfpScoreDfpLoginTransfer', // 转移设备积分
}

// 接口请求公共参数
const COMMON_PARAM = {
  agentversion: global.CLIENT_INFO.appVersion,
  appver: global.CLIENT_INFO.appVersion,
  agenttype: isIOS ? '20' : '21',
  srcplatform: isIOS ? '20' : '21',
  platform: isIOS ? '2_22_221' : '2_22_222',
  verticalCode: 'iQIYI',
  typeCode: 'point',
}

const QY_ID = global.CLIENT_INFO.qyId || global.CLIENT_INFO.deviceId

// 获取奇普数据
export const fetchQiPuData = async (): Promise<FetchQiPuData> => {
  let resData: FetchQiPuData = {
    menuList: [],
    advList: [],
  }

  try {
    const requestHeader = {
      task_code: TASK_CODE.QiPuData,
      timestamp: Date.now(),
    }

    const {resource_container: list} = await executeTask(requestHeader)

    if(list && list.length) {
      const resourceContainer = formatQipuData(list)

      // 少于4个不显示整个导航栏，多于4个仅显示前4个 @张晓娟
      const menuList = resourceContainer[0].length >= 4 ? resourceContainer[0].slice(0, 4) : []

      resData = {
        menuList,
        advList: resourceContainer[1] || [],
      }
    }

    return resData

  } catch(e) {
    return resData
  }
}

// 获取道具code
export const fetchPropsCodeList = async (): Promise<FetchPropCodeItem[]> => {
  let resData: FetchPropCodeItem[] = []

  try {
    const requestHeader = {
      task_code: TASK_CODE.PropCode,
      timestamp: Date.now(),
    }
    const requestBody = {
      [TASK_CODE.PropCode]: {
        vertical_code: 'iQIYI',
        tag: '积分中心'
      }
    }
    const {code, data} = await executeTask(requestHeader, requestBody)

    if(code === 'A00000') {
      for(let {partnerCode = '', partnerName = '', defaultPartner = 0, offlineTime = 0} of data) {
        if(partnerCode) {
          resData.push({
            code: partnerCode,
            title: partnerName,
            isLimitedSale: !!parseInt(defaultPartner), // 通过是否为defaultPartner（默认渠道)判断是否为秒杀 @龚腾
            offlineTime,
          })
        }
      }
    }

    return resData

  } catch(e) {
    return resData
  }
}

/**
 * 获取道具商品数据
 * @param {string} partnerCode 渠道号
 * @param {number} size 数据长度
 * @param {number} page 页数
 * @returns {Promise<FetchPropsProductItem[]>}
 */
export const fetchPropsProductList = async (
  code: string = '',
  size: number = 4,
  page: number = 1
): Promise<FetchPropsProductItem[]> => {
  let resData: FetchPropsProductItem[] = []

  try {
    const requestHeader = {
      task_code: TASK_CODE.PropList,
      timestamp: Date.now(),
    }
    const requestBody = {
      [TASK_CODE.PropList]: {
        vertical_code: COMMON_PARAM.verticalCode,
        version: COMMON_PARAM.agentversion,
        platform: COMMON_PARAM.platform,
        user_id: global.USER_INFO.userId,
        need_ext: true,
        user_grade: '',
        partner_code: code,
        size,
        page,
      }
    }
    const {code: resCode, data} = await executeTask(requestHeader, requestBody)

    if(resCode === 'A00000' && data.contents && data.contents.length) {
      resData = data.contents.map((i: any = {}) => {
        const photoMap: any = filterPic(i.photoList)
        const extMap = filterExts(i.exts)

        const [tagWidth = 0, tagHeight = 0] = (i.productBadgeSize || '').split('*')

        return {
          ...i,
          title: i.title || i.name,
          desc: `${i.credits || i.score}积分`,
          imgUrl: getImageByPropExts(photoMap),
          tagOptions: {
            url: i.productBadgeImage || '',
            size: {
              width: parseInt(tagWidth) / 2,
              height: parseInt(tagHeight) / 2,
            },
          },
          photoMap,
          extMap,
        }
      })
    }

    return resData

  } catch(e) {
    return resData
  }
}
/**
 * 获取抽奖 问答 话题PK card数据
 * @param wiki http://wiki.qiyi.domain/pages/viewpage.action?pageId=161068034#id-%E8%A7%84%E5%88%99%E5%BC%95%E6%93%8E%E6%96%B0%E6%8E%A5%E5%8F%A3WIKI-2.1%E5%A5%96%E7%9B%98%E5%88%9D%E5%A7%8B%E5%8C%96%EF%BC%9A/openApi/lottery/init
 * @returns {Promise<FetchActivityCardRes>}
 */
export const fetchActivityCardData = async (data): Promise<DrawBoxData[]> => {
  let cardList: DrawBoxData[] = []
  try {
    const requestHeader = {
      task_code: TASK_CODE.ActivityCard,
      timestamp: Date.now(),
    }
    const requestBody = {
      agentversion: COMMON_PARAM.agentversion,
      userId: global.USER_INFO.userId,
      authCookie: global.USER_INFO.authCookie,
      appver: global.CLIENT_INFO.appVersion,
      agenttype: isIOS ? '20' : '21',
      srcplatform: isIOS ? '20' : '21',
      sphinx_question_list_home: {
        pageSize: data.naodongSize,
        pageNum: 1
      },
      topicList: {
          limit: data.huatiSize,
          offset: 0
      }
    }
    const res = await executeTask(requestHeader, requestBody)
     /* eslint guard-for-in: off */
     const keyMap = ['huati', 'baoxiang', 'naodong']
     for(let i in res) {
      if(keyMap.includes(i) && res[i]) {
        let obj: {cardOrder?: number; items?: any[]; activityCardType?: string} = {}
        // TODO: card排序需要根据传进来的参数重新计算 此时暂时写死
        obj.activityCardType = i
        if(i === 'baoxiang') {
          obj.cardOrder = data.baoxiangIndex
          const drawboxData = handleDrawBoxData(res[i])
          obj = {...drawboxData, ...obj}
          cardList.push(obj)
        } else {
          if(i === 'naodong') {
            obj.cardOrder = data.naodongIndex
          }
          if(i === 'huati') {
            obj.cardOrder = data.huatiIndex
          }
          /* eslint array-callback-return : off */
          res[i].length > 0 && res[i].map((v, k) => {
            cardList.push({...{...v, ...obj}, index: k})
          })
        }
      }
    }
    return cardList.sort((a, b) => Number(a.cardOrder) - Number(b.cardOrder));
  } catch(e) {
    return cardList
  }
}
/**
 * 宝箱获奖信息
 * @returns {Promise<AwardInfo[]>}
 */
export const fetchAwardsInfo = async (): Promise<{value: string}[]> => {
  let marqueeList: {value: string}[] = []
  try {
    const data = await getAwardsInfo() || {}
    if(data.length) {
       marqueeList = handleAwardsList(data)
      return marqueeList
    }
    return marqueeList
  } catch(e) {
    return marqueeList
  }
}

/**
 * 宝箱获奖结果信息
 * @returns {Promise<AwardResult>}
 */
export const fetchAwardsResult = async (): Promise<AwardResultInfo> => {
  let awardResultInfo: AwardResultInfo = {}
  try {
    const res = await getAwardResult() || {}
    if(res.code === 'A00000' && res.data) {
      awardResultInfo = res.data
    }
    return awardResultInfo
  } catch(e) {
    return awardResultInfo
  }
}

/**
 * 获取花儿顶部状态条信息
 *  */
export const fetchFlowerStatsBar = async (): Promise<FlowerMageStatusBarInfo> => {
  let floweInfo: FlowerMageStatusBarInfo = {}
  try {
    const requestHeader = {
      task_code: TASK_CODE.MageStatusBar,
      timestamp: Date.now(),
    }
    const requestBody = {
      [TASK_CODE.MageStatusBar]: {
        verticalCode: 'iQIYI',
        typeCode: COMMON_PARAM.typeCode,
        userId: global.USER_INFO.userId,
        agenttype: COMMON_PARAM.agenttype,
        agentversion: COMMON_PARAM.agentversion,
        srcplatform: COMMON_PARAM.srcplatform,
        appver: COMMON_PARAM.appver
      }
    }
    const res: FlowerMageStatusBarResult = await executeTask(requestHeader, requestBody)

    if(res.code === 'A0000' && res.data) {
      floweInfo = res.data
    }

    return floweInfo
  } catch(e) {
    return floweInfo
  }
}

/**
 * 获取任务列表（for TaskListUI）
 * @param {number|array} code channelGroup值，支持数字或数字数组
 * @returns {Promise<FetchTaskList>}
 */
export const fetchTaskList = async (code: number[] | number = [], pageSize = 5, page = 1): Promise<FetchTaskList> => {
  const fetchData = {
    taskList: [],
    completedList: [],
    signData: {
      lastScore: 0,
      signScore: 0,
      signDay: 0,
    },
    hasDoubleCard: 0,
    expireTime: 0,
  }

  try {
    const codeList = typeof code === 'number' ? [code] : code
    const channelGroup = codeList.join(',')
    let taskData = {
      taskList: [],
      expireTime: 0,
    }

    if(global.USER_INFO.userId) {
      const requestHeader = {
        task_code: TASK_CODE.Tasklist,
        timestamp: Date.now()
      }
      const requestBody = {
        growth_task_list: {
          ...COMMON_PARAM,
          userId: global.USER_INFO.userId,
          need_ext: true,
          pageSize,
          page,
          channelGroup,
        },
      }
      const data = await executeTask(requestHeader, requestBody)

      taskData = data.taskList
      // 是否显示翻倍卡
      fetchData.hasDoubleCard = data.hasDoubleCard || 0
      // 积分翻倍剩余时间
      fetchData.expireTime = data.expireTime || 0
    } else {
      const params = {
        typeCode: 'point',
        page: 1,
        pageSize: 5,
        channelGroup,
      }

      taskData = await getTaskList(params)
    }

    // 签到数据，lastScore, signScore, signDay保存到fetchData.signData
    Object.keys(fetchData.signData).forEach((key) => {
      if(taskData.hasOwnProperty(key)) {
        fetchData.signData[key] = taskData[key]
      }
    })

    // 任务列表数据
    const fliterList = filterTaskList(taskData.taskList)
    fetchData.taskList = blockDownload(fliterList).map((task: any) => {
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

// 获取深度任务的sequenceGroup
export const fetchDeepTaskGroup = async (): Promise<string[]> => {
  try {
    const requestHeader = {
      task_code: TASK_CODE.DeepGroup,
      timestamp: Date.now(),
    }
    const {elements_summary: summary} = await executeTask(requestHeader)
    return formatQipuDataElementsSummary(summary)
      .map((item) => {
        return getObjectValueSafely(item, 'values.sequencename', '')
      })
      .filter(i => !!i)
  } catch(e) {
    return []
  }
}

// 获取深度任务列表
export const fetchDeepTaskListByGroup = async (group: string[]): Promise<any[]> => {
  let resData = []

  try {
    const params = {
      task_code: TASK_CODE.DeepTasklist,
      timestamp: Date.now(),
    }
    const requestBody = {
      [TASK_CODE.DeepTasklist]: {
        ...COMMON_PARAM,
        sequenceGroup: group.join(),
        need_ext: true,
        channelGroup: '188',
        userId: global.USER_INFO.userId,
        qyid: QY_ID,
      }
    }
    const {code, data} = await executeTask(params, requestBody)

    if(code === 'A0000' && data && data.length && data[0] && data[0].length) {
      const [list] = data
      resData = list
    }

    return resData
  } catch(e) {
    return resData
  }
}

// 获取深度任务列表
export const fetchDeepTaskList = async (): Promise<any[]> => {
  try {
    const group = await fetchDeepTaskGroup()
    if(group.length) {
      return fetchDeepTaskListByGroup(group)
    }
    return []
  } catch(e) {
    return []
  }
}

/**
 * 获取抽奖 问答 话题PK 资源位
 * @param wiki http://wiki.qiyi.domain/pages/viewpage.action?pageId=238095582
 * @returns {Promise<FetchActivityCardRes>}
 */
export const fetchActivityCardResource = async (): Promise<BaoxiangResource> => {
  let baoxiangResource: BaoxiangResource
  try {
    const requestHeader = {
      task_code: TASK_CODE.ActivityCardResource,
      timestamp: Date.now(),
    }
    const res = await executeTask(requestHeader)
    baoxiangResource = getDrawBoxResource(res.elements_summary)
    return baoxiangResource
  } catch(e) {
    return baoxiangResource
  }
}

/**
 * 通知栏接口信息
 *  */
export const fetchHomePageNotice = async (): Promise<HomePageNotice> => {
  let noticeData: HomePageNotice = {billboard: [], notice: []}
  try {
    const requestHeader = {
      task_code: TASK_CODE.Notice,
      timestamp: Date.now(),
    }
    const result = await executeTask(requestHeader)
    const {billboard = {}, notice = []} = result
    const resourceContainer = formatQipuDataElementsSummary(billboard.elements_summary)
    noticeData = {
      billboard: resourceContainer || [],
      notice
    }
    return noticeData
  } catch(e) {
    return noticeData
  }
}

// 获取用户花儿种子提示
export const fetchFLowerData = async (): Promise<FetchFLowerData> => {
  let resData: FetchFLowerData = {
    newborn: false,
  }
  try {
    const requestHeader = {
      task_code: TASK_CODE.FlowerSeed,
      timestamp: Date.now(),
    }
    const requestBody = {
      [TASK_CODE.FlowerSeed]: {
        ...COMMON_PARAM,
        qyid: QY_ID,
        userId: global.USER_INFO.userId,
        detail: true,
      },
    }

    const {code, data} = await executeTask(requestHeader, requestBody)
    if(code === 'A00000') {
      resData = {
        newborn: data.newborn,
      }
    }
    // console.log('getFLowerData', data)
    return resData
  } catch(e) {
    // console.log('getFLowerData err', e)
    return resData
  }
}

// 获取抢拍成功数据
export const fetchAuctionData = async (): Promise<FetchAuctionData> => {
  let resData: FetchAuctionData = {
    cost: 0,
    needNotice: false,
    productName: '',
  }

  try {
    const data = await getQiangPaiReward()
    resData = {
      cost: data.cost || 0,
      needNotice: !!data.needNotice,
      productName: data.productName || 'VIP天卡',
    }

    return resData
  } catch(e) {
    return resData
  }
}

// 签到
export const askToSignIn = async (): Promise<AskToSignIn> => {
  let resData: AskToSignIn = {
    continuousValue: 0,
    score: -1,
  }

  try {
    const requestHeader = {
      channelCode: 'Sign',
      scoreType: 1,
      debugMode: 'mdb',
    }

    const data = await userCheckin(requestHeader)

    if(data && data.length && data[0].code === 'A0000') {
      const {continuousValue = 0, score = 0} = data[0]
      resData = {
        continuousValue,
        score,
      }
    }

    return resData
  } catch(e) {
    return resData
  }
}

// 未登录用户查询设备积分
export const fetchDeviceScoreInfoUnlogin = async (): Promise<FetchDeviceScoreInfo> => {
  let resData: FetchDeviceScoreInfo = {
    todayScore: -1,
    totalScore: -1,
    lastPeriodScore: -1,
  }

  try {
    const requestHeader = {
      task_code: TASK_CODE.DeviceInfo,
      timestamp: Date.now(),
    }
    const requestBody = {
      [TASK_CODE.DeviceInfo]: {
        ...COMMON_PARAM,
        qyid: QY_ID,
        need_ext: true,
      }
    }
    const {code, data} = await executeTask(requestHeader, requestBody)
    if(code === 'A0000') {
      const {totalScore = 0, todayScore = 0, lastPeriodScore = 0} = data[0]
      resData = {
        totalScore,
        todayScore,
        lastPeriodScore,
      }
    }

    return resData
  } catch(e) {
    return resData
  }
}

// 登录用户查询设备积分
export const fetchDeviceScoreInfoLogined = async (): Promise<FetchDeviceScoreInfo> => {
  let resData: FetchDeviceScoreInfo = {
    totalScore: -1,
  }

  try {
    const requestHeader = {
      task_code: TASK_CODE.DeviceToUser,
      timestamp: Date.now(),
    }

    const requestBody = {
      [TASK_CODE.DeviceToUser]: {
        ...COMMON_PARAM,
        need_ext: true,
        qyid: QY_ID,
        userId: global.USER_INFO.userId,
      }
    }

    const {
      growthDfpExtRelation = {},
      device_scores: deviceScore = 0,
    } = await executeTask(requestHeader, requestBody)

    const {matched, userDfpId, dfpUserId} = growthDfpExtRelation

    // 如果无积分，不弹弹框
    // 如果有积分，matched = true，弹出弹框
    // 如果有积分，matched = false，且【userDfpId 、dfpUserId】都为空，弹弹框
    // 如果有积分，matched = false，且【userDfpId 、dfpUserId】任意一种有值，不弹
    // 如有疑问 @张晓娟
    if(deviceScore > 0 && (matched || (!userDfpId && !dfpUserId))) {
      resData = {
        totalScore: deviceScore,
      }
    }

    return resData
  } catch(e) {
    return resData
  }
}

// 根据用户是否登录，获取设备信息
export const fetchDeviceScoreInfo = async (isLogin = global.USER_INFO.isLogin): Promise<FetchDeviceScoreInfo> => {
  if(isLogin) {
    return fetchDeviceScoreInfoLogined()
  } else {
    return fetchDeviceScoreInfoUnlogin()
  }
}

// 转移设备积分
export const askToTransferDeviceScore = async (): Promise<AskToTransferDeviceScore> => {
  let resData: AskToTransferDeviceScore = {
    score: -1,
    finished: false,
  }

  try {
    const requestHeader = {
      task_code: TASK_CODE.TransferDevice,
      timestamp: Date.now(),
    }

    const requestBody = {
      [TASK_CODE.TransferDevice]: {
        ...COMMON_PARAM,
        need_ext: true,
        qyid: QY_ID,
        needSyncState: true,
        durationType: 1,
        userId: global.USER_INFO.userId,
      }
    }

    const {code, data} = await executeTask(requestHeader, requestBody)

    if(code === 'A0000' && data.data) {
      const {code: scoreCode, score = 0} = data.data

      if(scoreCode === 'A0000') {
        showToast('积分已经同步~')
        resData = {
          score,
          finished: true,
        }
      } else if(scoreCode === 'A0001') {
        showToast('该设备已被其他帐号关联~')
      }

    } else {
      showToast('同步失败，稍后再试')
    }

    return resData
  } catch(e) {
    showToast('同步失败，稍后再试')
    return resData
  }
}


// 获取商城商品数据（首页积分当钱花）
export const fetchIntegralShopping = async (): Promise<FetchPropsProductItem[]> => {
  let resData = []
  try {
    const {code, data} = await getIntegralShopping()

    if(code === 'A00000') {
      resData = data.map((i: any) => {
        const {title, showImage, scoreValue, discount, price, ...left} = i
        return {
          ...left,
          score: scoreValue,
          price: Number(price) - Number(discount) > 0 ? Number(price) - Number(discount) : 0,
          originalPrice: price,
          title,
          imgUrl: showImage || '',
          photoMap: {},
          extMap: {},
        }
      })
    }

    return resData
  } catch(e) {
    return resData
  }

}
