<template>
    <div class="addLinkUp">
        <div class="titleList">
            回复
        </div>
        <div class="titleList">
            <template  v-for="(item,index) in list"  style="margin-top:5px;">
                <template v-if="item.fieldGroup == 0">
                    <template>
                        <component :showLabel="false" :dataId="'control'+index" :moduleCode="moduleCode" labelPosition="left" labelWidth="0" :key="index"  rightWidth="646px" ref="control" v-bind:is="'control'+item.controlTypeId" :itemData="item" :controlData.sync="item.controlData"></component>
                    </template>
                </template>
            </template>
        </div>
        <div class="addFeedbackFoot">
            <el-button size="small" type="primary" @click="submits()" :loading="loading1">提交</el-button>
            <div style="float:right;">
                <el-button size="small" v-for="(item, index) in detailOpt" v-if="optCodeCheck(item.optCode)" :key="index" @click="$emit('PopupClick', item)">{{item.optName}}</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import Controls from '@/components/Controls/index.js'
import GroupControls from '@/components/GroupControls/index.js'
export default {
    name: 'addLinkUp',
    props: {
        addEditSet: {
            type: Array,
            default: function () {
                return []
            }
        },
        isContact: {
            type: Boolean,
            default: false
        },
        isAccept: {
            type: Boolean,
            default: false
        },
        optCtId: {
            type: String,
            default: ''
        },
        owners: {
            type: Array,
            default: function () {
                return []
            }
        },
        moduleCode: {
            type: String,
            default: ''
        },
        workId: {
            type: String,
            default: ''
        },
        detailOpt: {
            type: Array,
            default: function () {
                return []
            }
        }
    },
    data() {
        return {
            list: [],
            loading1: false,
            addPeopleFrom: {}
        }
    },
    mounted() {
    },
    created() {
        this.list = this.swidchEditSet(this.addEditSet)
    },
    mounted() {
    },
    computed: {
    },
    methods: {
        optCodeCheck (optCode) {
            return (optCode == 'otTransferWork' && this.isAccept) || optCode == 'otCloseWork'
        },
        submits () {
            let _this = this
            // return false
            _this.list.forEach(function(element) {
                if (element.fieldCategory != 4) {
                    if (element.fieldGroup == 0) {
                        if (element.controlData != '' && element.controlData != []) {
                            _this.addPeopleFrom[element.fieldName] = element.controlData
                        } else if (_this.addPeopleFrom[element.fieldName]) {
                            delete _this.addPeopleFrom[element.fieldName]
                        }
                    } else {
                        element.group.forEach(function(item) {
                            if (item.controlData != '' && item.controlData != []) {
                                _this.addPeopleFrom[item.fieldName] = item.controlData
                            } else if (_this.addPeopleFrom[item.fieldName]) {
                                delete _this.addPeopleFrom[item.fieldName]
                            }
                        })
                    }
                }
            })
            // return false
            _this.addPeopleFrom['moduleCode'] = _this.moduleCode
            _this.addPeopleFrom['strucId'] = '2'
            _this.addPeopleFrom['workId'] = _this.workId
            _this.loading1 = true
            _this.$http.post(_this.Global.baseURL + _this.Global.api.v2.document_generalOperate_add, _this.addPeopleFrom).then((res) => {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    _this.$message.success(_this.msg(res.body))
                    _this.$emit('getDetail')
                    _this.clearEditSet()
                    _this.loading1 = false
                } else {
                    _this.$message.error(_this.msg(res.body))
                    _this.loading1 = false
                }
            }, (res) => {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },
        swidchEditSet(list) {
            let _this = this
             let newLList = []
             let groupFirst = []
            list.forEach((element) => {
                element.controlData = ''
                if (element.editState == '0' || element.editState == '2') {
                    element.disabled = true
                }
                element.fieldValue = element.inDefaultValue
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
                            fieldGroup: element.fieldGroup,
                            cnFieldCaption: _this.returnGroupName(element.fieldGroup),
                            isTop: element.isTop,
                            group: []
                        }
                        newObj.group.push(element)
                        newLList.push(newObj)
                        groupFirst.push(element.fieldGroup)
                    } else { // 如果出现过就找之前创建的对象将自己放入到group数组中
                        newLList.forEach(function(them) {
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
        },
        clearEditSet() {
            this.$refs.control.forEach(item => {
                item.clearData()
            })
            this.list.forEach((elemennt) => {
                if (elemennt.fieldGroup == 0) {
                    elemennt.controlData = ''
                } else {
                    elemennt.group.forEach(function(items) {
                        items.controlData = ''
                    })
                }
            })
            this.addPeopleFrom = {}
        }
    },
    components: Object.assign({}, Controls, GroupControls),
    beforeDestroy: function () {
        this.swidchEditSet = null
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
