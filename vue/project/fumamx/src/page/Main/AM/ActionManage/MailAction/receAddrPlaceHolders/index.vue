<template>
    <div>
        <div class="block">
            <div class="blockList" v-for="(item, index) in receAddrPlaceHolders1" :key="index">
                {{item.name}}
                <span class="del text-hover" @click="delReceAddrPlaceHolders1(index)">
                    <i class="iconfont icon-close-bold"></i>
                </span>
            </div>
            <template v-if="isShow">
                <el-popover placement="bottom" width="260" trigger="click">
                    <div style="min-height:200px;text-align:center">
                        <el-cascader :options="associatedModulesList" v-model="list" @change="receAddrPlaceHoldersChange" @active-item-change="handleItemChange" style="width: 240px;">
                        </el-cascader>
                    </div>
                    <!-- 收件人 -->
                    <span class="addPeople text-hover" slot="reference">+ {{$t('mxpcweb.am.1543299755132')}}</span>
                </el-popover>
            </template>
            <template v-else>
                <!-- 收件人 -->
                <span class="addPeople text-hover" @click="msgClick()">+ {{$t('mxpcweb.am.1543299755132')}}</span>
            </template>
        </div>
    </div>
</template>

<script>
import { isArray } from '@/libs/utils.js'
export default {
    name: 'addWork',
    props: {
    },
    data() {
        return {
            associatedModulesList: [],
            receAddrPlaceHolders1: [],
            list: [],
            props: {
                value: 'label',
                children: 'children'
            },
            isShow: false
            // receAddrPlaceHoldersList: [{
            //     value: 'BF003',
            //     label: '联系人',
            //     children: [{
            //         value: 'mailAddress',
            //         label: '邮箱',
            //         children: [{
            //             value: '1',
            //             label: '联系人主邮箱'
            //         }, {
            //             value: '2',
            //             label: '联系人备用邮箱'
            //         }]
            //     }]
            // }]
        }
    },
    mounted() {
    },
    created() {
    },
    methods: {
        msgClick() {
            // 暂无可选值
            this.$message(this.$t('mxpcweb.am.1543300222378'))
        },
        updata(list1, list2) {
            if (list1 && list2 && list1.length != 0 && list2.length != 0) {
                let list = []
                list1.forEach((item, index) => {
                    list.push({
                        value: item,
                        name: list2[index]
                    })
                })
                this.receAddrPlaceHolders1 = list
                this.updateData()
            }
        },
        updateData() {
            let list = []
            this.receAddrPlaceHolders1.forEach(item => {
                list.push(item.value)
            })
            this.$emit('update:receAddrPlaceHolders', list)
        },
        receAddrPlaceHoldersChange(val) {
            if (val && val.length != '0') {
                let name = []
                let value = []
                val.forEach(item => {
                    name.push(this.returnReceAddrName(item, this.associatedModulesList, 'label'))
                    value.push(this.returnReceAddrName(item, this.associatedModulesList, 'key'))
                })
                let isHave = false
                let key = value.length > 0 ? value[value.length - 1] : ''
                this.receAddrPlaceHolders1.forEach(item => {
                    if (item.value == key) {
                        isHave = true
                    }
                })
                if (!isHave) {
                    this.receAddrPlaceHolders1.push({ name: name.join('.'), value: key })
                    this.updateData()
                    this.receAddrPlaceHolders = []
                    this.isShow = false
                    this.list = []
                    let _this = this
                    setTimeout(function () {
                        _this.isShow = true
                    }, 100)
                }
            }
        },
        returnReceAddrName(val, list, fieldName) {
            let name = ''
            list.forEach(item => {
                if (item.value == val) {
                    name = item[fieldName]
                    return false
                } else if (item.children) {
                    let names = this.returnReceAddrName(val, item.children, fieldName)
                    if (names != '') {
                        name = names
                        return false
                    }
                }
            })
            return name
        },
        delReceAddrPlaceHolders1(index) {
            this.receAddrPlaceHolders1.splice(index, 1)
            this.updateData()
        },
        async handleItemChange(val) {
            let _this = this
            if (val.length === 1) {
                let items = {}
                _this.associatedModulesList.forEach(item => {
                    if (item.moduleCode = val[0]) {
                        items = item
                    }
                })
                let list = await _this.returnField(items.moduleCode)
                if (list.length == 0) {
                    delete items.children
                } else {
                    items.children = list
                }
            } else if (val.length === 2) {
                let items = {}
                _this.associatedModulesList.forEach(item => {
                    if (item.moduleCode = val[0]) {
                        item.children.forEach(element => {
                            if (element.value = val[1]) {
                                items = element
                            }
                        })
                    }
                })
                let list = await _this.return3(val[0], items.value)
                if (list.length == 0) {
                    delete items.children
                } else {
                    items.children = list
                }
            }
        },
        async return3(moduleCode, fieldName) {
            if (moduleCode == '') {
                return []
            }
            let _this = this
            let module_fieldsList = []
            let res = await _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.autoStrategy_controlTypeV2, {
                params: {
                    valueFlag: 0,
                    placeHolderFlag: 1,
                    dataType: 'module_field_extField',
                    moduleCode: moduleCode,
                    fieldName: fieldName,
                    actionId: '1'
                }
            })
            if (res.body.code.toString() === _this.Global.RES_OK) {
                if (isArray(res.body.data.list)) {
                    res.body.data.list.forEach(element => {
                        let obj = {
                            label: element.showName,
                            value: element.showName_ph,
                            key: element.fieldName_ph
                        }
                        module_fieldsList.push(obj)
                    })
                } else {
                    module_fieldsList = []
                }
            } else {
                module_fieldsList = []
                _this.$message.error(_this.msg(res.body))
            }
            return module_fieldsList
        },
        async returnField(moduleCode) {
            if (moduleCode == '') {
                return []
            }
            let _this = this
            let module_fieldsList = []
            let res = await _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.autoStrategy_controlTypeV2, {
                params: {
                    valueFlag: 0,
                    placeHolderFlag: 1,
                    dataType: 'module_fields',
                    moduleCode: moduleCode,
                    actionId: '1'
                }
            })
            if (res.body.code.toString() === _this.Global.RES_OK) {
                if (isArray(res.body.data.list)) {
                    res.body.data.list.forEach(element => {
                        let obj = {
                            children: [],
                            label: element.showName,
                            value: element.fieldName,
                            key: element.fieldName_ph
                        }
                        module_fieldsList.push(obj)
                    })
                } else {
                    module_fieldsList = []
                }
            } else {
                module_fieldsList = []
                _this.$message.error(_this.msg(res.body))
            }
            return module_fieldsList
        },
        moduleCodeChange(item) {
            this.receAddrPlaceHolders1 = []
            this.updateData()
            if (!item || item.moduleCode == '') {
                return false
            }
            if (!item.allowPlaceHolder) {
                return false
            }
            let _this = this
            _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.autoStrategy_controlTypeV2, {
                params: {
                    valueFlag: 0,
                    placeHolderFlag: 1,
                    dataType: 'associatedModules',
                    moduleCode: item.moduleCode,
                    actionId: '1'
                }
            }).then((res) => {
                if (res.body.code.toString() === _this.Global.RES_OK) {
                    if (isArray(res.body.data.list) && res.body.data.list.length > 0) {
                        let associatedModulesList = []
                        res.body.data.list.forEach(element => {
                            let obj = {
                                children: [],
                                label: element.showName,
                                value: element.moduleCode,
                                key: element.moduleCode_ph
                            }
                            associatedModulesList.push(obj)
                        })
                        _this.associatedModulesList = associatedModulesList
                        _this.isShow = true
                    } else {
                        _this.associatedModulesList = []
                    }
                } else {
                    _this.associatedModulesList = []
                    _this.$message.error(_this.msg(res.body))
                }
            }, function (res) {
                _this.associatedModulesList = []
                _this.$message.error(this.$t(this.Global.errorTitle))
            })
        }
    },
    components: {
    }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
