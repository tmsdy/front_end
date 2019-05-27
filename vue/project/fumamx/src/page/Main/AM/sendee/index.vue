<template>
    <div class="sendee MXscroll">
        <div v-if="tabData=='1'">
            <!--大标题-->
            <!-- 接收人 -->
            <page-title :title="$t('mxpcweb.am.1542012292798')" iconfont="icon-personnel">
            </page-title>
            <div class="sendeeBox">
                <div class="sendeeBoxSearch">
                    <div class="addButtonBox">
                        <!-- 新建接收人列表 -->
                        <el-button class="addButton" type="primary" @click="addButton()" size="small">{{$t('mxpcweb.am.1542012644547')}}</el-button>
                    </div>
                    <!-- 列表名称 -->
                    <el-input class="addInput" v-model="keywords" :placeholder="$t('mxpcweb.am.1531901858925')" icon="search" @keyup.enter.native="getListData" :on-icon-click="getListData"></el-input>
                    <el-select class="addInput" v-if="isContact" v-model="ownersSelect" filterable @change="getListData()">
                        <el-option v-for="item in owners" :key="item.ctId" v-if="item.inUse==1" :label="item.realName" :value="item.ctId">
                        </el-option>
                    </el-select>
                </div>
                <div class="sendeeBoxList sendeeBoxTit MXscroll" v-loading="loading">
                    <el-row class="list" :gutter="20">
                        <!-- 地址簿名称 -->
                        <el-col :span="7">{{$t('mxpcweb.am.1542013124901')}}</el-col>
                        <!-- 接收人数量 -->
                        <el-col :span="3">{{$t('mxpcweb.am.1531902860739')}}</el-col>
                        <!-- 更新时间 -->
                        <el-col :span="7">{{$t('mxpcweb.am.1531893029814')}}</el-col>
                        <!-- 更新人 -->
                        <el-col :span="3">{{$t('mxpcweb.am.1531893035815')}}</el-col>
                        <el-col :span="4"></el-col>
                    </el-row>
                    <no-data v-if="sendeeList.length==0&&!loading" style="background:rgba(255,255,255,0)"></no-data>
                    <el-row v-else class="list1" :gutter="20" v-for="(item,index) in sendeeList" :key="index">
                        <el-col class="ellipsis" :span="7">{{item.name}}&nbsp;</el-col>
                        <el-col class="ellipsis" :span="3">&nbsp;{{item.memberCount}}&nbsp;</el-col>
                        <el-col class="ellipsis" :span="7">{{item.modifyDate}}&nbsp;</el-col>
                        <el-col class="ellipsis" :span="3">{{getName(item.modifyCtid)}}&nbsp;</el-col>
                        <el-col :span="4" class="listCol4">
                            <div class="listCol4Item">
                                <!-- 发信 -->
                                <span class="optButton" v-if="item.memberCount!='0'" @click="sendMail(item)" :title="$t('mxpcweb.am.1531893058358')">
                                    <i class="iconfont icon-send"></i>
                                </span>
                                <!-- 发信 -->
                                <span v-else class="disable" :title="$t('mxpcweb.am.1531893058358')">
                                    <i class="iconfont icon-send"></i>
                                </span>
                                <!-- 查看 -->
                                <span class="optButton left10" style="margin-left:10px;" @click="detailData=item;tabData='3'" :title="$t('mxpcweb.am.1531978974212')">
                                    <i class="iconfont  icon-eye"></i>
                                </span>
                                <!-- 删除 -->
                                <span class="optButton left10" style="margin-left:10px;" @click="deleteItem(item)" :title="$t('mxpcweb.am.1531893085173')">
                                    <i class="iconfont icon-del"></i>
                                </span>
                            </div>
                        </el-col>
                    </el-row>
                </div>
            </div>
            <!--分页-->
            <list-page style="background:#f7f8f9;text-align:center" :blockData="blockData" @getListData="getListData"></list-page>
        </div>
        <add-name v-if="tabData=='2'" @tabDataCheck="tabDataCheck"></add-name>
        <detail v-if="tabData=='3'" @tabDataCheck="tabDataCheck" :detailData="detailData"></detail>
        <addpeople v-if="tabData=='4'" @tabDataCheck="tabDataCheck" :detailData="detailData"></addpeople>
    </div>
</template>

<script>
import PageTitle from '@/components/PageTitle/index' // 大标题
import listPage from '@/components/listPageTwo/index' // 分页
import { isArray, setStore } from '@/libs/utils.js'
import NoData from '@/basecomponents/NoData/index'
import addName from './vue/addName'
import addpeople from './vue/addpeople'
import detail from './vue/detail'
import { mapGetters } from 'vuex'
export default {
    name: 'sendee',
    props: {

    },
    data() {
        return {
            loading: true,
            keywords: '',
            tabData: '1',
            sendeeList: [],
            // 分页操作
            blockData: {
                pageSize: 20,
                total: 0,
                fromNum: 1
            },
            detailData: {
                invokeName: '',
                name: ''
            },
            isContact: true,
            ownersSelect: '',
            owners: [],
            isAdd: false
        }
    },
    created() {
        let _this = this
        this.routeUrl = this.$route.path
        this.getListData()
        // this.contactCheck()
        this.getOwners()
        ep.tail('sendeeTopage', function (data) {
            _this.tabDataCheck(data.type, data)
        })
    },
    methods: {
        addButton() {
            this.isAdd = true
            this.tabData = '2'
        },
        getName(ctId) {
            let name = ''
            for (let index = 0; index < this.owners.length; index++) {
                const element = this.owners[index]
                if (element.ctId == ctId) {
                    name = element.realName
                    break
                }
            }
            return name
        },
        tabDataCheck(type, item) {
            this.tabData = type
            if (type == '3' && item) {
                this.detailData = item
            }
            if (type == '1') {
                if (this.isAdd) {
                    this.blockData.fromNum = 1
                    this.isAdd = false
                }
                this.getListData()
            }
        },
        sendMail(item) {
            setStore('sendMailTopageData', { invokeName: item.invokeName, name: item.name, type: '2' })
            this.$router.push('/main/am/mailMarketing')
        },
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
        //                 _this.getOwners()
        //             } else {
        //                 _this.isContact = false
        //             }
        //         } else if (res.body.code.toString() != '-3') {
        //             _this.$message.error(_this.msg(res.body))
        //         }
        //     }, function (res) {
        //         // _this.loading = false;
        //         _this.$message.error(_this.$t(_this.Global.errorTitle))
        //     })
        // },
        getOwners() {
            let _this = this
            let contactData = {
                // dataType: 'contact',
                // funType: 'all'
                dataType: 'contact',
                funType: 'withRight',
                moduleCode: 'AM001', // this.moduleCode,
                optCode: 'otView'
            }
            _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.accountDropList_get, { params: contactData }).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    let ownersArry = res.body.data
                    let str = _this.$t('mxpcweb.am.1541747843192')
                    ownersArry.splice(0, 0, { ctId: '', inUse: 1, realName: str })
                    _this.owners = ownersArry
                    // _this.ownersSelect = this.company.ctId
                } else {
                    _this.$message(_this.msg(res.body))
                }
            }, function (res) {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },
        deleteItem(list) {
            let _this = this
            // 即将删除此接收人列表, 是否继续?
            // 提示
            // 确定
            // 取消
            this.$confirm(this.$t('mxpcweb.am.1531902886917'), this.$t('mxpcweb.am.1531893166645'), {
                confirmButtonText: this.$t('mxpcweb.am.1531893129621'),
                cancelButtonText: this.$t('mxpcweb.am.1531893140621'),
                type: 'warning'
            }).then(() => {
                let data = {
                    invokeName: list.invokeName
                }
                this.$http.delete(this.Global.baseURL + this.Global.api.v2.addrBook_Delete, { params: data }).then((res) => {
                    if (res.body.code.toString() === this.Global.RES_OK) {
                        this.$message.success(_this.msg(res.body))
                        this.getListData()
                    } else if (res.body.code.toString() != '-3') {
                        this.$message.error(_this.msg(res.body))
                    }
                }, function (res) {
                    this.$message.error(this.$t(this.Global.errorTitle))
                })
            }).catch(() => {
            })
        },
        getListData(obj) {
            let _this = this
            let data = {
                pageN: _this.blockData.fromNum, // parseInt(_this.blockData.fromNum / _this.blockData.pageSize) + 1,
                pageSize: _this.blockData.pageSize
            }
            if (this.keywords != '') {
                data.name = this.keywords
            }
            if (this.ownersSelect != '') {
                data.ownerCtId = this.ownersSelect
            }
            _this.$http.get(this.Global.baseURL + this.Global.api.v2.addrBook_Get, { params: data }).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    if (res.body.data.dataList && isArray(res.body.data.dataList)) {
                        _this.sendeeList = res.body.data.dataList
                        _this.blockData.total = res.body.data.rowTotal
                    } else {
                        _this.sendeeList = []
                        _this.blockData.total = 0
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
        }
    },
    computed: {
        ...mapGetters(['company'])
    },
    watch: {
        '$route': function (val, old) {
            if (val.path == this.routeUrl) {
                this.getListData()
                // this.contactCheck()
                this.getOwners()
                this.tabData = '1'
            }
        }
    },
    components: {
        'page-title': PageTitle,
        'list-page': listPage,
        'no-data': NoData,
        'add-name': addName,
        'addpeople': addpeople,
        'detail': detail
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
