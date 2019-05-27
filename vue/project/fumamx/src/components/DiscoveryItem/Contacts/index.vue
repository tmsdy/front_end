<template>
    <div class="Contacts">
        <p class="navTitle">联系人</p>
        <template v-if="isDeep!=3">
            <div class="deepFindBox">
                <div class="imgBox">
                    <img src="/static/images/find/find.png" alt="">
                </div>
                <el-button @click="isDeep==2?'':$emit('toFind')" :loading="isDeep==2" type="primary">深挖企业信息和联系人</el-button>
            </div>
        </template>
        <template v-else>
            <div class="btnBox clearfix">
                <!--  -->
                <template v-if="hasContacts">
                    <el-button v-if="detailItem.isDetailed==0" @click="$emit('getMail')" :disabled="!hasContacts" type="primary" class="btnItem">获取邮箱</el-button>
                    <template v-if="detailItem.isDetailed==1">
                        <el-button @click="handleMarketingAll()" :disabled="!hasContacts" type="primary" class="btnItem">一键营销</el-button>
                        <el-button @click="handleAddAddressAll()" :disabled="!hasContacts" type="primary" class="btnItem">加入地址薄</el-button>
                        <el-button @click="handleExpExcel()" :loading="isExporting" :disabled="!hasContacts" type="primary" class="btnItem">导出Excel</el-button>
                        <div class="searchBox">
                            <i class="iconfont icon-search"></i>
                            <input v-model="keywords" @keyup="handleSearch()" type="text" placeholder="输入关键词进行检索">
                            <i v-if="keywords.length>0" class="clearBtn" @click="handleClearSearch()"></i>
                        </div>
                    </template>
                </template>
                <div v-if="!isLoading&&isRefind" class="pull-right">
                    <span class="hintText">联系人信息不准确？</span>
                    <el-button type="primary" @click="handleRefind()" class="btnItem">重新深挖</el-button>
                </div>
            </div>
            <ul class="contactsList clearfix">
                <li v-for="(item,index) in workers" class="contactsItem" :key="index">
                    <p class="info name ellipsis">
                        <i class="iconfont icon-avatar"></i>
                        {{item.name||item.email.split('@')[0]||'&nbsp;'}}
                    </p>
                    <p class="info type ellipsis">
                        <i class="iconfont icon-buyer"></i>
                        {{item.fumaFlag==0?'买手':''}}
                    </p>
                    <p class="info mail ellipsis">
                        <i class="iconfont icon-mail-meeting"></i>
                        <template v-if="detailItem.isDetailed==0">
                            {{item.email||'&nbsp;'}}
                        </template>
                        <a v-else class="link" :href="`mailto:${item.email}`">{{item.email||'&nbsp;'}}</a>
                    </p>
                    <div class="socalBox">
                        <a v-if="item['Facebook']" @click.prevent="openNewWindowTab(item['Facebook'].url)" :href="item['Facebook'].url" target="_blank">
                            <i class="iconfont icon-facebook facebookIcon"></i>
                        </a>
                        <a v-if="item['Twitter']" @click.prevent="openNewWindowTab(item['Twitter'].url)" :href="item['Twitter'].url" target="_blank">
                            <i class="iconfont icon-twitter twitterIcon"></i>
                        </a>
                        <a v-if="item['LinkedIn']" @click.prevent="openNewWindowTab(item['LinkedIn'].url)" :href="item['LinkedIn'].url" target="_blank">
                            <i class="iconfont icon-linkedin linkedinIcon"></i>
                        </a>
                    </div>
                    <ul class="optBtnBox clearfix">
                        <el-tooltip effect="dark" content="添加联系人" placement="top">
                            <li class="optBtnItem">
                                <i @click="handleAddContacts(item)" class="iconfont icon-contacts-add"></i>
                            </li>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="一键营销" placement="top">
                            <li class="optBtnItem">
                                <i @click="handleMarketingItem(item.email)" class="iconfont icon-send"></i>
                            </li>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="加入地址薄" placement="top">
                            <li class="optBtnItem">
                                <i @click="handleAddAddressItem(item)" class="iconfont icon-address-book"></i>
                            </li>
                        </el-tooltip>
                    </ul>
                </li>
            </ul>
            <loading v-if="isLoading"></loading>

            <no-data v-if="!isLoading&&workers.length<=0" :title="hasContacts?'无结果':'暂无联系人'"></no-data>
            <div v-if="allWorkers_show.length>page.size" class="page">
                <el-pagination @current-change="handleChangePage" background layout="total,prev,pager,next" :page-size="page.size" :current-page="page.now" :total="page.total">
                </el-pagination>
            </div>
        </template>
    </div>
</template>

<script>
import NoData from '@/basecomponents/NoData'
import Loading from '@/basecomponents/Loading'
import { sortContacts } from '../tools.js'
export default {
    name: 'Contacts',
    props: {
        isDeep: {
            type: Number,
            default: 1
        },
        companyName: {
            type: String,
            default: ''
        },
        detailItem: {
            type: Object,
            default: () => ({})
        },
        searchId: {
            type: [String, Number],
            default: ''
        },
        isRefind: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            getMailDialogVisible: false,
            rechargeDialogVisible: false,
            isPlaying: false,
            isExporting: false,
            keywords: '',
            allWorkers: Object.freeze([]),
            allWorkers_show: Object.freeze([]),
            isLoading: false,
            page: {
                now: 1,
                size: 9,
                total: 0
            }
        }
    },
    mounted() {
        this.getContacts()
    },
    computed: {
        hasContacts() {
            return this.allWorkers.length > 0
        },
        workers() {
            let start = (this.page.now - 1) * this.page.size
            let end = this.page.now * this.page.size
            let arr = []
            for (let index = start; index < end; index++) {
                if (this.allWorkers_show[index]) { arr.push(this.allWorkers_show[index]) }
            }
            return arr
        }
    },
    methods: {
        handleChangePage(i) {
            this.page.now = i
        },
        getAllWorkers() {
            return this.allWorkers
        },
        handleClearSearch() {
            this.keywords = ''
            this.handleSearch()
        },
        handleSearch() {
            this.page.now = 1
            let arr
            if (this.keywords) {
                let strKey = this.keywords.toLowerCase()
                arr = this.allWorkers.filter(({ name, email }) => {
                    if (name) {
                        return name.toLowerCase().indexOf(strKey) != -1
                    }
                    return email.toLowerCase().indexOf(strKey) != -1
                })
            } else {
                arr = this.allWorkers
            }

            this.allWorkers_show = Object.freeze(arr)
            this.page.total = this.allWorkers_show.length
        },
        /* 添加联系人 */
        async  handleAddContacts(item) {
            if (!item.email) {
                this.$message({
                    message: '没有联系人邮箱',
                    type: 'warning'
                })
                return false
            }
            let obj = [
                {
                    value: item.email.trim(),
                    fieldName: 'mailAddress',
                    disable: true
                },
                {
                    value: item.name || item.email.split('@')[0],
                    fieldName: 'contName',
                    disable: true
                }
            ]
            if (item.position) {
                obj.push({
                    value: item.position.trim(),
                    fieldName: 'jobs',
                    disable: true
                })
            }
            let { Facebook, Twitter, LinkedIn } = item
            if (Facebook || Twitter || LinkedIn) {
                let social = {}
                Facebook && Object.assign(social, { 5: Facebook.url })
                LinkedIn && Object.assign(social, { 6: LinkedIn.url })
                Twitter && Object.assign(social, { 7: Twitter.url })

                obj.push({
                    value: social,
                    fieldName: 'social',
                    disable: true
                })
            }
            let data = await this.getCustomerByName()
            if (data.flag) {
                obj.push({
                    value: data.custId,
                    fieldName: 'custId',
                    disable: true
                })
            }
            // this.$refs.addCustomer.openWindow({ otherObjs: obj })
            ep.emit('optClick', {
                optData: {
                    optCode: 'otNew',
                    optModuleCode: 'BF003',
                    optName: '新增联系人'
                },
                otherObjs: obj
            })
        },
        handleMarketingItem(mailAddress) {
            if (!mailAddress) {
                this.$message.error('没有联系人邮箱')
                return false
            }
            this.$emit('marketing', [{ mailAddress: mailAddress.trim() }])
        },
        handleMarketingAll() {
            if (this.allWorkers_show.length <= 0) {
                this.$message.error('没有联系人')
                return false
            }
            let mailAddress = []
            this.allWorkers_show.forEach(item => {
                if (item.email) {
                    mailAddress.push({ mailAddress: item.email.trim() })
                }
            })
            if (mailAddress.length <= 0) {
                this.$message.error('没有联系人邮箱')
                return false
            }
            this.$emit('marketing', mailAddress)
        },
        handleAddAddressItem(item) {
            if (!item.email) {
                this.$message.error('没有联系人邮箱')
                return false
            }
            this.$emit('addAddress', [{
                name: item.name || item.email.split('@')[0],
                address: item.email.trim()
            }])
        },
        handleAddAddressAll() {
            if (this.allWorkers_show.length <= 0) {
                this.$message.error('没有联系人')
                return false
            }
            let addressList = []
            this.allWorkers_show.forEach(item => {
                if (item.email) {
                    addressList.push({
                        name: item.name || item.email.split('@')[0],
                        address: item.email.trim()
                    })
                }
            })
            if (addressList.length <= 0) {
                this.$message.error('没有联系人邮箱')
                return false
            }
            this.$emit('addAddress', addressList)
        },

        handleExpExcel() {
            if (this.allWorkers.length <= 0) {
                this.$message.error('没有联系人')
                return false
            }
            this.isExporting = true
            let url = this.Global.baseURL + this.Global.api.v2.find_deep
            this.$http.put(url, { id: this.searchId })
                .then(res => {
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        this.downloadFile(res.body.data.url)
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                    this.isExporting = false
                })
                .catch(err => {
                    this.isExporting = false

                    this.$message.error(this.$t(this.Global.errorTitle))
                })
        },
        handleRefind() {
            if (Object.keys(this.detailItem).length > 0) {
                this.$emit('refind')
            }
        },
        /* 获取客户列表: */
        async getCustomerByName() {
            let returnData = { flag: false }
            try {
                let url = this.Global.baseURL + this.Global.api.v2.document_generalOperate_get
                let params = {
                    moduleCode: 'BF001',
                    searchType: 'allList',
                    from: 0,
                    size: 20,
                    custName: this.companyName
                }
                let res = await this.$http.get(url, { params })
                if (res.data.code.toString() == this.Global.RES_OK) {
                    if (res.data.data.list && res.data.data.list.length > 0) {
                        let { custId } = res.data.data.list[0]
                        returnData.flag = true
                        returnData.custId = custId
                    }
                } else {
                    this.$message.error(this.msg(res.body))
                }
            } catch (error) {
                this.$message.error(this.$t(this.Global.errorTitle))
            }
            return returnData
        },

        async  getContacts() {
            this.allWorkers = this.allWorkers_show = Object.freeze([])

            if (!this.searchId) return
            this.isLoading = true
            try {
                let url = this.Global.baseURL + this.Global.api.v2.find_deep
                let data = { id: this.searchId }
                let res = await this.$http.post(url, data)
                if (res.body.code.toString() == this.Global.RES_OK) {
                    let allWorkers = res.body.data || []
                    this.page.total = allWorkers.length
                    if (this.page.total > 0) {
                        allWorkers = sortContacts(allWorkers)
                        this.allWorkers = this.allWorkers_show = Object.freeze(allWorkers)
                    }
                } else {
                    this.$message.error(this.msg(res.body))
                }
            } catch (error) {
                this.$message.error(this.$t(this.Global.errorTitle))
            }
            this.isLoading = false
        }
    },
    watch: {
        searchId() {
            this.getContacts()
        }
    },
    components: {
        'no-data': NoData,
        'loading': Loading
    }
}
</script>
<style lang='less' rel='stylesheet/less' scoped>
@import "../common.less";
@import "../socialIcon.less";
@import "./en.less";
@import "./zh-cn.less";
</style>
