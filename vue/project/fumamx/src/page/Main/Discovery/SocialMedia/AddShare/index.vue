<template>
    <div class="AddShare">
        <page-detail class="detailTtitle" detailTitle="新增商品" @toList="pageBack()"></page-detail>
        <div class="main MXscroll">
            <el-form class="formBox" label-position="left" ref="form" label-width="100px">
                <!--  <el-form-item label="循环方式:">
                    <el-radio-group v-model="publishType">
                        <el-radio v-for="(item,index) in types" :key="index" :label="item.value">{{item.label}}</el-radio>
                    </el-radio-group>
                </el-form-item> -->
                <el-form-item label="发布账号:" class="accountBox">
                    <el-checkbox-group v-model="selAccounts">
                        <el-checkbox class="accountItem" v-for="(item,index) in accounts" :label="item" :key="index">
                            <i v-if="item.type=='fb'||item.type=='fb-pages'" class="iconfont icon-facebook facebookIcon"></i>
                            <i v-if="item.type=='twitter'" class="iconfont icon-twitter twitterIcon"></i>
                            <i v-if="item.type=='linkedin'" class="iconfont icon-linkedin linkedinIcon"></i>
                            <i v-if="item.type=='pinterest'" class="iconfont icon-pinterest pinterestIcon"></i>
                            {{item.account}}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="发布时间:">
                    <div class="selBox">
                        <el-select v-model="areaInfo.area" placeholder="请选择">
                            <el-option v-for="(item,index) in timeZones" :key="index" :label="item.label" :value="item.area">
                            </el-option>
                        </el-select>
                        <el-select v-model="areaInfo.time" placeholder="请选择">
                            <el-option v-for="(item,index) in timeDates" :key="index" :label="item" :value="item">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="tipBox clearfix">
                        <p class="tip pull-left">代表国家/地区：{{local}}，时差：{{areaInfo.diff}}小时(北京时间为{{localTimeShow}})。</p>
                    </div>
                </el-form-item>
                <el-form-item label="分享内容:">
                    <el-button @click="openAddGoods()">添加商品</el-button>
                </el-form-item>
                <el-form-item label="已选内容:">
                    <div class="tableBox">
                        <el-row class="tableHeader">
                            <el-col class="item" :span="6">
                                内容类型
                            </el-col>
                            <el-col class="item" :span="14">
                                标题
                            </el-col>
                            <el-col class="item" :span="4">
                                操作
                            </el-col>
                        </el-row>
                        <div class="tableBody">
                            <template v-if="goodsList.length>0">
                                <el-row v-for="(item, index) in goodsList" :key="index" class="row">
                                    <el-col class="item" :span="6">
                                        product
                                    </el-col>
                                    <el-col class="item ellipsis" :span="14">
                                        {{item.enSpuName||item.spuName}}&nbsp;
                                    </el-col>
                                    <el-col class="item" :span="4">
                                        <i @click="removeGoodsItem(index)" class="iconfont icon-del delBtn"></i>
                                    </el-col>
                                </el-row>
                            </template>
                            <div v-if="goodsList.length<=0" class="noData">暂无</div>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-button class="shareBtn" type="primary" icon="share" size="small" :loading="isLoading" @click="toShare()">分享</el-button>
                </el-form-item>
            </el-form>
        </div>
        <goods-add ref="goodsAdd" title="选择商品" :isReturnData="true" @add="addGoods" :selData="goodsList"></goods-add>
    </div>
</template>

<script>
import goodsAdd from '@/components/goodsAdd' // 添加商品
import PageDetail from '@/components/PageDetail/index'
export default {
    name: 'AddShare',
    data() {
        return {
            isLoading: false,
            types: [
                { value: 2, label: '任务结束后循环发布' },
                { value: 0, label: '任务完成后自动停止' }
            ],
            publishType: 2,
            areaInfo: {
                area: 'Etc/GMT-5',
                diff: '-13',
                time: '10:00:00'
            },
            local: '美国 美国东海岸',
            localTimeShow: '',
            timeZones: [
                { area: 'Etc/GMT0', diff: -7, label: '零时区', local: '英国 伦敦' },
                { area: 'Etc/GMT+1', diff: -6, label: '东一区', local: '南非 开普敦' },
                { area: 'Etc/GMT+3', diff: -5, label: '东三区', local: '俄罗斯 莫斯科' },
                { area: 'Etc/GMT+4', diff: -4, label: '东四区', local: '阿联酋 阿布扎比' },
                { area: 'Etc/GMT+5', diff: -2.5, label: '东五区', local: '印度 新德里' },
                { area: 'Etc/GMT+6', diff: -1.5, label: '东六区', local: '缅甸 仰光' },
                { area: 'Etc/GMT+9', diff: +1, label: '东九区', local: '日本 东京' },
                { area: 'Etc/GMT+10', diff: +2, label: '东十区', local: '澳大利亚 墨尔本' },
                { area: 'Etc/GMT-5', diff: -13, label: '西五区', local: '美国 美国东海岸' },
                { area: 'Etc/GMT+8', diff: -15, label: '西八区', local: '加拿大 温哥华' }
            ],
            accounts: [],
            selAccounts: [],
            goodsList: []
        }
    },
    computed: {
        timeDates() {
            let star = 8
            let end = 20
            let arr = []
            for (let index = star; index <= end; index++) {
                let h = index < 10 ? '0' + index : index
                arr.push(`${h}:00:00`)
            }
            return arr
        }
    },
    created() {
        this.getLocalTime()
        this.getAccount()
    },
    methods: {
        pageBack() {
            this.$emit('pageBack')
        },
        timeChange(time) {
            /*   console.log(time)
              this.areaInfo.time = time */
        },
        openAddGoods() {
            this.$refs.goodsAdd.open()
        },
        removeGoodsItem(index) {
            this.goodsList.splice(index, 1)
        },
        addGoods(list) {
            this.goodsList = [].concat(list)
        },
        toShare() {
            if (this.selAccounts.length <= 0) {
                this.$message.error('没有选择发布账号')
                return false
            }
            if (this.goodsList.length <= 0) {
                this.$message.error('没有选择商品')
                return false
            }
            this.isLoading = true
            let publishInfo = []
            this.goodsList.forEach(item => {
                publishInfo.push({
                    link: this.getGoodsLink(item.spuId),
                    name: item.enSpuName || item.spuName,
                    description: item.displayDesc || ''
                    /* facebook不能传图片了 */
                })
            })
            let selAccounts = this.selAccounts.map(item => {
                return {
                    outerId: item.outer_id,
                    accountType: item.type,
                    account: item.account,
                    isPublic: item.is_public
                }
            })
            let url = this.Global.baseURL + this.Global.api.v2.find_socialRelease
            let data = {
                publishType: 0,
                areaInfo: [this.areaInfo],
                publishInfo,
                account: selAccounts
            }
            this.$http.put(url, data)
                .then(res => {
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        /*  this.accounts = res.body.data */
                        this.$message.success(this.msg(res.body))
                        this.$emit('addSuccess')
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                    this.isLoading = false
                })
                .catch(err => {
                    this.isLoading = false
                    this.$message.error(this.$t(this.Global.errorTitle))
                })
        },
        /* 获取可以发布的账号 */
        getAccount() {
            let url = this.Global.baseURL + this.Global.api.v2.find_socialRelease
            this.$http.get(url)
                .then(res => {
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        this.accounts = res.body.data
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                })
                .catch(err => {
                    this.$message.error(this.$t(this.Global.errorTitle))
                })
        },
        getLocalTime() {
            let diff = parseInt(this.areaInfo.time.substring(0, 2)) - this.areaInfo.diff
            let h = parseInt(diff)
            let diffH = diff - h
            let mm = diffH == 0 ? '00' : 60 * diffH
            if (h > 24) {
                h -= 24
                this.localTimeShow = '后一天' + (h < 10 ? 0 + h : h) + ':' + mm
            } else {
                this.localTimeShow = '当天' + (h < 10 ? 0 + h : h) + ':' + mm
            }
        }
    },
    watch: {
        'areaInfo.time': function () {
            this.getLocalTime()
        },
        'areaInfo.area': function () {
            this.timeZones.forEach(item => {
                if (item.area == this.areaInfo.area) {
                    this.areaInfo.diff = item.diff
                    this.local = item.local
                }
            })
            this.getLocalTime()
        }
    },
    components: {
        'page-detail': PageDetail,
        'goods-add': goodsAdd
    }
}
</script>
<style lang='less' rel='stylesheet/less' scoped>
@import "../../socialIcon.less";
@import "./zh-cn.less";
@import "./en.less";
</style>
