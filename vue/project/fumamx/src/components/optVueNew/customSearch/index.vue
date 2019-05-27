<template>
<!-- 编辑 -->
    <el-dialog v-dialogDrag :title="optName" :visible.sync="dialogListEdit" :closeOnClickModal="false"  custom-class="width620"  :modal-append-to-body="false">
        <div class="listEdit" v-if="dialogListEdit">
            <div class="listBox addPeopleMXscroll">
                <div>
                    快捷查询名称：
                    <el-input v-model="searchName" placeholder="请输入查询名称" style="width:386px;"></el-input>
                </div>
                <div style="margin-top:6px;">
                    筛选条件：
                    <div v-for="(items, indexs) in list" :key="indexs" class="list" style="margin-top:6px;">
                        <span class="indexNum">{{indexs + 1}}</span>
                        <el-select v-model="items.itemData" value-key="fieldName" style="width:110px;">
                            <div v-for="(item,index) in searchSet" :key="index">
                                <el-option :label="item.cnFieldCaption" :value="item"></el-option>
                            </div>
                        </el-select>
                        <el-select v-model="items.matchType" value-key="fieldName" style="width:110px;">
                            <el-option label="是" value="equal"></el-option>
                            <el-option label="不是" value="not_equal"></el-option>
                        </el-select>
                        <div class="fieldNameClass">
                            <template v-if="JSON.stringify(items.itemData) != '{}'">
                                <template v-if="items.itemData.fieldGroup == 0">
                                    <component optCode="otView" isIndependent isProp size="small" :showLabel="false" labelWidth="0" :moduleCode="optModuleCode" class="component" v-bind:is="'control'+items.itemData.controlTypeId" ref="control" :itemData="items.itemData" rightWidth="240px" :controlData.sync="items.itemData.controlData"></component>
                                </template>
                                <template v-else>
                                    <component optCode="otView" isIndependent isProp size="small" :showLabel="false" labelWidth="0" v-if="items.itemData.fieldGroup==1"  class="component" v-bind:is="'group'+items.itemData.fieldGroup"  ref="control" :itemData="items.itemData" rightWidth="240px" rightWidth1="118px"></component>
                                    <component isIndependent isProp size="small" :showLabel="false" labelWidth="0" optCode="otView" :moduleCode="optModuleCode"  v-else class="component"  v-bind:is="'group'+items.itemData.fieldGroup"  ref="control" :itemData="items.itemData"  rightWidth="240px" rightWidth1="118px"></component>
                                </template>
                            </template>
                            <div v-else class="empty"></div>
                            <span class="optBox">
                                <span class="text-hover" style="color:#ff5a5a;margin-right:8px;" v-if="list.length > 1" @click="list.splice(indexs, 1)">
                                    <i class="iconfont icon-minus"></i>
                                </span>
                                <span class="text-hover" style="color:#9cff5a;" @click="list.push({
                                    itemData: {},
                                    matchType: ''
                                })">
                                    <i class="iconfont icon-plus-file" style="font-weight:600;"></i>
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div slot="footer" class="dialogFooter">
                <!-- 取消 -->
                <el-button  @click="dialogListEdit=false">{{$t('mxpcweb.client.1529047588840')}}</el-button>
                <!-- 保存 -->
                <el-button type="primary" :loading="submitLoading" @click="submitAddFrom">{{$t('mxpcweb.client.1529042806774')}}</el-button>
            </div>
        </div>
    </el-dialog>
</template>
<script>
/**
 * 描述：客户管理-客户列表-编辑客户
 * 作者：何俊峰
 * 时间：2017/11/22
 */
import Controls from '@/components/Controls/index.js'
import GroupControls from '@/components/GroupControls/index.js'
import { mapGetters, mapMutations } from 'vuex'
import { isObject } from '@/libs/utils.js'
export default {
    name: 'customSearch',
    props: {
    },
    data() {
        return {
            searchName: '',
            addPeopleFrom: {
            },
            dialogListEdit: false, // 客户编辑弹窗开关
            searchSet: [],
            submitLoading: false,
            optModuleCode: '',
            optName: '新增快捷搜索',
            list: [{
                itemData: {},
                matchType: ''
            }],
            callBack: () => {}
        }
    },
    created() {
    },
    mounted() {
    },
    computed: {
        ...mapGetters('client', [
            'billParameterList'
        ])
    },
    methods: {
        // 同步设置
        ...mapMutations('client', {
            set_billParameterList: 'SET_BILLPARAMETERLIST'
        }),
        openWindow(obj) {
            this.addPeopleFrom = {}
            this.searchName = ''
            this.searchSet = []
            this.list = [{
                itemData: {},
                matchType: ''
            }]
            let { optData, next, itemData } = obj
            this.optModuleCode = optData.optModuleCode
            if (itemData) {
                this.billId = itemData.id
                this.searchName = itemData.name
                let list = []
                Object.keys(itemData.parameter).forEach(item => {
                    list.push({
                        itemData: {},
                        matchType: ''
                    })
                })
                if (list.length > 0) {
                    this.list = list
                }
            }
            if (next) {
                this.callBack = next
            } else {
                this.callBack = () => {}
            }
            this.getSearchSet()
            this.dialogListEdit = true
        },
        closeWindow() {
            this.$emit('closeWindow')
        },
        // 获取编辑字段数据
        getSearchSet() {
            let datas = {
                moduleCode: this.optModuleCode,
                type: 'searchSet'
            }
            this.$http.get(this.Global.baseURL + this.Global.api.v2.fieldShow_get, { params: datas }).then((res) => {
                if (res.body.code.toString() == this.Global.RES_OK) {
                    this.searchSet = this.swidchSearchSet(res.body.data)
                } else {
                    this.$message.error(_this.msg(res.body))
                }
            }, (res) => {
                this.$message.error(this.$t(this.Global.errorTitle))
            })
        },
        submitAddFrom() {
            this.addPeopleFrom = {}
            this.switch(this.searchSet)
            let newList = []
            this.list.forEach(item => {
                if (item.itemData && JSON.stringify(item.itemData) != '{}') {
                    console.log(item)
                    if (item.itemData.fieldGroup && item.itemData.fieldGroup != '0') {
                        item.itemData.group.forEach(element => {
                            let obj = {
                                fieldId: element.fieldId,
                                matchType: item.matchType
                            }
                            if (isObject(element.controlData)) {
                                obj.gtParam = element.controlData.data.value
                                obj.ltParam = element.controlData.value
                            } else {
                                obj.eqParam = element.controlData
                            }
                            newList.push(obj)
                        })
                    } else {
                        let obj = {
                            fieldId: item.itemData.fieldId,
                            matchType: item.matchType
                        }
                        if (isObject(item.itemData.controlData)) {
                            obj.gtParam = item.itemData.controlData.data.value
                            obj.ltParam = item.itemData.controlData.value
                        } else {
                            obj.eqParam = item.itemData.controlData
                        }
                        newList.push(obj)
                    }
                }
            })
            this.submitLoading = true
            this.$http.post(this.Global.baseURL + this.Global.api.v2.document_searchListFilter_post, {
                moduleCode: this.optModuleCode,
                strucId: '1',
                searchFilterName: this.searchName,
                quickSearchCondList: newList
            }).then((res) => {
                if (res.body.code.toString() == this.Global.RES_OK) {
                    this.submitLoading = false
                    this.dialogListEdit = false
                    this.callBack()
                    this.$message.success(this.msg(res.body))
                } else {
                    this.submitLoading = false
                    this.$message.error(this.msg(res.body))
                }
            }, (res) => {
                this.submitLoading = false
                this.$message.error(this.$t(this.Global.errorTitle))
            })
        },
        switch(list) {
            list.forEach((element) => {
                if (element.controlTypeId != 0) {
                    if (element.fieldGroup == 0) {
                        if (element.controlData != '' && element.controlData != []) {
                            if (isObject(element.controlData)) {
                                this.switchControlData(element.controlData)
                            } else {
                                this.addPeopleFrom[element.fieldName] = element.controlData
                            }
                        } else {
                            if (this.addPeopleFrom[element.fieldName]) {
                                delete this.addPeopleFrom[element.fieldName]
                            }
                        };
                    } else {
                        if (element.group) {
                            element.group.forEach((item, index) => {
                                if (item.controlData != '' && item.controlData != []) {
                                    if (isObject(item.controlData)) {
                                        this.switchControlData(item.controlData)
                                    } else {
                                        this.addPeopleFrom[item.fieldName] = item.controlData
                                    }
                                } else {
                                    if (this.addPeopleFrom[item.fieldName]) {
                                        delete this.addPeopleFrom[item.fieldName]
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
                this.addPeopleFrom[obj.key] = obj.value
                if (obj.data) {
                    this.switchControlData(obj.data)
                }
            } else {
                if (this.addPeopleFrom[obj.key]) {
                    delete this.addPeopleFrom[obj.key]
                }
            }
        },
        // 转化编辑字段数据（按空间类型（单控件，组控件）顺序）
        swidchSearchSet(list) {
             let newLList = []
             let groupFirst = []
            list.forEach((element) => {
                if (element.fieldCategory != 4) {
                    element.controlData = ''
                    element.disabled = false
                    element.fieldValue = element.inDefaultValue
                    if (element.fieldGroup && element.fieldGroup !== 0) { // 判断是否是一个组
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
                                cnFieldCaption: this.returnGroupName(element.fieldGroup),
                                isTop: element.isTop,
                                fieldName: element.fieldName,
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
                }
            })
            return newLList
        }
    },
    watch: {
    },
    components: Object.assign({}, Controls, GroupControls),
    beforeDestroy: () => {
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
