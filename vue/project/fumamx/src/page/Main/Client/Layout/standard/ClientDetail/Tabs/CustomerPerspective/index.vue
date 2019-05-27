/*
 * Discription:客户透视
 * -----
 * Created Date: Tuesday, 16th April 2019 01:25:16 pm
 * Author: 郭兵 (guobing93@163.com)
 * -----
 * Last Modified: Tuesday, 16th April 2019 01:25:20 pm
 * Modified By: name (email)
 */

<template>
    <div class="CustomerPerspective">
        <loading v-if="isLoading"></loading>

        <customs-search v-else-if="isSearch" :custName="mainObj.custName" :asyncFun="bindCustoms" class="Search"></customs-search>
        <no-data v-else-if="!mainObj.customs||!CompanyInfo"></no-data>

        <div v-else>
            <div class="NavBox clearfix">
                <ul class="NavBar clearfix">
                    <li v-for="(item,index) in customsNavArr" @click="handelSetTabNav(item.tabIndex,index)" :class="{'active':customsTabIndex==item.tabIndex&&index==customsNavIndex}" class="navItem" :key="index">{{item.label}}</li>
                </ul>
                <el-select v-show="customsTabIndex==0" class="dateSelect pull-right" :value="customsImpDateType" @input="handleImpDateTypeChange" value-key="label" placeholder="请选择">
                    <el-option v-for="(item ,index) in dateOptions" :key="index" :label="item.label" :value="item">
                    </el-option>
                </el-select>
                <el-select v-show="customsTabIndex==1" class="dateSelect pull-right" :value="customsExpDateType" @input="handleExpDateTypeChange" value-key="label" placeholder="请选择">
                    <el-option v-for="(item ,index) in dateOptions" :key="index" :label="item.label" :value="item">
                    </el-option>
                </el-select>
                <!-- <p class="updateTime pull-right">更新日期:{{mainObj.customs&&mainObj.customs.customsUpdate}}</p> -->
            </div>
            <div class="MainBox">
                <div ref="tabOneBox" v-show="customsTabIndex==0">

                    <company-profile class="Customs_Tab_Item" :companyInfo="CompanyInfo" :detailItem="deepDetailItem" :showPanel="CompanyInfo.is_deep==3" @updated="handleFindUpdate()"></company-profile>

                    <div class="Customs_Tab_Item">

                        <contacts ref="contactsCom" :detailItem="deepDetailItem" :companyName="CompanyInfo.companyName" :isDeep="CompanyInfo.is_deep" :searchId="CompanyInfo.searchId" @toFind="handleFind()" @refind="hanldeRefind()" @getMail="handleBuyMail" @addAddress="handleAddAddress" @marketing="handleMarketing"></contacts>

                        <social-media v-show="CompanyInfo.is_deep==3" :detailItem="deepDetailItem" :loading="isLoadingDetail"></social-media>

                    </div>

                    <trend class="Customs_Tab_Item" inout="imp" :dateType="customsImpDateType" :scomid="CompanyInfo.companyId" :country="CompanyInfo.country" isRelink @relink="handleRelink()"></trend>

                    <commodity class="Customs_Tab_Item" inout="imp" :dateType="customsImpDateType" :scomid="CompanyInfo.companyId" :country="CompanyInfo.country"></commodity>

                    <merchant class="Customs_Tab_Item" inout="imp" :dateType="customsImpDateType" :scomid="CompanyInfo.companyId" :country="CompanyInfo.country" @openCompany="handleOpenCompany"></merchant>

                    <record class="Customs_Tab_Item" inout="imp" :dateType="customsImpDateType" :scomid="CompanyInfo.companyId" :country="CompanyInfo.country" @openCompany="handleOpenCompany"></record>

                </div>
                <div v-if="customsTabIndex==1">

                    <trend inout="exp" :dateType="customsExpDateType" :scomid="CompanyInfo.companyId" :country="CompanyInfo.country"></trend>

                    <commodity inout="exp" :dateType="customsExpDateType" :scomid="CompanyInfo.companyId" :country="CompanyInfo.country"></commodity>

                    <merchant inout="exp" :dateType="customsExpDateType" :scomid="CompanyInfo.companyId" :country="CompanyInfo.country" @openCompany="handleOpenCompany"></merchant>

                    <record inout="exp" :dateType="customsExpDateType" :scomid="CompanyInfo.companyId" :country="CompanyInfo.country" @openCompany="handleOpenCompany"></record>
                </div>
                <div v-if="customsTabIndex==2">
                    <tab-affiliates :addLinked="linkedCompany" :companyId="CompanyInfo.companyId" :country="CompanyInfo.country" :searchParams="searchParams"></tab-affiliates>
                </div>
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
    CustomsSearch,
    FindDialog,
    BuyMailDialog,
    DialogMarketing,
    DialogAddress,
    calcDateOptions,
    mixin
} from '@/components/DiscoveryItem'

import { DomObserver } from '@/libs/dom.js'
import NoData from '@/basecomponents/NoData'
import Loading from '@/basecomponents/Loading'
import { isObject } from '@/libs/utils.js'
export default {
    name: 'CustomerPerspective',
    props: {
        mainObj: {
            type: Object,
            default: () => ({})
        },
        customsNavArr: {
            type: Array,
            default: () => ([])
        },
        customsTabIndex: {
            type: Number,
            default: 0
        },
        customsNavIndex: {
            type: Number,
            default: 0
        },
        customsImpDateType: {
            type: Object,
            default: () => ({})
        },
        customsExpDateType: {
            type: Object,
            default: () => ({})
        }
    },
    mixins: [mixin],
    data() {
        return {
            isSearch: false,
            isLoaded: false,
            isLoading: false,
            CompanyInfo: '',
            // backup_CompanyInfo: '',
            dateOptions: [],
            heightArr: []
        }
    },
    created() {
        let dateOptions = calcDateOptions()
        this.dateOptions = Object.freeze(dateOptions)
        this.$emit('dateOptionsChange', this.dateOptions)
        this.$emit('update:customsImpDateType', this.dateOptions[0])
        this.$emit('update:customsExpDateType', this.dateOptions[0])
    },
    mounted() {
        // console.log(this.mainObj)
    },
    computed: {
        searchParams() {
            return {
                keywords: this.CompanyInfo.companyName,
                country: this.CompanyInfo.country,
                inout: this.CompanyInfo.companyType == 0 ? 'imp' : 'exp',
                type: 0
            }
        }
    },
    beforeDestroy() {
        this.observer && this.observer.destory()
    },
    methods: {
        setBindCompany(company) {
            if (this.mainObj.customs) {
                Object.assign(this.mainObj.customs, company)
            } else {
                this.mainObj.customs = Object.assign({}, company)
            }

            this.isSearch = false
            this.CompanyInfo = ''
            this._getTabData()
        },
        handleRelink() {
            this.isSearch = true
            // this.backup_CompanyInfo = this.CompanyInfo
            this.CompanyInfo = ''
        },
        handleOpenCompany(row) {
            this.$router.push({ name: 'CustomsData', params: { row } })
        },

        initDomObserver() {
            this.$nextTick(() => {
                let el = this.$refs.tabOneBox
                if (!el) return
                this.observer && this.observer.destory()
                this.observer = new DomObserver(el)
                this.observer.on('refresh', () => {
                    // console.log('============')
                    this._calcHeight()
                })
            })
        },

        _calcHeight() {
            let tabOneBox = this.$refs.tabOneBox
            if (!tabOneBox) return
            let items = tabOneBox.getElementsByClassName('Customs_Tab_Item')
            let heightArr = []
            heightArr.push(0)
            let h = 0
            for (let index = 0; index < items.length; index++) {
                const item = items[index]
                h += item.clientHeight
                heightArr.push(h)
            }
            this.$emit('heightChange', Object.freeze(heightArr))
        },
        async bindCustoms(companyInfo) {
            try {
                const url = this.Global.baseURL + this.Global.api.v2.find_customsCust
                let { companyId, country } = companyInfo
                let data = {
                    companys: companyId,
                    country: country,
                    custId: this.mainObj.custId
                }
                let res = await this.$http.post(url, data)
                if (res.body.code.toString() === this.Global.RES_OK) {
                    this.setBindCompany({ customsId: companyId, country: country })
                } else {
                    this.$message.error(this.msg(res.body))
                }
            } catch (error) {
                console.log(error)
                this.$message.error(this.$t(this.Global.errorTitle))
            }
        },
        async getTabData() {
            if (this.isLoaded && !this.isSearch) { return }
            this.isSearch = false
            this.isLoaded = true
            if (!this.mainObj.customs || !this.mainObj.customs.customsId || !this.mainObj.customs.country) {
                this.isSearch = true
                return
            }
            this._getTabData()
        },
        async _getTabData() {
            await this.getCompanyInfo()
            let { searchId, is_deep } = this.CompanyInfo
            if (!searchId || is_deep != 3) return
            this.getDeepDetail(searchId)
        },
        handleImpDateTypeChange(item) {
            this.$emit('update:customsImpDateType', item)
        },
        handleExpDateTypeChange(item) {
            this.$emit('update:customsExpDateType', item)
        },
        handelSetTabNav(tabIndex, navIndex) {
            this.$emit('changeTabNav', tabIndex, navIndex)
        },
        handleFindUpdate() {
            this.getDeepDetail(this.CompanyInfo.searchId)
            this.$refs.contactsCom.getContacts()
        },
        handleFind() {
            if (this.CompanyInfo.is_deep != 1) {
                return
            }
            this._deepFind()
        },
        hanldeRefind() {
            this._deepFind()
        },
        _deepFind() {
            this.$refs.findDialog.open(this.CompanyInfo, (is_deep, searchId) => {
                this.CompanyInfo.is_deep = is_deep
                if (is_deep == 3) {
                    this.CompanyInfo.searchId = searchId
                    this.getDeepDetail(this.CompanyInfo.searchId)
                }
            })
        },
        handleBuyMail() {
            this.$refs.buyMail.open(this.CompanyInfo.searchId, () => {
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
        async linkedCompany(companyId) {
            try {
                const url = this.Global.baseURL + this.Global.api.v2.find_customsCust
                let data = {
                    companys: companyId,
                    country: this.CompanyInfo.country,
                    custId: this.mainObj.custId
                }
                let res = await this.$http.post(url, data)
                if (res.body.code.toString() === this.Global.RES_OK) {
                    this.CompanyInfo.companyId = companyId
                    this.mainObj.customs.customsId = companyId
                } else {
                    this.$message.error(this.msg(res.body))
                }
            } catch (error) {
                this.$message.error(this.$t(this.Global.errorTitle))
            }
        },
        async getCompanyInfo() {
            this.isLoading = true

            try {
                const url = this.Global.baseURL + this.Global.api.v2.find_customsCheck
                let { customs: { customsId, country }, custId } = this.mainObj
                let data = {
                    companys: customsId,
                    country: country,
                    custId: custId
                }
                let res = await this.$http.post(url, data)
                if (res.body.code.toString() === this.Global.RES_OK) {
                    this.CompanyInfo = res.body.data
                } else {
                    this.$message.error(this.msg(res.body))
                }
            } catch (error) {
                // console.log(error)
                this.$message.error(this.$t(this.Global.errorTitle))
            }
            this.isLoading = false
        }
    },
    watch: {
        CompanyInfo() {
            if (isObject(this.CompanyInfo)) {
                this.initDomObserver()
                this.$emit('toggleScrollListener', true)
            } else {
                this.$emit('toggleScrollListener', false)
            }
        },
        customsNavIndex() {
            //  console.log(this.customsNavIndex)
        }
    },
    components: {

        'no-data': NoData,
        'loading': Loading,

        'company-profile': CompanyProfile,
        'contacts': Contacts,
        'social-media': SocialMedia,
        'trend': Trend,
        'commodity': Commodity,
        'merchant': Merchant,
        'record': Record,

        'tab-affiliates': TabAffiliates,

        'customs-search': CustomsSearch,

        'find-dialog': FindDialog,
        'buyMail-dialog': BuyMailDialog,
        'dialog-marketing': DialogMarketing,
        'dialog-address': DialogAddress
    }
}
</script>
<style lang='less' rel='stylesheet/less' scoped>
@import "./en.less";
@import "./zh-cn.less";
</style>
