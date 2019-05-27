/*
 * Discription:海关数据详情
 * -----
 * Created Date: Monday, 25th March 2019 1:22:51 pm
 * Author: 郭兵 (guobing93@163.com)
 * -----
 * Last Modified: Monday, 25th March 2019 4:21:08 pm
 * Modified By: name (email)
 */
<template>
    <div v-loading="isLoading" class="DataDetail">
        <div v-if="!isLoading">
            <div class="TitleBar">
                <div class="titleBox">
                    <p class="title ellipsis">{{companyInfo.companyName}}</p>
                    <p class="info">
                        <span class="infoItem iconfont icon-coordinate">
                            <span class="text">{{companyInfo.countryEn}}</span>
                        </span>
                        <span class="infoItem iconfont icon-industry">
                            <span class="text">{{companyInfo.companyType==1?'供应商':'采购商'}}</span>
                        </span>
                    </p>
                </div>
                <div class="btnBox pull-right clearfix">
                    <div @click="handleFollow()" class="btn">
                        <i v-if="isFollowing" class="el-icon-loading"></i>
                        <template v-else>
                            <i class="iconfont icon-star"></i>
                            {{ companyInfo.is_atte==2?'已关注':'关注'}}
                        </template>
                    </div>
                    <div @click="handleFind()" class="btn" :class="{'disabled':companyInfo.is_deep!=1&&companyInfo.is_deep!=3}">
                        <i v-if="companyInfo.is_deep==2" class="el-icon-loading"></i>
                        <template v-else>
                            <i class="iconfont icon-sou-dig"></i>
                            {{companyInfo.is_deep==3?'重新深挖':'深挖'}}
                        </template>
                    </div>
                    <div @click="handleBuildToCRM()" class="btn" :class="{'disabled':companyInfo.is_deep!=3}">
                        <i class="iconfont"></i>
                        建档到CRM
                    </div>
                    <div @click="handlePageBack()" class="btn returnBtn">
                        <i class="iconfont icon-page-left"></i>
                        返回
                    </div>
                </div>
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
            </div>
            <!-- 进口数据及深挖信息 -->
            <div ref="ScrollBox" v-show="tabIndex==0" class="mainBox MXscroll">
                <div ref="scroller" class="scroll">

                    <company-profile class="Customs_Detail_Tab_Item" :companyInfo="companyInfo" :detailItem="deepDetailItem" :showPanel="companyInfo.is_deep==3" @updated="handleFindUpdate()"></company-profile>

                    <div class="Customs_Detail_Tab_Item">
                        <contacts ref="contactsCom" :companyName="companyInfo.companyName" :isDeep="companyInfo.is_deep" :detailItem="deepDetailItem" :searchId="companyInfo.searchId" @toFind="handleFind()" @refind="handleFind()" @getMail="handleBuyMail" @addAddress="handleAddAddress" @marketing="handleMarketing"></contacts>

                        <social-media v-show="companyInfo.is_deep==3" :detailItem="deepDetailItem" :loading="isLoadingDetail"></social-media>
                    </div>

                    <trend class="Customs_Detail_Tab_Item" inout="imp" :dateType="impDateType" :scomid="companyInfo.companyId" :country="companyInfo.country"></trend>

                    <commodity class="Customs_Detail_Tab_Item" inout="imp" :dateType="impDateType" :scomid="companyInfo.companyId" :country="companyInfo.country"></commodity>

                    <merchant class="Customs_Detail_Tab_Item" inout="imp" :dateType="impDateType" :scomid="companyInfo.companyId" :country="companyInfo.country" @openCompany="handleOpenCompany"></merchant>

                    <record class="Customs_Detail_Tab_Item" inout="imp" :dateType="impDateType" :scomid="companyInfo.companyId" :country="companyInfo.country" @openCompany="handleOpenCompany"></record>
                </div>
            </div>
            <!-- 出口数据 -->
            <div class="mainBox MXscroll" v-if="tabIndex==1">

                <trend inout="exp" :dateType="expDateType" :scomid="companyInfo.companyId" :country="companyInfo.country"></trend>

                <commodity inout="exp" :dateType="expDateType" :scomid="companyInfo.companyId" :country="companyInfo.country"></commodity>

                <merchant inout="exp" :dateType="expDateType" :scomid="companyInfo.companyId" :country="companyInfo.country" @openCompany="handleOpenCompany"></merchant>

                <record inout="exp" :dateType="expDateType" :scomid="companyInfo.companyId" :country="companyInfo.country" @openCompany="handleOpenCompany"></record>

            </div>
            <!-- 关联公司 -->
            <div class="mainBox MXscroll" v-if="tabIndex==2">
                <tab-affiliates :addLinked='linkedCompany' :companyId="companyInfo.companyId" :country="companyInfo.country" :item="companyInfo" :searchParams="searchParams"></tab-affiliates>
            </div>

        </div>
        <find-dialog ref="findDialog"></find-dialog>
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
    calcDateOptions,
    FindDialog,
    BuyMailDialog,
    DialogMarketing,
    DialogAddress,
    mixin
} from '@/components/DiscoveryItem'
import { DomObserver } from '@/libs/dom.js'
export default {
    name: 'DataDetail',
    props: {
        companyInfo: {
            type: Object,
            default: () => ({})
        },
        searchParams: {
            type: Object,
            default: () => ({})
        },
        depth: {
            type: Number,
            default: 0
        }
    },
    mixins: [mixin],
    data() {
        return {
            isLoading: false,
            isFollowing: false,
            scroll: null,
            sHeight: [],
            tabIndex: 0,
            navIndex: 0,
            scrollY: 0,
            Y: 0,
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
            impDateType: '',
            expDateType: '',
            dateOptions: [],
            isLockScroll: false,
            timer: null
        }
    },
    created() {
        this.initData()
        let dateOptions = calcDateOptions()
        this.dateOptions = Object.freeze(dateOptions)
        this.impDateType = this.dateOptions[0]
        this.expDateType = this.dateOptions[0]
    },
    mounted() {
        this.initDomObserver()
        //  this.initScroll()
    },
    beforeDestroy() {
        this.observer && this.observer.destory()
    },
    methods: {
        async initData() {
            this.deepDetailItem = {}
            if (this.companyInfo.isNotListOpen) {
                await this.getCompanyInfo()
                if (this.depth === 1) {
                    this.$nextTick(() => {
                        this.initDomObserver()
                    })
                }
            }
            if (this.companyInfo.searchId && this.companyInfo.is_deep == 3) {
                this.getDeepDetail(this.companyInfo.searchId)
            }
        },
        handlePageBack() {
            this.$emit('pageBack')
        },
        handleOpenCompany(row) {
            this.$emit('openCompany', row)
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
            if (this.companyInfo.is_deep !== 3) {
                return
            }
            let obj = [{
                value: this.companyInfo.companyName,
                fieldName: 'custName',
                model: 'BF001',
                disable: true
            }, {
                value: this.deepDetailItem.link,
                fieldName: 'web',
                model: 'BF001',
                disable: true
            }, {
                value: this.deepDetailItem.phone,
                fieldName: 'tel',
                model: 'BF001',
                disable: true
            }, {
                value: this.deepDetailItem.description,
                fieldName: 'remarks',
                model: 'BF001',
                disable: true
            }]
            let allWorkers = this.$refs.contactsCom.getAllWorkers()
            if (allWorkers.length > 0 && allWorkers[0].fumaFlag === 0 && allWorkers[0].email) {
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
            } else if (this.deepDetailItem.email) {
                obj.push({
                    value: this.deepDetailItem.email,
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
                if (allWorkers[0].position) {
                    obj.push({
                        value: allWorkers[0].position.trim(),
                        fieldName: 'jobs',
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
                otherObjs: obj,
                next: data => {
                    console.log('next')
                    console.log(data)

                    this._addLinkedCustomer(data.custId)
                }
            })
        },
        /* 关注 */
        handleFollow() {
            if (this.isFollowing) { return }
            switch (this.companyInfo.is_atte) {
                case 1:
                    this._addFolllow()
                    break
                case 2:
                    this._removeFollow()
                    break
                default:
                    break
            }
        },
        handleFindUpdate() {
            this.getDeepDetail(this.companyInfo.searchId)
            this.$refs.contactsCom.getContacts()
        },
        handleFind() {
            if (this.companyInfo.is_deep != 1 && this.companyInfo.is_deep != 3) {
                return
            }
            this._deepfind()
        },

        _deepfind() {
            this.$refs.findDialog.open(this.companyInfo, (is_deep, searchId) => {
                this.companyInfo.is_deep = is_deep
                if (is_deep == 3) {
                    this.companyInfo.searchId = searchId
                    this.getDeepDetail(this.companyInfo.searchId)
                }
            })
        },
        handleBuyMail() {
            this.$refs.buyMail.open(this.companyInfo.searchId, () => {
                this.deepDetailItem.isDetailed = 1
                this.$refs.contactsCom.getContacts()
            })
        },

        handleMarketing(mailAddress) {
            this.$refs.dialogMarketing.open(mailAddress)
        },

        handleAddAddress(addressList) {
            this.$refs.dialogAddress.open(addressList)
        },
        linkedCompany(companyId) {
            this.companyInfo.companyId = companyId
        },
        initDomObserver() {
            let scrollBox = this.$refs.ScrollBox
            if (!scrollBox) { return }

            this.observer && this.observer.destory()
            this.observer = new DomObserver(scrollBox)

            this.observer.on('refresh', () => {
                this._calcHeight()
            })

            scrollBox.addEventListener('scroll', () => {
                if (this.isLockScroll) {
                    return
                }
                this.scrollY = scrollBox.scrollTop
            })
        },
        /*  initScroll() {
             this.scroll = new BScroll(this.$refs.ScrollBox, {
                 scrollY: true,
                 bounce: false,
                 scrollbar: {
                     fade: false,
                     interactive: true
                 },
                 stopPropagation: true,
                 disableMouse: true,
                 mouseWheel: true,
                 observeDOM: true
             })
             this.scroll.on('scroll', ({ y }) => {
                 this.Y = y >= -95 ? y : -95
                 if (this.isLockScroll) {
                     return
                 }
                 this.scrollY = y
             })
             this.scroll.on('refresh', () => {
                 this._calcHeight()
             })
         }, */

        handleSetTabNav(tabIndex, navIndex) {
            this.tabIndex = tabIndex
            this.navIndex = navIndex

            if (tabIndex == 0) {
                this.$nextTick(() => {
                    this.isLockScroll = true // 给滚动上锁
                    setTimeout(() => {
                        this.$refs.ScrollBox.scrollTop = this.sHeight[navIndex]
                    }, 200)

                    clearTimeout(this.timer)
                    this.timer = setTimeout(() => {
                        this.isLockScroll = false
                    }, 500)
                })
            }
        },
        async getCompanyInfo() {
            this.isLoading = true
            try {
                const url = this.Global.baseURL + this.Global.api.v2.find_customsCheck
                let data = {
                    companys: this.companyInfo.companyId,
                    country: this.companyInfo.country
                }
                let res = await this.$http.post(url, data)
                if (res.body.code.toString() === this.Global.RES_OK) {
                    Object.assign(this.companyInfo, res.body.data, { isNotListOpen: false })
                    // this.CompanyInfo = res.body.data
                } else {
                    this.$message.error(this.msg(res.body))
                }
            } catch (error) {
                // console.log(error)
                this.$message.error(this.$t(this.Global.errorTitle))
            }
            this.isLoading = false
        },
        async _addFolllow() {
            this.isFollowing = true
            try {
                const url = this.Global.baseURL + this.Global.api.v2.find_customsAttentionDeep
                let data = {
                    companys: this.companyInfo.companyId,
                    country: this.companyInfo.country
                }
                let res = await this.$http.post(url, data)
                if (res.body.code.toString() === this.Global.RES_OK) {
                    this.companyInfo.is_atte = 2
                    this.companyInfo.atteId = res.body.data.id
                } else {
                    this.$message.error(this.msg(res.body))
                }
            } catch (error) {
                this.$message.error(this.$t(this.Global.errorTitle))
            }
            this.isFollowing = false
        },
        async  _removeFollow() {
            this.isFollowing = true
            try {
                const url = this.Global.baseURL + this.Global.api.v2.find_attention
                let body = {
                    id: this.companyInfo.atteId
                }
                let res = await this.$http.delete(url, { body })
                if (res.body.code.toString() === this.Global.RES_OK) {
                    this.companyInfo.is_atte = 1
                } else {
                    this.$message.error(this.msg(res.body))
                }
            } catch (error) {
                this.$message.error(this.$t(this.Global.errorTitle))
            }
            this.isFollowing = false
        },
        async _addLinkedCustomer(custId) {
            try {
                const url = this.Global.baseURL + this.Global.api.v2.find_customsCust
                let data = {
                    companys: this.companyInfo.companyId,
                    country: this.companyInfo.country,
                    custId: custId
                }
                let res = await this.$http.post(url, data)
                if (res.body.code.toString() === this.Global.RES_OK) {

                } else {
                    this.$message.error(this.msg(res.body))
                }
            } catch (error) {
                console.log(error)

                this.$message.error(this.$t(this.Global.errorTitle))
            }
        },
        _calcHeight() {
            let scroller = this.$refs.scroller
            if (!scroller) return
            let items = scroller.getElementsByClassName('Customs_Detail_Tab_Item')
            this.sHeight = []
            this.sHeight.push(0)
            let h = 0
            for (let index = 0; index < items.length; index++) {
                const item = items[index]
                h += item.clientHeight
                this.sHeight.push(h)
            }
        }
    },
    watch: {

        async companyInfo() {
            await this.initData()
            this.$nextTick(() => {
                // this.initScroll()
                this.initDomObserver()
                this.handleSetTabNav(0, 0)
            })
        },
        scrollY(newY) {
            const h = this.sHeight
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
            /*  if (newY >= 0) {
                 this.navIndex = 0
                 return
             }
             for (let i = 0; i < h.length - 1; i++) {
                 let h1 = h[i]
                 let h2 = h[i + 1]
                 if (-newY >= (h1 - 100) && -newY <= (h2 - 100)) {
                     this.navIndex = i
                     return
                 }
             } */
            this.navIndex = h.length - 2
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
        'find-dialog': FindDialog,
        'dialog-marketing': DialogMarketing,
        'dialog-address': DialogAddress,
        'buyMail-dialog': BuyMailDialog
    }
}
</script>
<style lang='less' rel='stylesheet/less' scoped>
@import "./en.less";
@import "./zh-cn.less";
</style>
