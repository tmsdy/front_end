// 异步操作，异步修改
import * as types from './mutation-types'

// 获取个人信息
export const setPersonalInfo = function ({ commit, state }, option = {}) {
  let _V = this._vm
  _V.$http.get(_V.Global.baseURL + _V.Global.api.UniversalInterface.accountQuery, { params: {} }).then(function (res) {
    if (res.body.code.toString() === _V.Global.RES_OK) {
      commit(types.SET_PERSONALINFO, res.body.data)
    } else {
      console.warn('setPersonalInfo error!')
    }
  })
}

// 设置企业基础信息
export const setCompanyBasicInfo = function ({ commit, state }, option = {}) {
  let _V = this._vm
  _V.$http.get(_V.Global.baseURL + _V.Global.api.v2.company_query, { params: {} }).then(function (res) {
    if (res.body.code.toString() === _V.Global.RES_OK) {
      commit(types.SET_COMPANYBASICINFO, res.body.data)
    } else {
      console.warn('setPersonalInfo error!')
    }
  })
}

// 设置企业配置信息
export const setCompanyConfigInfo = function ({ commit, state }, option = {}) {
  let _V = this._vm
  _V.$http.get(_V.Global.baseURL + _V.Global.api.UniversalInterface.companysettingGet, { params: {} }).then(function (res) {
    if (res.body.code.toString() === _V.Global.RES_OK) {
      commit(types.SET_COMPANYCONFIGINFO, res.body.data)
    } else {
      console.warn('setCompanyConfigInfo error!')
    }
  })
}

// 设置系统导航
export const setNavigator = function ({ commit, state }, option = {}) {
  let _V = this._vm
  _V.$http.get(_V.Global.baseURL + _V.Global.api.v2.navigator_get, { params: {} }).then(function (res) {
    if (res.body.code.toString() === _V.Global.RES_OK) {
      let navigator = res.body.data || {}
      commit(types.SET_NAVIGATOR, navigator)
    } else {
      console.warn('setNavigator error!')
    }
  })
}

// 设置个人配置信息
export const setIndividualConfigInfo = function ({ commit, state }, option = {}) {
  let _V = this._vm
  _V.$http.get(_V.Global.baseURL + _V.Global.api.UniversalInterface.personalsettingGet, { params: {} }).then(function (res) {
    if (res.body.code.toString() === _V.Global.RES_OK) {
      commit(types.SET_INDIVIDUALCONFIGINFO, res.body.data)
    } else {
      console.warn('setIndividualConfigInfo error!')
    }
  })
}

// 获取系统动态组件下拉框值
export const setSysBoxValue = function ({ commit, state }) {
  let _V = this._vm
  _V.$http.get(_V.Global.baseURL + _V.Global.api.v2.sysBoxValue_get, { params: {} }).then(function (res) {
    if (res.body.code.toString() === _V.Global.RES_OK) {
      commit(types.SET_SYSBOXVALUE, res.body.data)
      let listShow = {}
      res.body.data.forEach(element => {
        let obj = {
          dictCode: element.dictCode,
          alias: element.inUse,
          dictName: element.dictName,
          moduleCode: element.moduleCode,
          sortOrder: element.sortOrder,
          id: element.id
        }
        let dictItem = {}
        element.dictItems.forEach(item => {
          dictItem[item.dictItemCode] = item
        })
        obj.dictItem = dictItem
        listShow[element.dictCode] = obj
      })
      commit(types.SET_SYSBOXVALUESHOW, listShow)
    } else {
      console.warn('setIndividualConfigInfo error!')
    }
  })
}

// 获取系统动态组件自定义下拉框值
export const setCusBoxValue = function ({ commit, state }) {
  let _V = this._vm
  _V.$http.get(_V.Global.baseURL + _V.Global.api.v2.bizField_query, { params: {
    type: 'spinnerValues'
  } }).then(function (res) {
    if (res.body.code.toString() === _V.Global.RES_OK) {
      commit(types.SET_CUSBOXVALUE, res.body.data)
    } else {
      console.warn('setIndividualConfigInfo error!')
    }
  })
}

// 获取组类型
export const setFieldGroupType = function ({ commit, state }) {
  let _V = this._vm
  _V.$http.get(_V.Global.baseURL + _V.Global.api.v2.dictionary + 'fieldgrouptype', { params: {} }).then(function (res) {
    if (res.body.code.toString() === _V.Global.RES_OK && Array.isArray(res.body.data)) {
      commit(types.SET_FIELDGROUPTYPE, res.body.data)
    } else {
      console.warn('setFieldGroupType error!')
    }
  })
}

// 获取系统后端域名前缀
export const setDomain = function ({ commit, state }) {
  let _V = this._vm
  _V.$http.get(_V.Global.baseURL + _V.Global.api.UniversalInterface.domain, { params: {} }).then(function (res) {
    if (res.body.code.toString() === _V.Global.RES_OK) {
      commit(types.SET_DOMAIN, res.body.data)
    } else {
      console.warn('setFieldGroupType error!')
    }
  })
}

// 获取公司全部人员下拉框值
export const setContactList = function ({ commit, state }) {
  let _V = this._vm
  _V.$http.get(_V.Global.baseURL + _V.Global.api.v2.accountDropList_get, { params: {
    dataType: 'contact',
    funType: 'all'
  } }).then(function (res) {
    if (res.body.code.toString() === _V.Global.RES_OK) {
      let list = res.body.data || []
      let obj = {}
      res.body.data.forEach(element => {
        obj[element.ctId] = element.realName
      })
      commit(types.SET_CONTACTVALUE, list)
      commit(types.SET_CONTACTLIST, obj)
    } else {
      console.warn('setContactList error!')
    }
  })
}

// 获取公司全部部门下拉框值
export const setDepartmentList = function ({ commit, state }) {
  let _V = this._vm
  _V.$http.get(_V.Global.baseURL + _V.Global.api.v2.accountDropList_get, { params: {
    dataType: 'department',
    funType: 'all',
    deptCascade: false
  } }).then(function (res) {
    if (res.body.code.toString() === _V.Global.RES_OK) {
      let obj = {}
      res.body.data.forEach(element => {
        obj[element.dkey] = element.deptName
      })
      commit(types.SETDEPARTMENTLIST, obj)
    } else {
      console.warn('setDepartmentList error!')
    }
  })
}

// 社交类型下拉
export const setSocialTypeList = function ({ commit, state }) {
  let _V = this._vm
  _V.$http.get(_V.Global.baseURL + _V.Global.api.v2.socialType_get, { params: {} }).then(function (res) {
    if (res.body.code.toString() === _V.Global.RES_OK) {
      commit(types.SET_SOCIALTYPELIST, res.body.data)
    } else {
      console.warn('setSocialTypeList error!')
    }
  })
}

export const setContactCheck = function ({ commit, state }) { // 判断是否时管理员权限，客户筛选使用
  let _V = this._vm
  _V.$http.get(_V.Global.baseURL + _V.Global.api.v2.contact_do, {
      params: {
          type: 'isAdmin'
      }
  }).then(function(res) {
      if (res.body.code.toString() == _V.Global.RES_OK) {
        commit(types.SET_CONTACTCHECK, res.body.data)
      } else {
        console.warn('setContactCheck error!')
      }
  })
}

export const setScreenWidth = function ({ commit, state }) { // 判断是否时管理员权限，客户筛选使用
  commit(types.SET_SCREENWIDTH, document.documentElement.clientWidth)
}

export const setScreenHeight = function ({ commit, state }) { // 判断是否时管理员权限，客户筛选使用
  commit(types.SET_SCREENHEIGHT, document.documentElement.clientHeight)
}
