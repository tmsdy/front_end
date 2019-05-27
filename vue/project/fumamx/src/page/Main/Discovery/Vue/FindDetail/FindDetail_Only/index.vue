<template>
    <div class="RecordDetail">
        <page-detail detailTitle="详情" @toList="pageBack()"></page-detail>
        <div class="detailCut" v-if="isList">
            <el-button-group>
                <el-button @click="prevItem()" :disabled="isStart" icon="arrow-left"></el-button>
                <el-button @click="nextItem()" :disabled="isEnd"><i class="el-icon-arrow-right el-icon--right"></i></el-button>
            </el-button-group>
        </div>
        <div v-loading="isLoading" class="detailBox MXscroll">
            <div v-if="!isLoading" class="clearfix">
                <div class="leftBox pull-left">
                    <div class="logoBox">
                        <div class="imgBox">
                            <a target="_blank" @click.prevent="openNewWindowTab(detailItem.link)" :href="detailItem.link">
                                <img v-imgsrc="detailItem.picture" data-initsrc="/static/images/initImg.png" />
                            </a>
                        </div>
                        <p ref="companyName" class="name">{{detailItem.company}}</p>
                        <p v-if="isArchive" class="btn">已建档</p>
                        <p v-else class="btn" @click="buildToCRM()">建档到CRM</p>
                    </div>
                    <div class="infoBox">
                        <p class="title">基本信息</p>
                        <ul class="infoList">
                            <li class="clearfix">
                                <span class="label pull-left">联系邮箱</span>
                                <span class="info ellipsis pull-left">{{detailItem.email}}</span>
                            </li>
                            <li class="clearfix">
                                <span class="label pull-left">联系电话</span>
                                <span class="info ellipsis pull-left">{{detailItem.phone}}</span>
                            </li>
                            <li class="clearfix">
                                <span class="label pull-left">所在国家</span>
                                <span class="info ellipsis pull-left">{{detailItem.country}}</span>
                            </li>
                            <li class="clearfix">
                                <span class="label pull-left">公司网站</span>
                                <span class="info ellipsis pull-left">
                                    <a target="_blank" @click.prevent="openNewWindowTab(detailItem.link)" :href="getWebSite(detailItem.link)||'javascript:void(0);'">{{detailItem.link||''}}</a>
                                </span>
                            </li>
                            <li class="clearfix">
                                <span class="label pull-left">员工人数</span>
                                <span class="info ellipsis pull-left"></span>
                            </li>
                        </ul>
                    </div>
                    <div class="explainBox">
                        <p class="title">详情说明</p>
                        <div ref="explain" class="explain">{{detailItem.description||'暂无'}}</div>
                    </div>
                </div>
                <div class="rightBox">
                    <div class="socialBox">
                        <div class="title">社交媒体
                            <p class="pull-right">
                                <span class="deeptime">{{detailItem.deepdate}}</span>
                                <el-button v-if="canUpdate" @click="handleUpdate()" :loading="isUpdate" class="optBtn" type="primary">更新</el-button>
                            </p>
                        </div>
                        <ul class="socialList">
                            <li v-for="(item,key) in social" class="item pull-left" :key="key">
                                <div class="imgBox pull-left">
                                    <a target="_blank" @click.prevent="openNewWindowTab(item.url)" :href="item.url">
                                        <img :src="item.img||''" />
                                    </a>
                                </div>
                                <div class="socialInfo">
                                    <p class="name ellipsis">
                                        <a target="_blank" @click.prevent="openNewWindowTab(item.url)" :href="item.url">{{item.name}}</a>
                                    </p>
                                    <p class="sname">{{key}}</p>
                                </div>
                            </li>
                        </ul>
                        <no-data v-if="Object.keys(social).length<=0"></no-data>
                    </div>
                    <div class="contactsBox">
                        <div class="title">
                            联系人员 {{page.total!==0?"("+page.total+")":''}}
                            <p class="pull-right">
                                <el-button v-if="detailItem.isDetailed==0" @click="handleBuyMail()" :disabled="allWorkers.length<=0" class="optBtn" type="primary">获取邮箱</el-button>
                                <template v-else>
                                    <el-button @click="marketingAll()" :disabled="allWorkers.length<=0" type="primary" class="optBtn">一键营销</el-button>
                                    <!--  <el-button class="optBtn" type="primary">批量新增</el-button> -->
                                    <el-button @click="addAddressAll()" :disabled="allWorkers.length<=0" type="primary" class="optBtn">加入地址簿</el-button>
                                    <el-button @click="exportExcel()" :disabled="allWorkers.length<=0" :loading="isExporting" type="primary" class="optBtn">导出Excel</el-button>
                                </template>
                            </p>
                        </div>
                        <div class="tableBox " :class="{'hasPage':page.total>page.size}">
                            <el-row class="headerBox">
                                <el-col class="item" :span="6">
                                    <div>姓名</div>
                                </el-col>
                                <el-col class="item" :span="9">
                                    <div>邮箱</div>
                                </el-col>
                                <el-col class="item" :span="4">
                                    <div>社交账号</div>
                                </el-col>
                                <el-col class="item" :span="5">
                                    <div>&nbsp;</div>
                                </el-col>
                            </el-row>
                            <div class="bodyBox MXscroll">
                                <template v-if="allWorkers.length>0">
                                    <el-row class="line" v-for="(item,index) in workers" :key="index">
                                        <el-col class="item nameItem" :span="6">
                                            <div>
                                                <img class="avatarImg" :src="item.img||'/static/images/avatar.png'" alt="">
                                                {{item.name||item.email.split('@')[0]||'&nbsp;'}}
                                                <span class="jobTag" v-if="item.fumaFlag==0">买手</span>
                                            </div>
                                        </el-col>

                                        <el-col class="item" :span="9">
                                            <div>{{item.email||'&nbsp;'}}</div>
                                        </el-col>
                                        <el-col class="item" :span="4">
                                            <div class="socialIconBox">
                                                <a v-if="item['Facebook']" @click.prevent="openNewWindowTab(item['Facebook'].url)" :href="item['Facebook'].url" target="_blank"><i class="iconfont icon-facebook facebookIcon"></i></a>
                                                <a v-if="item['Twitter']" @click.prevent="openNewWindowTab(item['Twitter'].url)" :href="item['Twitter'].url" target="_blank"><i class="iconfont icon-twitter twitterIcon"></i></a>
                                                <a v-if="item['LinkedIn']" @click.prevent="openNewWindowTab(item['LinkedIn'].url)" :href="item['LinkedIn'].url" target="_blank"><i class="iconfont icon-linkedin linkedinIcon"></i></a>
                                                <div v-else>&nbsp;</div>
                                            </div>
                                        </el-col>
                                        <el-col class="item" :span="5">
                                            <div class="operationBox">
                                                <div v-if="detailItem.isDetailed!=0" class="optItems clearfix">
                                                    <el-tooltip content="添加联系人" placement="top" effect="light">
                                                        <i @click="addContacts(item)" class="iconfont icon-contacts-add addContacts"></i>
                                                    </el-tooltip>
                                                    <el-tooltip content="一键营销" placement="top" effect="light">
                                                        <i @click="marketingItem(item.email)" class="iconfont icon-send addMarketing"></i>
                                                    </el-tooltip>
                                                    <el-tooltip content="加入地址簿" placement="top" effect="light">
                                                        <i @click="addAddressItem(item)" class="iconfont icon-address-book addMarketing"></i>
                                                    </el-tooltip>
                                                </div>
                                                &nbsp;
                                            </div>
                                        </el-col>
                                    </el-row>
                                </template>
                                <no-data v-if="allWorkers.length<=0"></no-data>
                            </div>
                        </div>

                        <div class="page" v-if="page.total>page.size">
                            <el-pagination @current-change="changePage" background layout="total,prev,pager,next" :page-size="page.size" :current-page="page.now" :total="page.total">
                            </el-pagination>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <buyMail-dialog ref="buyMail"></buyMail-dialog>
        <dialog-marketing ref="dialogMarketing"></dialog-marketing>
        <dialog-address ref="dialogAddress"></dialog-address>
    </div>
</template>
<script>
import NoData from '@/basecomponents/NoData/index'
import PageDetail from '@/components/PageDetail/index'
import {
    BuyMailDialog,
    DialogMarketing,
    DialogAddress,
    sortContacts
} from '@/components/DiscoveryItem'

export default {
    name: 'RecordDetail',
    props: {
        isList: {
            type: Boolean,
            default: false
        },
        id: {
            type: [Number, String],
            default: ''
        },
        isStart: {
            type: Boolean,
            default: false
        },
        isEnd: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            isExporting: false,
            detailId: '',
            detailIndex: '',
            detailItem: {},
            allWorkers: [],
            isLoading: false,
            isUpdate: false,
            page: {
                now: 1,
                size: 10,
                total: 0
            }
        }
    },
    computed: {
        canUpdate() {
            let now = this.$moment(new Date(), 'YYYY/MM/DD').format('YYYY-MM-DD')
            let deeptime
            if (this.detailItem.deepdate) {
                deeptime = this.$moment(this.detailItem.deepdate.replace(/-/g, '/'), 'YYYY/MM/DD').format('YYYY-MM-DD')
            }
            return now !== deeptime
        },
        getSrc() {
            return this.detailItem.picture || '/static/images/initImg.png'
        },
        social() {
            let t = this.detailItem.social_info || '{}'
            return JSON.parse(t)
        },
        workers() {
            let start = (this.page.now - 1) * this.page.size
            let end = this.page.now * this.page.size - 1
            let arr = []
            for (let index = start; index < end; index++) {
                if (this.allWorkers[index]) arr.push(this.allWorkers[index])
            }
            return arr
        },
        isArchive() {
            return !!this.detailItem.custId
        }
    },
    mounted() {
        this.getDetail()
        this.getContacts()
    },
    methods: {

        pageBack() {
            this.$emit('pageBack')
            this.dataInit()
        },
        nextItem() {
            if (this.isLoading) return
            this.$emit('next')
        },
        prevItem() {
            if (this.isLoading) return
            this.$emit('prev')
        },
        dataInit() {
            this.detailItem = {}
            this.allWorkers = []
            this.page = {
                now: 1,
                size: 10,
                total: 0
            }
        },
        getWebSite(url) {
            if (!url) { return false }
            let reg = new RegExp(/HTTP:\/\/|HTTPS:\/\//i)
            return reg.test(url) ? url.toLowerCase() : 'http://' + url.toLowerCase()
        },
        async handleUpdate() {
            if (this.isUpdate) return
            let flag = await this._deepUpdate()
            if (flag) {
                this.getDetail()
                this.getContacts()
            }
        },
        async _deepUpdate() {
            this.isUpdate = true
            let returnFlag = false
            try {
                let url = this.Global.baseURL + this.Global.api.v2.find_detailed
                let data = {
                    params: {
                        id: this.id,
                        source: '1'
                    },
                    before(request) {
                        if (this.previousRequest) {
                            this.previousRequest.abort()
                        }
                        this.previousRequest = request
                    }
                }
                let res = await this.$http.get(url, data)

                if (res.body.code.toString() == this.Global.RES_OK) {
                    returnFlag = true
                } else {
                    this.$message.error(this.msg(res.body))
                }
            } catch (error) {
                if (error.status == 0) {
                    return false
                }

                this.$message.error(this.$t(this.Global.errorTitle))
            }
            this.isUpdate = false
            return returnFlag
        },
        /* 添加联系人 */
        async  addContacts(item) {
            if (!item.email) {
                this.$message({
                    message: '没有联系人邮箱',
                    type: 'warning'
                })
                return false
            }
            let obj = [{
                value: item.email.trim(),
                fieldName: 'mailAddress',
                disable: true
            },
            {
                value: item.name || item.email.split('@')[0],
                fieldName: 'contName',
                disable: true
            }]
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
            ep.emit('optClick', {
                optData: {
                    optCode: 'otNew',
                    optModuleCode: 'BF003',
                    optName: '新增联系人'
                },
                otherObjs: obj
            })
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
                    custName: this.detailItem.company
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
        addAddressItem(item) {
            if (!item.email) {
                this.$message.error('没有联系人邮箱')
                return false
            }
            this.$refs.dialogAddress.open([{
                name: item.name || item.email.split('@')[0],
                address: item.email.trim()
            }])
        },
        addAddressAll() {
            if (this.allWorkers.length <= 0) {
                this.$message.error('没有联系人')
                return false
            }
            let addressList = []
            this.allWorkers.forEach(item => {
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
            this.$refs.dialogAddress.open(addressList)
        },
        /* 一键营销：单个 */
        marketingItem(mailAddress) {
            if (!mailAddress) {
                this.$message.error('没有联系人邮箱')
                return false
            }
            this.$refs.dialogMarketing.open([{ mailAddress: mailAddress.trim() }])
        },
        /* 一键营销：多个 */
        marketingAll() {
            if (this.allWorkers.length <= 0) {
                this.$message.error('没有联系人')
                return false
            }
            let mailAddress = []
            this.allWorkers.forEach(item => {
                if (item.email) {
                    mailAddress.push({ mailAddress: item.email.trim() })
                }
            })
            if (mailAddress.length <= 0) {
                this.$message.error('没有联系人邮箱')
                return false
            }
            this.$refs.dialogMarketing.open(mailAddress)
        },
        /* 导出excel */
        exportExcel() {
            if (this.allWorkers.length <= 0) {
                this.$message.error('没有联系人')
                return false
            }
            this.isExporting = true
            let url = this.Global.baseURL + this.Global.api.v2.find_deep
            this.$http.put(url, { id: this.id })
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
        buildToCRM() {
            let obj = [{
                value: this.detailItem.company,
                fieldName: 'custName',
                model: 'BF001',
                disable: true
            }, {
                value: this.detailItem.link,
                fieldName: 'web',
                model: 'BF001',
                disable: true
            }, {
                value: this.detailItem.phone,
                fieldName: 'tel',
                model: 'BF001',
                disable: true
            }, {
                value: this.detailItem.description,
                fieldName: 'remarks',
                model: 'BF001',
                disable: true
            }]
            if (this.allWorkers[0].fumaFlag === 0 && this.allWorkers[0].email) {
                obj.push(
                    {
                        value: this.allWorkers[0].email,
                        fieldName: 'mailAddress',
                        model: 'BF003',
                        disable: true
                    },
                    {
                        value: this.allWorkers[0].name,
                        fieldName: 'contName',
                        model: 'BF003',
                        disable: true
                    },
                    {
                        value: '买手',
                        fieldName: 'jobs',
                        model: 'BF003',
                        disable: true
                    }
                )
            } else if (this.detailItem.email) {
                obj.push({
                    value: this.detailItem.email,
                    fieldName: 'mailAddress',
                    model: 'BF003',
                    disable: true
                })
            } else if (this.allWorkers.length > 0) {
                obj.push(
                    {
                        value: this.allWorkers[0].email.trim(0),
                        fieldName: 'mailAddress',
                        model: 'BF003',
                        disable: true
                    },
                    {
                        value: this.allWorkers[0].name,
                        fieldName: 'contName',
                        model: 'BF003',
                        disable: true
                    })
                let item = this.allWorkers[0]
                if (item.position) {
                    obj.push({
                        value: item.position.trim(),
                        fieldName: 'jobs',
                        model: 'BF003',
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
                        model: 'BF003',
                        disable: true
                    })
                }
            }

            ep.emit('optClick', {
                optData: {
                    optCode: 'otNew',
                    optModuleCode: 'BF001',
                    optName: '新增客户'
                },
                otherObjs: obj
            })
        },
        changePage(i) {
            this.page.now = i
        },
        clampInit() {
            $clamp(this.$refs.explain, {
                clamp: 8
            })
            $clamp(this.$refs.companyName, {
                clamp: 2
            })
        },
        getDetail() {
            let url = this.Global.baseURL + this.Global.api.v2.find_detailed
            let data = {
                id: this.id
            }
            this.isLoading = true
            this.$http.put(url, data)
                .then(res => {
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        this.detailItem = res.body.data
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                    this.isLoading = false
                    this.$nextTick(() => {
                        this.clampInit()
                    })
                })
                .catch(err => {
                    this.isLoading = false
                    this.$message.error(this.$t(this.Global.errorTitle))
                })
        },
        handleBuyMail() {
            this.$refs.buyMail.open(this.id, () => {
                this.detailItem.isDetailed = 1
                this.getContacts()
            })
        },
        getContacts() {
            let url = this.Global.baseURL + this.Global.api.v2.find_deep
            let data = { id: this.id }
            this.$http.post(url, data)
                .then(res => {
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        let allWorkers = res.body.data
                        this.page.total = allWorkers.length
                        if (this.page.total > 0) {
                            this.allWorkers = sortContacts(allWorkers)
                        }
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                })
                .catch(err => {
                    console.log(err)

                    this.$message.error(this.$t(this.Global.errorTitle))
                })
        }
    },
    watch: {
        id() {
            this.dataInit()
            this.getDetail()
            this.getContacts()
        }
    },
    components: {
        'page-detail': PageDetail,
        'no-data': NoData,
        'buyMail-dialog': BuyMailDialog,
        'dialog-marketing': DialogMarketing,
        'dialog-address': DialogAddress
    }
}
</script>
<style lang='less' rel='stylesheet/less' scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
