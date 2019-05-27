// 异步操作，异步修改
import * as types from './mutation-types'
export const set_currency = function ({ commit, state }) {
    let _V = this._vm
    _V.$http.get(_V.Global.baseURL + _V.Global.api.v2.dictionary + 'currency').then((res) => {
        if (res.body.code.toString() === _V.Global.RES_OK) {
            let list = res.body.data || []
            commit(types.SET_CURRENCY, list)
            let obj = {}
            list.forEach(item => {
                obj[item.currencyCode] = JSON.parse(JSON.stringify(item))
            })
            commit(types.SET_CURRENCYSHOW, obj)
        }
    })
}
export const set_unitList = function ({ commit, state }) {
    let _V = this._vm
    _V.$http.get(_V.Global.baseURL + _V.Global.api.v2.dictionary + 'unit').then((res) => {
        if (res.body.code.toString() === _V.Global.RES_OK) {
            commit(types.SET_UNITLIST, res.body.data)
            let obj = {}
            res.body.data.forEach(item => {
                obj[item.unitId] = {
                    name: item.name
                }
            })
            commit(types.SET_UNITLISTSHOW, obj)
        }
    })
}
export const set_portList = function ({ commit, state }) {
    let _V = this._vm
    _V.$http.get(_V.Global.baseURL + _V.Global.api.v2.dictionary + 'port').then(res => {
        if (res.body.code.toString() == _V.Global.RES_OK) {
            commit(types.SET_PORTLIST, res.body.data)
            let obj = {}
            res.body.data.forEach(item => {
                obj[item.portId] = {
                    name: item.name
                }
            })
            commit(types.SET_PORTLISTSHOW, obj)
        }
    })
}
