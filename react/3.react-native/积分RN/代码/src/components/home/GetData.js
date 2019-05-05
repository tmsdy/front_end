import {isIOS} from '@iqiyi/rn-utils'
import {executeTask} from '../../api/index'


// TODO 此方法由后端 确认无用，下个版本移除
export function sendPingbackToBackend(task, rseat) { // 给积分后端发送pingback 接口见规则引擎21 growth_user_pingback
    const { channelCode } = task
    const requestHeader = {
      task_code: 'growth_user_pingback',
      timestamp: Date.now(),
    }
    const requestBody = {
      growth_user_pingback: {
        agentversion: global.CLIENT_INFO.appVersion,
        srcplatform: isIOS ? '20' : '21',
        agenttype: isIOS ? '20' : '21',
        appver: global.CLIENT_INFO.appVersion,
        count: 1,
        block: '200400',
        rpage: 'homeRN',
        rseat,
        verticalCode: 'iQIYI',
        userId: global.USER_INFO.userId || 0,
        channelCode,
        typeCode: 'point'
      }
    }
    executeTask(requestHeader, requestBody).then(() => {
    }).catch(() => {
    })
  }

  /**
   * @param {*} param 参数分别为分页信息 调用的渠道号
   */
export function getDaojuByPagination(param) {
  const requestHeader = {
    task_code: 'daojuProductListWithPage',
    timestamp: Date.now(),
  }
  const {partnerCode, size, page} = param
  const requestBody = {
    daojuProductListWithPage: {
      size,
      user_id: global.USER_INFO.userId,
      need_ext: true,
      vertical_code: 'iQIYI',
      page,
      partner_code: partnerCode,
      user_grade: '',
      version: global.CLIENT_INFO.appVersion,
      platform: isIOS ? '2_22_221' : '2_22_222'
    }
  }
  return executeTask(requestHeader, requestBody).then((result) => {
      const {code, data} = result
      if (code === 'A00000') {
        return data.contents
      }
      return {}
  }).catch(() => {
    return {}
  })
}
