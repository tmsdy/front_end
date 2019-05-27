<template>
    <div class="DialogMailLogs">
        <!-- 接收日志 -->
        <el-dialog v-dialogDrag :title="$t('mxpcweb.mail.1528955790915')" :visible.sync="isOpen" custom-class="width620" :close-on-click-modal="false" >
            <div class="text-left" v-if="mailAccountList.length>0">
                <!-- 请选择邮箱 -->
                <el-select v-model="selectValue" @change="changeMailAccount" :placeholder="$t('mxpcweb.mail.1528955815994')" style="width:370px;">
                    <el-option v-for="(item,index) in mailAccountList" :key="index" :label="item.mailAccount" :value="item.mailAccount"> </el-option>
                </el-select>
            </div>
            <div class="logBody MXscroll" v-if="mailLogList.length>0">
                <dl v-if="selectedMailAccount.status != '0' && selectedMailAccount.msg != undefined && selectedMailAccount.msg != null &&  selectedMailAccount.msg != '' ">
                    <dt></dt>
                    <dd>
                        <span class="text-red">{{selectedMailAccount.doneTime}} {{selectedMailAccount.msg}}</span>
                        <!-- //修改邮箱设置 -->
                        <span class="text-blue text-hover text_underline" @click="goMailAccount">{{$t('mxpcweb.mail.1528955846770')}}</span>
                        <!-- <span class="text-blue text-hover text_underline" @click="reReceiveMail">再次尝试接收</span> -->
                    </dd>
                </dl>
                <dl v-if="selectedMailAccount.processDetails  != undefined && selectedMailAccount.processDetails  != null &&  selectedMailAccount.processDetails  != '' ">
                    <dt></dt>
                    <dd>
                        <span class="text-red">{{selectedMailAccount.doneTime}} {{selectedMailAccount.processDetails}}</span>
                    </dd>
                </dl>
                <dl v-if="selectedMailAccount.currentUpdatedCount  != undefined && selectedMailAccount.currentUpdatedCount  != null
                                    &&  selectedMailAccount.currentUpdatedCount  != '' ">
                    <dt></dt>
                    <dd>
                        <!-- 本次处理邮件数量： -->
                        <span>{{$t('mxpcweb.mail.1528955886970')}}：{{selectedMailAccount.currentUpdatedCount}}</span>
                    </dd>
                </dl>
                <template v-if="mailLogList!=null && mailLogList.length > 0">
                    <dl v-for="(item,index) in mailLogList" :key="index">
                        <dt></dt>
                        <dd>
                            {{item}}
                        </dd>
                    </dl>
                </template>
            </div>
            <!-- 暂时无日志 -->
            <no-data v-if="mailAccountList.length==0&&mailLogList.length==0" :title="$t('mxpcweb.mail.1547445687465')" class="marginTop15" style="background: transparent;"></no-data>
        </el-dialog>
    </div>
</template>

<script>
import { isArray, isObject } from '@/libs/utils.js'
import NoData from '@/basecomponents/NoData/index'
/**
 * 描述：邮件部分
 * 作者：向士健(CSS) / ***(API)
 * 时间：2017/12/11
 */
export default {
    name: 'DialogMailLogs',
    props: {},
    data() {
        return {
            isOpen: false, // 弹窗开关
            selectValue: '',
            mailAccountList: [],
            selectedMailAccount: {},
            mailLogList: []
        }
    },
    computed: {},
    methods: {
        dateFormat(dateValue) {
            return this.$m_unifiedTime(dateValue, { format: 'YYYY-MM-DD hh:mm' })
        },
        // 父组件来调用
        isDialog(to) {
            if (to == 'open') {
                this.isOpen = true
                this.getMailStatus()
            } else {
                this.isOpen = false
                this.mailAccountList = []
            }
        },
        /**
           * 获取收件错误提示
           */
        getMailStatus() {
            let _this = this
            _this.$http.get(_this.Global.baseURL + _this.Global.api.Mail.getMailStatus, {}).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    if (isArray(res.body.data)) {
                        var tipText = ''
                        // 根据状态值来获取有问题的账户信息（列表）
                        res.body.data.forEach(element => {
                            if (element.status == '-1') {
                                tipText =
                                    tipText + element.mailAccount + ':'
                                tipText = tipText + _this.$t('mxpcweb.mail.1530002866891')// "账号认证失败;";
                            } else if (element.status == '-2') {
                                tipText =
                                    tipText + element.mailAccount + ':'
                                tipText = tipText + _this.$t('mxpcweb.mail.1530002887711')// "超时;";
                            }
                        })
                        if (tipText != '') {
                            // 不为空则说明有错误邮箱，如果为空则说明都是对的 不需要显示了。
                            _this.isShowReceiveMailError = true
                            _this.$message.error(tipText)
                        }
                        // _this.mailErrorList = res.body.data
                        _this.initData(res.body.data)
                    }
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
            },
                function (res) {
                    _this.$message.error(_this.$t(_this.Global.errorTitle))
                }
            )
        },
        /**
              初始化数据
             */
        initData(dataList) {
            this.mailAccountList = dataList
            if (this.mailAccountList != null && this.mailAccountList.length > 0) {
                this.selectedMailAccount = this.mailAccountList[0]
                this.getLog(this.selectedMailAccount.latestLog)
                this.selectValue = this.selectedMailAccount.mailAccount
            }
        },
        /**
                值改变
             */
        changeMailAccount(mailAccount) {
            var needContinue = true
            this.selectedMailAccount = {}
            this.mailAccountList.forEach(element => {
                if (needContinue) {
                    if (element.mailAccount == mailAccount) {
                        this.selectedMailAccount = element
                        this.getLog(this.selectedMailAccount.latestLog)
                        needContinue = false
                    }
                }
            })
        },
        /**
         * 获取日志列表
         */
        getLog(url) {
            let _this = this
            if (url != undefined && url != null && url != '') {
                this.$http
                    .get(this.Global.baseURL + this.Global.api.UniversalInterface.log, {
                        params: {
                            mailLogUrl: url }
                    })
                    .then(
                        function (res) {
                            if (res.body && res.body.code.toString() == _this.Global.RES_OK && isObject(res.body.data) &&
                                res.body.data.mailLog != undefined && res.body.data.mailLog != null && res.body.data.mailLog != '') {
                                _this.mailLogList = res.body.data.mailLog.split('\r\n')
                            } else {
                                _this.mailLogList = []
                                // _this.$message.error(_this.msg(res.body));
                            }
                        },
                        function (res) { }
                    )
            } else {
                _this.mailLogList = []
            }
        },
        /**
         * 重新收邮件
         */
        reReceiveMail() {
            this.isOpen = false
            this.$emit('reReceiveMail')
        },
        /**
         * 跳入账户设置页面
         */
        goMailAccount() {
            this.isOpen = false
            this.$router.push('/main/systemset/mailset/mailaccount')
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
