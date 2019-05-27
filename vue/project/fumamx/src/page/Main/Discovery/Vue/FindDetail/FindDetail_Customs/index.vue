<template>
    <div v-loading="isLoading" class="FindDetail" :class="{'notLinked':!isLinked}">
        <template v-if="!isLoading">

            <div class="TitleBar">
                <div class="titleBox">
                    <p class="title ellipsis">{{detailItem.company}}</p>
                    <p class="info">
                        <span class="infoItem iconfont icon-coordinate">
                            <span class="text">{{detailItem.country||companyInfo.countryEn}}</span>
                        </span>
                        <span v-if="isLinked" class="infoItem iconfont icon-industry">
                            <span class="text">{{companyType}}</span>
                        </span>
                    </p>
                </div>
                <div class="btnBox pull-right clearfix">
                    <div @click="handleBuildToCRM()" class="btn" :class="{'disabled':isArchive}">
                        <i class="iconfont"></i>
                        {{isArchive?'已建档':'建档到CRM'}}
                    </div>
                    <div @click="handlePageBack()" class="btn returnBtn">
                        <i class="iconfont icon-page-left"></i>
                        返回
                    </div>
                </div>
                <template v-if="isLinked">
                    <ul class="NavBar clearfix">
                        <li v-for="(item2,index) in navArr" @click="handleSetTabNav(item2.tabIndex,index)" :class="{'active':index==navIndex&&tabIndex==item2.tabIndex}" class="navItem" :key="index">{{item2.label}}</li>
                    </ul>
                    <div class="optBox">
                        <el-dropdown class="dropdownItem" trigger="click" @command="handleSetDateType">
                            <span class="el-dropdown-link">
                                {{tabIndex==0?impDateType.label:expDateType.label}}<i class="el-icon-caret-bottom el-icon--right"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item v-for="(item2,index) in dateOptions" :disabled="tabIndex==0?(item2==impDateType):(item2==expDateType)" :command="item2" :key="index">{{item2.label}}</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </template>
            </div>
            <div v-show="tabIndex==0" ref="ScrollBox" class="mainBox MXscroll">
                <div ref="scroller" class="scroll">

                    <company-profile class="Customs_Detail_Tab_Item" :companyInfo="companyInfo" :detailItem="detailItem" showPanel @updated="handleFindUpdate()"></company-profile>

                    <div class="Customs_Detail_Tab_Item">
                        <contacts ref="contactsCom" :companyName="companyInfo.companyName||detailItem.company" :isDeep="3" :detailItem="detailItem" :isRefind="false" :searchId="id" @getMail="handleBuyMail" @addAddress="handleAddAddress" @marketing="handleMarketing"></contacts>

                        <social-media :detailItem="detailItem"></social-media>
                    </div>
                    <template v-if="isLinked">
                        <trend class="Customs_Detail_Tab_Item" inout="imp" :dateType="impDateType" :scomid="companyInfo.companyId" :country="companyInfo.country" isRelink @relink="handleRelink()"></trend>

                        <commodity class="Customs_Detail_Tab_Item" inout="imp" :dateType="impDateType" :scomid="companyInfo.companyId" :country="companyInfo.country"></commodity>

                        <merchant class="Customs_Detail_Tab_Item" inout="imp" :dateType="impDateType" :scomid="companyInfo.companyId" :country="companyInfo.country" @openCompany="handleOpenCompany"></merchant>

                        <record class="Customs_Detail_Tab_Item" inout="imp" :dateType="impDateType" :scomid="companyInfo.companyId" :country="companyInfo.country" @openCompany="handleOpenCompany"></record>
                    </template>
                    <customs-search v-else :custName="detailItem.company" :asyncFun="bindCustoms" showTitle></customs-search>
                </div>
            </div>

            <div v-if="tabIndex==1" class="mainBox MXscroll">
                <trend inout="exp" :dateType="expDateType" :scomid="companyInfo.companyId" :country="companyInfo.country"></trend>

                <commodity inout="exp" :dateType="expDateType" :scomid="companyInfo.companyId" :country="companyInfo.country"></commodity>

                <merchant inout="exp" :dateType="expDateType" :scomid="companyInfo.companyId" :country="companyInfo.country" @openCompany="handleOpenCompany"></merchant>

                <record inout="exp" :dateType="expDateType" :scomid="companyInfo.companyId" :country="companyInfo.country" @openCompany="handleOpenCompany"></record>
            </div>

            <div v-if="tabIndex==2" class="mainBox MXscroll">
                <tab-affiliates :addLinked='linkedCompany' :companyId="companyInfo.companyId" :country="companyInfo.country" :item="companyInfo" :searchParams="searchParams"></tab-affiliates>
            </div>

        </template>

        <buyMail-dialog ref="buyMail"></buyMail-dialog>
        <dialog-marketing ref="dialogMarketing"></dialog-marketing>
        <dialog-address ref="dialogAddress"></dialog-address>
    </div>
</template>

<script>
import {
    CompanyProfile,
    Contacts,
    SocialMedia,
    Trend,
    Commodity,
    Merchant,
    Record,
    TabAffiliates,
    CustomsSearch,
    calcDateOptions,
    BuyMailDialog,
    DialogMarketing,
    DialogAddress
} from '@/components/DiscoveryItem'
import { DomObserver } from '@/libs/dom.js'
export default {
    name: 'FindDetail',
    props: {
        id: {
            type: [Number, String],
            default: ''
        },
        companyInfo: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            isLoading: false,
            detailItem: {},

            dateOptions: '',
            impDateType: '',
            expDateType: '',

            scrollY: 0,
            heights: '',
            isLockScroll: false,
            tabIndex: 0,
            navIndex: 0,
            navArr: Object.freeze([{
                label: '企业概况',
                tabIndex: 0
            },
            {
                label: '联系人',
                tabIndex: 0
            },
            {
                label: '采购趋势',
                tabIndex: 0
            },
            {
                label: '采购商品',
                tabIndex: 0
            },
            {
                label: '供应商',
                tabIndex: 0
            },
            {
                label: '海关记录',
                tabIndex: 0
            },
            {
                label: '出口数据',
                tabIndex: 1
            },
            {
                label: '关联公司',
                tabIndex: 2
            }
            ]),
            backup_comapny: ''
        }
    },
    computed: {
        isLinked() {
            return this.companyInfo.companyId != undefined
        },
        isFindLite() {
            return false
        },
        isArchive() {
            return !!this.detailItem.custId
        },
        companyType() {
            if (this.companyInfo.companyType == undefined) {
                return ''
            }
            return this.companyInfo.companyType == 1 ? '供应商' : '采购商'
        },
        searchParams() {
            return {
                keywords: this.companyInfo.companyName,
                country: this.companyInfo.country,
                inout: this.companyInfo.companyType == 0 ? 'imp' : 'exp',
                type: 0
            }
        }
    },
    created() {
        let dateOptions = calcDateOptions()
        this.dateOptions = Object.freeze(dateOptions)
        this.impDateType = this.dateOptions[0]
        this.expDateType = this.dateOptions[0]

        this._initDetail()
    },

    beforeDestroy() {
        this._observerDestory()
    },
    methods: {
        linkedCompany(companyId) {
            this.companyInfo.companyId = companyId
        },
        handlePageBack() {
            if (this.backup_comapny) {
                this.$emit('update:companyInfo', this.backup_comapny)
            }
            this.$emit('pageBack')
        },

        handleOpenCompany(row) {
            this.$router.push({ name: 'CustomsData', params: { row } })
        },
        handleRelink() {
            this.backup_comapny = this.companyInfo
            this.$emit('update:companyInfo', {})
        },
        handleFindUpdate() {
            this._initDetail(true)

            this.$refs.contactsCom.getContacts()
        },
        handleBuyMail() {
            this.$refs.buyMail.open(this.id, () => {
                this.detailItem.isDetailed = 1
                this.$refs.contactsCom.getContacts()
            })
        },

        handleMarketing(mailAddress) {
            this.$refs.dialogMarketing.open(mailAddress)
        },

        handleAddAddress(addressList) {
            this.$refs.dialogAddress.open(addressList)
        },
        handleSetTabNav(tabIndex, navIndex) {
            this.tabIndex = tabIndex
            this.navIndex = navIndex

            if (tabIndex == 0) {
                this.$nextTick(() => {
                    this.isLockScroll = true // 给滚动上锁
                    setTimeout(() => {
                        this.$refs.ScrollBox.scrollTop = this.heights[navIndex]
                    }, 200)

                    clearTimeout(this.timer)
                    this.timer = setTimeout(() => {
                        this.isLockScroll = false
                    }, 500)
                })
            }
        },
        handleSetDateType(item) {
            if (this.tabIndex === 0) {
                this.impDateType = item
            }
            if (this.tabIndex === 1) {
                this.expDateType = item
            }
        },
        handleBuildToCRM() {
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
            let allWorkers = this.$refs.contactsCom.getAllWorkers()
            if (allWorkers[0].fumaFlag === 0 && allWorkers[0].email) {
                obj.push(
                    {
                        value: allWorkers[0].email,
                        fieldName: 'mailAddress',
                        model: 'BF003',
                        disable: true
                    },
                    {
                        value: allWorkers[0].name,
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
            } else if (allWorkers.length > 0) {
                obj.push(
                    {
                        value: allWorkers[0].email.trim(0),
                        fieldName: 'mailAddress',
                        model: 'BF003',
                        disable: true
                    },
                    {
                        value: allWorkers[0].name,
                        fieldName: 'contName',
                        model: 'BF003',
                        disable: true
                    })
                let item = allWorkers[0]
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

        async bindCustoms(companyInfo) {
            try {
                const url = this.Global.baseURL + this.Global.api.v2.find_findDeepCustoms
                let { companyId, country } = companyInfo
                let data = {
                    searchId: this.id,
                    companyId,
                    country,
                    link: this.detailItem.link,
                    picture: this.detailItem.picture
                }
                let res = await this.$http.put(url, data)
                if (res.body.code.toString() == this.Global.RES_OK) {
                    this.$emit('update:companyInfo', Object.assign({}, companyInfo))
                    if (this.backup_comapny) {
                        this.backup_comapny = ''
                    }
                } else {
                    this.$message.error(this.msg(res.body))
                }
            } catch (error) {
                this.$message.error(this.$t(this.Global.errorTitle))
            }
        },
        _observerDestory() {
            this.observer && this.observer.destory()
            this.observer = null
        },
        _initDOMObserver() {
            let scrollBox = this.$refs.ScrollBox
            if (!scrollBox) { return }

            this._observerDestory()

            this.observer = new DomObserver(scrollBox)

            this.observer.on('refresh', () => {
                this._calcHeight()
            })

            scrollBox.scrollTop = 0

            scrollBox.addEventListener('scroll', () => {
                if (this.isLockScroll) {
                    return
                }
                this.scrollY = scrollBox.scrollTop
            })
        },
        _addScrollEventListener() {

        },
        _removeScrollEventListener() {

        },
        _scrollEvent() {

        },
        _calcHeight() {
            let scroller = this.$refs.scroller
            if (!scroller) {
                return
            }
            let items = scroller.getElementsByClassName('Customs_Detail_Tab_Item')
            let heights = []
            let h = 0
            heights.push(h)
            for (let i = 0; i < items.length; i++) {
                const el = items[i]
                h += el.offsetHeight
                heights.push(h)
            }
            this.heights = Object.freeze(heights)
        },
        async _initDetail(update = false) {
            if (!update) { this.isLoading = true }
            try {
                const url = this.Global.baseURL + this.Global.api.v2.find_detailed

                let res = await this.$http.put(url, { id: this.id })

                if (res.body.code.toString() == this.Global.RES_OK) {
                    this.detailItem = res.body.data
                } else {
                    this.$message.error(this.msg(res.body))
                }
            } catch (error) {
                this.$message.error(this.$t(this.Global.errorTitle))
            }
            if (!update) { this.isLoading = false }
        }
    },
    watch: {
        scrollY(newY) {
            const h = this.heights
            if (newY <= 0) {
                this.navIndex = 0
                return
            }
            for (let i = 0; i < h.length - 1; i++) {
                let h1 = h[i]
                let h2 = h[i + 1]
                if (newY >= (h1 - 100) && newY <= (h2 - 100)) {
                    this.navIndex = i
                    return
                }
            }

            this.navIndex = h.length - 2
        },
        isLinked(newVal) {
            if (newVal) {
                this.$nextTick(() => {
                    this._initDOMObserver()
                })
            } else {
                this._observerDestory()
            }
        },
        isLoading(newVal) {
            if (!newVal && this.isLinked) {
                this.$nextTick(() => {
                    this._initDOMObserver()
                })
            }
        }
    },
    components: {
        'company-profile': CompanyProfile,
        'contacts': Contacts,
        'social-media': SocialMedia,

        'trend': Trend,
        'commodity': Commodity,
        'merchant': Merchant,
        'record': Record,

        'tab-affiliates': TabAffiliates,

        'customs-search': CustomsSearch,

        'dialog-marketing': DialogMarketing,
        'dialog-address': DialogAddress,
        'buyMail-dialog': BuyMailDialog
    }
}
</script>
<style lang='less' rel='stylesheet/less' scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
