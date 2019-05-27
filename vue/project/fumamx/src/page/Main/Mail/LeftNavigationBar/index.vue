<template>
    <div class="treeWrap MXscroll">
        <div class="treeItem">
            <div class="title" @click="UndistributedMail()">
                <i class="iconfont iconThis icon-mail-not"></i>
                <span>
                    <!-- 未分发邮件 -->
                    {{$t('mxpcweb.mail.1528941834774')}}</span>
            </div>
        </div>
        <div class="treeItem" @click="TopMail()">
            <div class="title">
                <!-- el-icon-star-on -->
                <i class="iconfont iconThis icon-star"></i>
                <span>
                    <!-- 置顶邮件 -->
                    {{$t('mxpcweb.mail.1528941835031')}}</span>
            </div>
        </div>
        <div class="treeItem">
            <div class="title">
                <i @click="isMyMail=!isMyMail" class="iconfont iconThis openBtn" :class="[isMyMail ? 'icon-minus' : 'icon-plus-file']"></i>
                <el-dropdown trigger="click" @command="AccountNmberchange" @visible-change="visibleChange">
                    <span class="el-dropdown-link" :title="AccountNmber">
                        <span class="currentMail">
                            <em class="textFull" :title="showName">{{showName}}</em>
                            <em class="numBG">{{nmber}}</em>
                        </span>
                        <i class="iconfont icon-page-down pull-right text-hover"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown" class="MXscroll" style="min-height:100px;max-height:300px;overflow:auto;">
                        <el-dropdown-item :command="{name:item.mailAddress,code:item.unRead}" v-for="(item,index) in AccountList" :key="index" :style="getTitlecolor(item.status)">{{item.mailAddress.length>25?item.mailAddress.substring(0,22).trim():item.mailAddress}} &nbsp;&nbsp;&nbsp;
                            <span class="text-red" v-if="item.unRead>0">{{item.unRead}}</span>
                        </el-dropdown-item>

                    </el-dropdown-menu>
                </el-dropdown>
            </div>
            <!-- 菜单树 -->
            <template v-if="isMyMail">
                <ul class="T_down" v-for="(item,index) in myMailTree" :key="index">
                    <tree-menu :treeData="item" :RowIndex="index" :myMailTree="myMailTree" @mailsMailboxesGet="mailsMailboxesGet" :AccountObject="AccountObject"></tree-menu>
                </ul>
            </template>
        </div>
        <div class="treeItem" v-if="customerArray.length>0">
            <div class="title">
                <i @click="isFocusCustomer=!isFocusCustomer" class="iconfont iconThis openBtn" :class="[isFocusCustomer ? 'icon-minus' : 'icon-plus-file']"></i>
                <span>
                    <!-- 关注客户 -->
                    {{$t('mxpcweb.mail.1528941835293')}}</span>
            </div>
            <!-- 菜单树 -->
            <template v-if="isFocusCustomer">
                <ul class="T_down" v-for="(item,index) in customerArray" :key="index">
                    <li>
                        <h3 @click="treeCustmerClick($event,item.custId,item.custName)">
                            <span class="label">
                                <span class="labelColor">{{item.custName}}</span>
                                <em></em>
                            </span>
                        </h3>
                    </li>
                </ul>
            </template>
        </div>
    </div>
</template>
<script>
import { isArray } from '@/libs/utils.js'
import { mapGetters, mapMutations } from 'vuex'
import TreeMenu from '../Vue/TreeMenu/index'
export default {
    name: '',
    props: {

    },
    data() {
        return {
            isMyMail: true, // 我的邮件，展开开关
            isFocusCustomer: true, // 我的邮件，展开开关
            customerArray: [],
            myMailTree: [],
            RowIndex: 0,
            beforeNmber: '',
            AccountList: [],
            nmber: 0,
            myMap: new Map(),
            startCtid: '',
            AccountObject: {},
            showName: '',
            AccountNmber: '', // 当前选中的账号
            myAccount: this.$t('mxpcweb.mail.1528957697972')

        }
    },
    computed: {
        ...mapGetters(['company', 'personalInfo']),
        ...mapGetters('mail', [
            'refurbishBool',
            'selectedBoxId',
            'treeCustmerBool',
            'subordinateCtid',
            'boxCount'
        ])

    },
    created() {
        let _this = this
        ep.tail('getFolder', function (obj) {
            obj.fn(_this.myMap.get(obj.boxId.toString()))
        })
    },
    methods: {
        // 同步设置
        ...mapMutations('mail', {
            set_selectedBoxId: 'SET_SELECTEDBOXID',
            set_selectedBoxName: 'SET_SELECTEDBOXNAME',
            set_refurbishBool: 'SET_REFURBISHBOOL',
            set_refurbishListBool: 'SET_REFURBISHLISTBOOL',
            set_subordinateCtid: 'SET_SUBORDINATECTID',
            set_mailTemplateListG: 'SET_MAILTEMPLATELISTG',
            set_boxCount: 'SET_BOXCOUNT'
        }),
        //*  树 **************************************** *
        // 未分发邮件
        UndistributedMail() {
            let $this = $(event.target)
            $this.parents('.navLeft').find('.active').removeClass('active')
            let tag = $this.nodeName
            if (tag === 'div') {
                $this.addClass('active')
            } else {
                $this.parents('div').addClass('active')
            }
            ep.emit('mailTabIndex')
            this.set_selectedBoxId({
                id: '-9000',
                target: 'undistributed',
                SelectType: 'b'
            })
            this.set_selectedBoxName(this.$t('mxpcweb.mail.1528941834774'))// 未分发邮件
        },
        // 置顶邮件
        TopMail() {
            let $this = $(event.target)
            let tag = $this.nodeName
            $this.parents('.navLeft').find('.active').removeClass('active')
            if (tag === 'div') {
                $this.addClass('active')
            } else {
                $this.parents('div').addClass('active')
            }
            ep.emit('mailTabIndex')
            this.set_selectedBoxId({
                id: '-1100',
                target: 'toplist',
                SelectType: 'b'
            })
            this.set_selectedBoxName(this.$t('mxpcweb.mail.1528941835031'))// 置顶邮件
        },
        // 获取邮件账号列表
        MailAccountList(type) {
            let _this = this
            let data = { 'type': 'total', 'mailAccount': '' }
            if (this.subordinateCtid != this.company.ctId && this.subordinateCtid != 0) {
                data.ctid = this.subordinateCtid
            } else {
                delete data.ctid
            }
            _this.$http.get(_this.Global.baseURL + _this.Global.api.Mail.GetNumberAccounts, { params: data }).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK && isArray(res.body.data)) {
                    if (res.body.data.length > 0) {
                        this.AccountList = res.body.data
                        this.AccountList[0].mailAddress = this.$t('mxpcweb.mail.1528957697972')
                        if (this.AccountList[0].Openstatus) {
                            this.$emit('showMail')
                        }
                    }

                    // if ((this.subordinateCtid == this.company.ctId || this.subordinateCtid == 0) && (this.AccountList.length <= 1 || this.AccountList[1].status != 1)) {
                    //     this.$emit('showMail')
                    // }
                    if (type == 2) {
                        this.AccountNmber = this.AccountList.length > 0 ? this.AccountList[0].mailAddress : ''
                        this.showName = this.AccountNmber.length > 10 ? this.AccountNmber.substr(0, 12) : this.AccountNmber
                        this.nmber = this.AccountList.length > 0 ? this.AccountList[0].unRead : 0
                    } else {
                        for (let index = 0; index < this.AccountList.length; index++) {
                            const element = this.AccountList[index]
                            if (element.mailAddress == this.showName) {
                                this.nmber = element.unRead
                                break
                            }
                        }
                    }
                } else {
                    this.$message.error(this.msg(res.body))
                }
            },
                function (res) {
                    _this.$message.error(_this.$t(_this.Global.errorTitle))
                }
            )
        },
        // 获取文件夹列表
        async mailsMailboxesGet() {
            this.mailsMailscountGet()
            let _this = this
            _this.set_refurbishBool(0)
            let data = {}
            if (this.subordinateCtid != this.company.ctId && this.subordinateCtid != 0) {
                data.ctid = this.subordinateCtid
            } else {
                delete data.ctid
            }
            let url = this.Global.baseURL + this.Global.api.Mail.mailsMailboxesGet
            this.$http.get(url, { params: data }).then(res => {
                if (res.body.code.toString() == this.Global.RES_OK) {
                    let Arry = res.body.data
                    let ArrNew = []
                    for (let i = 0; i < Arry.length; i++) {
                        if (_this.AccountNmber == '') {
                            _this.AccountNmber = _this.myAccount
                        }
                        if (i == 0) {
                            if (_this.selectedBoxId.id == '' || _this.selectedBoxId.id == undefined || _this.AccountNmber != _this.beforeNmber || _this.subordinateCtid != _this.startCtid) {
                                _this.startCtid = _this.subordinateCtid
                                _this.set_selectedBoxId({
                                    id: Arry[0].boxId.toString(),
                                    SelectType: 'b',
                                    target: 'folder',
                                    AccountNmber: _this.AccountNmber == _this.myAccount ? '' : _this.AccountNmber // 我的全部邮件
                                })
                                _this.set_selectedBoxName(Arry[0].boxName.toString())
                                _this.beforeNmber = _this.AccountNmber
                            }
                        }
                        if (Arry[i].child.length > 0) {
                            _this.myMap.set(Arry[i].boxId.toString(), Arry[i].boxName)
                            let childAryy = _this.GetData(Arry[i].child, Arry[i].boxName + '/', Arry[i].boxId, i)
                            ArrNew.push({
                                id: Arry[i].boxId,
                                label: Arry[i].boxName,
                                children: childAryy,
                                boxType: Arry[i].boxType,
                                boxPath: Arry[i].boxPath,
                                TitleName: Arry[i].boxName + '/',
                                FID: -2,
                                bgColor: Arry[i].bgColor,
                                position: i,
                                custId: Arry[i].custId,
                                AccountNmber: _this.AccountNmber == _this.myAccount ? '' : _this.AccountNmber // 我的全部邮件
                            })
                        } else {
                            _this.myMap.set(Arry[i].boxId.toString(), Arry[i].boxName)
                            ArrNew.push({
                                id: Arry[i].boxId,
                                label: Arry[i].boxName,
                                children: [],
                                boxType: Arry[i].boxType,
                                boxPath: Arry[i].boxPath,
                                TitleName: Arry[i].boxName + '/',
                                FID: -2,
                                bgColor: Arry[i].bgColor,
                                position: i,
                                custId: Arry[i].custId,
                                AccountNmber: _this.AccountNmber == _this.myAccount ? '' : _this.AccountNmber // 我的全部邮件
                            })
                        }
                    }
                    _this.myMailTree = ArrNew
                } else {
                    this.$message.error(this.msg(res.body))
                }
                this.isLoading = false
            })
                .catch(err => {
                    if (err.status == 0) {
                        return false
                    }
                    this.isLoading = false
                    this.$message.error(this.$t(this.Global.errorTitle))
                })
        },
        GetData(Arry, Aname, FID, title) {
            let arrs = []
            for (let i = 0; i < Arry.length; i++) {
                let Aname2 = Aname + Arry[i].boxName + '/'
                this.myMap.set(Arry[i].boxId.toString(), Aname2)
                if (Arry[i].child.length > 0) {
                    let temp = this.GetData(Arry[i].child, Aname2, Arry[i].boxId, title) //
                    arrs.push({
                        id: Arry[i].boxId,
                        label: Arry[i].boxName,
                        children: temp,
                        boxType: Arry[i].boxType,
                        boxPath: Arry[i].boxPath,
                        TitleName: Aname2,
                        FID: FID,
                        bgColor: Arry[i].bgColor,
                        position: title,
                        custId: Arry[i].custId,
                        AccountNmber: this.AccountNmber == this.myAccount ? '' : this.AccountNmber // 我的全部邮件
                    })
                } else {
                    arrs.push({
                        id: Arry[i].boxId,
                        label: Arry[i].boxName,
                        children: [],
                        boxType: Arry[i].boxType,
                        boxPath: Arry[i].boxPath,
                        TitleName: Aname2,
                        FID: FID,
                        bgColor: Arry[i].bgColor,
                        position: title,
                        custId: Arry[i].custId,
                        AccountNmber: this.AccountNmber == this.myAccount ? '' : this.AccountNmber // 我的全部邮件
                    })
                }
            }
            return arrs
        },
        // 获取邮件数量
        mailsMailscountGet() {
            let data = { 'type': 'detail', 'mailAccount': this.AccountNmber == this.myAccount ? '' : this.AccountNmber } //
            if (this.subordinateCtid != this.company.ctId && this.subordinateCtid != 0) {
                data.ctid = this.subordinateCtid
            } else {
                delete data.ctid
            }
            let url = this.Global.baseURL + this.Global.api.Mail.mailsMailscountGet
            this.$http.get(url, { params: data })
                .then(res => {
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        this.AccountObject = res.body.data
                    } else {
                        // this.$message.error(this.msg(res.body))
                    }
                    this.isLoading = false
                })
                .catch(err => {
                    if (err.status == 0) {
                        return false
                    }
                    this.isLoading = false
                    this.$message.error(this.$t(this.Global.errorTitle))
                })
        },
        // 客户树
        getcustomer() {
            let _this = this
            let data = {
                moduleCode: 'BF001',
                searchType: 'focusedList'
            }
            if (this.subordinateCtid != this.company.ctId && this.subordinateCtid != 0) {
                data.ownerCtId = this.subordinateCtid // 需要特别注意
            }
            _this.$http.get(this.Global.baseURL + this.Global.api.Mail.generalOperateGet, {
                params: data
            }).then(function (res) {
                if (res.body.code == undefined) {
                    this.customerArray = []
                    return
                }
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    let dataResult = res.body.data.list
                    let Arrylist = []
                    if (dataResult.length > 100) {
                        for (let i = dataResult.length - 1; i > dataResult.length - 100; i--) {
                            Arrylist.push({
                                custId: dataResult[i].custId,
                                custName: dataResult[i].custName
                            })
                        }
                    } else {
                        for (let i = 0; i < dataResult.length; i++) {
                            Arrylist.push({
                                custId: dataResult[i].custId,
                                custName: dataResult[i].custName
                            })
                        }
                    }
                    this.customerArray = Arrylist
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
            },
                function (res) {
                    _this.$message.error(_this.$t(_this.Global.errorTitle))
                }
            )
        },
        // 点击文件夹项item高亮
        treeCustmerClick(event, id, name) {
            ep.emit('mailTabIndex')
            let $this = $(event.target)
            $this.parents('.navLeft').find('.active').removeClass('active')
            let tag = $this.nodeName // event.target.tagName;
            if (tag === 'H3') {
                $this.addClass('active')
            } else {
                $this.parents('h3').addClass('active')
            }
            this.set_selectedBoxId({
                id: id.toString(),
                SelectType: 'c',
                target: 'folder'
            })
            this.set_selectedBoxName(name)
        },
        // 账号下拉
        visibleChange(e) {
            // if (e) {
            //     this.MailAccountList(1)
            // }
        },
        // 账号切换
        AccountNmberchange(command) {
            this.showName = command.name
            this.AccountNmber = command.name
            this.nmber = command.code
            this.mailsMailboxesGet() // 获取文件夹列表
        },
        getTitlecolor(status) {
            if (status == 0) {
                return 'color:#bfcbd9'
            }
        }

        //* ************************************

    },
    components: {
        'tree-menu': TreeMenu
    }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
</style>
