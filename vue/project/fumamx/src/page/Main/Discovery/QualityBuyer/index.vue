<template>
    <div class="QualityBuyer">
        <div v-show="!isShowDetail" class="quatilyBuyerBox">
            <page-title iconfont="icon-buyer-o"></page-title>
            <div class="toolBar">
                <el-form class="typeBox pull-left" label-position="left" label-width="80px">
                    <el-form-item class="lineItem " label="国家/地区">
                        <div v-for="(item,index) in selCountry" :key='index' class="countryItem pull-left">
                            {{item}}
                            <span @click="removeCountry(index)" class="removeBtn iconfont icon-close-bold"></span>
                        </div>
                    </el-form-item>
                    <el-form-item class="lineItem " label="行业">
                        <div v-for="(item,index) in selIndustry" :key='index' class="industryItem pull-left">
                            {{item}}
                            <span @click="removeIndustry(index)" class="removeBtn iconfont icon-close-bold"></span>
                        </div>
                    </el-form-item>
                </el-form>
                <div class="settingBox pull-right clearfix">
                    <el-button @click="openSetting()" type="text">偏好设置</el-button>
                    <el-button @click="changeBatch()" type="primary"><i class="iconfont icon-refresh-arrow"></i> 换一批</el-button>
                </div>
            </div>
            <div class="resultBox MXscroll">
                <transition name="listBox">
                    <div v-if="list.length>0&&!isLoading" class="listBox">
                        <buyer-item v-for="(item,index) in list" :isAdmin="isAdmin" :item="item" @lookDetail="lookDetail(item)" @needSearch="needSearch(item.name[0])" :key="index"></buyer-item>
                    </div>
                </transition>
                <transition name="el-fade-in-linear">
                    <loading v-show="isLoading" class="atCenter"></loading>
                </transition>
                <!-- 没有记录 -->
                <transition name="el-fade-in-linear">
                    <no-data v-show="list.length<=0&&!isLoading" class="noDataBox atCenter"></no-data>
                </transition>
            </div>
        </div>
        <!-- 深挖详情 -->
        <find-detail v-if="isShowDetail" :id="detailItem.id" :companyInfo.sync="detailItem.company" @pageBack="pageBack"></find-detail>

        <preference-setting ref="preferenceSetting" @sure="getList()" :selCountry="selCountry" :selIndustry="selIndustry"></preference-setting>
        <el-dialog title="提示" :visible.sync="dialogVisible" size="tiny">
            <span>该企业没有网址，是否跳转到找买家进行深挖？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="toSearch()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import NoData from '@/basecomponents/NoData/index'
import Loading from '@/basecomponents/Loading/index'
import PageTitle from '@/components/PageTitle/index'
import BuyerItem from './BuyerItem'
// import RecordDetail from '../Vue/RecordDetail'
import FindDetail from '../Vue/FindDetail'
import PreferenceSetting from './PreferenceSetting'
import { getStore, setStore } from '@/libs/utils'
const FIND_COUNTRY = 'findCountrys'
const FIND_INDUSTRY = 'findIndustrys'
export default {
    name: 'QualityBuyer',
    data() {
        return {
            detailItem: '',
            isShowDetail: false,
            isLoading: false,
            list: [],
            selCountry: [],
            selIndustry: [],
            size: 20,
            isAdmin: false,
            dialogVisible: false,
            searchKeyword: ''
        }
    },
    created() {
        //  this.getList()
    },
    mounted() {
        let countrys = getStore(FIND_COUNTRY)
        let industry = getStore(FIND_INDUSTRY)
        if (countrys) {
            this.selCountry = JSON.parse(countrys)
        }
        if (industry) {
            this.selIndustry = JSON.parse(industry)
        }
        if (!countrys || !industry) {
            this.openSetting()
        } else {
            this.getList()
        }
    },
    methods: {
        openSetting() {
            this.$refs.preferenceSetting.open()
        },
        lookDetail(item) {
            this.detailItem = item
            this.isShowDetail = true
        },
        pageBack() {
            this.isShowDetail = false
            this.detailItem = ''
        },
        needSearch(keyword) {
            this.searchKeyword = keyword
            this.dialogVisible = true
        },
        toSearch(name) {
            this.dialogVisible = false
            this.$router.push({ name: 'FumaSearch', params: { keyword: this.searchKeyword } })
        },
        changeBatch() {
            if (this.selCountry.length > 0 && this.selIndustry.length > 0) {
                this.getList()
            } else {
                this.$message({
                    message: '请先选择偏好设置',
                    type: 'warning'
                })
            }
        },
        removeCountry(index) {
            if (this.selCountry.length == 1) {
                this.$message({
                    message: '至少保留一项',
                    type: 'warning'
                })
                return
            }
            this.selCountry.splice(index, 1)
            setStore(FIND_COUNTRY, JSON.stringify(this.selCountry))
        },
        removeIndustry(index) {
            if (this.selIndustry.length == 1) {
                this.$message({
                    message: '至少保留一项',
                    type: 'warning'
                })
                return
            }
            this.selIndustry.splice(index, 1)
            setStore(FIND_INDUSTRY, JSON.stringify(this.selIndustry))
        },
        getList() {
            this.list = []
            this.isLoading = true
            let url = this.Global.baseURL + this.Global.api.v2.find_corpration
            let params = {
                industry: this.selIndustry.join(','),
                state: this.selCountry.join(','),
                size: this.size
            }
            this.$http.get(url, { params })
                .then(res => {
                    if (res.body.code.toString() === this.Global.RES_OK) {
                        this.list = res.body.data.list
                        this.isAdmin = res.body.data.isAdmin
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                    this.isLoading = false
                })
                .catch(err => {
                    this.isLoading = false
                    this.$message.error(this.$t(this.Global.errorTitle))
                })
        }
    },
    watch: {
        $route() {
            if (this.$route.path === '/main/discovery/qualityBuyer' &&
                this.selIndustry.length <= 0 &&
                this.selCountry.length <= 0) {
                this.openSetting()
            }
        }
    },
    components: {
        'page-title': PageTitle,
        'buyer-item': BuyerItem,
        'no-data': NoData,
        'loading': Loading,
        'find-detail': FindDetail,
        'preference-setting': PreferenceSetting
    }
}
</script>
<style lang='less' rel='stylesheet/less' scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
