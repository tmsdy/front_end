<template>
    <div class="AddIm">
        <page-detail class="detailTtitle" detailTitle="新增即时发布" @toList="pageBack()"></page-detail>
        <div class="main MXscroll">
            <el-form class="formBox" label-position="left" ref="form" label-width="100px">
                <p class="tip">每天每个账号只能发布一条即时发布消息，超过将影响您的推广效果</p>
                <el-form-item label="发布账号:" class="accountBox">
                    <el-checkbox-group v-model="selAccounts">
                        <el-checkbox v-for="(item,index) in accounts" class="accountItem" :label="item" :key="index">
                            <i v-if="item.type=='fb'||item.type=='fb-pages'" class="iconfont icon-facebook facebookIcon"></i>
                            <i v-if="item.type=='twitter'" class="iconfont icon-twitter twitterIcon"></i>
                            <i v-if="item.type=='linkedin'" class="iconfont icon-linkedin linkedinIcon"></i>
                            <i v-if="item.type=='pinterest'" class="iconfont icon-pinterest pinterestIcon"></i>
                            {{item.account}}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="添加链接:">
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
                <el-form-item label="发布内容:">
                    <el-input type="textarea" :rows="6" resize="none" placeholder="请输入内容" v-model="description">
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button class="shareBtn" type="primary" icon="share" size="small" :loading="isLoading" @click="toShare()">分享</el-button>
                </el-form-item>
            </el-form>
        </div>
        <goods-add ref="goodsAdd" title="选择商品" :isReturnData="true" :selOne="true" @add="addGoods" :selData="goodsList"></goods-add>
    </div>
</template>

<script>
import goodsAdd from '@/components/goodsAdd' // 添加商品
import PageDetail from '@/components/PageDetail/index'
export default {
    name: 'AddIm',
    data() {
        return {
            isLoading: false,
            accounts: [],
            selAccounts: [],
            description: '',
            goodsList: []
        }
    },
    created() {
        this.getAccount()
    },
    methods: {
        pageBack() {
            this.$emit('pageBack')
        },
        openAddGoods() {
            this.$refs.goodsAdd.open()
        },
        addGoods(list) {
            this.goodsList = [].concat(list)
        },
        removeGoodsItem(index) {
            this.goodsList.splice(index, 1)
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
                link: this.getGoodsLink(this.goodsList[0].spuId),
                name: this.goodsList[0].enSpuName || this.goodsList[0].spuName,
                description: this.description,
                account: selAccounts
            }
            this.$http.post(url, data)
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
        }
    },
    components: {
        'page-detail': PageDetail,
        'goods-add': goodsAdd
    }
}
</script>
<style lang='less' rel='stylesheet/less' scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
