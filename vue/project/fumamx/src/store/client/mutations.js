// 所有mutations
// 在mutations中只能是同步的操作，打印个日志什么的
// 在actions文件中使用commit方法触发调用
import * as types from './mutation-types'

const mutations = {
  [types.SET_CUSTOMERINFO] (state, customerInfo) {
    state.customerInfo = customerInfo
  },
  [types.SET_CLIENTCHECK] (state, clientCheck) {
    state.clientCheck = clientCheck
  },
  [types.SET_ROUTPARAMETERS] (state, routParameters) {
    state.routParameters = routParameters
  },
  [types.SET_MODULECONFIG] (state, moduleConfig) {
    state.moduleConfig = moduleConfig
  },
  [types.SET_COUNTRYLIST] (state, countryList) {
    state.countryList = countryList
  },
  [types.SET_ADDEDITSETLIST] (state, addEditSetList) {
    state.addEditSetList = addEditSetList
  },
  [types.SET_MODIFYEDITSETLIST] (state, modifyEditSetList) {
    state.modifyEditSetList = modifyEditSetList
  },
  [types.SET_DETAILCONFIG] (state, detailConfig) {
    state.detailConfig = detailConfig
  },
  [types.SET_BILLPARAMETERLIST] (state, billParameterList) {
    state.billParameterList = billParameterList
  },
  [types.SET_BILLPARAMETER] (state, billParameter) {
    state.billParameter = billParameter
  }
}

export default mutations
