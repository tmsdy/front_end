<template>
    <div class="detail">
        <!-- 接收人 -->
        <!-- 名单详情 -->
        <page-detail :title="$t('mxpcweb.am.1542012292798')" iconfont="icon-personnel" :detailTitle="$t('mxpcweb.am.1542012746541')" @toList="$emit('tabDataCheck','1')"></page-detail>
        <div style="height:100%;">
            <div class="sendeePeopleBox">
                <div class="sendeePeopleBoxSearch">
                    <span class="editDetailName" v-show="editDetailName">
                        {{detailDatas.name}}
                        <i class="iconfont icon-edit text-hover" @click="editDetailName=false" style="margin-left:10px"></i>
                    </span>
                    <span class="editDetailName" v-show="!editDetailName">
                        <el-input v-model="detailDatas.name" size="mini" @blur="editDetailNameClick()" :maxlength="20"></el-input>
                        <i class="iconfont icon-close text-hover editClick" @click="editDetailName=true" style="font-size: 12px;"></i>
                    </span>
                    <div style="float:right">
                        <!-- 新增接收人 -->
                        <el-button type="primary" @click="$emit('tabDataCheck','4')" size="small" style="height:35px;">{{$t('mxpcweb.am.1531902437465')}}</el-button>
                    </div>
                    <!-- @click="getListData"  考虑换成下拉框 -->
                    <el-input class="inputSearch" v-model="keywords" icon="search" @click="getListData()"></el-input>
                </div>

                <div class="sendeePeopleBoxList">
                    <el-row class="list" :gutter="20">
                        <el-checkbox v-if="sendeePeopleList.length" class="sendeeCheck" :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">&nbsp;</el-checkbox>
                        <template v-if="checkList.length==0">
                            <!-- 邮箱 -->
                            <el-col :span="5">{{$t('mxpcweb.am.1531900664136')}}</el-col>
                            <!-- 昵称 -->
                            <el-col :span="5">{{$t('mxpcweb.am.1531900824830')}}</el-col>
                            <!-- 手机 -->
                            <el-col :span="5">{{$t('mxpcweb.am.1531901900133')}}</el-col>
                            <!-- 更新时间 -->
                            <el-col :span="5">{{$t('mxpcweb.am.1531893029814')}}</el-col>
                            <!-- 操作 -->
                            <el-col :span="4">{{$t('mxpcweb.am.1531902668646')}}</el-col>
                        </template>
                        <div v-else style="padding-left:10px;color:#bcbcca">
                            <!-- 生成新列表 -->
                            <!-- <span class="text-hover">{{$t('mxpcweb.am.1531902457901')}}</span> -->
                            <!-- 删除 -->
                            <span class="text-hover" @click="deleteItem2(false,true)" style="margin-left:10px">{{$t('mxpcweb.am.1531893085173')}}</span>
                        </div>
                    </el-row>
                </div>
                <el-checkbox-group v-model="checkList" @change="handleCheckedCitiesChange">
                    <div class="sendeePeopleBoxList sendeePeopleBoxTit MXscroll" :style="blockData.total>blockData.pageSize?'padding-bottom: 44px;':'padding-bottom: 0;'">
                        <no-data v-if="sendeePeopleList.length==0&&!loading" style="background:rgba(1,1,1,0)"></no-data>
                        <el-row v-else class="list1" :gutter="20" v-for="(item,index) in sendeePeopleList" :key="index">
                            <el-checkbox class="sendeeCheck" :label="item.member">&nbsp;</el-checkbox>
                            <el-col class="ellipsis" :span="5" :title="item.member">
                                {{item.member}}
                                <!-- <i v-if="item.vars&&JSON.parse(item.vars).level" class="iconfont" :title="iconfontTitle[JSON.parse(item.vars).level.toUpperCase()]" :style="{color: iconfontColor[JSON.parse(item.vars).level.toUpperCase()]}" style="font-size:12px;" :class="iconfont[JSON.parse(item.vars).level.toUpperCase()]"></i> -->
                            </el-col>
                            <el-col class="ellipsis" :span="5">{{item.vars&&JSON.parse(item.vars).recipientName?JSON.parse(item.vars).recipientName:'&nbsp;'}}</el-col>
                            <el-col class="ellipsis" :span="5">{{item.vars&&JSON.parse(item.vars).phone?JSON.parse(item.vars).phone:'&nbsp;'}}</el-col>
                            <el-col class="ellipsis" :span="5">{{item.gmtUpdated}}</el-col>
                            <!-- 编辑 -->
                            <!-- 删除 -->
                            <el-col :span="4">
                                <span class="text-hover" @click="dialogEditOpen(item)">
                                    {{$t('mxpcweb.am.1531893071733')}}
                                </span>
                                <span @click="deleteItem(item)" class="text-hover" style="margin-left:15px;">
                                    {{$t('mxpcweb.am.1531893085173')}}
                                </span>
                            </el-col>
                        </el-row>
                    </div>
                </el-checkbox-group>
            </div>
            <!--分页-->
            <list-page style="text-align:left;background:#f7f8f9;z-index: 1;" :blockData="blockData" @getListData="getListData"></list-page>
            <!-- 编辑接收人 -->
            <el-dialog v-dialogDrag :close-on-click-modal="false" :title="$t('mxpcweb.am.1531902462340')" :visible.sync="dialogEdit" :closeOnClickModal="false" custom-class="width620" :modal-append-to-body="false">
                <!-- 邮箱: -->
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px" label-position="right" style="margin-top:15px">
                    <el-form-item :label="$t('mxpcweb.am.1531902483427')" prop="address">
                        <el-input v-model="ruleForm.address" style="width:350px"></el-input>
                    </el-form-item>
                    <!-- 昵称: -->
                    <el-form-item :label="$t('mxpcweb.am.1531902495700')">
                        <el-input v-model="ruleForm.name" style="width:350px"></el-input>
                    </el-form-item>
                    <!-- 手机号: -->
                    <el-form-item :label="$t('mxpcweb.am.1531902488660')" prop="phone">
                        <el-input v-model="ruleForm.phone" style="width:350px"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialogFooter text-center">
                    <!-- 取消 -->
                    <el-button @click="dialogEdit=false">{{$t('mxpcweb.am.1531893140621')}}</el-button>
                    <!-- 确定 -->
                    <el-button type="primary" :loading="submitLoading" @click="submit">{{$t('mxpcweb.am.1531893129621')}}</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import PageDetail from '@/components/PageDetail/index' // 大标题
import PageTitle from '@/components/PageTitle/index' // 大标题
import listPage from '@/components/listPageTwo/index' // 分页
import { isArray, checkPhone, checkEmail } from '@/libs/utils.js'
import NoData from '@/basecomponents/NoData/index'
import { mapGetters } from 'vuex'
export default {
    name: 'sendeePeople',
    props: {
        detailData: {
            type: Object,
            default: function () {
                return {
                    invokeName: '',
                    name: ''
                }
            }
        }
    },
    data() {
        var checkPhones = (rule, value, callback) => {
            if (value === '') {
                callback()
            } else {
                if (!checkPhone(value)) {
                    // 请输入正确的手机号
                    callback(new Error(this.$t('mxpcweb.am.1531902510388')))
                } else {
                    callback()
                }
            }
        }
        var checkEmails = (rule, value, callback) => {
            if (value === '') {
                callback()
            } else {
                if (!checkEmail(value)) {
                    // 请输入正确的邮箱地址
                    callback(new Error(this.$t('mxpcweb.am.1531902516260')))
                } else {
                    callback()
                }
            }
        }

        return {
            loading: true,
            keywords: '',
            sendeePeopleList: [],
            // 分页操作
            blockData: {
                pageSize: 20,
                total: 0,
                fromNum: 1
            },
            editDetailName: true,
            detailDatas: {
                invokeName: '',
                name: ''
            },
            baseDetailDatas: {
                invokeName: '',
                name: ''
            },
            ruleForm: {
                name: '',
                address: '',
                phone: '',
                contName: '',
                custName: ''

            },
            rules: {
                address: [
                    { required: true, validator: checkEmails, trigger: 'blur' }
                ],
                phone: [
                    { validator: checkPhones, trigger: 'blur' }
                ]
            },
            dialogEdit: false,
            itemData: {},
            checkList: [],
            checkAll: false,
            isIndeterminate: false,
            cityOptions: [],
            iconfont: {
                'A+': 'icon-mail-level-AA',
                'A': 'icon-mail-level-A',
                'B': 'icon-mail-level-B',
                'C': 'icon-mail-level-C',
                'D': 'icon-mail-level-D',
                'E': 'icon-mail-level-E'
            },
            iconfontColor: {
                'A+': '#91da6f',
                'A': '#bfbf18',
                'B': '#bfbf18',
                'C': '#bfbf18',
                'D': '#ffb735',
                'E': '#ff7165'
            },
            iconfontTitle: {
                // 该级别地址活跃度很高，建议发送
                'A+': this.$t('mxpcweb.am.1533112834426'),
                // 该级别地址有效，建议发送
                'A': this.$t('mxpcweb.am.1533112856267'),
                // 该级别地址有效，建议发送
                'B': this.$t('mxpcweb.am.1533112856267'),
                // 该级别地址有效，建议发送
                'C': this.$t('mxpcweb.am.1533112856267'),
                // 该级别地址不一定有效，存在一系列的其他因素
                'D': this.$t('mxpcweb.am.1533112870958'),
                // 该地址无效，不建议发送
                'E': this.$t('mxpcweb.am.1533112886302')
            },
            submitLoading: false
        }
    },
    mounted() {

    },
    created() {
        this.detailDatas = this.detailData
        this.baseDetailDatas = this.detailDatas
        this.getListData()
    },
    mounted() {
    },
    computed: {
        ...mapGetters([
            'company'
        ])
    },
    methods: {
        handleCheckAllChange(event) {
            this.checkList = event.target.checked ? this.cityOptions : []
            this.isIndeterminate = false
        },
        handleCheckedCitiesChange(value) {
            let checkedCount = value.length
            this.checkAll = checkedCount === this.cityOptions.length
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.cityOptions.length
        },
        submit() {
            this.submitLoading = true
            let _this = this
            _this.$http.put(this.Global.baseURL + this.Global.api.v2.addrMember_Edit, {
                invokeName: _this.detailDatas.invokeName,
                members: [this.itemData.member],
                newMembers: [this.ruleForm.address],
                names: [this.ruleForm.name == '' ? this.ruleForm.address : this.ruleForm.name],
                vars: [{ recipientName: this.ruleForm.name, phone: this.ruleForm.phone, contName: this.ruleForm.contName, custName: this.ruleForm.custName }]
            }).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    _this.getListData()
                    _this.$message.success(_this.msg(res.body))
                    _this.dialogEdit = false
                    _this.submitLoading = false
                } else if (res.body.code.toString() != '-3') {
                    _this.submitLoading = false
                    _this.$message.error(_this.msg(res.body))
                }
            }, function (res) {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },
        dialogEditOpen(item) {
            if (item.vars) {
                let obj = JSON.parse(item.vars)
                this.ruleForm = {
                    name: obj.recipientName,
                    address: item.member,
                    phone: obj.phone,
                    contName: obj.contName,
                    custName: obj.custName
                }
            } else {
                this.ruleForm = {
                    name: '',
                    address: item.member,
                    phone: '',
                    contName: '',
                    custName: ''
                }
            }
            this.itemData = item
            this.dialogEdit = true
        },
        editDetailNameClick() {
            let _this = this
            if (_this.detailDatas.name === '') {
                _this.detailDatas.name = _this.baseDetailDatas.name
                return false
            }
            _this.$http.put(this.Global.baseURL + this.Global.api.v2.addrBook_Edit, {
                invokeName: _this.detailDatas.invokeName,
                name: _this.detailDatas.name
            }).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    _this.$message.success(res.body.msg)
                    _this.baseDetailDatas = _this.detailDatas
                    _this.editDetailName = true
                } else if (res.body.code.toString() != '-3') {
                    _this.detailDatas = _this.baseDetailDatas
                    _this.$message(res.body.msg)
                } else {
                    _this.detailDatas = _this.baseDetailDatas
                }
            }, function (res) {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },

        deleteItem2(list, lists) {
            // 即将删除接收人地址, 是否继续?
            // 提示
            this.$confirm(this.$t('mxpcweb.am.1531902526739'), this.$t('mxpcweb.am.1531893166645'), {
                // 确定
                confirmButtonText: this.$t('mxpcweb.am.1531893129621'),
                // 取消
                cancelButtonText: this.$t('mxpcweb.am.1531893140621'),
                type: 'warning'
            }).then(() => {
                let data = {
                    invokeName: this.detailDatas.invokeName,
                    members: this.checkList
                }
                this.$http.delete(this.Global.baseURL + this.Global.api.v2.addrMember_Delete, { params: data }).then((res) => {
                    if (res.body.code.toString() === this.Global.RES_OK) {
                        this.$message.success(this.msg(res.body))
                        this.getListData()
                        this.checkList = []
                        this.checkAll = false
                        this.isIndeterminate = false
                    } else if (res.body.code.toString() != '-3') {
                        this.$message.error(this.msg(res.body))
                    }
                }, function (res) {
                    this.$message.error(this.$t(this.Global.errorTitle))
                })
            }).catch(() => {
            })
        },
        deleteItem(item) {
            // 即将删除接收人地址, 是否继续?
            // 提示
            this.$confirm(this.$t('mxpcweb.am.1531902526739'), this.$t('mxpcweb.am.1531893166645'), {
                // 确定
                confirmButtonText: this.$t('mxpcweb.am.1531893129621'),
                // 取消
                cancelButtonText: this.$t('mxpcweb.am.1531893140621'),
                type: 'warning'
            }).then(() => {
                let data = {
                    members: [item.member],
                    invokeName: item.address
                }
                this.$http.delete(this.Global.baseURL + this.Global.api.v2.addrMember_Delete, { params: data }).then((res) => {
                    if (res.body.code.toString() === this.Global.RES_OK) {
                        this.$message.success(this.msg(res.body))
                        this.getListData()
                        this.checkList = []
                        this.checkAll = false
                        this.isIndeterminate = false
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
                from: (_this.blockData.fromNum - 1) * _this.blockData.pageSize, // parseInt(_this.blockData.fromNum / _this.blockData.pageSize),
                size: _this.blockData.pageSize,
                invokeName: _this.detailDatas.invokeName
            }
            if (_this.keywords.toString().trim() != '') {
                data.members = _this.keywords
            }
            _this.$http.get(this.Global.baseURL + this.Global.api.v2.addrMember_Get, { params: data }).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    if (res.body.data.dataList && isArray(res.body.data.dataList)) {
                        _this.sendeePeopleList = res.body.data.dataList
                        _this.blockData.total = res.body.data.total
                    } else {
                        _this.sendeePeopleList = []
                        _this.blockData.total = 0
                    }
                    let cityOptions = []
                    _this.sendeePeopleList.forEach(element => {
                        cityOptions.push(element.member)
                    })
                    _this.cityOptions = cityOptions
                    _this.loading = false
                } else {
                    _this.loading = false
                    _this.$message.error(res.body.data.message)
                }
            }, function (res) {
                _this.loading = false
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        }
    },
    watch: {
        '$route': function (val, old) {
        }
    },
    components: {
        'page-title': PageTitle,
        'list-page': listPage,
        'no-data': NoData,
        'page-detail': PageDetail
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.detail {
    height: 100%;
    .title {
        height: 50px;
        line-height: 50px;
        .back {
            color: #b9b9b9;
            margin-right: 20px;
            font-size: 12px;
        }
        .titleName {
            color: #6b6b6b;
            font-weight: 400;
        }
    }
    .sendeePeopleBox {
        color: #6b6b6b;
        font-size: 14px;
        width: 100%;
        .sendeePeopleBoxSearch {
            height: 52px;
            line-height: 52px;
            overflow: hidden;
            background: white;
            border-bottom: 1px solid rgba(234, 237, 239, 1);
            padding: 0 10px;
            .addButtonBox {
                float: right;
                position: relative;
                top: -1px;
            }
            .addInput {
                float: right;
                margin: 0 10px;
                width: 150px;
            }
            .editDetailName {
                display: inline-block;
                position: relative;
                margin-left: 5px;
                .editClick {
                    position: absolute;
                    top: 0px;
                    right: -20px;
                }
            }
            .inputSearch {
                float: right;
                width: 268px;
                margin: 0 20px 0 10px;
            }
        }
        .sendeePeopleBoxList {
            font-size: 12px;
            overflow-x: hidden;
            .list {
                height: 40px;
                line-height: 40px;
                padding: 0 47px;
                background: rgba(239, 242, 244, 1);
                color: RGBA(144, 147, 153, 1);
                .sendeeCheck {
                    position: absolute;
                    left: 32px;
                    height: 40px;
                    //   border: 1px blue solid;
                }
            }
            .list1 {
                height: 54px;
                line-height: 54px;
                color: RGBA(34, 34, 34, 1);
                border-bottom: 1px solid #f4f5f6;
                padding: 0 35px;
                background: white;
                .sendeeCheck {
                    position: absolute;
                    left: 20px;
                    height: 50px;
                }
                .left10 {
                    margin-left: 10px;
                }
                &:hover {
                    background: #fcf2f3;
                }
            }
        }

        .sendeePeopleBoxTit {
            position: absolute;
            top: 147px;
            left: 15px;
            right: 15px;
            bottom: 0px;
            overflow-y: auto;
            overflow-x: hidden;
        }
    }
}
</style>
