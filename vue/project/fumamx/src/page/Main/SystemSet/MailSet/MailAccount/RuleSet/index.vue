<template>
    <div class="publicMailRuleSet" v-if="setShow">
        <!-- 邮箱账号> 公共邮箱分发规则设置 -->
        <page-detail :title="$t('mxpcweb.systemset.mailset.setindex.1528979295510')" :detailTitle="$t('mxpcweb.systemset.mailset.mailaccount.1532072345670')" iconfont="icon-mail" @toList="pageBack()"></page-detail>

        <div v-loading="isLoading" class="mainBody MXscroll">
            <transition name="el-fade-in-linear">
                <div v-if="!isLoading">
                    <div class="headerShow">
                        <el-form label-position="left" label-width="96px">
                            <!-- 邮箱 -->
                            <el-form-item class="showItem" :label="$t('mxpcweb.systemset.mailset.mailaccount.1533537709898')">
                                <div>{{mailItem.mailAddress}}</div>
                            </el-form-item>
                            <!-- 允许接收 -->
                            <el-form-item class="showItem" :label="$t('mxpcweb.systemset.mailset.mailaccount.1533538090291')">
                                <div class="allowReceiveList">
                                    <el-button v-for="(item,index) in receiverArr" :key="index" size="small">
                                        {{item.sendName}}
                                        <i class="iconfont icon-close" v-if="canEdit" @click.stop="receiverRemove(index,item)"></i>
                                    </el-button>

                                    <el-dropdown trigger="click" @command="receiverSelect">
                                        <el-button type="primary" size="small" :disabled="!canEdit">
                                            <!--  添加 -->
                                            {{$t('mxpcweb.systemset.mailset.mailaccount.1529032463835')}}
                                        </el-button>
                                        <el-dropdown-menu slot="dropdown" class="MXscroll" style="overflow:auto;min-height:100px;max-height:200px;">
                                            <el-dropdown-item v-for="(item,index) in personList" :command="index" :disabled="dropFilter(receiverArr,item)" :key="index"> {{item.realName}}</el-dropdown-item>
                                        </el-dropdown-menu>
                                    </el-dropdown>
                                </div>
                            </el-form-item>
                            <!-- 允许发送 -->
                            <el-form-item class="showItem" :label="$t('mxpcweb.systemset.mailset.mailaccount.1533538291954')">
                                <div class="allowSendList">

                                    <!-- <el-button v-for="(item,index) in senderArr" :key="index" size="small">
                                        {{item.sendName}}
                                        <i class="iconfont icon-close" v-if="canEdit" @click.stop="senderRemove(index)"></i>
                                    </el-button> -->
                                    <!-- <div class="senderClass" v-for="(item,index) in senderArr" :key="index">
                                        <span> {{item.sendName}}</span>
                                        <span>|</span>
                                        <span>显示名称：</span>
                                        <span>{{item.sendName}}</span>
                                        <span><input class="inputclass" type="text" @blur="changeName($event)"></span>
                                        <span>
                                            <i class="iconfont icon-edit-square"></i>
                                        </span>
                                        <span>
                                            <i class="iconfont icon-close" v-if="canEdit" @click.stop="senderRemove(index)"></i>
                                        </span>
                                    </div> -->
                                    <sender-component ref="SenderComponent" v-for="(item,index) in senderArr" :key="index" :Detail="item" :index="index" @senderRemove="senderRemove" @changeName="changeName"></sender-component>
                                    <el-dropdown trigger="click" @command="senderSelect">
                                        <el-button type="primary" size="small" :disabled="!canEdit">
                                            <!--  添加 -->
                                            {{$t('mxpcweb.systemset.mailset.mailaccount.1529032463835')}}
                                        </el-button>
                                        <el-dropdown-menu slot="dropdown" class="MXscroll" style="overflow:auto;min-height:100px;max-height:200px;">
                                            <el-dropdown-item v-for="(item,index) in personList" :command="index" :disabled="dropFilter(senderArr,item)" :key="index"> {{item.realName}}</el-dropdown-item>
                                        </el-dropdown-menu>
                                    </el-dropdown>
                                </div>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div class="bodyShow">
                        <div class="toolTab">
                            <el-button :disabled="!canEdit" type="primary" class="pull-right addRuleBtn" @click="createRule" size="small">{{$t('mxpcweb.systemset.mailset.mailaccount.1532072392373')}}</el-button>
                        </div>
                        <el-table class="ruleTable" :data="ruleList" style="width: 100%">
                            <!-- 分发规则 -->
                            <el-table-column prop="ruleNo" :label="$t('mxpcweb.systemset.mailset.mailaccount.1533538365114')" align="center">
                                <template slot-scope="scope">
                                    {{rules[scope.row.ruleNo-1]['ruleName']}}
                                </template>
                            </el-table-column>
                            <!-- 适配邮箱 -->
                            <el-table-column prop="mailAccount" :label="$t('mxpcweb.systemset.mailset.mailaccount.1533538641883')" align="center">
                            </el-table-column>
                            <!-- 匹配信息 -->
                            <el-table-column prop="content" :label="$t('mxpcweb.systemset.mailset.mailaccount.1533538695771')" align="center">
                            </el-table-column>
                            <!-- 标记分发 -->
                            <el-table-column prop="" :label="$t('mxpcweb.systemset.mailset.mailaccount.1533538709083')" align="center" width="150">
                                <template slot-scope="scope">
                                    <el-checkbox disabled :checked="scope.row.assignMark==1"></el-checkbox>
                                </template>
                            </el-table-column>
                            <!-- 接收人 -->
                            <el-table-column prop="" :label="$t('mxpcweb.systemset.mailset.mailaccount.1533538725243')" align="center">
                                <template slot-scope="scope">
                                    <span v-for="(item,index) in scope.row.recCtids" :key="index">
                                        {{getNameById(item)}}{{index==scope.row.recCtids.length-1?'':' , '}}
                                    </span>
                                </template>
                            </el-table-column>
                            <!-- 操作 -->
                            <el-table-column prop="" :label="$t('mxpcweb.systemset.mailset.mailaccount.1529042764362')" align="center" width="150">
                                <template slot-scope="scope">
                                    <div class="operationBox " :class="{'notEdit':!canEdit}">
                                        <div class="centerBox clearfix">
                                            <i class="iconfont icon-edit-square" @click="editRule(scope.$index, scope.row)">
                                            </i>
                                            <i class="iconfont icon-del" @click="deleteRule(scope.$index, scope.row)">
                                            </i>
                                        </div>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
            </transition>
        </div>
        <dialog-rule ref="dialogRule" :personList='personList' :propMailItem="mailItem" @isCommit="ruleChange"></dialog-rule>

    </div>
</template>
<script>
import Loading from '@/basecomponents/Loading/index'
import PageDetail from '@/components/PageDetail/index'
import { isArray, isObject, decrypt } from '@/libs/utils.js'
import DialogRule from './DialogRule/index'
import SenderComponent from './SenderComponent/index'
export default {
    name: 'RuleSet',
    data() {
        return {
            setShow: false,
            isLoading: false,
            canEdit: false,
            personList: [],
            senderArr: [],
            receiverArr: [],
            ruleList: [],
            mailItem: {},
            mailsDetail: {},
            rules: [
                /* 01.按联系人的分配权限分发 */
                { ruleNo: '01', ruleName: this.$t('mxpcweb.systemset.mailset.mailaccount.1533538962073') },
                /* 02.将此邮箱所有邮件分发接收人 */
                { ruleNo: '02', ruleName: this.$t('mxpcweb.systemset.mailset.mailaccount.1533538991244') },
                /* 03.按邮件内容关键词分发 */
                { ruleNo: '03', ruleName: this.$t('mxpcweb.systemset.mailset.mailaccount.1533539037812') },
                /* 04.按邮箱的主题关键字分发 */
                { ruleNo: '04', ruleName: this.$t('mxpcweb.systemset.mailset.mailaccount.1533539051641') },
                /* 05.按发件人邮箱地址分发 */
                { ruleNo: '05', ruleName: this.$t('mxpcweb.systemset.mailset.mailaccount.1533539069962') },
                /* 06.按收件人邮箱地址或名字分发 */
                { ruleNo: '06', ruleName: this.$t('mxpcweb.systemset.mailset.mailaccount.1533539085226') },
                /* 07.来自陌生客户平均分配 */
                { ruleNo: '07', ruleName: this.$t('mxpcweb.systemset.mailset.mailaccount.1533539097515') },
                /* 08.来自指定发件人的邮件按平均分配 */
                { ruleNo: '08', ruleName: this.$t('mxpcweb.systemset.mailset.mailaccount.1533539112243') },
                /* 09.来自阿里陌生询盘按平均分配 */
                { ruleNo: '09', ruleName: this.$t('mxpcweb.systemset.mailset.mailaccount.1533539127506') },
                /* 10.来自制造网陌生询盘按平均分配 */
                { ruleNo: '10', ruleName: this.$t('mxpcweb.systemset.mailset.mailaccount.1533539143011') },
                /* 11.来自环球资源陌生询盘按平均分配 */
                { ruleNo: '11', ruleName: this.$t('mxpcweb.systemset.mailset.mailaccount.1533539156831') }
            ]
        }
    },
    created() {

    },
    computed: {

    },
    methods: {
        async open(data = {}) {
            this.setShow = true
            this.mailItem = data

            /* 数据初始化 */
            this.senderArr = []
            this.receiverArr = []
            this.isLoading = true

            await Promise.all([
                this.getPersonList(),
                this.getRightsCheck(),
                this.getMailDetail(),
                this.getRuleList()
            ])
            this.isLoading = false
        },
        pageBack() {
            this.setShow = false
            this.$emit('goback')
        },
        dropFilter(selArr, data) {
            let flag = false
            for (const item of selArr) {
                if (item.userCtid == data.ctId) {
                    flag = true
                    break
                }
            }
            return flag
        },

        senderSelect(index) {
            let { ctId, realName } = this.personList[index]
            let obj = { userCtid: ctId, sendName: realName, mailType: 1, dispalyName: realName }
            this.senderArr.push(obj)
            this.reviseAccount([obj], 1)
        },

        receiverSelect(index) {
            let { ctId, realName } = this.personList[index]
            let obj = { userCtid: ctId, sendName: realName, mailType: 0 }
            this.receiverArr.push(obj)
            this.reviseAccount([obj], 1)
        },
        senderRemove(index, item) {
            // let { ctId, realName } = this.personList[index]
            // let obj = { userCtid: ctId, sendName: realName, mailType: 1 }
            // console.log(obj)
            // console.log(this.senderArr)
            // console.log(this.personList)
            this.senderArr.splice(index, 1)
            this.reviseAccount([item], 0)
        },
        receiverRemove(index, item) {
            // let { ctId, realName } = this.personList[index]
            // let obj = { userCtid: ctId, sendName: realName, mailType: 0 }
            this.receiverArr.splice(index, 1)
            this.reviseAccount([item], 0)
        },
        createRule() {
            this.$refs.dialogRule.open('add')
        },
        deleteRule(index, row) {
            if (!this.canEdit) { return false }
            let url = this.Global.baseURL + this.Global.api.v2.mails_publicRules
            let data = { body: { ruleId: row.ruleId } }
            this.$http.delete(url, data)
                .then(res => {
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        this.$message.success(res.body.msg)
                        this.getRuleList()
                    } else {
                        this.$message.error(res.body.msg)
                    }
                })
                .catch(err => {
                    console.log(123)

                    this.$message.error(this.$t(this.Global.errorTitle))
                })
        },
        editRule(index, row) {
            if (!this.canEdit) { return false }
            this.$refs.dialogRule.open('edit', row)
        },
        getNameById(ctId) {
            let name = ''
            for (let index = 0; index < this.personList.length; index++) {
                let item = this.personList[index]
                if (item.ctId == ctId) {
                    name = item.realName
                    break
                }
            }
            return name
        },
        ruleChange() {
            this.$emit('ceshi')
            this.getRuleList()
        },
        async getPersonList() {
            let url = this.Global.baseURL + this.Global.api.SystemSet.groupstructure.getTable
            let data = { params: { dCode: '0' } }
            try {
                let res = await this.$http.get(url, data)
                if (res.body.code.toString() == this.Global.RES_OK) {
                    this.personList = res.body.data.tableList
                    let _this = this
                    setTimeout(() => {
                        _this.mailsDetail.owners.forEach(item => {
                            if (item.mailType.toString() === '1') {
                                for (let index = 0; index < _this.personList.length; index++) {
                                    const element = _this.personList[index]
                                    if (element.ctId == item.userCtid) {
                                        _this.senderArr.push({ userCtid: item.userCtid, sendName: item.sendName, mailType: item.mailType, dispalyName: element.realName })
                                        break
                                    }
                                }
                            }
                        })
                    }, 300)
                }
            } catch (error) {
                this.$message.error(this.$t(this.Global.errorTitle))
            }
        },
        async getMailDetail() {
            let url = this.Global.baseURL + this.Global.api.SystemSet.mailset.mailaccount.mailsAccount
            let data = { params: { accountId: this.mailItem.accountId } }
            try {
                let res = await this.$http.get(url, data)
                if (res.body.code.toString() == this.Global.RES_OK && isObject(res.body.data) && isArray(res.body.data.configs)) {
                    this.mailsDetail = res.body.data

                    this.mailsDetail.recPassword = decrypt(res.body.data.recPassword)
                    this.mailsDetail.owners.forEach(item => {
                        if (item.mailType.toString() === '0') {
                            this.receiverArr.push({ userCtid: item.userCtid, sendName: item.sendName, mailType: item.mailType })
                        }
                    })
                } else {
                    this.$message.error(res.body.msg)
                }
            } catch (error) {
                this.$message.error(this.$t(this.Global.errorTitle))
            }
        },
        async getRuleList() {
            let url = this.Global.baseURL + this.Global.api.v2.mails_publicRules
            let data = { params: { mailAccount: this.mailItem.mailAddress } }
            try {
                let res = await this.$http.get(url, data)
                if (res.body.code.toString() == this.Global.RES_OK) {
                    this.ruleList = res.body.data.ruleList
                    this.mailItem.ruleSize = res.body.data.rowTotal
                } else {
                    this.$message.error(res.body.msg)
                }
            } catch (error) {
                this.$message.error(this.$t(this.Global.errorTitle))
            }
        },
        async getRightsCheck() {
            this.canEdit = false
            let url = this.Global.baseURL + this.Global.api.Mail.GetRightsCheck
            let params = { 'optCode': 'otEdit', 'moduleCode': 'SY015', 'targetCtid': this.mailItem.ctid }
            let res = await this.$http.get(url, { params })
            if (res.body.code.toString() == this.Global.RES_OK) {
                this.canEdit = true
            } else {
                this.$message.error(this.msg(res.body))
                this.canEdit = false
            }
        },
        reviseAccount(Arry, type) {
            let _this = this
            let paramsData = {
                'accountId': _this.mailItem.accountId,
                'delUsers': type == 0 ? Arry : [],
                'action': 'alter',
                'addUsers': type == 1 ? Arry : []
            }
            _this.$http.put(_this.Global.baseURL + _this.Global.api.SystemSet.mailset.mailaccount.reviseAccounts,
                paramsData).then(function (res) {
                    if (res.body.code.toString() != _this.Global.RES_OK) {
                        if (type == 1) {
                            _this.$message.error(_this.$t('mxpcweb.systemset.mailset.mailaccount.1529042124909'))// 添加失败
                        } else {
                            _this.$message.error(_this.$t('mxpcweb.systemset.accountsettings.1533287099718'))// 删除失败
                        }
                    }
                })
        },
        async   changeName(name, index) {
            this.senderArr[index].sendName = name
            let params = {
                action: 'alterName',
                accountId: this.mailItem.accountId,
                senderCtid: this.senderArr[index].userCtid,
                senderName: name
            }
            let _this = this
            _this.$http.put(_this.Global.baseURL + _this.Global.api.SystemSet.mailset.mailaccount.reviseAccounts,
                params).then(function (res) {
                    if (res.body.code.toString() != _this.Global.RES_OK) {
                        // if (type == 1) {
                        //     _this.$message.error(_this.$t('mxpcweb.systemset.mailset.mailaccount.1529042124909'))// 添加失败
                        // } else {
                        //     _this.$message.error(_this.$t('mxpcweb.systemset.accountsettings.1533287099718'))// 删除失败
                        // }
                    }
                })
        }
    },
    components: {
        'page-detail': PageDetail,
        'loading': Loading,
        'dialog-rule': DialogRule,
        'sender-component': SenderComponent
    },
    watch: {

    }

}
</script>
<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
