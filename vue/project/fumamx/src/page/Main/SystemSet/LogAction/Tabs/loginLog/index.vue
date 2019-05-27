<template>
    <div class="loginLog MXscroll" ref="loginLog">
        <!--表单-->
        <el-form :model="formData" :inline="true" style="margin-top: 5px;">
            <!-- 选择登录时间 -->
            <el-form-item :label="$t('mxpcweb.systemset.logaction.1530342505453')">
                <!-- 请选择时间范围 -->
                <el-date-picker v-model="formData.time" format="yyyy-MM-dd HH:mm" :picker-options="pickerOptions" type="datetimerange" :placeholder="$t('mxpcweb.systemset.logaction.1530342578081')"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <!-- 查询 -->
                <el-button type="primary" @click="onSubmit">{{$t('mxpcweb.systemset.logaction.1530342744049')}}</el-button>
            </el-form-item>
        </el-form>
        <!--<div style="margin-top:-18px;"></div>-->

        <!--表格-->
        <!-- 没有查到日志 -->
        <no-data v-if='isNoData' :title="$t('mxpcweb.systemset.logaction.1530344749834')"></no-data>
        <!-- 拼命加载中... -->
        <div class="tableBox" ref="tableBox">
            <el-table v-if='tableList.length > 0' :height="tableHeight" :data="tableList" v-loading="windowLoading" :element-loading-text="$t('mxpcweb.systemset.logaction.1530344838465')">
                <!-- 登录时间 -->
                <el-table-column prop="createDate" :label="$t('mxpcweb.systemset.logaction.1530344867593')" width="130">
                    <template slot-scope="{ row }">
                        <span>{{tableListDataFormat(row.createDate)}}</span>
                    </template>
                </el-table-column>
                <!-- 登录账号 -->
                <el-table-column prop="userName" :label="$t('mxpcweb.systemset.logaction.1530345012898')" width="130"></el-table-column>
                <!-- 进入应用 -->
                <el-table-column prop="entry" :label="$t('mxpcweb.systemset.logaction.1530345035971')" width="130"></el-table-column>
                <!-- 设备 -->
                <el-table-column prop="equipment" :label="$t('mxpcweb.systemset.logaction.1530345065799')" width="260">
                    <template slot-scope="{ row }">
                        <span>{{equipment(row.os, row.agent, row.agentVersion)}}</span>
                    </template>
                </el-table-column>
                <!-- 所在地 -->
                <el-table-column prop="address" :label="$t('mxpcweb.systemset.logaction.1530345156721')">
                    <template slot-scope="{ row }">
                        <span style="margin-left:-5px;">{{areaFormat(row.fromIpC,row.ipAddress)}}</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 导航 -->
        <div class="pagination" v-if='tableList.length > 0 && paging.total > paging.eachNum'>
            <el-pagination @size-change="eachNumChange" @current-change="currentPageChange" :current-page="paging.currentPage" :page-sizes="paging.arrEachNum" :page-size="paging.eachNum" layout="total, sizes, prev, pager, next, jumper" :total="paging.total">
            </el-pagination>
        </div>
        <!-- <div v-if='paging.total <= paging.eachNum' style="margin-top:15px;padding-left:20px;">没有更多日志了</div> -->

    </div>
</template>

<script>
/**
 * 描述：系统设置=>日志与行为
 * 作者：向士健
 * 时间：2017/10/30
 */
import { isObject } from '@/libs/utils.js'
import NoData from '@/basecomponents/NoData/index'

export default {
    name: 'loginLog',
    props: {
        pickerOptions: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            tableHeight: '300',
            windowLoading: true, // 加载中开关
            isNoData: false,
            formData: {
                time: []
            },

            tableList: [],
            paging: {
                total: 0, // 总条数
                currentPage: 1, // 默认当前第几页
                eachNum: 15, // 每页条数
                arrEachNum: [15, 50, 100, 150] // 可选的每页条数
            }
        }
    },
    created() {
    },
    mounted() {
        this.getTableHeight()
        window.addEventListener('resize', this.getTableHeight)
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.getTableHeight)
    },
    methods: {
        // 设置固定高
        getTableHeight() {
            if (this.$refs.tableBox) {
                let h = this.$refs.tableBox.offsetHeight
                this.tableHeight = h
            }
        },
        // 获取默认数据
        getData() {
            this.windowLoading = true
            this.tableList = []
            this.isNoData = false

            let params = {
                type: 'login',
                pageN: this.paging.currentPage, // 当前第几页
                pageSize: this.paging.eachNum, // 每页条数
                sort: 'createDate', // 以此排序
                order: 'desc',
                startDate: this.$m_unifiedTime(this.formData.time[0]),
                endDate: this.$m_unifiedTime(this.formData.time[1])
            }

            const url = this.Global.baseURL + this.Global.api.SystemSet.logaction.operateLogQuery
            this.$http.get(url, { params })
                .then(res => {
                    this.windowLoading = false
                    if (res.body.code.toString() == this.Global.RES_OK && isObject(res.body.data)) {
                        let backData = res.body.data
                        this.tableList = Object.freeze(backData.loginList)
                        this.paging.total = backData.rowTotal
                        this.isNoData = backData.loginList.length == 0
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                }).catch(res => {
                    this.$message.error(this.$t(this.Global.errorTitle))
                })
        },
        // 输出的时间格式化一下
        tableListDataFormat(val) {
            return this.timeShow_customized(val)
        },
        // 输出的地区
        areaFormat(city, ip) {
            return '【' + city + '】' + ip
        },
        // 输出设备
        equipment(os, agent, agentVersion) {
            if (os != '') {
                return os + '/' + agent + '/' + agentVersion
            } else {
                return agent + '/' + agentVersion
            }
        },
        // 每页条数
        eachNumChange(val) {
            this.paging.eachNum = val
            this.getData()
        },
        // 当前第几页
        currentPageChange(val) {
            this.paging.currentPage = val
            this.getData()
        },
        // 查询
        onSubmit() {
            this.tableList = []
            this.paging.currentPage = 1 // 当前页置成1
            this.getData()
        }
    },
    components: {
        'no-data': NoData
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
