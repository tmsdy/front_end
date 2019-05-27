<template>
<!-- 列表显示字段 -->
    <el-dialog v-dialogDrag :title="$t('mxpcweb.client.1529054977675')" :visible.sync="dialogSetList" :closeOnClickModal="false" custom-class="width420"  :modal-append-to-body="false">
        <div class="setList MXscroll"  style="max-height:600px;min-height:400px;overflow-y:scroll;" v-loading="loading">
            <div class="customerSelection">
                <el-row :gutter="20" class="list listTitle">
                    <el-col :span="12">
                        <div class="grid-content bg-purple" style="font-size:12px;">
                            <!-- 名称字段显示选择 -->
                            {{$t('mxpcweb.client.1529054989653')}}
                        </div>
                    </el-col>
                    <el-col :span="4">
                        <div class="grid-content bg-purple">
                            &nbsp;
                        </div>
                    </el-col>
                    <el-col :span="4">
                        <div class="grid-content bg-purple">
                            <!-- 启用 -->
                            {{$t('mxpcweb.systemset.highseas.1529025082189')}}
                        </div>
                    </el-col>
                    <el-col :span="4">
                        <div class="grid-content bg-purple">
                            <!-- 顺序 -->
                            {{$t('mxpcweb.client.1529026870537')}}
                        </div>
                    </el-col>
                </el-row>
                <drag-wrap  v-model="allowSetList" :options="{handle:'.icon-dragBox'}"  @update="datadragEnd">
                    <transition-group>
                        <el-row :gutter="20" v-for="(item,index) in allowSetList" :key="'a'+index" class="list">
                            <el-col :span="12">
                                <div class="grid-content bg-purple">
                                    {{item.cnFieldCaption}}
                                </div>
                            </el-col>
                            <el-col :span="4">
                                <div class="grid-content bg-purple">
                                    &nbsp;
                                </div>
                            </el-col>
                            <el-col :span="4">
                                <div class="grid-content bg-purple hover">
                                <el-checkbox v-model="item.checkbox" @change="isUseField(item.fieldId)"></el-checkbox>
                                </div>
                            </el-col>
                            <el-col :span="4">
                                <div class="grid-content bg-purple">
                                    <span  class="icon-dragBox" style="cursor: move;"><i class="iconfont icon-drag"></i></span>
                                </div>
                            </el-col>
                        </el-row>
                    </transition-group>
                </drag-wrap>
            </div>
        </div>
    </el-dialog>
</template>
<script>
/**
 * 描述：客户管理-客户列表-设置列表字段
 * 作者：何俊峰
 * 时间：2017/11/10
 */
import draggable from 'vuedraggable'
import { isArray } from '@/libs/utils.js'
export default {
    name: 'setScreen',
    props: {
    },
    data() {
        return {
            allowSetList: [],
            allowSetListBak: [],
            model: true,
            loading: true,
            moduleCode: '',
            dialogSetList: false, // 设置列表弹框
            callback: function() {}
        }
    },
    created() {
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
        openWindow(obj) {
            this.moduleCode = obj.optData.optModuleCode
            if (obj.next) {
                this.callback = obj.next
            } else {
                this.callback = function() {}
            }
            this.allowSetList = []
            this.allowSetListBak = []
            this.getFieldData()
            this.dialogSetList = true
        },
        datadragEnd(evt) { // 排序
            let _this = this
            let oldFieldId = _this.allowSetListBak[evt.oldIndex].fieldId
            // if(evt.oldIndex+1==_this.setList.length)
            let upperFieldId
            if (evt.newIndex == 0) {
                upperFieldId = 0
            } else {
                upperFieldId = _this.allowSetListBak[evt.newIndex - 1].fieldId
            }
            _this.$http.put(this.Global.baseURL + this.Global.api.v2.fieldDetails_put, {
                moduleCode: _this.moduleCode,
                fieldType: 'listSet',
                fieldId: oldFieldId,
                operate: 'sort',
                upperFieldId: upperFieldId
            }).then((res) => {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    _this.$message.success(_this.msg(res.body))
                    _this.getFieldData()
                    _this.callback()
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
            }, (res) => {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },

         getFieldData() { // 获取数据
            let _this = this
            _this.loading = true
            _this.$http.get(this.Global.baseURL + this.Global.api.v2.fieldDetails_get, { params: {
                moduleCode: _this.moduleCode,
                fieldType: 'listSet'
            } }).then((res) => {
                if (res.body.code.toString() == _this.Global.RES_OK && isArray(res.body.data)) {
                    _this.setList = _this.searchSetData(res.body.data)
                    let allowSetList = _this.searchSetData(res.body.data)
                    _this.allowSetList = allowSetList
                     _this.allowSetListBak = allowSetList
                     _this.loading = false
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
            }, (res) => {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },
        isUseField(fieldId) { // 是否启用字段
            let _this = this
            // _this.$http.post(this.Global.baseURL + this.Global.api.DocumentFramework.ModulesAndFields.fieldDetailsPut, {
            _this.$http.put(this.Global.baseURL + this.Global.api.v2.fieldDetails_put, {
                moduleCode: _this.moduleCode,
                fieldType: 'listSet',
                fieldId: fieldId,
                operate: 'use'
            }).then((res) => {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    _this.callback()
                    _this.$message.success(_this.msg(res.body))
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
            }, (res) => {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },
        searchSetData(list) { // 判断复选框是否选中
            let newLList = []
            list.forEach((elemennt) => {
                elemennt.checkbox = (elemennt.isListShow == 1)
                newLList.push(elemennt)
            })
            return newLList
        }
    },
    watch: {

    },
    components: {
        'drag-wrap': draggable
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
