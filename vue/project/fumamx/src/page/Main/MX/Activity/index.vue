<template>
    <div class="ImgManage">
        <!-- <page-title title="市场活动" iconfont="iconfont icon-gift"> </page-title> -->
        <page-title :showTitle="false" title="市场活动" iconfont="icon-setting"></page-title>
        <template v-if="tabModel=='1'">
            <!-- 列表部分 -->
            <div class="actionManageBox MXscroll" v-if="isShowList">
                <div class="toolBar clearfix">
                    <el-button class="pull-right" type="primary" @click="isShowList = false;">创建活动</el-button>
                </div>

                <el-table class="detailTable widthFull" :data="tableData3" :height="tableHeight" v-if="tableData3.length > 0" v-loading="isLoading">
                    <el-table-column prop="activityName" label="活动名称"> </el-table-column>
                    <el-table-column prop="beginDate" label="开始时间" align="center"> </el-table-column>
                    <el-table-column prop="endDate" label="结束时间" align="center"> </el-table-column>
                    <!-- <el-table-column prop="pictureCode" label="展示位置" align="center">
          <template slot-scope="{ row }">
            {{row.showPosition == 1 ? 'test' : ''}} -->
                    <!-- <a :href="getGlobalImgSrc(row.pictureCode, '')" data-lightbox="FumaMX" data-title="FumaMX" style="margin-top:10px;display:block;">
              <img :src="getGlobalImgSrc(row.pictureCode, '99x99')" />
            </a> -->
                    <!-- </template> -->
                    <!-- </el-table-column> -->
                    <el-table-column prop="mapArea" label="活动区域" width="250">
                        <template slot-scope="{ row }" v-if="row.mapArea.length>0">
                            <span v-for="(item,index) in row.mapArea" :key="index" class="depart">{{item}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="" label="" width="200">
                        <template slot-scope="{ row }">
                            <div class="operation">
                                <span @click="doDetail(row)"><i class="iconfont icon-edit"></i></span>
                                <!-- <span @click="delItem(row)"><i class="iconfont icon-del"></i></span> -->
                            </div>
                        </template>
                    </el-table-column>
                </el-table>

                <no-data v-if="tableData3.length === 0" style="background:rgba(255,255,255,0)"></no-data>

                <div class="paging">
                    <el-pagination :current-page="page.now" @current-change="changePage" layout="total,prev, pager, next" :page-size="page.size" :total="page.total"></el-pagination>
                </div>

            </div>

            <!-- 编辑 -->
            <activity-edit ref="ActivityEdit" v-else @toShowList="isShowList = true; getListData()" :areaList="areaList"></activity-edit>
        </template>

        <template v-if="tabModel=='2'">
            <activity-area></activity-area>
        </template>
        <div class="pageTab" style="z-index:0">
            <el-tabs v-model="tabModel" @tab-click="handleClick" class="subTabs-pullRight">
                <el-tab-pane label="市场活动" name="1">
                </el-tab-pane>
                <el-tab-pane label="活动区域" name="2">
                </el-tab-pane>
            </el-tabs>
        </div>

    </div>
</template>
<script>
import { isArray } from '@/libs/utils.js'
import NoData from '@/basecomponents/NoData/index'
import PageTitle from '@/components/PageTitle/index'
import ActivityEdit from './ActivityEdit'
import ActivityArea from './ActivityArea'

export default {
    name: 'ImgManage',
    data() {
        return {
            tabModel: '1',
            isLoading: false,
            page: {
                now: 1,
                size: 20,
                total: 0
            },
            tableData3: [],
            tableHeight: '333',
            isShowList: true,
            areaList: []
        }
    },
    async created() {
        await this.getAreaListData()
        await this.getListData()
    },
    mounted() {
        setTimeout(() => {
            this.getWinHeight()
        }, 200)
        $(window).resize(() => {
            this.getWinHeight()
        })
    },
    computed: {
    },
    methods: {
        handleClick() {
            if (this.tabModel == '1') {
                this.getListData()
            }
        },
        // 设置固定高
        getWinHeight() {
            let winHeight = document.body.clientHeight
            this.tableHeight = winHeight - 230
        },
        changePage(val) {
            this.page.now = val
            this.getListData()
        },
        doDetail(item) {
            this.isShowList = false
            this.$nextTick(_ => {
                this.$refs.ActivityEdit.editItem(item)
            })
        },
        // 操作
        doListData(item, operation) {
            let data = {
                type: operation,
                pictureIds: item.pictureId
            }
            this.$http
                .put(this.Global.baseURL + this.Global.api.v2.imgManage, data)
                .then(
                    res => {
                        this.submiting = false
                        if (res.body.code.toString() == this.Global.RES_OK) {
                            this.$message.success(res.body.msg)
                            this.getListData()
                        } else {
                            this.$message.error(res.body.msg)
                        }
                    },
                    res => {
                        this.$message.error(this.$t(this.Global.errorTitle))
                    }
                )
        },
        delItem(item) {
            let title = this.$t('fumamx-web-templateeditor.1531904183099') // 提示
            let msg = '确定删除这个图片吗？' // 确定删除这个模板吗？
            let sure = this.$t('fumamx-web-templateeditor.1531901211609') // 确定
            let cancel = this.$t('fumamx-web-templateeditor.1531901134034') // 取消
            this.$confirm(msg, title, {
                confirmButtonText: sure,
                cancelButtonText: cancel,
                type: 'warning'
            })
                .then(() => {
                    this.doListData(item, 'delete')
                })
                .catch(() => { })
        },
        // 查列表数据
        async getListData() {
            await this.$http
                .get(this.Global.baseURL + this.Global.api.v2.activity, { params: { type: 'list' } })
                .then(
                    res => {
                        // this.isLoading = false
                        if (res.body.code.toString() == this.Global.RES_OK && isArray(res.body.data)) {
                            this.tableData3 = res.body.data
                            this.tableData3.forEach(item => {
                                let area = item.area.split(',')
                                let mapArea = []
                                area.forEach(ele => {
                                    let filterAreaId = this.areaList.filter(e => e.areaId == ele)
                                    if (filterAreaId[0]) {
                                        mapArea.push(filterAreaId[0].areaName)
                                    }
                                })
                                item.mapArea = mapArea
                            })
                            this.page.total = res.body.data.length
                        } else {
                            this.$message.error(res.body.msg)
                        }
                    },
                    res => {
                        this.$message.error(this.$t(this.Global.errorTitle))
                    }
                )
        },
        // 查活动列表
        async getAreaListData() {
            await this.$http
                .get(this.Global.baseURL + this.Global.api.v2.activityArea, { params: { type: 'inuse' } })
                .then(
                    res => {
                        if (res.body.code.toString() == this.Global.RES_OK) {
                            this.areaList = res.body.data
                        } else {
                            this.$message.error(res.body.msg)
                        }
                    },
                    res => {
                        this.$message.error(this.$t(this.Global.errorTitle))
                    }
                )
        }
    },
    components: {
        'activity-edit': ActivityEdit,
        'page-title': PageTitle,
        'no-data': NoData,
        'activity-area': ActivityArea
    },
    watch: {
        '$route': function () {
            this.isShowList = true // 切走，恢复显示列表
        }
    }
}
</script>

<style lang='less' rel='stylesheet/less' scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
