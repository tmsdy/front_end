<template>
    <div class="Assign">
        <!-- 指派负责人 -->
        <el-dialog :title="$t('mxpcweb.sale.components.1557564823675')" v-dialogDrag :visible.sync="dialogVisible" :closeOnClickModal="false" custom-class="width420" :modal-append-to-body="false">
            <div class="formBox">
                <div class="fieldList">
                    <!-- 流程环节 -->
                    <span class="labelBox">{{$t('mxpcweb.sale.components.1557564596388')}}</span>
                    <el-select style="width:300px;" disabled v-model="step">
                        <el-option :label="itemData.nodeName" value="1"></el-option>
                    </el-select>
                </div>
                <div class="fieldList">
                    <!-- 负责人 -->
                    <span class="labelBox">{{$t('mxpcweb.sale.components.1557564615823')}}</span>
                    <el-select v-model="itemData.chargeCtId" style="width:300px">
                        <div class="searchBox">
                            <el-input v-model="keyWords" ref="searchInput" autofocus @change='handleSearch()' icon="search"></el-input>
                        </div>
                        <div class="listBox MXscroll">
                            <div v-show="false">
                                <el-option label="" value=""></el-option>
                            </div>
                            <div class="nodata" v-show="loading">
                                <loading></loading>
                            </div>
                            <div v-show="!loading">
                                <template v-if="showListLength">
                                    <!-- 未指定 -->
                                    <el-option :label="$t('mxpcweb.sale.components.1557564616258')" value=""></el-option>
                                    <!-- 拥有人 -->
                                    <el-option :label="$t('mxpcweb.sale.components.1557564616443')" value="${ownerCtId}"></el-option>
                                    <!-- 指定人员 -->
                                    <el-option-group key="1" :label="$t('mxpcweb.sale.components.1557564616635')">
                                        <div v-for="(item,index) in showList" :key="index"  v-show="item.inUse===1 && item.isShow">
                                            <el-option :label="item.realName" :value="item.ctId+''">
                                            </el-option>
                                        </div>
                                    </el-option-group>
                                </template>
                                <div class="nodata" v-else>
                                    <!-- 未找到结果 -->
                                    {{$t('mxpcweb.sale.components.1557564823903')}}
                                </div>
                            </div>
                        </div>
                    </el-select>
                </div>
                <div class="fieldList">
                    <!-- 指定时间 -->
                    <span class="labelBox">{{$t('mxpcweb.sale.components.1557564616039')}}</span>
                    <el-date-picker style="width:300px;" v-model="itemData.deadline" type="date" size="small" format="yyyy-MM-dd" align="right"></el-date-picker>
                </div>
            </div>
            <div class="text-center">
                <el-button type="primary" @click="submitForm()" :loading="subLoading">
                    <!-- 保 存 -->
                    {{$t('mxpcweb.sale.components.1557564616847')}}
                </el-button>
                <el-button @click="dialogVisible = false">
                    <!-- 取 消 -->
                    {{$t('mxpcweb.sale.components.1557564617043')}}
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { toPinyin } from '@/libs/utils.js'
import Loading from '@/basecomponents/Loading'
import { mapGetters } from 'vuex'
export default {
    name: 'Assign',
    props: {
        optCode: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            itemData: {
                nodeName: '',
                chargeCtId: '',
                doctryNodeId: '',
                doctryId: '',
                deadline: '',
                next: () => {}
            },
            dialogVisible: false,
            step: '1',
            subLoading: false,
            loading: false,
            keyWords: '',
            baseList: [],
            showList: [],
            showListLength: false
        }
    },
    created() {
    },
    mounted() {
    },
    computed: {
        ...mapGetters([
            'contactValue'
        ])
    },
    methods: {
        showDialog(item) {
            this.dealList()
            this.itemData = {
                doctryNodeId: '',
                nodeName: '',
                chargeCtId: '',
                deadline: '',
                doctryId: '',
                orderId: '',
                next: () => {}
            }
            if (item) {
                this.itemData = {
                    doctryNodeId: item.doctryNodeId || '',
                    nodeName: item.nodeName || '',
                    chargeCtId: item.chargeCtId + '' || '',
                    deadline: item.deadline && item.deadline.indexOf('1970-01-01') == '-1' ? item.deadline : '',
                    doctryId: item.doctryId || '',
                    next: item.next || (() => {})
                }
            }
            this.dialogVisible = true
        },
        // 提交表单
        submitForm() {
            if (this.optCode == 'otView' && this.itemData.doctryId && this.itemData.doctryId != '') {
                let obj = {
                    doctryNodeId: this.itemData.doctryNodeId || '',
                    chargeCtId: this.itemData.chargeCtId + '' || '',
                    deadline: this.itemData.deadline && this.itemData.deadline != '' ? this.$m_unifiedTime(this.itemData.deadline, {format: 'YYYY-MM-DD'}).replace('00:00:00', '23:59:59') : '',
                    doctryId: this.itemData.doctryId || '',
                    moduleCode: 'SC003',
                    strucId: '3'
                }
                this.subLoading = true
                this.$http.put(this.Global.baseURL + this.Global.api.v2.document_documentaryInfo_put, obj).then((res) => {
                    this.subLoading = false
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        this.$message.success(this.msg(res.body))
                        this.$emit('getData')
                        this.dialogVisible = false
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                }, (res) => {
                    this.subLoading = false
                    this.$message.error(this.$t(this.Global.errorTitle))
                })
            } else {
                let data = {
                    chargeCtId: this.itemData.chargeCtId || '',
                    deadline: this.itemData.deadline && this.itemData.deadline != '' ? this.$m_unifiedTime(this.itemData.deadline, {format: 'YYYY-MM-DD'}) : ''
                }
                this.itemData.next(data)
                this.dialogVisible = false
            }
        },
        // 重置表单
        resetForm() {
        },
        handleSearch() {
            this.showListLength = false
            let list = JSON.parse(JSON.stringify(this.baseList))
            list.forEach((item) => {
                if (item.alias.toLowerCase().replace(/\s+/g, '').indexOf(this.keyWords.toLowerCase().replace(/\s+/g, '')) != -1) {
                    item.isShow = true
                    this.showListLength = true
                } else {
                    item.isShow = false
                }
            })
            this.showList = list
        },
        dealList() {
            if (this.contactValue.length <= 0) {
                this.baseList = []
                this.showList = []
                this.showListLength = false
            } else {
                let list = JSON.parse(JSON.stringify(this.contactValue))
                list.forEach(element => {
                    if (!element.realName) {
                        element.realName = ''
                    }
                })
                this.baseList = toPinyin([].concat(list), { usekey: 'realName' })
                this.baseList.forEach(element => {
                    element.isShow = true
                })
                this.showList = JSON.parse(JSON.stringify(this.baseList))
                this.showListLength = true
            }
        }
    },
    components: {
        'loading': Loading
    },
    watch: {
        contactValue() {
            this.dealList()
        }
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
