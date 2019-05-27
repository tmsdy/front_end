<template>
    <!-- 查重显示字段 -->
     <el-dialog :title="$t('mxpcweb.client.1529026640805')" :visible.sync="dialog" :closeOnClickModal="false" custom-class="width420">
        <div class="setCheck MXscroll"  style="max-height:600px;overflow-y:scroll;">
            <div class="customerSelection" v-loading="loading">
                <el-row :gutter="20" class="list listTitle">
                    <el-col :span="12">
                        <div class="grid-content bg-purple">
                            <!-- 客户字段 -->
                            {{$t('mxpcweb.client.1529026760679')}}
                        </div>
                    </el-col>
                    <el-col :span="4">
                        <div class="grid-content bg-purple">
                            &nbsp;
                        </div>
                    </el-col>
                    <el-col :span="4">
                        <div class="grid-content bg-purple">
                            <!-- 显示 -->
                            {{$t('mxpcweb.mail.1528715979174')}}
                        </div>
                    </el-col>
                    <el-col :span="4">
                        <div class="grid-content bg-purple">
                            <!-- 顺序 -->
                            {{$t('mxpcweb.client.1529026870537')}}
                        </div>
                    </el-col>
                </el-row>

                <drag-wrap v-model="custList" :options="{handle:'.icon-dragBox'}" @update="dragEndCust">
                    <transition-group>
                        <el-row :gutter="20" v-for="(item,index) in custList" :key="'a'+index" class="list">
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
                                <el-checkbox :disabled="item.fieldName=='custName'" v-model="item.checkbox" @change="isUseField(item.fieldId)"></el-checkbox>
                                </div>
                            </el-col>
                            <el-col :span="4">
                                <div class="grid-content bg-purple">
                                    <span  :class="item.fieldName!='custName'?'icon-dragBox':''" style="cursor: move;"><i class="iconfont icon-drag"></i></span>
                                </div>
                            </el-col>
                        </el-row>
                    </transition-group>
                </drag-wrap>
                 <el-row :gutter="20" v-if="contList.length!=0" class="list listTitle">
                    <el-col :span="12">
                        <div class="grid-content bg-purple">
                            <!-- 主联系人 -->
                            {{$t('mxpcweb.client.1529026890672')}}
                        </div>
                    </el-col>
                    <el-col :span="4">
                        <div class="grid-content bg-purple">
                            &nbsp;
                        </div>
                    </el-col>
                    <el-col :span="4">
                        <div class="grid-content bg-purple">
                            <!-- 显示 -->
                            {{$t('mxpcweb.mail.1528715979174')}}
                        </div>
                    </el-col>
                    <el-col :span="4">
                        <div class="grid-content bg-purple">
                            <!-- 顺序 -->
                            {{$t('mxpcweb.client.1529026870537')}}
                        </div>
                    </el-col>
                </el-row>
                <drag-wrap v-model="contList" :options="{handle:'.icon-dragBox'}" @update="dragEndCont">
                    <transition-group>
                        <el-row :gutter="20" v-for="(item,index) in contList" :key="'a'+index" class="list">
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
 * 描述：客户管理-客户列表-新增客户
 * 作者：何俊峰
 * 时间：2017/11/21
 */
import { isArray } from '@/libs/utils.js'
import draggable from 'vuedraggable'
export default {
    name: 'setCheck',
    props: {
    },
    data() {
        return {
            dialog: false,
            loading: false,
            custList: [],
            custListBak: [],
            contList: [],
            contListBak: []
        }
    },
    created() {
        this.getData()
    },
    mounted() {
    },
    computed: {
    },
    methods: {
        dialogs() {
            this.dialog = true
        },
        getData() {
            let _this = this
            _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.fieldShow_custCheck_do, { params: { type: 'config'} }).then((res) => {
                if (res.body.code.toString() == _this.Global.RES_OK && isArray(res.body.data)) {
                    let allowSetList = this.searchSetData(res.body.data)
                    let custList = []
                    let contList = []
                    allowSetList.forEach(function(item) {
                        item.moduleCode == 'BF001' ? custList.push(item) : contList.push(item)
                    })
                    _this.custList = custList
                    _this.custListBak = Object.assign(custList)
                    _this.contList = contList
                    _this.contListBak = Object.assign(contList)
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
            }, (res) => {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },
        isUseField(fieldId) { // 是否启用字段
            let _this = this
            _this.$http.put(this.Global.baseURL + _this.Global.api.v2.fieldShow_custCheck_do, {
                fieldId: fieldId,
                operate: 'use'
            }).then((res) => {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    _this.$emit('getSetData')
                    _this.getData()
                    _this.$message.success(_this.msg(res.body))
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
            }, (res) => {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },

        dragEndCont(evt) { // 排序
            let _this = this
            let oldFieldId = _this.contListBak[evt.oldIndex].fieldId
            let upperFieldId
            if (evt.newIndex == 0) {
                upperFieldId = 0
            } else {
                upperFieldId = _this.contListBak[evt.oldIndex > evt.newIndex ? evt.newIndex - 1 : evt.newIndex].fieldId
            };
            _this.$http.put(_this.Global.baseURL + _this.Global.api.v2.fieldShow_custCheck_do, {
                fieldId: oldFieldId,
                operate: 'sort',
                upperFieldId: upperFieldId
            }).then((res) => {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    _this.$message.success(_this.msg(res.body))
                    _this.getData()
                     _this.$emit('getSetData')
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
            }, (res) => {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },
         dragEndCust(evt) { // 排序
            let _this = this
            let oldFieldId = _this.custListBak[evt.oldIndex].fieldId
            let upperFieldId
            if (evt.newIndex == 0) {
                upperFieldId = 0
            } else {
                upperFieldId = _this.custListBak[evt.newIndex - 1].fieldId
            };
            _this.$http.put(_this.Global.baseURL + _this.Global.api.v2.fieldShow_custCheck_do, {
                fieldId: oldFieldId,
                operate: 'sort',
                upperFieldId: upperFieldId
            }).then((res) => {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    _this.$message.success(_this.msg(res.body))
                    _this.getData()
                     _this.$emit('getSetData')
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
                elemennt.checkbox = (elemennt.isCheckShow == 1)
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
    .setCheck {
        height:550px;
        .font-blue{
            color:#1296db;
        }
        .font-grey{
            color:#999999;
        }
        .hover{
            cursor: pointer;
        }
        .customerSelection {
            p {
                font-size: 12px;
                color: #666666;
            }
            .list{
                width: 100%;
                padding:10px 0;
                text-align: center;
                border-bottom:1px solid #f2f2f2;
            }
            .listTitle{
                background: #f2f2f2;
            }
        }
    }
</style>
