// 所有mutations
// 在mutations中只能是同步的操作，打印个日志什么的
// 在actions文件中使用commit方法触发调用
import * as types from './mutation-types'

const mutations = {
  [types.SET_CUSTOMERINFO] (state, customerInfo) {
    state.customerInfo = customerInfo
  },
  [types.SET_ROUTPARAMETERS] (state, routParameters) {
    state.routParameters = routParameters
  },
  [types.SET_PARAMERSDATA] (state, parametersData) {
    state.parametersData = parametersData
  }
}
export default mutations
