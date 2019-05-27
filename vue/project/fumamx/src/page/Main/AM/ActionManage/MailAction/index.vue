<template>
    <div class="MailAction">
        <!-- 客户抽屉 -->
        <customer-slider></customer-slider>
        <template v-if="tabData=='0'">
            <page-title :showTitle="false"></page-title>
            <div class="actionManageBox MXscroll" :class="{'hasPage':page.total>page.size}" v-loading="loading">
                <div class="toolBar clearfix">
                    <div class="pull-right">
                        <!-- 搜索邮件名称 -->
                        <el-input class="search" :placeholder="$t('mxpcweb.am.1543297998126')" icon="search" v-model="searchKey" :on-icon-click="getListData" @keyup.enter.native="getListData">
                        </el-input>
                        <!-- 新建触发邮件 -->
                        <el-button type="primary" class="button" @click="tabDataCheck('1')">{{$t('mxpcweb.am.1543297998877')}}</el-button>
                    </div>
                </div>
                <div class="table">
                    <el-row class="headerBox">
                        <el-col class="item ellipsis" :span="4" style="padding-left:30px;">
                            <!-- 方案名称 -->
                            {{$t('mxpcweb.am.1543298028534')}}
                        </el-col>
                        <el-col class="item ellipsis" :span="3">
                            <!-- 所属模块 -->
                            {{$t('mxpcweb.am.1541590431848')}}
                        </el-col>
                        <el-col class="item ellipsis" :span="4">
                            <!-- 发送方式 -->
                            {{$t('mxpcweb.am.1545025633788')}}
                        </el-col>

                        <el-col class="item ellipsis" :span="3">
                            <!-- 开发信模版 -->
                            {{$t('mxpcweb.am.1543298040045')}}
                        </el-col>
                        <el-col class="item ellipsis" :span="4">
                            <!-- 创建时间 -->
                            {{$t('mxpcweb.am.1543298040294')}}
                        </el-col>
                        <el-col class="item ellipsis" :span="3">
                            <!-- 创建人 -->
                            {{$t('mxpcweb.am.1543298040653')}}
                        </el-col>
                    </el-row>
                </div>
                <div class="tableBox" v-if="page.total > 0">
                    <el-row class="list" v-for="(item, index) in mailList" :key="index">
                        <el-col class="item ellipsis" :span="4" style="padding-left:30px;">
                            {{item.detailActionName}}&nbsp;
                        </el-col>
                        <el-col class="item ellipsis" :span="3">
                            {{item.moduleName}}&nbsp;
                        </el-col>
                        <el-col class="item ellipsis" :span="4">
                            <!-- 平台推广发送/ 普通邮箱发送 -->
                            {{item.sendType==1?$t('mxpcweb.am.1545098731673'):$t('mxpcweb.am.1545098731958')}}&nbsp;
                        </el-col>
                        <el-col class="item ellipsis" :span="3">
                            {{item.templateName}}&nbsp;
                        </el-col>
                        <el-col class="item ellipsis" :span="4">
                            {{item.createDate}}&nbsp;
                        </el-col>
                        <el-col class="item ellipsis" :span="3">
                            {{item.createRealName}}&nbsp;
                        </el-col>
                        <el-col :span="3" class="item listCol4">
                            <div class="listCol4Item">
                                <!-- 编辑 -->
                                <span class="optButton left10" style="margin-left:10px;" @click="toEditThis(item)" :title="$t('mxpcweb.am.1531893071733')">
                                    <i class="iconfont icon-edit" style="font-size: 12px;"></i>
                                </span>
                                <!-- 查看 -->
                                <span class="optButton left10" style="margin-left:10px;" @click="toView(item)" :title="$t('mxpcweb.am.1531978974212')">
                                    <i class="iconfont icon-orders" style="font-size: 12px;"></i>
                                </span>
                                <!-- 删除 -->
                                <span class="optButton left10" style="margin-left:10px;" @click="deleteItem(item)" :title="$t('mxpcweb.am.1531893085173')">
                                    <i class="iconfont icon-del" style="font-size: 12px;"></i>
                                </span>
                            </div>
                        </el-col>
                    </el-row>
                </div>
                <no-data v-else style="background:rgba(255,255,255,0)"></no-data>

                <!--分页-->
            </div>
            <div class="page" v-if="page.total>page.size&&!loading">
                <el-pagination @current-change="changePage" background layout="total,prev,pager,next" :page-size="page.size" :current-page="page.now" :total="page.total">
                </el-pagination>
            </div>

        </template>
        <add-work v-else-if="tabData=='1'" @pageBack="tabDataCheck('0')"></add-work>
        <add-work v-else-if="tabData=='2'" type="edit" :editItem="editItem" @pageBack="tabDataCheck('0')"></add-work>
        <view-work v-else-if="tabData=='3'" :viewItem="editItem" @pageBack="tabDataCheck('0')"></view-work>
    </div>
</template>

<script>
import NoData from '@/basecomponents/NoData/index'
import PageTitle from '@/components/PageTitle/index'
import addWork from './addWork'
import viewWork from './viewWork/index'
import CustomerSlider from '@/components/CustomerSlider/index.vue'
export default {
    name: 'MailAction',
    data() {
        return {
            tabData: '0',
            searchKey: '',
            mailList: [],
            loading: false,
            // 分页操作
            page: {
                now: 1,
                size: 10,
                total: 0
            },
            editItem: {},
            pageId: ''
        }
    },
    created() {
        this.getListData()
    },
    methods: {
        // 去编辑这条列表，打开编辑器
        toEditThis(item) {
            this.editItem = item
            this.tabData = '2'
        },
        toView(item) {
            this.editItem = item
            this.tabData = '3'
        },
        async deleteItem(item) {
            // 是否删除邮件通知:
            // 提示
            try {
                await this.$confirm(this.$t('mxpcweb.am.1543298050861') + ':(' + item.detailActionName + ')?', this.$t('mxpcweb.am.1531893166645'), {
                    // 确定
                    confirmButtonText: this.$t('mxpcweb.am.1531893129621'),
                    // 取消
                    cancelButtonText: this.$t('mxpcweb.am.1531893140621'),
                    type: 'warning'
                })

                let url = this.Global.baseURL + this.Global.api.v2.autoStrategy_actions
                let params = {
                    actionId: item.actionId,
                    detailActionId: item.detailActionId
                }
                this.$http.delete(url, { params })
                    .then(res => {
                        if (res.body.code.toString() == this.Global.RES_OK) {
                            this.getListData()
                            this.$message.success(this.msg(res.body))
                        } else {
                            this.$message.error(this.msg(res.body))
                        }
                    })
                    .catch(res => {
                        this.$message.error(this.$t(this.Global.errorTitle))
                    })
            } catch (error) {

            }
        },
        changePage(i) {
            this.page.now = i
            this.getListData()
        },

        tabDataCheck(type) {
            this.tabData = type
            if (type == '0') {
                this.getListData()
                this.$emit('tabToggle', true)
            } else {
                this.$emit('tabToggle', false)
            }
        },
        getListData() {
            this.loading = true
            let params = {
                pageN: this.page.now,
                pageSize: this.page.size,
                actionId: '1',
                type: 'list'
            }
            if (this.searchKey != '') {
                params.wildcardWords = this.searchKey
            }
            let url = this.Global.baseURL + this.Global.api.v2.autoStrategy_actions
            this.$http.get(url, { params })
                .then(res => {
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        this.mailList = res.body.data.list
                        this.page.total = res.body.data.totalNum
                        this.loading = false
                    } else {
                        this.loading = false
                        this.page.total = 0
                        this.$message.error(this.msg(res.body))
                    }
                })
                .catch(err => {
                    this.loading = false
                    this.$message.error(this.$t(this.Global.errorTitle))
                })
        }
    },
    components: {
        'page-title': PageTitle,
        'no-data': NoData,
        'add-work': addWork,
        'customer-slider': CustomerSlider,
        'view-work': viewWork
    }
}
</script>
<style lang='less' rel='stylesheet/less' scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
