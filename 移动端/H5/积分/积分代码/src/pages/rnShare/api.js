import {signPost} from './request'

// 抢拍接口列表
const apis = {
  excute: 'task/execute',
}

export const getQiPuData = (data, params) => signPost(apis.excute, data, params)