
<template>
    <div class="tabSendset">
        <div class="add">
            <el-select v-model="ownersSelect" filterable @change="getListData()">
                <el-option v-for="item in owners" :key="item.ctId" :label="item.realName" :value="item.ctId">
                </el-option>
            </el-select>
            <!-- 选择日期范围 -->
            <el-date-picker v-model="selectTimeAuto" type="daterange" align="right" :placeholder="$t('mxpcweb.am.1531966917262')" :picker-options="pickerOptions2" @change="getListData()">
            </el-date-picker>
        </div>
        <el-row class="title">
            <el-col :span="4">
                <!-- 姓名 -->
                {{$t('mxpcweb.am.1531905404050')}}
            </el-col>
            <el-col :span="4">
                <!-- 发送邮件 -->
                {{$t('mxpcweb.am.1531905409233')}}
            </el-col>
            <el-col :span="4">
                <!-- 发送成功 -->
                {{$t('mxpcweb.am.1531905409448')}}
            </el-col>
            <el-col :span="3">
                <!-- 发送失败 -->
                {{$t('mxpcweb.am.1531905409671')}}
            </el-col>
            <el-col :span="3">
                <!-- 推荐产品 -->
                {{$t('mxpcweb.am.1531905409871')}}
            </el-col>
            <el-col :span="3">
                <!-- 推荐客户 -->
                {{$t('mxpcweb.am.1531905420062')}}
            </el-col>
            <el-col :span="3">
                <!-- 客户阅读 -->
                {{$t('mxpcweb.am.1531905420247')}}
            </el-col>
        </el-row>
        <div class="tableBox MXscroll" v-loading="loading">
            <no-data v-if="!loading&&sendList.length==0" style="background:rgba(255,255,255,0)"></no-data>
            <el-row v-else class="list" v-for="(item,index) in sendList" :key="index">
                <el-col :span="4" class="ellipsis">
                    {{returnName(item.ctId)}}&nbsp;
                </el-col>
                <el-col :span="4" class="ellipsis">
                    {{item.requestCount}}&nbsp;
                </el-col>
                <el-col :span="4" class="ellipsis">
                    {{item.deliveredCount}}&nbsp;
                </el-col>
                <el-col :span="3" class="ellipsis">
                    {{item.invalidCount}}&nbsp;
                </el-col>
                <el-col :span="3" class="ellipsis">
                    <!-- 推荐产品 -->
                    {{$t('mxpcweb.am.1531905409871')}}
                </el-col>
                <el-col :span="3" class="ellipsis">
                    <!-- 推荐客户 -->
                    {{$t('mxpcweb.am.1531905420062')}}
                </el-col>
                <el-col :span="3" class="ellipsis">
                    {{item.openCount}}&nbsp;
                </el-col>
            </el-row>
        </div>
        <list-page style="background:#f7f8f9;text-align:center" :blockData="blockData" @getListData="getListData"></list-page>
    </div>
</template>

<script>

import { isArray } from '@/libs/utils.js'
import NoData from '@/basecomponents/NoData/index'
import listPage from '@/components/listPageTwo/index'
import { mapGetters } from 'vuex'
export default {
    name: 'tabSendset',
    props: {
    },
    data() {
        return {
            sendList: [],
            loading: true,
            isContact: true,
            // 分页操作
            blockData: {
                pageSize: 20,
                total: 0,
                fromNum: 1
            },
            ownersSelect: '',
            owners: [],
            selectTimeAuto: '',
            pickerOptions2: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7 - 3600 * 1000 * 24 * 30 || time.getTime() > Date.now()
                },
                shortcuts: [{
                    // 今天
                    text: this.$t('mxpcweb.am.1532155762510'),
                    onClick(picker) {
                        let end = new Date()
                        let start = new Date()
                        start = new Date(new Date(new Date().setHours(0, 0, 0, 0)))
                        picker.$emit('pick', [start, end])
                    }
                }, {
                    // 昨天
                    text: this.$t('mxpcweb.am.1532155791814'),
                    onClick(picker) {
                        let end = new Date()
                        let start = new Date()
                        start = new Date(new Date(start.setHours(0, 0, 0, 0)) - 3600 * 1000 * 24 * 1)
                        end.setTime(end.getTime() - 3600 * 1000 * 24 * 1)
                        picker.$emit('pick', [start, end])
                    }
                }, {
                    // 最近一周
                    text: this.$t('mxpcweb.am.1531906012570'),
                    onClick(picker) {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                        picker.$emit('pick', [start, end])
                    }
                }, {
                    // 最近一个月
                    text: this.$t('mxpcweb.am.1531905991654'),
                    onClick(picker) {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                        picker.$emit('pick', [start, end])
                    }
                }]
            }
        }
    },
    created() {
        this.unit()
        // this.contactCheck()
    },
    methods: {
        // contactCheck() {
        //     let _this = this
        //     _this.$http.get(this.Global.baseURL + this.Global.api.v2.contact_do, {
        //         params: {
        //             type: 'isAdmin'
        //         }
        //     }).then(function (res) {
        //         if (res.body.code.toString() == _this.Global.RES_OK) {
        //             if (res.body.data.isAdmin) {
        //                 _this.isContact = true
        //             } else {
        //                 _this.isContact = false
        //             }
        //             this.unit()
        //         } else if (res.body.code.toString() != '-3') {
        //             _this.$message.error(_this.msg(res.body))
        //         }
        //     }, function (res) {
        //         // _this.loading = false;
        //         _this.$message.error(_this.$t(_this.Global.errorTitle))
        //     })
        // },
        unit() {
            let _this = this
            var p1 = new Promise((resolve, reject) => {
                if (_this.isContact) {
                    let contactData = {
                        dataType: 'contact',
                        funType: 'all'
                    }
                    _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.accountDropList_get, { params: contactData }).then(function (res) {
                        if (res.body.code.toString() == _this.Global.RES_OK) {
                            _this.owners.push({
                                ctId: '0',
                                // 全部人员
                                realName: this.$t('mxpcweb.am.1531903437658')
                            })
                            _this.owners = _this.owners.concat(res.body.data)
                            _this.ownersSelect = '0'
                            resolve([])
                        } else if (res.body.code.toString() != '-3') {
                            _this.$message(_this.msg(res.body))
                            resolve([])
                        } else {
                            resolve([])
                        }
                    }, function (res) {
                        _this.$message.error(_this.$t(_this.Global.errorTitle))
                    })
                } else {
                    _this.owners = [{
                        ctId: this.company.ctId,
                        // 我的
                        realName: this.$t('mxpcweb.am.1531901772937')
                    }]
                    _this.ownersSelect = this.company.ctId
                    resolve([])
                }
            })

            // var p2 = new Promise((resolve, reject) => {
            //     let endDate = ''
            //     let beginDate = ''
            //     if (_this.selectTimeAuto[0] && _this.selectTimeAuto[1]) {
            //         let time = new Date()
            //         let sTime = _this.timeShow_custom(_this.$m_unifiedTime(time), 'HH:mm:ss')
            //         beginDate = _this.timeShow_custom(_this.$m_unifiedTime(_this.selectTimeAuto[0]), 'YYYY-MM-DD') + ' ' + sTime
            //         endDate = _this.timeShow_custom(_this.$m_unifiedTime(_this.selectTimeAuto[1]), 'YYYY-MM-DD') + ' ' + sTime
            //     }
            //     _this.$http.get(this.Global.baseURL + this.Global.api.am.mt_header_sendrecord, { params: {
            //         subctid: '0',
            //         beginDate: beginDate,
            //         endDate: endDate
            //     } }).then(function(res) {
            //         if (res.body.code.toString() == _this.Global.RES_OK && isArray(res.body.data.dataList)) {
            //             resolve({resultCount: 10, dataList: res.body.data.dataList})
            //         } else {
            //             _this.loading = false
            //             _this.$message.error(_this.msg(res.body))
            //         }
            //     }, function(res) {
            //         _this.loading = false
            //         _this.$message.error(_this.$t(_this.Global.errorTitle))
            //     })
            // })
            Promise.all([p1]).then(function (results) {
                //  _this.sendList = results[1].dataList
                // _this.blockData.total = results[1].resultCount
            })
        },
        returnName(ctId) {
            let name = ''
            this.owners.forEach(element => {
                if (element.ctId == ctId) {
                    name = element.realName
                }
            })
            return name
        },
        getListData() {
            let _this = this
            let endDate = ''
            let beginDate = ''
            let params = {}
            if (this.selectTimeAuto[0] && this.selectTimeAuto[1]) {
                beginDate = _this.$m_unifiedTime(_this.selectTimeAuto[0])
                endDate = _this.$m_unifiedTime(_this.selectTimeAuto[1])
            }
            if (beginDate != '' && endDate != '') {
                params.dateBegin = beginDate
                params.dateEnd = endDate
            }
            // else {
            //     beginDate = _this.$m_unifiedTime('1970-01-01')
            //     let mydata = new Date()
            //     endDate = _this.$m_unifiedTime(mydata.toLocaleDateString())
            // }

            if (_this.ownersSelect != 0) {
                params.subCtId = _this.ownersSelect
            }
            _this.$http.get(this.Global.baseURL + this.Global.api.v2.statistics_Get, { params: params }).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK && isArray(res.body.data.infoList)) {
                    if (isArray(res.body.data.infoList)) {
                        this.sendList = res.body.data.infoList
                        this.blockData.total = 10
                    } else {
                        this.sendList = []
                        this.blockData.total = 0
                    }
                    _this.loading = false
                } else if (res.body.code.toString() != '-3') {
                    _this.loading = false
                    _this.$message.error(_this.msg(res.body))
                } else {
                    _this.loading = false
                }
            }, function (res) {
                _this.loading = false
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },
        deleteItem(item) {
            // 即将删除报告
            // 是否继续?
            // 提示
            // 确定
            // 取消
            this.$confirm(this.$t('mxpcweb.am.1531905600375') + '（' + item.name + '）, ' + this.$t('mxpcweb.am.1531904306656'), this.$t('mxpcweb.am.1531893166645'), {
                confirmButtonText: this.$t('mxpcweb.am.1531893129621'),
                cancelButtonText: this.$t('fumamx-web-templateeditor.1531901134034'),
                type: 'warning'
            }).then(() => {

            }).catch(() => {
            })
        }
    },
    computed: {
        ...mapGetters(['company'])
    },
    components: {
        'no-data': NoData,
        'list-page': listPage
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.tabSendset {
    height: 100%;
    .add {
        height: 52px;
        line-height: 52px;
        background: rgba(255, 255, 255, 1);
        padding: 0 10px;
    }
    .title {
        height: 40px;
        line-height: 40px;
        background: rgba(239, 242, 244, 1);
        color: RGBA(144, 147, 153, 1);
        padding: 0 35px;
    }
    .tableBox {
        font-size: 12px;
        position: absolute;
        top: 147px;
        left: 14px;
        right: 14px;
        bottom: 67px;
        overflow: auto;
        .list {
            height: 54px;
            line-height: 54px;
            padding: 0 35px;
            color: RGBA(34, 34, 34, 1);
            border-bottom: 1px solid #f4f5f6;
            background: white;
            &:hover {
                background: #fcf2f3;
            }
        }
    }
}
</style>
