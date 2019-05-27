<template>
    <div>
        <!-- 查看数据 -->
        <!-- 选择联系人邮箱 -->
        <el-dialog :close-on-click-modal="false" v-dialogDrag :title="tabData==1?$t('mxpcweb.am.1531900659440'):'一键营销'" :visible.sync="dialogLook" :closeOnClickModal="false" custom-class="width620" :modal-append-to-body="false">
            <div class="addLowerCust" v-show="tabData == '1'">
                <div class="dialogLookBox MXscroll">
                    <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
                        <el-row class="lookTitle lookList">
                            <el-col :span="2">
                                {{$t('mxpcweb.login.1528702888027')}}
                            </el-col>
                            <!-- 邮箱 -->
                            <el-col :span="8">{{$t('mxpcweb.am.1531900664136')}}</el-col>
                            <!-- 时间 -->
                            <!-- <el-col :span="8">{{itemType=='1'||itemType=='2'?$t('mxpcweb.am.1531900668705'):'&nbsp;'}}</el-col> -->
                            <el-col :span="8">{{$t('mxpcweb.am.1531900668705')}}</el-col>
                            <!-- 备注 -->
                            <el-col :span="6">{{$t('mxpcweb.am.1531900669055')}}</el-col>
                        </el-row>
                        <div style="height:10px;"></div>
                        <el-row class="lookList" v-for="(item,index) in dialogLookList" :key="index">
                            <el-col :span="2">
                                <el-checkbox :label="JSON.parse(item).email">{{''}}</el-checkbox>
                            </el-col>
                            <el-col :span="8" :title="JSON.parse(item).email" class="ellipsis">{{JSON.parse(item).email}}</el-col>
                            <el-col :span="8">{{JSON.parse(item).currTime}}</el-col>
                            <el-col :span="6" class="urlClaass" v-if=" itemType=='click'" :title="JSON.parse(item).url">{{JSON.parse(item).url}}</el-col>
                            <el-col :span="6" v-else>{{getbeizhu()}}</el-col>
                        </el-row>
                    </el-checkbox-group>
                </div>
                <div style="padding:18px 26px 0;">
                    <el-pagination small layout="prev, pager, next" @current-change="handleCurrentChange" :current-page="currentPage" :page-size="10" :total="dialogLookTotal"></el-pagination>
                </div>
                <div slot="footer" class="dialogFooter">
                    <!-- 写邮件 -->
                    <el-button type="primary" @click="writeMail()" :loading="dialogLookLoading">{{$t('mxpcweb.mail.1528941747561')}}</el-button>
                    <!-- 一键营销 -->
                    <el-button type="primary" @click="showTable2()" :loading="dialogLookLoading">{{$t('mxpcweb.am.1557457205750')}}</el-button>
                    <!-- 生成接收人列表 -->
                    <el-button type="primary" @click="autoBook()" :loading="dialogLookLoading">{{$t('mxpcweb.am.1531900699673')}}</el-button>
                    <!-- 取消 -->
                    <span class="cancel">
                        <el-button @click="cancelChange()" :loading="dialogLookLoading">{{$t('mxpcweb.am.1531893140621')}}</el-button>
                    </span>
                </div>
            </div>
            <div class="addLowerCust" v-show="tabData == '2'">
                <div style="height:40px;"></div>
                <div class="mailBox">
                    <span style="margin-right:15px;">触发邮件</span>
                    <action-mail v-if="dialogLook" inputWidth="355px" ref="actionMail" :showPreview="false" :actionMails.sync="actionMails" :moduleCode="moduleCode"></action-mail>
                </div>
            </div>
            <div v-if="tabData != '1'" slot="footer" class="dialogFooter" style="text-align:center">
                <!-- 取消 -->
                <el-button @click="tabData = '1'">上一步</el-button>
                <!-- 确定 -->
                <el-button type="primary" @click="submit" :loading="subLoading">发送</el-button>
            </div>
        </el-dialog>

    </div>

</template>

<script>
import ActionMail from '@/components/ActionMail/index'
export default {
    name: 'dialogLookBox',
    props: {
        ctid: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            dialogLook: false,
            dialogLookList: [],
            dialogLookListBase: [],
            dialogLookLoading: false,
            currentPage: 1,
            dialogLookTotal: 0,
            itemData: '',
            itemType: '',
            checkedCities: [],
            tabData: 1,
            moduleCode: 'allModule',
            actionMails: {},
            subLoading: false

        }
    },
    methods: {
        showTable2() {
            if (this.checkedCities.length <= 0) {
                this.$message('请选择营销邮箱')
                return false
            }
            this.tabData = 2
        },
        submit() {
            let _this = this
            _this.subLoading = true
            let sendType = _this.actionMails.sendType
            if (!sendType) {
                _this.$message('请选择触发邮件')
                return false
            }
            if (sendType == '2') {
                _this.$http.post(_this.Global.baseURL + _this.Global.api.v2.bulkDeliver_Post, {
                    detailActionId: _this.actionMails.detailActionId,
                    sendUser: _this.actionMails.sendAddress || '',
                    invokeName: _this.actionMails.invokeName,
                    receiptInfos: _this.returnMailList(_this.checkedCities, 'addressStr')
                }).then(function (res) {
                    _this.subLoading = false
                    if (res.body.code.toString() == _this.Global.RES_OK) {
                        _this.$message.success(_this.msg(res.body))
                        _this.dialogLook = false
                    } else {
                        _this.$message.error(_this.msg(res.body))
                    }
                }, function (res) {
                    _this.subLoading = false
                    _this.$message.error(_this.$t(_this.Global.errorTitle))
                })
            } else {
                _this.$http.post(_this.Global.baseURL + _this.Global.api.v2.autoStrategy_manualExecAct, {
                    actionId: 1,
                    detailActionId: _this.actionMails.detailActionId,
                    moduleCode: _this.moduleCode,
                    paramsArray: _this.returnMailList(_this.checkedCities, 'mailAddress')
                }).then(function (res) {
                    if (res.body.code.toString() == _this.Global.RES_OK) {
                        _this.$message.success(_this.msg(res.body))
                        _this.subLoading = false
                        _this.dialogLook = false
                    } else {
                        _this.subLoading = false
                        _this.dialogLook = false
                        _this.$message.error(_this.msg(res.body))
                    }
                }, function (res) {
                    _this.subLoading = false
                    _this.$message.error(_this.$t(_this.Global.errorTitle))
                })
            }
        },
        returnMailList(list, strName) {
            // let _this = this
            let mailList = []
            if (list.length == 0) {
                return mailList
            };
            list.forEach(element => {
                if (strName == 'mailAddress') {
                    mailList.push({ 'mailAddress': element })
                } else {
                    mailList.push({ 'addressStr': element })
                }
            })
            return mailList
        },
        writeMail() {
            if (this.checkedCities.length <= 0) {
                this.$message('请选择收件人')
                return false
            }
            let recipientsPicking = []
            for (let index = 0; index < this.checkedCities.length; index++) {
                const element = this.checkedCities[index]
                recipientsPicking.push({ mail: element, name: element.split('@')[0] })
            }

            let _this = this
            // _this.dialogLookLoading = true
            // 写邮件
            _this.$router.push({ path: '/main/mail/home/index', query: { 'title': _this.$t('mxpcweb.client.1529053914531'), 'type': 'W', 'recipientsPicking': recipientsPicking } })
            _this.dialogLook = false
            // _this.$router.push('/main/mail/home/index')
            // setTimeout(function () {
            //     // 写邮件
            //     ep.emit('openNewMail', { 'title': _this.$t('mxpcweb.client.1529053914531'), 'type': 'W' })
            //     setTimeout(function () {
            //         let { id } = _this.$route.params
            //         let ids = id.split('_')
            //         ep.emit('CustmerWriteMail' + ids[2], { recipientsPicking: recipientsPicking })
            //         _this.dialogLookLoading = false
            //         _this.dialogLook = false
            //     }, 500)
            // }, 500)
        },
        handleCheckedCitiesChange(value) {
            if (this.checkedCities.length <= 50) {
                this.checkedCities = value
            } else {
                this.checkedCities.splice(this.checkedCities.length - 1, 1)
                this.$message.error(this.$t('mxpcweb.am.1557303720454'))
            }
        },
        cancelChange() {
            this.dialogLook = false
            this.$emit('getListData')
        },
        show(item, type) {
            this.checkedCities = []
            this.itemData = item
            this.itemType = type
            this.currentPage = 1
            this.tabData = 1
            this.emailStatus(item, type)
        },
        handleCurrentChange(val) {
            // this.dialogLookList = this.dialogLookListBase.slice(val * 10 - 10, val * 10)
            this.currentPage = val
            this.emailStatus(this.itemData, this.itemType)
        },
        emailStatus(item, type) {
            let _this = this
            let data = {
                // id: item.guidkey,
                eventName: type,
                from: _this.currentPage * 10 - 10,
                size: 10
                // ,            subctid: _this.ctid
            }
            _this.$http.get(this.Global.baseURL + this.Global.api.v2.eventDetails_Get + '/' + item.taskId, { params: data }).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    _this.dialogLookListBase = res.body.data.dataList
                    _this.dialogLookList = res.body.data.dataList // _this.dialogLookListBase.slice(this.currentPage * 10 - 10, this.currentPage * 10)
                    _this.dialogLookTotal = parseInt(res.body.data.total)
                    _this.dialogLook = true
                } else if (res.body.code.toString() != '-3') {
                    _this.dialogLookListBase = []
                    _this.dialogLookList = []
                    _this.dialogLookTotal = 0
                    _this.$message.error(_this.msg(res.body))
                } else {
                    _this.dialogLookListBase = []
                    _this.dialogLookList = []
                    _this.dialogLookTotal = 0
                }
            }, function (res) {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },
        autoBook() {
            let _this = this
            _this.dialogLookLoading = true
            let data = {
                taskId: this.itemData.taskId,
                eventName: this.itemType,
                subctid: this.ctid
            }
            _this.$http.post(this.Global.baseURL + this.Global.api.v2.addrGenerate_Add, data).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    _this.$message.success(res.body.msg)
                    _this.dialogLookLoading = false
                    _this.dialogLook = false
                    let data = {
                        invokeName: res.body.data.addrInovkeName,
                        name: res.body.data.name,
                        type: '3'
                    }
                    _this.$router.push(`/main/am/sendee`)
                    setTimeout(function () {
                        ep.emit('sendeeTopage', data)
                    }, 20)
                } else if (res.body.code.toString() != '-3') {
                    _this.$message.error(res.body.msg)
                    _this.dialogLookLoading = false
                } else {
                    _this.dialogLookLoading = false
                }
            }, function (res) {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },
        getbeizhu() {
            let title = ''
            switch (this.itemType) {
                case 'deliver': // 送达
                    title = this.$t('mxpcweb.am.1531900669464')
                    break
                case 'open':// 打开
                    title = this.$t('mxpcweb.am.1531901433719')
                    break
                case 'click ':// 点击
                    title = this.$t('mxpcweb.am.1531901259662')
                    break
                case 'invalid':// 无效
                    title = this.$t('mxpcweb.am.1531900978904')
                    break
            }
            return title
        }

    },
    watch: {
    },
    components: {
        'action-mail': ActionMail
    }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
.dialogLookBox {
    min-height: 200px;
    max-height: 500px;
    overflow: auto;
    font-size: 12px;
    .lookTitle {
        height: 40px;
        line-height: 40px;
        padding: 0 20px;
        background: rgba(239, 242, 244, 1);
        color: RGBA(144, 147, 153, 1);
    }
    .lookList {
        height: 40px;
        line-height: 40px;
        padding: 0 40px;
        overflow: hidden;
        .urlClaass {
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
        }
    }
}
.addLowerCust {
    .dialogFooter {
        height: 80px;
        line-height: 80px;
        position: relative;
        .cancel {
            display: inline-block;
            position: absolute;
            right: 0px;
        }
    }
}
</style>
