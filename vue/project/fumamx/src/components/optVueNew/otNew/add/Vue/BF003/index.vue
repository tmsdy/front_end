<template>
    <div class="AddContactsItem">
        <div id="top"></div>
        <template v-for="(item,index) in detailList">
            <template v-if="item.fieldGroup == 0 || item.controlTypeId == 14">
                <component class="component"  :nameId="item.fieldName" :dataId="'AddContactsItem'+index" :optCode="optCode" :moduleCode="moduleCode" ref="control" :key="index" v-bind:is="'control'+item.controlTypeId" :rightWidth="rightWidth" :itemData="item" :controlData.sync="item.controlData" labelPosition="left" labelWidth="78px"></component>
            </template>
            <template v-else>
                <component @isPower="isPower" :nameId="item.fieldName" :optCode="optCode" :moduleCode="moduleCode" class="component" :dataId="'AddContactsItem'+index" ref="control" :key="index" v-bind:is="'group'+item.fieldGroup" :rightWidth="rightWidth" rightWidth1="148px" :itemData="item" :controlData.sync="item.controlData" labelPosition="left" labelWidth="78px"></component>
            </template>
        </template>
    </div>
</template>

<script>
/**
 * 描述：客户联系人，添加
 * 作者：向士健
 * 时间：2017/12/18
 * 动态识别控件组件的时候，当 Group!=0 时，以Group为准 否则以 Controls以准
 */
import { isArray, isObject, isString, isNumber } from '@/libs/utils.js'
import Controls from '@/components/Controls/index.js'
import GroupControls from '@/components/GroupControls/index.js'
export default {
    name: 'AddContactsItem',
    props: {
        // 用于UI列表中,是否显示选客户控件
        isShowCustomer: {
            type: Boolean,
            default: true
        },
        rightWidth: {
            type: String,
            default: '220px'
        },
        rightWidths: {
            type: String,
            default: '70px'
        },
        detailList: {
            type: Array,
            default: function() {
                return []
            }
        },
        moduleCode: {
            type: String,
            default: ''
        },
        optCode: {
            type: String,
            default: 'otNew'
        }
    },
    data() {
        return {
        }
    },
    mounted() {
    },
    methods: {
        isPower() { // 判断是否有权限新增
            this.$emit('isPower')
        },
        show(items) {
            let _this = this
            if (items.custId) {
                let custId = items.custId
                custId = isNumber(custId) ? custId.toString() : custId
                let time = setInterval(function() {
                    if (_this.$refs['control']) {
                        clearInterval(time)
                        _this.$refs['control'].forEach((item) => {
                            if (custId && item.$attrs.nameId == 'custId') {
                                item.updatas(custId, false, items)
                            }
                        })
                    }
                }, 10)
            }
        },
        // 提交验证
        isCheckForm() {
            let isPass = true
            let firstTo = true
            this.$refs['control'].forEach((item) => {
                if (!item.submitForm()) {
                    isPass = false
                    if (firstTo) {
                        firstTo = false
                        if (item.$attrs.dataId != '') {
                            let height = 0
                            if (this.moduleCode == 'BF003') {
                                height = $('.addPeopleMXscroll')[0].offsetTop
                            }
                             $('.addPeopleMXscroll').scrollTop($('[dataId=' + item.$attrs.dataId + ']')[0].offsetTop - height)
                        }
                    }
                }
            })
            return isPass
        },
        // 父组件来调用，获得数据，提交时来调用取数据
        isGetConatctsData() {
            let _this = this
            if (!_this.isCheckForm()) {
                return false
            }
            let NewData = {}
            _this.detailList.forEach(function(item) {
                // 为字段时
                if (item.fieldName && item.controlData !== undefined) {
                    // 值为字符串
                    if (isString(item.controlData) && item.controlData !== '') {
                        NewData[item.fieldName] = item.controlData
                    }
                    // 值为数组，且数组有值时
                    if (isArray(item.controlData) && item.controlData.length > 0 && item.controlData + '' !== '') {
                        NewData[item.fieldName] = item.controlData
                    }
                    // 值为对象
                    if (isObject(item.controlData) && Object.keys(item.controlData).length != 0) {
                        NewData[item.fieldName] = item.controlData
                    }
                } else if (item.group) { // 为组时
                    item.group.forEach(function(item2) {
                        if (item2.controlData !== undefined) {
                            NewData[item2.fieldName] = item2.controlData
                        }
                    })
                }
            })
            NewData['moduleCode'] = _this.moduleCode
            // console.log(" 此数据提交 ");
            // console.log(NewData);
            return NewData
        },
        // 父组件来调用，提交数据
        isSubmit(next, next1) {
            let _this = this
            if (_this.isGetConatctsData() === false) {
                next1()
                return // 返回对象数据时，才提交
            }
            _this.getFormKey((formKey, msg) => {
                if (formKey && formKey != '') {
                    _this.$http.post(_this.Global.baseURL + _this.Global.api.v2.document_generalOperate_add, Object.assign(_this.isGetConatctsData(), {
                        'formKey': formKey
                    })).then((res) => {
                        if (res.body.code.toString() == _this.Global.RES_OK) {
                            next()
                            _this.$message.success(_this.msg(res.body))
                        } else {
                            next1()
                            _this.$message.error(_this.msg(res.body))
                        }
                        _this.updateFormKey()
                    }, (res) => {
                        next1()
                        _this.$message.error(_this.$t(_this.Global.errorTitle))
                    })
                } else {
                    next1()
                    _this.$message.error(msg)
                }
            })
        },
        clearControlsData() {
            this.$refs['control'].forEach((item) => {
                item.clearData() // 所有控件清空数据
            })
        }

    },
    computed: {
    },
    watch: {
    },
    components: Object.assign({}, Controls, GroupControls)
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
