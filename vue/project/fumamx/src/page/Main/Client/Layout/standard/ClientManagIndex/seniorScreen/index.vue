<template>
    <div class="seniorScreen" >
        <div class="customerSelection">
            <div  class="MXscroll" style="max-height:550px;overflow-y:scroll;">
                <ul>
                    <li class="list" v-for="(item,index) in searchSet.slice(0,6)" :key="index">
                        <el-row :gutter="20" v-if="item.fieldGroup == 0" class="customerMessage">
                            <el-col :span="20">
                                <div>
                                    <component v-bind:is="'control'+item.controlTypeId" size="small" labelPosition="left" :optCode="optCode"  :moduleCode="moduleCode"   labelWidth="120px" :isRow="true" :isProp="true" rightWidth="240px" :controlData.sync="item.controlData" :itemData="item" ></component>
                                </div>
                            </el-col>
                            <el-col :span="4" class="setControl">
                                <template v-if="isContact">
                                    <span :style="{background:item.isTop?'rgba(208,2,27,1)':'rgba(192,196,204,1)'}" class="topClick hover"  @click="isTopField(item,index)">
                                        <i class="iconfont icon-ding"></i>
                                    </span>
                                </template>
                            </el-col>
                        </el-row>
                        <el-row  :gutter="20"  v-else-if="returnGroup(item)">
                            <el-col :span="20">
                                <component :key="index" v-bind:is="'group'+item.fieldGroup"  size="small"  :optCode="optCode"  :moduleCode="moduleCode"  labelPosition="left"  labelWidth="120px" :isRow="true" ref="control" :isProp="true"  rightWidth="240px"  rightWidth1="240px" :itemData="item"></component>
                            </el-col>
                            <el-col :span="4" class="setControl">
                                <template v-if="isContact">
                                    <span :style="{background:item.isTop?'rgba(208,2,27,1)':'rgba(192,196,204,1)'}" class="topClick hover"  @click="isTopField(item,index)">
                                        <i class="iconfont icon-ding"></i>
                                    </span>
                                </template>
                            </el-col>
                        </el-row>
                    </li>
                </ul>
                <ul class="moreConditionList">
                    <li class="list" v-for="(item,index) in searchSet.slice(6)" :key="index">
                        <el-row :gutter="20" v-if="item.fieldGroup == 0" class="customerMessage">
                            <el-col :span="20">
                                <div>
                                    <component v-bind:is="'control'+item.controlTypeId"  size="small"  :optCode="optCode"  :moduleCode="moduleCode"  labelPosition="left"  labelWidth="120px" :isRow="true" :isProp="true" rightWidth="240px" :controlData.sync="item.controlData" :itemData="item" ></component>
                                </div>
                            </el-col>
                            <el-col :span="4" class="setControl">
                                <template v-if="isContact">
                                    <span :style="{background:item.isTop?'rgba(208,2,27,1)':'rgba(192,196,204,1)'}" class="topClick hover"  @click="isTopField(item,index)">
                                        <i class="iconfont icon-ding"></i>
                                    </span>
                                </template>
                            </el-col>
                        </el-row>
                        <el-row  :gutter="20" v-else-if="returnGroup(item)">
                            <el-col :span="20">
                                <component :key="index" v-bind:is="'group'+item.fieldGroup"  size="small"  :optCode="optCode"  :moduleCode="moduleCode"  :isRow="true" ref="control"  labelWidth="120px" :isProp="true" rightWidth="240px" rightWidth1="240px" :itemData="item" labelPosition="left"></component>
                            </el-col>
                            <el-col :span="4" class="setControl">
                                <template v-if="isContact">
                                    <span :style="{background:item.isTop?'rgba(208,2,27,1)':'rgba(192,196,204,1)'}" class="topClick hover"  @click="isTopField(item,index)">
                                        <i class="iconfont icon-ding"></i>
                                    </span>
                                </template>
                            </el-col>
                        </el-row>
                    </li>
                </ul>
            </div>
            <!-- 显示更多筛选条件 -->
            <p v-if="searchSet.slice(6).length!==0" class="moreCondition hover" @click="getMoreCondition">{{$t('mxpcweb.client.1529049727676')}}</p>
            <div slot="footer" class="dialog-footer">
                <!-- 立即查找 -->
                <el-button type="primary" @click="submit()">{{$t("mxpcweb.client.1529049762390")}}</el-button>
            </div>
        </div>
    </div>
</template>
<script>
/**
 * 描述：客户管理-客户列表
 * 作者：何俊峰
 * 时间：2017/11/10
 */
import NoData from '@/basecomponents/NoData/index'
import Controls from '@/components/Controls/index.js'
import GroupControls from '@/components/GroupControls/index.js'
import { isObject } from '@/libs/utils.js'
export default {
    name: 'seniorScreen',
    props: {
        searchSet: {
            type: Array,
            required: true
        },
        moduleCode: {
            type: String,
            default: ''
        },
        isContact: {
            type: Boolean,
            default: false
        },
        optCode: {
            type: String,
            default: 'otView'
        }
    },
    data() {
        return {
            searchForm: {
                name: '',
                value: ''
            },
            otherArgument: {},
            moreCondition: true
        }
    },
    created() {
    },
    mounted() {
    },
    computed: {

    },
    methods: {
        returnGroup(item) {
            if (item.fieldGroup == '1') {
                if (item.group[0].fieldName == 'countryId') {
                    return true
                } else {
                    return false
                }
            } else if (item.fieldGroup == '3') {
                if (item.group[0].fieldName == 'ownerCtId') {
                    return true
                } else {
                    return false
                }
            } else {
                return true
            }
        },
        getMoreCondition() {
            if (this.moreCondition) {
                $('.moreConditionList').show()
                // 收起更多筛选条件
                $('.moreCondition').text(this.$t('mxpcweb.client.1529049842949'))
            } else {
                // 显示更多筛选条件
                $('.moreConditionList').hide()
                $('.moreCondition').text(this.$t('mxpcweb.client.1529049727676'))
            }
            this.moreCondition = !this.moreCondition
        },
        change(newValue) {
            if (newValue.value == '' || newValue.value == undefined) {
                if (this.otherArgument[newValue.key]) {
                    delete this.otherArgument[newValue.key]
                }
            } else {
                this.otherArgument[newValue.key] = newValue.value
            }
        },
        submit() {
            this.otherArgument = {}
            this.switch(this.searchSet)
            this.$emit('getListData', this.otherArgument, false, false, true)
            this.$emit('dialogSeniorClick')
        },
        switch(list) {
            list.forEach((element) => {
                if (element.controlTypeId != 0) {
                    if (element.fieldGroup == 0) {
                        if (element.controlData != '' && element.controlData != []) {
                            if (isObject(element.controlData)) {
                                this.switchControlData(element.controlData)
                            } else {
                                this.otherArgument[element.fieldName] = element.controlData
                            }
                        } else {
                            if (this.otherArgument[element.fieldName]) {
                                delete this.otherArgument[element.fieldName]
                            }
                        };
                    } else {
                        if (element.group) {
                            element.group.forEach((item, index) => {
                                if (item.controlData != '' && item.controlData != []) {
                                    if (isObject(item.controlData)) {
                                        this.switchControlData(item.controlData)
                                    } else {
                                        this.otherArgument[item.fieldName] = item.controlData
                                    }
                                } else {
                                    if (this.otherArgument[item.fieldName]) {
                                        delete this.otherArgument[item.fieldName]
                                    }
                                };
                            })
                        }
                    }
                }
            })
        },
        switchControlData(obj) {
            if (obj.value != '' && obj.value != []) {
                this.otherArgument[obj.key] = obj.value
                if (obj.data) {
                    this.switchControlData(obj.data)
                }
            } else {
                if (this.otherArgument[obj.key]) {
                    delete this.otherArgument[obj.key]
                }
            }
        },
        isTopField(itemData, index) {
            this.isTopFields(itemData.fieldId, index)
        },
        isTopFields(fieldId, index) { // 是否启用字段
            if (this.searchSet[index].fieldGroup != 0) {
                if (this.searchSet[index].group[0].isTop == 1) {
                    this.searchSet[index].group[0].isTop = 0
                } else {
                    this.searchSet[index].group[0].isTop = 1
                }
            } else {
                if (this.searchSet[index].isTop == 1) {
                    this.searchSet[index].isTop = 0
                } else {
                    this.searchSet[index].isTop = 1
                }
            }
            let data = {
                moduleCode: this.moduleCode,
                fieldType: 'searchSet',
                strucId: '1',
                fieldId: fieldId,
                operate: 'stick'
            }
            let viewType = this.getRoute().viewType
            if (viewType == 'seas') {
                data.isSea = true
            };
            this.$http.put(this.Global.baseURL + this.Global.api.v2.fieldDetails_put, data).then((res) => {
                if (res.body.code.toString() == this.Global.RES_OK) {
                    let name = this.searchSet[index].cnFieldCaption
                    this.$message.success(name + this.msg(res.body))
                    this.$emit('getSearchSet', false)
                } else {
                    if (this.searchSet[index].isTop == 1) {
                        this.searchSet[index].isTop = 0
                    } else {
                        this.searchSet[index].isTop = 1
                    }
                    this.$message.error(this.msg(res.body))
                }
            }, (res) => {
                this.$message.error(this.$t(this.Global.errorTitle))
            })
        }
    },
    watch: {

    },
    components: Object.assign({
        'no-data': NoData
    }, Controls, GroupControls)
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
