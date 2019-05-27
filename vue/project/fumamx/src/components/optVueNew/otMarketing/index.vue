<template>
<!-- 选择联系人邮箱 -->
    <el-dialog v-dialogDrag title="一键营销" :visible.sync="dialog" :closeOnClickModal="false" custom-class="width620" :modal-append-to-body="false">
        <div class="addLowerCust" v-show="tabData == '1'">
            <div style="padding-left:20px">
                <el-checkbox style="margin-left: -9px;margin-bottom: 20px;" :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                <!-- 选中所有联系人首个邮箱 -->
                <el-checkbox  v-model="firstChild" @change="handleCheckSameChange">{{$t('mxpcweb.client.1529053871567')}}</el-checkbox>
            </div>
            <div class="mailBox MXscroll">
                <el-checkbox-group v-model="checkedCities1" @change="handleCheckedCitiesChange">
                    <el-row class="contentsBox" :gutter="20" style="background:rgba(239,242,244,1);">
                        <!-- 客户 -->
                        <el-col  class="contents1 ellipsis" :span="6">{{$t('mxpcweb.components.1530947739505')}}</el-col>
                        <el-col :span="18">
                            <el-row :gutter="20">
                                <!-- 联系人 -->
                                <el-col  class="contents1 ellipsis" :span="6">{{$t('mxpcweb.workbench.1530703534191')}}</el-col>
                                <el-col  class="contents1 ellipsis" :span="18">
                                    <el-col  class="content" :span="4">&nbsp;</el-col>
                                    <!-- 邮箱 -->
                                    <el-col  class="content" :span="20">{{$t('mxpcweb.client.1529056101685')}}</el-col>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                    <el-row class="contentsBox" :gutter="20" v-for="(itemList,itemListIndex) in custContacts" :key="itemListIndex">
                        <el-col  class="contents1 ellipsis" :title="itemList.custName" :span="6" style="height:41px">{{itemList.custName}}</el-col>
                        <el-col :span="18">
                            <template v-for="(item,index) in itemList.custContacts">
                                <el-row :gutter="20" v-if="item.mailAddress&&item.mailAddress.length!==0" :key="index">
                                    <el-col  class="contents1 ellipsis" :title="item.contName" style="height:41px" :span="6">{{item.contName}}</el-col>
                                    <el-col :span="18" class="contents2Box">
                                        <el-row :gutter="20" class="contents2" v-for="(items,indexs) in item.mailAddress" :key="indexs">
                                            <el-col  class="content" :span="4">
                                                <el-checkbox :label="items" :key="items">&nbsp;</el-checkbox>
                                            </el-col>
                                            <el-col  class="content text-blue ellipsis" :span="20">{{items}}</el-col>
                                        </el-row>
                                    </el-col>
                                </el-row>
                            </template>
                        </el-col>
                    </el-row>
                </el-checkbox-group>
            </div>
        </div>
        <div class="addLowerCust" v-show="tabData == '2'">
            <div style="height:40px;"></div>
            <div class="mailBox">
                <span style="margin-right:15px;">触发邮件</span>
                <action-mail v-if="dialog" inputWidth="355px" ref="actionMail" :showPreview="false" :actionMails.sync="actionMails" :moduleCode="moduleCode"></action-mail>
            </div>
        </div>
        <div v-if="tabData == '1'" slot="footer" class="dialogFooter" style="text-align:center">
            <!-- 取消 -->
            <el-button @click="dialog=false">{{$t('mxpcweb.client.1529047588840')}}</el-button>
            <!-- 确定 -->
            <el-button type="primary" @click="tabData = '2'">下一步</el-button>
        </div>
        <div v-else slot="footer" class="dialogFooter" style="text-align:center">
            <!-- 取消 -->
            <el-button @click="tabData = '1'">上一步</el-button>
            <!-- 确定 -->
            <el-button type="primary" @click="submit" :loading="subLoading">发送</el-button>
        </div>
    </el-dialog>
</template>
<script>
import { isArray } from '@/libs/utils.js'
import ActionMail from '@/components/ActionMail/index'
/**
 * 描述：客户管理-客户列表-编辑客户
 * 作者：何俊峰
 * 时间：2017/11/22
 */
export default {
    name: 'sendEmail',
    props: {
    },
    data() {
        return {
            dialog: false,
            checkAll: true,
            cities: [],
            isIndeterminate: true,
            custContacts: [],
            checkedCities1: [],
            checkedCities2: [],
            firstChild: true,
            tabData: '1',
            actionMails: {},
            optModuleCode: '',
            moduleCode: '',
            subLoading: false
        }
    },
    created() {
    },
    mounted() {
    },
    computed: {
    },
    methods: {
        submit() {
            let _this = this
            _this.subLoading = true
            let sendType = _this.actionMails.sendType
            if (!sendType) {
                _this.$message.success('请选择触发邮件')
                return false
            }
            if (sendType == '2') {
                _this.$http.post(_this.Global.baseURL + _this.Global.api.v2.bulkDeliver_Post, {
                    detailActionId: _this.actionMails.detailActionId,
                    sendUser: _this.actionMails.sendAddress || '',
                    invokeName: _this.actionMails.invokeName,
                    receiptInfos: _this.returnMailList1(_this.checkedCities1)
                }).then(function(res) {
                    _this.subLoading = false
                    if (res.body.code.toString() == _this.Global.RES_OK) {
                        _this.$message.success(_this.msg(res.body))
                        _this.dialog = false
                    } else {
                        _this.$message.error(_this.msg(res.body))
                    }
                }, function(res) {
                    _this.subLoading = false
                    _this.$message.error(_this.$t(_this.Global.errorTitle))
                })
            } else {
                _this.$http.post(_this.Global.baseURL + _this.Global.api.v2.autoStrategy_manualExecAct, {
                    actionId: 1,
                    detailActionId: _this.actionMails.detailActionId,
                    moduleCode: _this.moduleCode,
                    paramsArray: _this.returnMailList(_this.checkedCities1)
                }).then(function(res) {
                    if (res.body.code.toString() == _this.Global.RES_OK) {
                        _this.$message.success(_this.msg(res.body))
                        _this.subLoading = false
                        _this.dialog = false
                    } else {
                        _this.subLoading = false
                        _this.dialog = false
                        _this.$message.error(_this.msg(res.body))
                    }
                }, function(res) {
                    _this.subLoading = false
                    _this.$message.error(_this.$t(_this.Global.errorTitle))
                })
            }
        },
        returnMailList1(list) {
            let _this = this
            let mailList = []
            if (list.length == 0) {
                return mailList
            };
            _this.custContacts.forEach(function(itemLists) {
                let lists = []
                itemLists.custContacts.forEach(function(item) {
                    if (item.mailAddress) {
                        item.mailAddress.forEach(function(items) {
                            list.forEach(function(listItem) {
                                if (listItem == items) {
                                    lists.push(items)
                                }
                            })
                        })
                    }
                })
                if (lists.length != 0) {
                    let otherReceiveAddrs = _this.actionMails.otherReceiveAddrs || []
                    lists = lists.concat(otherReceiveAddrs)
                    let obj = {
                        addressStr: lists.join(';'),
                        identId: itemLists.custId
                    }
                    mailList.push(obj)
                }
            })
            return mailList
        },
        returnMailList(list) {
            let _this = this
            let mailList = []
            if (list.length == 0) {
                return mailList
            };
            list.forEach(function(listItem) {
                _this.custContacts.forEach(function(itemLists) {
                    itemLists.custContacts.forEach(function(item) {
                        if (item.mailAddress) {
                            item.mailAddress.forEach(function(items) {
                                if (listItem == items) {
                                    let obj = {
                                        mailAddress: items,
                                        identValue: itemLists.custId
                                    }
                                    mailList.push(obj)
                                }
                            })
                        }
                    })
                })
            })
            return mailList
        },
        openWindow(obj) {
            let _this = this
            let { itemData, billId, customerLists, type, optData, moduleCode } = obj
            _this.moduleCode = moduleCode
            _this.optModuleCode = optData.optModuleCode
            let custContacts = []
            let arr = []
            let billIds = []
            let customerList = []
            if (type == '1') {
                billIds = billId
                customerList = customerLists
            } else {
                billIds.push(billId)
                customerList.push(itemData)
            }
            customerList.forEach(function(itemLists) { // 所有客户循环
                billIds.forEach(function(itemList) { // 选中客户循环
                    if (itemLists.custId == itemList && itemLists.custContacts) {
                        if (itemLists.delState != '1' && isArray(itemLists.custContacts)) {
                            let isHave = false
                            itemLists.custContacts.forEach(function(item) {
                                if (isArray(item.mailAddress)) {
                                    item.mailAddress.forEach(function(items) {
                                        if (items !== '') {
                                            arr.push(items)
                                            if (!isHave) {
                                                isHave = true
                                            }
                                        }
                                    })
                                }
                            })
                            if (isHave) {
                                custContacts.push(itemLists)
                            }
                        }
                    }
                })
            })
            if (custContacts.length == '0') {
                // 此联系人暂无邮箱地址
                _this.$message(_this.$t('mxpcweb.client.list.1544165836676'))
                return false
            }
            _this.custContacts = custContacts
            _this.cities = arr
            _this.handleCheckSameChange1()
            _this.firstChild = true
            _this.actionMails = {}
            // if (_this.$refs.actionMail) {
            //     _this.$refs.actionMail.clearData()
            // }
            _this.tabData = '1'
            _this.dialog = true
        },
        handleCheckAllChange(event) {
            this.checkedCities1 = event.target.checked ? this.cities : []
            this.isIndeterminate = false
            this.firstChild = false
        },
        handleCheckSameChange() {
            if (this.firstChild) {
                this.checkedCities1 = this.checkedCities2
            } else {
                this.checkedCities1 = []
            }
            this.handleCheckedCitiesChange(this.checkedCities1, true)
        },
        handleCheckSameChange1() {
            let _this = this
            let checkedCities1 = []
            _this.custContacts.forEach(function(itemLists) { // 所有客户循环
                itemLists.custContacts.forEach(function(item) {
                    if (item.mailAddress && item.mailAddress[0]) {
                        checkedCities1.push(item.mailAddress[0])
                    }
                })
            })
            this.checkedCities1 = checkedCities1
            this.checkedCities2 = checkedCities1
        },
        handleCheckedCitiesChange(value, check) {
            let checkedCount = value.length
            this.checkAll = checkedCount === this.cities.length
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length
            if (!check) {
                this.firstChild = false
            }
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
.addLowerCust{
    padding:20px 20px;
    .mailBox{
        padding:0 20px;
        height: 180px;
        overflow-y: auto;
        .contentsBox{
            .contents1{
                height: 40px;
                line-height:40px;
            }
            .contents2{
                height: 40px;
                line-height:40px;
                .content{
                    height: 40px;
                    line-height:40px;
                }
            }
        }
    }
    .dialogFooter{
        height: 80px;
    }
}
</style>
