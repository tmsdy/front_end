// 所有mutations
// 在mutations中只能是同步的操作，打印个日志什么的
// 在actions文件中使用commit方法触发调用
import * as types from './mutation-types'

const mutations = {
  [types.SET_CURRENCY] (state, currency) {
    state.currency = currency
  },
  [types.SET_CURRENCYSHOW] (state, currencyShow) {
    state.currencyShow = currencyShow
  },
  [types.SET_UNITLIST] (state, unitList) {
    state.unitList = unitList
  },
  [types.SET_UNITLISTSHOW] (state, unitListShow) {
    state.unitListShow = unitListShow
  },
  [types.SET_PORTLISTSHOW] (state, portListShow) {
    state.portListShow = portListShow
  },
  [types.SET_PORTLIST] (state, portList) {
    state.portList = portList
  }
}
export default mutations
