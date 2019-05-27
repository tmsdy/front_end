<template>
    <!-- 选择邮箱 -->
    <el-dialog v-dialogDrag title="选择邮箱" :visible.sync="dialog" :closeOnClickModal="false" custom-class="width620" :modal-append-to-body="false">
        <div class="addLowerCust">
            <div style="padding-left:20px">
                <el-checkbox style="margin-left: -9px;margin-bottom: 20px;" :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                <el-checkbox v-model="firstChild" @change="handleCheckSameChange">选中首个邮箱</el-checkbox>
            </div>
            <div class="mailBox MXscroll">
                <el-checkbox-group v-model="checkedCities1" @change="handleCheckedCitiesChange">
                    <el-row class="contentsBox" :gutter="20" style="background:rgba(239,242,244,1);">
                        <el-col class="contents1 ellipsis" :span="6">单据编号</el-col>
                        <el-col class="contents1 ellipsis" :span="18">
                            <el-col class="content" :span="4">&nbsp;</el-col>
                            <el-col class="content" :span="20">{{$t('mxpcweb.client.1529056101685')}}</el-col>
                        </el-col>
                    </el-row>
                    <el-row class="contentsBox" :gutter="20" v-for="(itemList,itemListIndex) in custContacts" :key="itemListIndex">
                        <el-col class="contents1 ellipsis" :title="itemList.quotaCode" :span="6" style="height:41px">{{itemList.quotaCode}}</el-col>
                        <el-col :span="18">
                            <template v-if="itemList.mailAddress">
                                <el-row :gutter="20" class="contents2" v-for="(items,indexs) in itemList.mailAddress" :key="indexs">
                                    <el-col class="content" :span="4">
                                        <el-checkbox :label="items" :key="items">&nbsp;</el-checkbox>
                                    </el-col>
                                    <el-col class="content text-blue ellipsis" :span="20">{{items}}</el-col>
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
            //     recipientsPicking: this.returnMailList(this.checkedCities1)
            // }
            // // console.log(objs);
            //  this.$router.push('/main/mail/home/index')
            // setTimeout(() => {
            //     // 写邮件
            //     ep.emit('openNewMail', {'title': this.$t('mxpcweb.client.1529053914531'), 'type': 'W'})
            //     setTimeout(() => {
            //         let { id } = this.$route.params
            //         let ids = id.split('_')
            //         ep.emit('CustmerWriteMail' + ids[2], objs)
            //     }, 50)
            // }, 50)
            this.dialog = false
        },
        returnMailList(list) {
            let mailList = []
            if (list.length == 0) {
                return mailList
            };
            list.forEach((listItem) => {
                this.custContacts.forEach((item) => {
                    if (item.mailAddress) {
                        item.mailAddress.forEach((items) => {
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
            return mailList
        },
        openWindow(obj) {
            let { billId, customerLists, type, moduleCode } = obj
            let itemData = JSON.parse(JSON.stringify(obj.itemData))
            this.key = ''
            if (moduleCode == 'SC001') {
                this.key = 'quotaId'
                this.label = 'quotaCode'
            } else if (moduleCode == 'SC002') {
                this.key = 'orderId'
                this.label = 'orderCode'
            }
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
            customerList.forEach((itemLists) => { // 所有客户循环
                billIds.forEach((itemList) => { // 选中客户循环
                    if (itemLists[this.key] == itemList && itemLists.mailAddress) {
                        if (isArray(itemLists.mailAddress)) {
                            let isHave = false
                            itemLists.mailAddress.forEach((item) => {
                                if (item !== '') {
                                    arr.push(item)
                                    if (!isHave) {
                                        isHave = true
                                    }
                                }
                            })
                            if (isHave) {
                                custContacts.push(itemLists)
                            }
                        } else {
                            arr.push(itemLists.mailAddress)
                            let mail = itemLists.mailAddress
                            itemLists.mailAddress = []
                            itemLists.mailAddress.push(mail)
                            custContacts.push(itemLists)
                        }
                    }
                })
            })
            if (custContacts.length == '0') {
                // 此客户当前没有联系人邮箱，是否继续进行写邮件操作
                // 提示
                // 确定
                // 取消
                this.$confirm('当前没有邮箱账号，是否继续进行写邮件操作', this.$t('mxpcweb.client.1529047715824'), {
                    confirmButtonText: this.$t('mxpcweb.client.1529047741736'),
                    cancelButtonText: this.$t('mxpcweb.client.1529047588840'),
                    type: 'warning'
                }).then(() => {
                    this.submit()
                }).catch(() => {
                })
                return false
            }
            this.custContacts = custContacts
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
            let checkedCities1 = []
            this.custContacts.forEach((itemLists) => { // 所有客户循环
                if (itemLists.mailAddress && itemLists.mailAddress[0]) {
                    checkedCities1.push(itemLists.mailAddress[0])
                }
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
