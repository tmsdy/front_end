<template>
    <div class="setScreen">
        <div class="customerSelection">
            <p>
                <!-- 启用后显示在筛选窗口，置顶后显示在列表管理顶端最多支持5个置顶 -->
                <span style="color:red">*</span>{{$t('mxpcweb.client.1529055381221')}}</p>
            <el-row :gutter="20" class="list listTitle">
                <el-col :span="4">
                    <div class="grid-content bg-purple">
                        <!-- 启用 -->
                        {{$t('mxpcweb.systemset.highseas.1529025082189')}}
                    </div>
                </el-col>
                <el-col :span="11">
                    <div class="grid-content bg-purple">
                        <!-- 字段 -->
                        {{$t('mxpcweb.client.1529052699658')}}
                    </div>
                </el-col>
                <el-col :span="4">
                    <div class="grid-content bg-purple">
                        <!-- 置顶 -->
                        {{$t('mxpcweb.client.1529055418467')}}
                    </div>
                </el-col>
                <el-col :span="4">
                    <div class="grid-content bg-purple">
                        <!-- 顺序 -->
                        {{$t('mxpcweb.client.1529026870537')}}
                    </div>
                </el-col>
            </el-row>
            <br/>
            <loading v-if="firstGet"></loading>
            <div v-else class="listBox  MXscroll">
                <drag-wrap  v-model="searchSetList" :options="{handle:'.icon-dragBox'}" :move="getdata" @update="datadragEnd">
                    <transition-group>
                        <div  v-for="(item,index) in searchSetList" :key="'a'+index">
                            <el-row :gutter="20"  v-if="item.fieldGroup==0" class="list">
                                <el-col :span="4">
                                    <div class="grid-content bg-purple">
                                        <el-checkbox v-model="item.checkbox" @change="isUseFields(item.fieldId)"></el-checkbox>
                                    </div>
                                </el-col>
                                <el-col :span="12">
                                    <div class="grid-content bg-purple">
                                        {{item.cnFieldCaption}}
                                    </div>
                                </el-col>
                                <el-col :span="4">
                                    <div class="grid-content bg-purple hover">
                                        <span v-if="item.checkbox">
                                            <span :style="{background:item.isTop?'rgba(208,2,27,1)':'rgba(192,196,204,1)'}" class="topClick hover"  @click="isTopFields(item)">
                                                <i class="iconfont icon-ding"></i>
                                            </span>
                                        </span>
                                        <span v-else>
                                            <span class="topClick"  @click="isTopErrMsg">
                                                <i class="iconfont icon-ding"></i>
                                            </span>
                                        </span>
                                    </div>
                                </el-col>
                                <el-col :span="4">
                                    <div class="grid-content bg-purple">
                                        <span class="icon-dragBox" style="cursor: move;">
                                            <i class="iconfont icon-drag"></i>
                                        </span>
                                    </div>
                                </el-col>
                            </el-row>
                            <div v-else class="list-box">
                                <el-row :gutter="20"  class="list">
                                    <el-col :span="4">
                                        <div class="grid-content bg-purple">
                                            <el-checkbox  v-model="item.checkbox" @change="isUseFields(item.fieldId)"></el-checkbox>
                                        </div>
                                    </el-col>
                                    <el-col :span="12">
                                        <div class="grid-content bg-purple">
                                            {{item.cnFieldCaption}}
                                        </div>
                                    </el-col>
                                    <el-col :span="4">
                                        <div class="grid-content bg-purple hover">
                                            <span v-if="item.group[0].checkbox">
                                                <span :style="{background:item.isTop?'rgba(208,2,27,1)':'rgba(192,196,204,1)'}" class="topClick hover"  @click="isTopFields(item.group[0],index)">
                                                    <i class="iconfont icon-ding"></i>
                                                </span>
                                            </span>
                                            <span v-else>
                                                <span class="topClick"  @click="isTopErrMsg">
                                                    <i class="iconfont icon-ding"></i>
                                                </span>
                                            </span>
                                        </div>
                                    </el-col>
                                    <el-col :span="4">
                                        <div class="grid-content bg-purple">
                                            <span class="icon-dragBox" style="cursor: move;">
                                                <i class="iconfont icon-drag"></i>
                                            </span>
                                        </div>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20" v-for="(list,indexs) in item.group" :key="indexs" class="list">
                                    <el-col :span="4">
                                        <div class="grid-content bg-purple">
                                            <el-checkbox v-model="item.checkbox" disabled @change="isUseFields(list.fieldId)"></el-checkbox>
                                        </div>
                                    </el-col>
                                    <el-col :span="12">
                                        <div class="grid-content bg-purple">
                                            {{list.cnFieldCaption}}
                                        </div>
                                    </el-col>
                                </el-row>
                            </div>
                        </div>
                    </transition-group>
                </drag-wrap>
            </div>
        </div>
    </div>
</template>
<script>
/**
 * 描述：客户管理-客户列表-设置查询字段
 * 作者：何俊峰
 * 时间：2017/11/10
 */
import draggable from 'vuedraggable'
import { isArray } from '@/libs/utils.js'
import Loading from '@/basecomponents/Loading/index'
export default {
    name: 'setScreen',
    props: {
        moduleCode: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            multipleSelection: [],
            checked: false,
            searchSetList: [],
            firstGet: true,
            searchSetListBak: []
        }
    },
    created() {
        this.getFieldData()
    },
    mounted() {
    },
    computed: {

    },
    methods: {
        toggleSelection(rows) {
            if (rows) {
                rows.forEach(row => {
                    this.$refs.multipleTable.toggleRowSelection(row)
                })
            } else {
                this.$refs.multipleTable.clearSelection()
            }
        },
        handleSelectionChange(val) {
            this.multipleSelection = val
        },
        // 拖拽
        getdata(evt) {
            // console.log(evt.draggedContext.element.id)
        },
        datadragEnd(evt) { // 排序
            let oldFieldId = this.searchSetListBak[evt.oldIndex].fieldId
            let upperFieldId
            // console.log("------------------------排序-----------------------")
            // console.log(evt.oldIndex,oldFieldId);
            if (evt.newIndex == 0) {
                upperFieldId = 0
            } else {
                upperFieldId = this.searchSetListBak[evt.oldIndex > evt.newIndex ? evt.newIndex - 1 : evt.newIndex].fieldId
            };
            let data = {
                moduleCode: this.moduleCode,
                fieldType: 'searchSet',
                fieldId: oldFieldId,
                operate: 'sort',
                upperFieldId: upperFieldId
            }
            this.$http.put(this.Global.baseURL + this.Global.api.v2.fieldDetails_put, data).then((res) => {
                if (res.body.code.toString() == this.Global.RES_OK) {
                    this.$message.success(this.msg(res.body))
                    this.getFieldData()
                    this.$emit('getSearchSet', false)
                } else {
                    this.$message.error(this.msg(res.body))
                }
            }, (res) => {
                this.$message.error(this.$t(this.Global.errorTitle))
            })
        },
        getFieldData() { // 获取字段数据
            let data = {
                moduleCode: this.moduleCode,
                fieldType: 'searchSet',
                strucId: '1'
            }
            let viewType = this.getRoute().viewType
            if (viewType == 'seas') {
                data.isSea = true
            };
            this.$http.get(this.Global.baseURL + this.Global.api.v2.fieldDetails_get, {
                params: data
            }).then((res) => {
                if (res.body.code.toString() == this.Global.RES_OK && isArray(res.body.data)) {
                    if (this.firstGet) {
                        this.firstGet = false
                    }
                    this.searchSetList = []
                    this.searchSetListBak = []
                    this.searchSetList = this.searchSetData(res.body.data)
                    this.searchSetListBak = this.searchSetData(res.body.data)
                } else {
                    this.$message.error(this.msg(res.body))
                }
            }, (res) => {
                this.$message.error(this.$t(this.Global.errorTitle))
            })
        },
        searchSetData(list) { // 筛选字段数据转化
             let newLList = []
             let groupFirst = []
            list.forEach((element) => {
                element.checkbox = (element.isSearch == 1)
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
                            cnFieldCaption: this.returnGroupName(element.fieldGroup),
                            fieldGroup: element.fieldGroup,
                            isTop: element.isTop,
                            fieldId: element.fieldId,
                            checkbox: (element.isSearch == 1),
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
        },
        isUseFields(fieldId) { // 是否启用字段
            let data = {
                moduleCode: this.moduleCode,
                fieldType: 'searchSet',
                strucId: '1',
                fieldId: fieldId,
                operate: 'use'
            }
            let viewType = this.getRoute().viewType
            if (viewType == 'seas') {
                data.isSea = true
            }
            this.$http.put(this.Global.baseURL + this.Global.api.v2.fieldDetails_put, data).then((res) => {
                if (res.body.code.toString() == this.Global.RES_OK) {
                    this.$message.success(this.msg(res.body))
                    this.getFieldData()
                    this.$emit('getSearchSet', false)
                } else {
                    this.$message.error(this.msg(res.body))
                }
            }, (res) => {
                this.$message.error(this.$t(this.Global.errorTitle))
            })
        },
        isTopFields(item) { // 是否启用字段
            let data = {
                moduleCode: this.moduleCode,
                fieldType: 'searchSet',
                strucId: '1',
                fieldId: item.fieldId,
                operate: 'stick'
            }
            let viewType = this.getRoute().viewType
            if (viewType == 'seas') {
                data.isSea = true
            }
            this.$http.put(this.Global.baseURL + this.Global.api.v2.fieldDetails_put, data).then((res) => {
                if (res.body.code.toString() == this.Global.RES_OK) {
                    this.$message.success(this.msg(res.body))
                    this.getFieldData()
                    this.$emit('getSearchSet', false)
                } else {
                    this.$message.error(this.msg(res.body))
                }
            }, (res) => {
                this.$message.error(this.$t(this.Global.errorTitle))
            })
        },
        isTopErrMsg() {
            // 此字段未启用，不能置顶
            this.$message.error(this.$t('mxpcweb.client.1529055450379'))
        }
    },
    watch: {
    },
    components: {
        'drag-wrap': draggable,
         'loading': Loading
    },
    beforeDestroy: function () {
        this.searchSetList = null
        this.searchSetListBak = null
        this.searchSetData = null
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
