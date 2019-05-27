export const getModleConfig = _getModleConfig
export const swidchEditSet = _swidchEditSet
export const getQuickSearchSet = _getQuickSearchSet
export const getListSet = _getListSet
export const getCountryList = _getCountryList
export const updateSearchSet = _updateSearchSet
export const updateListSet = _updateListSet
export const getAddEditSetList = _getAddEditSetList
export const getDetailConfig = _getDetailConfig
export const getModifyEditSetList = _getModifyEditSetList
export const updateEditSetList = _updateEditSetList
export const getBillParameterList = _getBillParameterList

async function _updateEditSetList(moduleCode, next) {
    let datas1 = {
        moduleCode: moduleCode,
        type: 'addEditSet'
    }
    let datas2 = {
        moduleCode: moduleCode,
        type: 'modifyEditSet'
    }
    this.$http.get(this.Global.baseURL + this.Global.api.v2.fieldShow_get, { params: datas1 }).then((res) => {
        if (res.body.code.toString() == this.Global.RES_OK) {
            let listSetData = res.body.data
            let obj = {
                moduleCode: moduleCode,
                list: listSetData
            }
            let list = []
            this.addEditSetList.forEach((elements, indexs) => {
                if (elements.moduleCode != moduleCode) {
                    list.push(elements)
                }
            })
            list.push(obj)
            this.set_addEditSetList(list)
        } else {
            console.log('新增字段接口异常，模块：' + moduleCode)
        }
    })
    this.$http.get(this.Global.baseURL + this.Global.api.v2.fieldShow_get, { params: datas2 }).then((res) => {
        if (res.body.code.toString() == this.Global.RES_OK) {
            let listSetData = res.body.data
            let obj = {
                moduleCode: moduleCode,
                list: listSetData
            }
            let list = []
            this.modifyEditSetList.forEach((elements, indexs) => {
                if (elements.moduleCode != moduleCode) {
                    list.push(elements)
                }
            })
            list.push(obj)
            this.set_modifyEditSetList(list)
        } else {
            console.log('编辑字段接口异常，模块：' + moduleCode)
        }
    })
}

async function _getModleConfig(data, next, error) {
    if (this.moduleConfig) {
        let { moduleCode, viewLayout, viewType } = data
        let isHave = false
        this.moduleConfig.forEach(element => {
            if (moduleCode == element.moduleCode && viewType == element.viewType && viewLayout == element.viewLayout) {
                isHave = true
                if (next) {
                    next(element)
                }
            }
        })
        if (!isHave) {
            let moduleStruct = {
                moduleCode: moduleCode,
                viewLayout: viewLayout,
                viewType: viewType
            }
            let searchSet = {
                moduleCode: moduleCode,
                type: 'searchSet'
            }
            let quickSearchSet = {
                moduleCode: moduleCode,
                type: 'quickSearchSet'
            }
            let listSet = {
                moduleCode: moduleCode,
                type: 'listSet'
            }
            let sortSet = {
                moduleCode: moduleCode,
                type: 'sortSet'
            }
            if (viewType == 'seas') {
                searchSet.isSea = true
                quickSearchSet.isSea = true
                listSet.isSea = true
                sortSet.isSea = true
            }
            let allArgument = {
                moduleStruct: moduleStruct,
                searchSet: searchSet,
                listSet: listSet,
                sortSet: sortSet,
                quickSearchSet: quickSearchSet
            }
            let res = await this.$http.get(this.Global.baseURL + this.Global.api.Client.list.getListConfig, { params: allArgument })
            if (res.body.code.toString() == this.Global.RES_OK) {
                if (res.body.data.res_searchSet.code != this.Global.RES_OK) {
                    this.$message.error(this.msg(res.body.data.res_searchSet))
                    error()
                    return
                }
                if (res.body.data.res_moduleStruct.code != this.Global.RES_OK) {
                    this.$message.error(this.msg(res.body.data.res_moduleStruct))
                    error()
                    return
                }
                if (res.body.data.res_quickSearchSet.code != this.Global.RES_OK) {
                    this.$message.error(this.msg(res.body.data.res_quickSearchSet))
                    error()
                    return
                }
                if (res.body.data.res_moduleOptSet.code != this.Global.RES_OK) {
                    this.$message.error(this.msg(res.body.data.res_moduleOptSet))
                    error()
                    return
                }
                if (res.body.data.res_listSet.code != this.Global.RES_OK) {
                    this.$message.error(this.msg(res.body.data.res_listSet))
                    error()
                    return
                }
                if (res.body.data.res_sortSet.code != this.Global.RES_OK) {
                    this.$message.error(this.msg(res.body.data.res_sortSet))
                    error()
                    return
                }
                let list = []
                this.moduleConfig.forEach(element => {
                    list.push(element)
                })
                let searchSetData = this.swidchEditSet(res.body.data.res_searchSet.data || [])
                let obj = {
                    moduleCode: moduleCode,
                    viewLayout: viewLayout,
                    viewType: viewType,
                    moduleStruct: res.body.data.res_moduleStruct.data || {},
                    quickSearchSet: this.getQuickSearchSet(res.body.data.res_quickSearchSet.data) || [],
                    searchSet: searchSetData,
                    moduleOptSet: res.body.data.res_moduleOptSet.data || [],
                    searchSetRow: searchSetData,
                    listSet: this.getListSet(res.body.data.res_listSet.data || []),
                    sortSet: res.body.data.res_sortSet.data || []
                }
                list.push(obj)
                if (next) {
                    next(obj)
                }
                this.set_moduleConfig(list)
            } else {
                error(res.body.msg)
            }
        }
    }
}
async function _getDetailConfig(data, next, error) {
    if (this.detailConfig) {
        let { moduleCode, viewLayout, viewType } = data
        let isHave = false
        this.detailConfig.forEach(element => {
            if (moduleCode == element.moduleCode && viewType == element.viewType && viewLayout == element.viewLayout) {
                isHave = true
                if (next) {
                    next(element)
                }
            }
        })
        if (!isHave) {
            let moduleStruct = {
                moduleCode: moduleCode,
                viewLayout: viewLayout,
                viewType: viewType
            }
            let viewSet = {
                moduleCode: moduleCode,
                type: 'viewSet'
            }
            let summarySet = {
                moduleCode: moduleCode,
                type: 'summarySet'
            }
            if (viewType == 'seas') {
                viewSet.isSea = true
                summarySet.isSea = true
            }
            let allArgument = {
                moduleStruct: moduleStruct,
                viewSet: viewSet,
                summarySet: summarySet
            }
            let res = await this.$http.get(this.Global.baseURL + this.Global.api.Client.list.getDetailConfig, { params: allArgument })
            if (res.body.code.toString() == this.Global.RES_OK) {
                if (res.body.data.res_moduleStruct.code != this.Global.RES_OK) {
                    this.$message.error(this.msg(res.body.data.res_moduleStruct))
                    error()
                    return
                }
                if (res.body.data.res_moduleOptSet.code != this.Global.RES_OK) {
                    this.$message.error(this.msg(res.body.data.res_moduleOptSet))
                    error()
                    return
                }
                if (res.body.data.res_viewSet.code != this.Global.RES_OK) {
                    this.$message.error(this.msg(res.body.data.res_viewSet))
                    error()
                    return
                }
                if (res.body.data.res_summarySet.code != this.Global.RES_OK) {
                    this.$message.error(this.msg(res.body.data.res_summarySet))
                    error()
                    return
                }
                let list = []
                this.detailConfig.forEach(element => {
                    list.push(element)
                })
                let obj = {
                    moduleCode: moduleCode,
                    viewLayout: viewLayout,
                    viewType: viewType,
                    moduleStruct: res.body.data.res_moduleStruct.data || {},
                    moduleOptSet: res.body.data.res_moduleOptSet.data || [],
                    viewSet: res.body.data.res_viewSet.data || [],
                    summarySet: res.body.data.res_summarySet.data || []
                }
                list.push(obj)
                if (next) {
                    next(obj)
                }
                this.set_detailConfig(list)
            } else {
                error(res.body.msg)
            }
        }
    }
}

async function _getAddEditSetList(moduleCode, next) {
    if (this.addEditSetList) {
        let isHave = false
        this.addEditSetList.forEach(element => {
            if (moduleCode == element.moduleCode) {
                isHave = true
                if (next) {
                    next(element)
                }
            }
        })
        if (!isHave) {
            let datas = {
                moduleCode: moduleCode,
                type: 'addEditSet'
            }
            this.$http.get(this.Global.baseURL + this.Global.api.v2.fieldShow_get, { params: datas }).then((res) => {
                if (res.body.code.toString() == this.Global.RES_OK) {
                    let listSetData = res.body.data
                    let obj = {
                        moduleCode: moduleCode,
                        list: listSetData
                    }
                    next(obj)
                    let list = []
                    this.addEditSetList.forEach((elements, indexs) => {
                        if (elements.moduleCode != moduleCode) {
                            list.push(elements)
                        }
                    })
                    list.push(obj)
                    this.set_addEditSetList(list)
                } else {
                    this.$message.error(this.msg(res.body))
                }
            }, (res) => {
                this.$message.error(this.$t(this.Global.errorTitle))
            })
        }
    }
}
async function _getModifyEditSetList(moduleCode, next) {
    if (this.modifyEditSetList) {
        let isHave = false
        this.modifyEditSetList.forEach(element => {
            if (moduleCode == element.moduleCode) {
                isHave = true
                if (next) {
                    next(element)
                }
            }
        })
        if (!isHave) {
            let datas = {
                moduleCode: moduleCode,
                type: 'modifyEditSet'
            }
            this.$http.get(this.Global.baseURL + this.Global.api.v2.fieldShow_get, { params: datas }).then((res) => {
                if (res.body.code.toString() == this.Global.RES_OK) {
                    let listSetData = res.body.data
                    let obj = {
                        moduleCode: moduleCode,
                        list: listSetData
                    }
                    next(obj)
                    let list = []
                    this.modifyEditSetList.forEach((elements, indexs) => {
                        if (elements.moduleCode != moduleCode) {
                            list.push(elements)
                        }
                    })
                    list.push(obj)
                    this.set_modifyEditSetList(list)
                } else {
                    this.$message.error(this.msg(res.body))
                }
            }, (res) => {
                this.$message.error(this.$t(this.Global.errorTitle))
            })
        }
    }
}

async function _updateSearchSet(data, next) {
    if (this.moduleConfig) {
        let { moduleCode, viewLayout, viewType } = data
        let datas = {
            moduleCode: moduleCode,
            type: 'searchSet'
        }
        if (viewType == 'seas') {
            datas.isSea = true
        }
        this.$http.get(this.Global.baseURL + this.Global.api.v2.fieldShow_get, { params: datas }).then((res) => {
            if (res.body.code.toString() == this.Global.RES_OK) {
                let searchSetData = this.swidchEditSet(res.body.data)
                next(searchSetData)
                this.moduleConfig.forEach((element, index) => {
                    if (moduleCode == element.moduleCode && viewType == element.viewType && viewLayout == element.viewLayout) {
                        let list = []
                        let obj = {
                            moduleCode: moduleCode,
                            viewLayout: viewLayout,
                            viewType: viewType,
                            moduleStruct: element.moduleStruct,
                            quickSearchSet: element.quickSearchSet,
                            searchSet: searchSetData,
                            moduleOptSet: element.moduleOptSet,
                            searchSetRow: searchSetData,
                            listSet: element.listSet,
                            sortSet: element.sortSet
                        }
                        this.moduleConfig.forEach((elements, indexs) => {
                            if (index == indexs) {
                                list.push(obj)
                            } else {
                                list.push(elements)
                            }
                        })
                        this.set_moduleConfig(list)
                    }
                })
            } else {
                this.$message.error(_this.msg(res.body))
            }
        }, (res) => {
            this.$message.error(this.$t(this.Global.errorTitle))
        })
    }
}
async function _updateListSet(data, next) {
    if (this.moduleConfig) {
        let { moduleCode, viewLayout, viewType } = data
        let datas = {
            moduleCode: moduleCode,
            type: 'listSet'
        }
        if (viewType == 'seas') {
            datas.isSea = true
        }
        this.$http.get(this.Global.baseURL + this.Global.api.v2.fieldShow_get, { params: datas }).then((res) => {
            if (res.body.code.toString() == this.Global.RES_OK) {
                let listSetData = this.getListSet(res.body.data)
                next(listSetData)
                this.moduleConfig.forEach((element, index) => {
                    if (moduleCode == element.moduleCode && viewType == element.viewType && viewLayout == element.viewLayout) {
                        let list = []
                        let obj = {
                            moduleCode: moduleCode,
                            viewLayout: viewLayout,
                            viewType: viewType,
                            moduleStruct: element.moduleStruct,
                            quickSearchSet: element.quickSearchSet,
                            searchSet: element.searchSet,
                            moduleOptSet: element.moduleOptSet,
                            searchSetRow: element.searchSetRow,
                            listSet: listSetData,
                            sortSet: element.sortSet
                        }
                        this.moduleConfig.forEach((elements, indexs) => {
                            if (index == indexs) {
                                list.push(obj)
                            } else {
                                list.push(elements)
                            }
                        })
                        this.set_moduleConfig(list)
                    }
                })
            } else {
                this.$message.error(_this.msg(res.body))
            }
        }, (res) => {
            this.$message.error(this.$t(this.Global.errorTitle))
        })
    }
}
async function _getCountryList(next) {
    if (this.countryList) {
        if (this.countryList.length == 0) {
            this.$http.get(this.Global.baseURL + this.Global.api.SystemSet.enterpriseset.areaInf, { params: { id: 1, type: 'country' } }).then((res) => {
                if (res.body.code.toString() === this.Global.RES_OK) {
                    next(res.body.data)
                    this.set_countryList(res.body.data)
                }
            })
        } else {
            next(this.countryList)
        }
    }
}

function _getListSet (list) {
    let allColumnWidth = 0
    list.forEach(function(item) {
        if (item.controlTypeId == 2) {
            item.code = -1
        }
        allColumnWidth += parseInt(item.columnWidth)
    })
    return {
        listSet: list,
        listSetAllow: list,
        allColumnWidth: allColumnWidth
    }
}
function _getQuickSearchSet(data) {
    let quickSearchSet = data
    if (quickSearchSet.length == 0) {
        return ''
    }
    //  输入
    let tip = this.$t('mxpcweb.client.1529042502503')
    quickSearchSet.forEach((item, index) => {
        if (index == 0) {
            tip += item.cnFieldCaption
        } else {
            tip += '、' + item.cnFieldCaption
        }
    })
    //  等
    tip += this.$t('mxpcweb.client.1529042531686')
    return tip
}
function _swidchEditSet(list) { // 编辑字段数据转化
    let _this = this
    let newLList = []
    let groupFirst = []
    list.forEach((element) => {
        element.controlData = ''
        element.check = ''
        element.inDefaultValue = ''
        element.checkbox = (element.fieldCategory == 2)// 是否启用
        if (element.fieldGroup !== 0) { // 判断是否是一个组
            let isHave = false
            let thisGroup = ''
            groupFirst.forEach((item) => { // 判断这个组是否出现过，出现则在groupFirst里做个标记
                if (item == element.fieldGroup) {
                    isHave = true
                    thisGroup = item // 记住这个组id
                }
            })
            if (!isHave) { // 如果没有出现过新建一个对象放入newList里面
                let newObj = {
                    fieldId: element.fieldId,
                    fieldGroup: element.fieldGroup,
                    cnFieldCaption: _this.returnGroupName(element.fieldGroup),
                    isTop: element.isTop,
                    group: []
                }
                newObj.group.push(element)
                newLList.push(newObj)
                groupFirst.push(element.fieldGroup)
            } else { // 如果出现过就找之前创建的对象将自己放入到group数组中
                newLList.forEach((them) => {
                    if (them.fieldGroup == thisGroup) {
                        them.group.push(element)
                    }
                })
            }
        } else {
            newLList.push(element)
        }
    })
    return newLList
}

async function _getBillParameterList(moduleCode, next, upData) {
    if (this.billParameterList) {
        let isHave = false
        if (!upData) {
            this.billParameterList.forEach(element => {
                if (moduleCode == element.moduleCode) {
                    isHave = true
                    if (next) {
                        next(element)
                    }
                }
            })
        }
        if (!isHave) {
            this.$http.get(this.Global.baseURL + this.Global.api.v2.document_searchListFilter_list, { params: {
                moduleCode: moduleCode,
                strucId: '1',
                type: 'json'
            } }).then((res) => {
                if (res.body.code.toString() === this.Global.RES_OK) {
                    let obj = {
                        moduleCode: moduleCode,
                        list: res.body.data.list || []
                    }
                    next(obj)
                    let list = []
                    this.billParameterList.forEach((elements) => {
                        if (elements.moduleCode != moduleCode) {
                            list.push(elements)
                        }
                    })
                    list.push(obj)
                    this.set_billParameterList(list)
                }
            })
        }
    }
}
