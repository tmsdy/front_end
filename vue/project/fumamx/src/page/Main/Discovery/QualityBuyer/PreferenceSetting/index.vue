<template>
    <div class="PreferenceSetting">
        <el-dialog title="选择国家/地区、行业" v-dialogDrag :visible.sync="dialogVisible" size="small" :before-close="handleClose">
            <transition name="el-fade-in-linear">
                <div v-if="!isLoading&&industrys.length>0&&countrys.length>0">
                    <p class="title">国家/地区</p>
                    <ul class="listBox countrys clearfix">
                        <template v-for="(val,index) in countrys">
                            <template v-if="index<26">
                                <li @click="setCountry(val)" :class="{'active':selCountryed.includes(val)}" :key="index" class="item">{{val}}</li>
                            </template>
                            <template v-if="isShowMore&&index>=26">
                                <li @click="setCountry(val)" :class="{'active':selCountryed.includes(val)}" :key="index" class="item">{{val}}</li>
                            </template>
                        </template>
                        <li v-if="countrys.length>=26" @click="toggleShowMore()" class="item">{{isShowMore?'收起':'更多...'}}</li>
                    </ul>
                    <p class="title">行业</p>
                    <ul class="listBox industrys clearfix">
                        <li v-for="(val,index) in industrys" @click="setIndustry(val)" :class="{'active':selIndustryed.includes(val)}" :key="index" class="item">{{val}}</li>
                    </ul>
                </div>
            </transition>

            <loading v-show="isLoading" class="atCenter"></loading>

            <!-- 没有记录 -->
            <transition name="el-fade-in-linear">
                <no-data v-show="(countrys.length<=0||industrys.length<=0)&&!isLoading" class="noDataBox atCenter"></no-data>
            </transition>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="sure()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import NoData from '@/basecomponents/NoData/index'
import Loading from '@/basecomponents/Loading/index'
import { setStore } from '@/libs/utils'
const FIND_COUNTRY = 'findCountrys'
const FIND_INDUSTRY = 'findIndustrys'
export default {
    name: 'PreferenceSetting',
    props: {
        selCountry: {
            type: Array,
            default: () => []
        },
        selIndustry: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            isLoading: false,
            dialogVisible: false,
            isShowMore: false,
            countrys: [],
            industrys: [],
            selCountryed: [],
            selIndustryed: [],
            hotCountry: Object.freeze(['美国', '印度', '巴基斯坦', '英国', '韩国', '哥伦比亚', '墨西哥', '中国台湾', '台湾', '台湾省', '菲律宾', '洪都拉斯', '尼加拉瓜', '萨尔瓦多', '危地马拉', '秘鲁', '阿根廷', '玻利维亚', '智利', '哥斯达黎加', '厄瓜多尔', '斯里兰卡', '巴拿马', '巴拉圭', '俄罗斯', '乌克兰', '乌拉圭', '委内瑞拉', '越南', '巴西', '哈萨克斯坦', '埃塞俄比亚'])
        }
    },
    created() {

    },
    methods: {
        open() {
            this.selCountryed = [].concat(this.selCountry)
            this.selIndustryed = [].concat(this.selIndustry)
            this.dialogVisible = true
            this.getData()
        },
        sure() {
            if (this.selCountryed.length > 0 && this.selIndustryed.length > 0) {
                this.selCountry.splice(0, this.selCountry.length, ...this.selCountryed)
                this.selIndustry.splice(0, this.selIndustry.length, ...this.selIndustryed)
                this.selCountryed = []
                this.selIndustryed = []
                this.dialogVisible = false
                setStore(FIND_COUNTRY, JSON.stringify(this.selCountry))
                setStore(FIND_INDUSTRY, JSON.stringify(this.selIndustry))
                this.$emit('sure')
            } else {
                this.$message({
                    message: '国家和行业至少选择一项',
                    type: 'warning'
                })
            }
        },
        toggleShowMore() {
            this.isShowMore = !this.isShowMore
        },
        handleClose(done) {
            done()
            /* if (this.selCountry.length > 0 && this.selIndustry.length > 0) {
                done()
            } else {
                this.$message({
                    message: '国家和行业至少选择一项',
                    type: 'warning'
                })
            } */
        },
        setCountry(item) {
            let index = this.selCountryed.indexOf(item)
            if (index >= 0) {
                this.selCountryed.splice(index, 1)
            } else {
                if (this.selCountryed.length >= 4) return
                this.selCountryed.push(item)
            }
        },
        setIndustry(item) {
            let index = this.selIndustryed.indexOf(item)
            if (index >= 0) {
                this.selIndustryed.splice(index, 1)
            } else {
                if (this.selIndustryed.length >= 4) return
                this.selIndustryed.push(item)
            }
        },
        async getData() {
            try {
                this.isLoading = true
                let url = this.Global.baseURL + this.Global.api.v2.find_corpration
                let res = await this.$http.post(url, {})

                if (res.body.code.toString() == this.Global.RES_OK) {
                    this.industrys = Object.freeze(res.body.data.industry || [])
                    let countrys = res.body.data.state || []

                    /**
                     *  处理热门国家
                     *  根据热门国家排序现有的国家列表
                     * */
                    for (let i = 0; i < countrys.length - 1; i++) {
                        for (let j = i + 1; j < countrys.length; j++) {
                            let a = countrys[i]
                            let b = countrys[j]
                            let a_index = this.hotCountry.indexOf(a)
                            let b_index = this.hotCountry.indexOf(b)
                            if ((a_index > b_index && b_index != -1) || (a_index == -1 && b_index != -1)) {
                                countrys[i] = b
                                countrys[j] = a
                            }
                        }
                    }
                    this.countrys = Object.freeze(countrys)
                } else {
                    this.$message.error(this.msg(res.body))
                }
            } catch (error) {
                console.error(error)

                this.$message.error(this.$t(this.Global.errorTitle))
            }
            this.isLoading = false
        }
    },
    components: {
        'no-data': NoData,
        'loading': Loading
    }

}
</script>
<style lang='less' rel='stylesheet/less' scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
