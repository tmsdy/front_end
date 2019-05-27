// 所有mutations
// 在mutations中只能是同步的操作，打印个日志什么的
// 在actions文件中使用commit方法触发调用
import * as types from './mutation-types'

const mutations = {
  [types.SET_PERSONALINFO] (state, personalInfo) {
    if (personalInfo.avatar === '') {
      personalInfo.avatar = '5,01a572250c77'
    }
    state.personalInfo = personalInfo
  },
  [types.SET_COMPANYCONFIGINFO] (state, companyConfigInfo) {
    if (companyConfigInfo.logoUrl === '') {
      companyConfigInfo.logoUrl = '4,f8d9218b2d'
    }
    state.companyConfigInfo = companyConfigInfo
  },
  [types.SET_NAVIGATOR] (state, navigator) {
    state.navigator = navigator
  },
  [types.SET_COMPANY] (state, company) {
    state.company = company
  },
  [types.SET_COMPANYBASICINFO] (state, companyBasicInfo) {
    state.companyBasicInfo = companyBasicInfo
  },
  [types.SET_INDIVIDUALCONFIGINFO] (state, individualConfigInfo) {
    individualConfigInfo.datetimeFormat = individualConfigInfo.dateFormat + ' ' + individualConfigInfo.timeFormat
    state.individualConfigInfo = individualConfigInfo
  },
  [types.SET_SYSBOXVALUE] (state, sysBoxValue) {
    state.sysBoxValue = sysBoxValue
  },
  [types.SET_SYSBOXVALUESHOW] (state, sysBoxValueShow) {
    state.sysBoxValueShow = sysBoxValueShow
  },
  [types.SET_CUSBOXVALUE] (state, cusBoxValue) {
    state.cusBoxValue = cusBoxValue
  },
  [types.SET_FIELDGROUPTYPE] (state, fieldGroupType) {
    state.fieldGroupType = fieldGroupType
  },
  [types.SET_DOMAIN] (state, domain) {
    state.domain = domain
  },
  [types.SET_CONTACTLIST] (state, contactList) {
    state.contactList = contactList
  },
  [types.SET_CONTACTVALUE] (state, contactValue) {
    state.contactValue = contactValue
  },
  [types.SETDEPARTMENTLIST] (state, departmentList) {
    state.departmentList = departmentList
  },
  [types.SET_SOCIALTYPELIST] (state, socialTypeList) {
    state.socialTypeList = socialTypeList
  },
  [types.SET_CONTACTCHECK] (state, contactCheck) {
    state.contactCheck = contactCheck
  },
  [types.SET_SCREENWIDTH] (state, screenWidth) {
    state.screenWidth = screenWidth
  },
  [types.SET_SCREENHEIGHT] (state, screenHeight) {
    state.screenHeight = screenHeight
  },
  [types.SET_FORMKEY] (state, formKey) { // 获取新增表单校验key
    state.formKey = formKey
  }
}
export default mutations
