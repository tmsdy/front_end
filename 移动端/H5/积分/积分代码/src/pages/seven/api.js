import {signGet} from './request'

// 抢拍接口列表
const apis = {
  taskComplete: 'task/complete',
  add_score: 'score/add', 
  task_list: 'task/list',
}

export const taskComplete = (data, params) => signGet(apis.taskComplete, data, params)
export const addScore = (data, params) => signGet(apis.add_score, data, params)
export const taskList = (data, params) => signGet(apis.task_list, data, params)