import {signGet} from './request'

// 抢拍接口列表
const apis = {
  detail: 'treasure/detail',
}

export const getDetail = (data, params) => signGet(apis.detail, data, params)