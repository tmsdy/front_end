<template>
    <!-- 选择联系人邮箱 -->
    <el-dialog v-dialogDrag :title="$t('mxpcweb.client.1529053857522')" :visible.sync="dialog" :closeOnClickModal="false" custom-class="width620" :modal-append-to-body="false">
        <div class="addLowerCust">
            <div style="padding-left:20px">
                <el-checkbox style="margin-left: -9px;margin-bottom: 20px;" :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                <!-- 选中所有联系人首个邮箱 -->
                <el-checkbox v-model="firstChild" @change="handleCheckSameChange">{{$t('mxpcweb.client.1529053871567')}}</el-checkbox>
            </div>
            <div class="mailBox MXscroll">
                <el-checkbox-group v-model="checkedCities1" @change="handleCheckedCitiesChange">
                    <el-row class="contentsBox" :gutter="20" style="background:rgba(239,242,244,1);">
                        <!-- 客户 -->
                        <el-col class="contents1 ellipsis" :span="6">{{$t('mxpcweb.components.1530947739505')}}</el-col>
                        <el-col :span="18">
                            <el-row :gutter="20">
                                <!-- 联系人 -->
                                <el-col class="contents1 ellipsis" :span="6">{{$t('mxpcweb.workbench.1530703534191')}}</el-col>
                                <el-col class="contents1 ellipsis" :span="18">
                                    <el-col class="content" :span="4">&nbsp;</el-col>
                                    <!-- 邮箱 -->
                                    <el-col class="content" :span="20">{{$t('mxpcweb.client.1529056101685')}}</el-col>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                    <el-row class="contentsBox" :gutter="20" v-for="(itemList,itemListIndex) in custContacts" :key="itemListIndex">
                        <el-col class="contents1 ellipsis" :title="itemList.custName" :span="6" style="height:41px">{{itemList.custName}}</el-col>
                        <el-col :span="18">
                            <template v-for="(item,index) in itemList.custContacts">
                                <el-row :gutter="20" v-if="item.mailAddress&&item.mailAddress.length!==0" :key="index">
                                    <el-col class="contents1 ellipsis" :title="item.contName" style="height:41px" :span="6">{{item.contName}}</el-col>
                                    <el-col :span="18" class="contents2Box">
                                        <el-row :gutter="20" class="contents2" v-for="(items,indexs) in item.mailAddress" :key="indexs">
                                            <el-col class="content" :span="4">
                                                <el-checkbox :label="items" :key="items">&nbsp;</el-checkbox>
                                            </el-col>
                                            <el-col class="content text-blue ellipsis" :span="20">{{items}}</el-col>
                                        </el-row>
                                    </el-col>
                                </el-row>
                            </template>
                        </el-col>
                    </el-row>
                </el-checkbox-group>
            </div>
        </div>
        <div slot="footer" class="dialogFooter" style="text-align:center">
            <!-- 取消 -->
            <el-button @click="dialog=false">{{$t('mxpcweb.client.1529047588840')}}</el-button>
            <!-- 确定 -->
            <el-button type="primary" @click="submit">{{$t('mxpcweb.client.1529047741736')}}</el-button>
        </div>
    </el-dialog>
</template>
<script>
import { isArray } from '@/libs/utils.js'
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
            firstChild: true
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
            _this.$router.push({ path: '/main/mail/home/index', query: { 'title': _this.$t('mxpcweb.client.1529053914531'), 'type': 'W', 'recipientsPicking': _this.returnMailList(this.checkedCities1) } })
            // let objs = {
            //     recipientsPicking: _this.returnMailList(this.checkedCities1)
            // }
            // console.log(objs);
            // _this.$router.push('/main/mail/home/index')
            // setTimeout(function () {
            //     // 写邮件
            //     ep.emit('openNewMail', { 'title': _this.$t('mxpcweb.client.1529053914531'), 'type': 'W' })
            //     setTimeout(function () {
            //         let { id } = _this.$route.params
            //         let ids = id.split('_')
            //         console.log('ddddddddddddd')
            //         console.log(id)
            //         ep.emit('CustmerWriteMail' + ids[2], objs)
            //     }, 50)
            // }, 50)
            _this.dialog = false
        },
        returnMailList(list) {
            let _this = this
            let mailList = []
            if (list.length == 0) {
                return mailList
            };
            list.forEach(function (listItem) {
                _this.custContacts.forEach(function (itemLists) {
                    itemLists.custContacts.forEach(function (item) {
                        if (item.mailAddress) {
                            item.mailAddress.forEach(function (items) {
                                if (listItem == items) {
                                    let objs = {
                                        name: item.contName,
                                        mail: items
                                    }
                                    mailList.push(objs)
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
            let { itemData, billId, customerLists, type } = obj
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
            customerList.forEach(function (itemLists) { // 所有客户循环
                billIds.forEach(function (itemList) { // 选中客户循环
                    if (itemLists.custId == itemList && itemLists.custContacts) {
                        if (isArray(itemLists.custContacts)) {
                            let isHave = false
                            itemLists.custContacts.forEach(function (item) {
                                if (item.delState != '1' && isArray(item.mailAddress)) {
                                    item.mailAddress.forEach(function (items) {
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
                // 此客户当前没有联系人邮箱，是否继续进行写邮件操作
                // 提示
                // 确定
                // 取消
                _this.$confirm(_this.$t('mxpcweb.client.1529054609031'), _this.$t('mxpcweb.client.1529047715824'), {
                    confirmButtonText: _this.$t('mxpcweb.client.1529047741736'),
                    cancelButtonText: _this.$t('mxpcweb.client.1529047588840'),
                    type: 'warning'
                }).then(() => {
                    _this.submit()
                }).catch(() => {
                })
                return false
            }
            _this.custContacts = custContacts
            this.cities = arr
            this.handleCheckSameChange1()
            this.firstChild = true
            this.dialog = true
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
            _this.custContacts.forEach(function (itemLists) { // 所有客户循环
                itemLists.custContacts.forEach(function (item) {
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
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.addLowerCust {
    padding: 20px 20px;
    .mailBox {
        padding: 0 20px;
        max-height: 400px;
        padding-bottom: 50px;
        overflow-y: auto;
        .contentsBox {
            .contents1 {
                height: 40px;
                line-height: 40px;
            }
            .contents2 {
                height: 40px;
                line-height: 40px;
                .content {
                    height: 40px;
                    line-height: 40px;
                }
            }
        }
    }
    .dialogFooter {
        height: 80px;
    }
}
</style>
