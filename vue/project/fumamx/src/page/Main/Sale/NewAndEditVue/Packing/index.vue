<template>
    <div class="BaseMsg">
        <!-- 包装信息 -->
        <p class="contactTitle">{{$t('mxpcweb.sale.components.1557565475756')}}</p>
        <div class="listBox">
            <template v-if="editSet.length!=0">
                <template v-for="(item,index) in editSet">
                    <div v-if="item.fieldCategory != 4" :key="index" :class="[item.controlTypeId == 4||item.fieldGroup==1||item.controlTypeId == 15||item.controlTypeId == 46 ? 'listBox1' : 'listBox2']">
                        <el-row v-if="item.fieldGroup == 0">
                            <el-col :span="24">
                                <div v-if="item.controlTypeId == 4||item.controlTypeId == 15||item.controlTypeId == 46" style="margin-left:16px;">
                                    <component size="mini" :nameId="item.fieldName" :optCode="optCode" :moduleCode="moduleCode" :dataId="'control'+index" @relyOn="relyOn" class="component" labelWidth="86px" v-bind:is="'control'+item.controlTypeId" @closeWindow="closeWindow" :checkRepeat="true" ref="control" :itemData="item" rightWidth="620px"  :controlData.sync="item.controlData" labelPosition="left" @returnFieldList="returnFieldList"></component>
                                </div>
                                <component size="mini" @custChange="custChange" @CurrencyChange="CurrencyChange" v-else :nameId="item.fieldName" :optCode="optCode" :moduleCode="moduleCode" :dataId="'control'+index"  @relyOn="relyOn" style="margin-left:16px;" labelWidth="86px" class="component" v-bind:is="'control'+item.controlTypeId" @closeWindow="closeWindow" :checkRepeat="true" ref="control" :itemData="item" rightWidth="187px"  :controlData.sync="item.controlData" labelPosition="left" @returnFieldList="returnFieldList"></component>
                            </el-col>
                        </el-row>
                        <el-row v-else>
                            <component size="mini" :nameId="item.fieldName" @relyOn="relyOn" @returnFieldList="returnFieldList" :optCode="optCode" :moduleCode="moduleCode" :dataId="'control'+index" v-if="item.fieldGroup==1" labelWidth="86px" style="margin-left:16px;" class="component" v-bind:is="'group'+item.fieldGroup"  ref="control" :itemData="item"  rightWidth="620px" rightWidth1="152px" labelPosition="left"></component>
                            <component size="mini"  :optCode="optCode" @returnFieldList="returnFieldList" :moduleCode="moduleCode" :nameId="item.fieldName" @relyOn="relyOn" :dataId="'control'+index" v-else class="component" labelWidth="86px" style="margin-left:16px;" v-bind:is="'group'+item.fieldGroup"  ref="control" :itemData="item"   rightWidth="315px" rightWidth1="92px" labelPosition="left"></component>
                        </el-row>
                    </div>
                </template>
            </template>
        </div>
    </div>
</template>

<script>
import Controls from '@/components/Controls/index.js'
import GroupControls from '@/components/GroupControls/index.js'
export default {
    name: 'BaseMsg',
    props: {
        editSet: {
            type: Array,
            default: () => {
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
        },
        itemData: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },
    data() {
        return {
            addPeopleFrom: {
            }
        }
    },
    created() {
    },
    computed: {
    },
    methods: {
        custChange(val) {
            this.$emit('custChange', val)
        },
        CurrencyChange(val) {
            this.$emit('CurrencyChange', val)
        },
        updata() {
            if (this.itemData && this.$refs['control']) {
                this.$refs['control'].forEach((item, index) => {
                    if (item.$attrs.nameId == 'custId') {
                        item.updatas(this.itemData)
                    } else if (item.$attrs.nameId == 'contId') {
                        item.updatas(this.itemData)
                    } else {
                        item.updata()
                    }
                })
            }
        },
        submit() {
            let isPass = true
            let firstTo = true
            this.$refs['control'].forEach((item) => {
                console.log(item)
                if (!item.submitForm()) {
                    isPass = false
                    if (firstTo) {
                        firstTo = false
                        if (item.$attrs.dataId != '') {
                             this.$emit('scrollTop', $('[dataId=' + item.$attrs.dataId + ']')[0].offsetTop)
                        }
                    }
                }
            })
            // let custContact = {}
            if (!isPass) {
                return isPass
            }
            this.editSet.forEach((element) => {
                if (element.fieldCategory != 4) {
                    if (element.fieldGroup == 0) {
                        if (element.controlData != '' && element.controlData != [] && JSON.stringify(element.controlData) != JSON.stringify(this.itemData[element.fieldName])) {
                            this.addPeopleFrom[element.fieldName] = element.controlData
                        } else if (this.addPeopleFrom[element.fieldName]) {
                            delete this.addPeopleFrom[element.fieldName]
                        }
                    } else {
                        element.group.forEach((item) => {
                            if (item.controlData != '' && item.controlData != [] && JSON.stringify(item.controlData) != JSON.stringify(this.itemData[item.fieldName])) {
                                this.addPeopleFrom[item.fieldName] = item.controlData
                            } else if (this.addPeopleFrom[item.fieldName]) {
                                delete this.addPeopleFrom[item.fieldName]
                            }
                        })
                    }
                }
            })
            return this.addPeopleFrom
        },
        submitEdit() {
            let isPass = true
            let firstTo = true
            this.$refs['control'].forEach((item) => {
                if (!item.submitForm()) {
                    isPass = false
                    if (firstTo) {
                        firstTo = false
                        if (item.$attrs.dataId != '') {
                             this.$emit('scrollTop', $('[dataId=' + item.$attrs.dataId + ']')[0].offsetTop)
                        }
                    }
                }
            })
            // let custContact = {}
            if (!isPass) {
                return isPass
            }
            this.editSet.forEach((element) => {
                if (element.fieldCategory != 4) {
                    if (element.fieldGroup == 0) {
                        if (element.controlData != this.itemData[element.fieldName] && JSON.stringify(element.controlData) != JSON.stringify(this.itemData[element.fieldName])) {
                            this.addPeopleFrom[element.fieldName] = element.controlData == '' ? 0 : element.controlData
                        } else if (this.addPeopleFrom[element.fieldName]) {
                            delete this.addPeopleFrom[element.fieldName]
                        }
                    } else {
                        element.group.forEach((item) => {
                            if (JSON.stringify(item.controlData) != JSON.stringify(this.itemData[item.fieldName])) {
                                this.addPeopleFrom[item.fieldName] = item.controlData ? 0 : element.controlData
                            } else if (this.addPeopleFrom[item.fieldName]) {
                                delete this.addPeopleFrom[item.fieldName]
                            }
                        })
                    }
                }
            })
            return this.addPeopleFrom
        },
        closeWindow() {
        },
        relyOn(value, name) {
            this.editSet.forEach((item) => {
                if (item.parFilterField == name) {
                     this.$refs['control'].forEach((items) => {
                         if (items.$attrs.nameId == item.fieldName) {
                             items.getData(value, true)
                         }
                    })
                }
            })
        },
        returnFieldList(data, field) {
            let fieldList = field.split(';')
            fieldList.forEach(element => {
                if (element != '') {
                    let elementList = element.split('=')
                    this.$refs['control'].forEach((items) => {
                        if (items.$attrs.nameId == elementList[0]) {
                            items.updata(data[elementList[1]] || '')
                        }
                    })
                }
            })
        },
        clearData() {
            this.editSet.forEach((elemennt) => {
                if (elemennt.fieldGroup == 0) {
                    elemennt.controlData = ''
                } else {
                    elemennt.group.forEach((items) => {
                        items.controlData = ''
                    })
                }
            })
            this.addPeopleFrom = {}
            this.$refs['control'].forEach((item) => {
                item.clearData()
            })
        }
    },
    components: Object.assign({
    }, Controls, GroupControls)
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
