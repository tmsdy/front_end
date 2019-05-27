<template>
    <div class="MailAccount mainWrap  MXscroll">
        <!--大标题-->
        <!-- 邮箱账号 -->
        <div v-if="!isSetRule">
            <page-title :title="$t('mxpcweb.systemset.mailset.setindex.1528979295510')" iconfont="icon-mail"></page-title>

            <div class="mainBody " style="padding:15px 0;" ref="MailAccount">
                <popup ref="popup" @getMailList="getMailList"></popup>
                <el-form :inline="true" style="padding-bottom:0;">
                    <el-form-item label="" prop="">
                        <!-- 请选择 -->
                        <el-select v-model="dataPara.Tvalue" size="small" :placeholder="$t('mxpcweb.systemset.mailset.mailaccount.1529033277257')" style="width:200px;">
                            <!-- 我的账号 -->
                            <el-option :label="$t('mxpcweb.systemset.mailset.mailaccount.1529042687833')" value="my"> </el-option>
                            <!-- 全公司 -->
                            <el-option :label="$t('mxpcweb.systemset.mailset.mailaccount.1529042706250')" value="all"> </el-option>

                        </el-select>
                    </el-form-item>
                    <el-form-item label="" prop="">
                        <!-- 请输入邮箱名 -->
                        <!--
                        <el-input size="small" icon="search" v-model="searchForm.keywords" :on-icon-click="keywordsChanged" style="width:200px;">
                        </el-input>
                        -->

                        <el-input v-model="searchForm.keywords" size="small" :placeholder="$t('mxpcweb.systemset.mailset.mailaccount.1529042714616')" style="width:215px;"></el-input>

                    </el-form-item>
                    <el-form-item>
                        <!-- 搜索 -->
                        <el-button type="primary" size="small" @click="keywordsChanged">{{$t('mxpcweb.systemset.mailset.setindex.1528978960400')}}</el-button>
                    </el-form-item>
                    <el-form-item>
                        <!-- 添加邮箱 -->
                        <el-button type="primary" size="small" @click="showMail()">{{$t('mxpcweb.systemset.mailset.mailaccount.1529042617566')}}</el-button>
                    </el-form-item>
                </el-form>

                <!--表格-->

                <el-table :data="mailInfoList" class="columnClass" :height="listHeight">
                    <!-- 邮箱账号 -->
                    <el-table-column prop="mailAddress" :label="$t('mxpcweb.systemset.mailset.setindex.1528979295510')" align="center"></el-table-column>
                    <!-- 拥有人 -->
                    <el-table-column prop="owner" :label="$t('mxpcweb.systemset.mailset.mailaccount.1529042715331')" align="center"> </el-table-column>
                    <!-- 账号类型 -->
                    <el-table-column prop="prop" :label="$t('mxpcweb.systemset.mailset.mailaccount.1529042743901')" align="center">
                        <template slot-scope="scope">
                            <!-- '公共':'个人' -->
                            {{ mailInfoList[scope.$index].prop == 0 ? $t('mxpcweb.systemset.mailset.mailaccount.1529040024691'):$t('mxpcweb.systemset.mailset.mailaccount.1529040021925') }}
                        </template>
                    </el-table-column>
                    <!-- 邮箱协议 -->
                    <el-table-column prop="mailType" :label="$t('mxpcweb.systemset.mailset.mailaccount.1529042744455')" align="center">
                        <template slot-scope="scope">
                            {{ mailInfoList[scope.$index].serverType == 0 ? 'pop':mailInfoList[scope.$index].serverType == 1?'imap':'smtp' }}
                        </template>
                    </el-table-column>
                    <!-- 分发规则 -->
                    <el-table-column prop="" align="center">
                        <template slot-scope="scope">
                            <div class="pull-left" v-if="scope.row.prop==0">
                                <template v-if="scope.row.ruleSize==0">
                                    {{$t('mxpcweb.systemset.mailset.mailaccount.1532072508902')}}
                                </template>
                                <span v-else v-html="$t('mxpcweb.systemset.mailset.mailaccount.1532072603941',[scope.row.ruleSize])">

                                </span>

                                <el-button size="mini" class="setPulMailBtn" @click='setRule(scope.$index, scope.row)'>{{$t('mxpcweb.systemset.mailset.mailaccount.1532072544160')}}</el-button>
                            </div>
                        </template>
                    </el-table-column>
                    <!-- 操作 -->
                    <el-table-column prop="" :label="$t('mxpcweb.systemset.mailset.mailaccount.1529042764362')" align="center">
                        <template slot-scope="scope">

                            <!-- 删除 -->
                            <!-- <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">{{$t('mxpcweb.systemset.mailset.mailaccount.1529042765009')}}</el-button> -->

                            <div class="pull-right">
                                <i class="iconfont icon-del" @click="handleDelete(scope.$index, scope.row)">

                                </i>
                            </div>
                            <!-- 编辑 -->
                            <!-- <el-button size="mini" type="info" @click="handleEdit(scope.$index, scope.row,'edit')">{{$t('mxpcweb.systemset.mailset.mailaccount.1529042764836')}}</el-button> -->

                            <div class="pull-right">
                                <i class="iconfont icon-edit-square" @click="handleEdit(scope.$index, scope.row,'edit')">

                                </i>
                            </div>
                            <!-- 查看 -->
                            <!-- <el-button size="mini" type="info" @click="handleEdit(scope.$index, scope.row,'view')">{{$t('mxpcweb.systemset.mailset.mailaccount.1529042764619')}}</el-button> -->
                            <div class="pull-right">
                                <i class="iconfont icon-eye" @click="handleEdit(scope.$index, scope.row,'view')">

                                </i>
                            </div>

                        </template>
                    </el-table-column>
                </el-table>

                <!-- 分页 -->
                <div class="pagination">
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPageIndex" :page-size="paging.eachNum" :page-sizes="paging.arrEachNum" :total="paging.total" layout="total, sizes, prev, pager, next, jumper">
                    </el-pagination>
                </div>
            </div>
        </div>
        <rule-set ref="ruleSet" @goback="ruleSetBack"></rule-set>
    </div>
</template>
<script>
import PageTitle from '@/components/PageTitle/index' // 大标题
import Popup from './Popup/index.vue'
import { isArray, isObject, decrypt } from '@/libs/utils.js'
import { mapGetters } from 'vuex'
import RuleSet from './RuleSet/index'
/**
 * 描述：系统设置=>邮件设置
 * 作者：UI:向士健/逻辑:陈媛媛/后台:刘孟金
 * 时间：2017/11/8
 */
export default {
    name: 'MailAccount',
    props: {},
    data() {
        let _this = this
        return {
            currentPageIndex: 1,
            // 列表
            mailInfoList: [
            ],
            dataPara: {
                Tvalue: 'my'
            },
            searchForm: {
                keywords: ''
            },
            // 编辑器配置
            config: {
                initialContent: _this.$t('mxpcweb.systemset.mailset.mailaccount.1529042743901'), // "请输入签名内容", //初始化编辑器的内容,也可以通过textarea/script给值，看官网例子
                initialFrameHeight: 260, // 内容初始高度
                serverUrl: ''
            },
            paging: {
                total: 0, // 总条数
                currentPage: 1, // 默认当前第几页
                eachNum: 10, // 每页条数
                arrEachNum: [10, 20, 30] // 可选的每页条数
            },
            mailsDetail: {

            },
            listHeight: '0',
            isSetRule: false
        }
    },
    created() {
        let _this = this
        _this.getMailList()
        _this.$set(_this.dataPara, 'Tvalue', 'my')
    },
    mounted() {
        let _this = this
        setTimeout(function () {
            _this.getWinHeight()
        }, 200)
        // window.onresize = function temp() {
        //     _this.getWinHeight()
        // }
    },
    computed: {
        ...mapGetters(['company', 'personalInfo', 'screenHeight']),
        ...mapGetters('mail', [
            'subordinateCtid'
        ])
    },
    methods: {
        // 设置固定高
        getWinHeight() {
            const _this = this
            let winHeight = document.body.clientHeight
            _this.$refs.MailAccount.style.height = winHeight - 130 + 'px'
            this.listHeight = winHeight - 250
        },
        async   GetRightsCheck(data) {
            let blg = false
            let res = await this.$http.get(this.Global.baseURL + this.Global.api.Mail.GetRightsCheck, {
                params: data
            })
            if (res.body.code.toString() == this.Global.RES_OK) {
                blg = true
            } else {
                this.$message.error(this.msg(res.body))
                blg = false
            }
            return blg
        },
        getMailList() {
            let _this = this
            if (_this.dataPara.Tvalue == '') {
                _this.dataPara.Tvalue = 'my'
            }
            _this.$http.get(_this.Global.baseURL + _this.Global.api.SystemSet.mailset.mailaccount.accounts, { params: { type: _this.dataPara.Tvalue, keywords: _this.searchForm.keywords, pageN: _this.paging.currentPage, pageSize: _this.paging.eachNum } }).then(
                function (res) {
                    if (res.body.code.toString() == _this.Global.RES_OK && isObject(res.body.data) && isArray(res.body.data.mailAccountsInfo)) {
                        _this.mailInfoList = res.body.data.mailAccountsInfo
                        _this.paging.total = res.body.data.rowTotal
                    } else if (res.body.code.toString() == _this.Global.RES_OK) {
                        _this.avatar = ''
                        _this.mailInfoList = []
                        _this.paging.total = 0
                        _this.$message(res.data.msg)
                    } else {
                        _this.$message.error(res.data.msg)
                    }
                },
                function (res) {
                    _this.$message.error(_this.$t(_this.Global.errorTitle))
                }
            )
        },
        // 操作编辑
        async handleEdit(index, row, type) {
            let flg = true
            if (type == 'edit') {
                flg = await this.GetRightsCheck({ 'optCode': 'otEdit', 'moduleCode': 'SY015', 'targetCtid': row.ctid })
            }
            if (!flg) {
                return
            }
            let _this = this
            _this.$http.get(_this.Global.baseURL + _this.Global.api.SystemSet.mailset.mailaccount.mailsAccount, { params: { accountId: row.accountId } }).then(
                function (res) {
                    if (res.body.code.toString() == _this.Global.RES_OK && isObject(res.body.data) && isArray(res.body.data.configs)) {
                        _this.mailsDetail = res.body.data
                        _this.mailsDetail.recPassword = decrypt(res.body.data.recPassword)
                        if (type == 'view') {
                            this.$refs['popup'].showSer('1', _this.mailsDetail, row.ctid, false)
                        } else {
                            this.$refs['popup'].showSer('1', _this.mailsDetail, row.ctid, true)
                        }
                    } else {
                        _this.$message.error(res.data.msg)
                    }
                },
                function (res) {
                    _this.$message.error(_this.$t(_this.Global.errorTitle))
                }
            )
        },
        // 操作删除
        async handleDelete(index, row) {
            let blg = await this.GetRightsCheck({ 'optCode': 'otDelete', 'moduleCode': 'SY015', 'targetCtid': row.ctid })
            if (!blg) {
                return
            }
            let _this = this
            let Rowid = row.accountId.toString()
            // _this.$confirm("此操作将永久删除, 是否继续？", "提示", {
            _this.$confirm(_this.$t('mxpcweb.systemset.mailset.mailaccount.1529042987569'), _this.$t('mxpcweb.systemset.mailset.mailaccount.1529042990926'), {
                confirmButtonText: _this.$t('mxpcweb.systemset.mailset.mailaccount.1529042997772'), // "确定",
                cancelButtonText: _this.$t('mxpcweb.systemset.mailset.mailaccount.1529042998054'), // "取消",
                type: 'warning'
            }).then(() => {
                _this.$http.post(_this.Global.baseURL + _this.Global.api.SystemSet.mailset.mailaccount.accountsDelete, { accountId: Rowid }).then(function (res) {
                    if (res.body.code.toString() == _this.Global.RES_OK) {
                        _this.$message({
                            type: 'success',
                            message: _this.$t('mxpcweb.systemset.mailset.mailaccount.1529043014812')// "删除成功!"
                        })
                        _this.getMailList()
                    } else {
                        _this.$message.error(_this.msg(res.body))
                    }
                },
                    function (res) {
                        _this.$message.error(_this.$t(_this.Global.errorTitle))
                    })
            }).catch(() => {

            })
        },
        /* 设置公共邮箱规则 */
        setRule(index, row) {
            this.isSetRule = true

            this.$refs.ruleSet.open(row)
        },
        /* 分发规则返回邮箱设置 */
        ruleSetBack() {
            /* 刷新页面 */
            this.isSetRule = false
        },
        /**
         * 每页数量改变
         */
        handleSizeChange(val) {
            this.paging.eachNum = val
            this.getMailList()
        },
        /** @augments
         * 页数变更
         */
        handleCurrentChange(val) {
            this.paging.currentPage = val
            this.getMailList()
        },
        /**
         * 关键字搜索
        */
        keywordsChanged() {
            this.getMailList()
        },
        async   showMail() {
            let blg = await this.GetRightsCheck({ 'optCode': 'otNew', 'moduleCode': 'SY015', 'targetCtid': this.company.ctId })
            if (!blg) {
                return
            }
            this.$refs['popup'].showMail(1)
        }
    },
    watch: {
        dataPara: {
            handler(curVal, oldvalue) {
                this.getMailList()
            },
            deep: true
        },
        screenHeight (val) { // 监听屏幕宽度变化
            this.getWinHeight()
        }

    },

    components: {
        'page-title': PageTitle,
        'popup': Popup,
        'rule-set': RuleSet
    }

}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
