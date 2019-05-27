<template>
    <div class="CardItem">
        <div class="img-box">
            <img v-imgsrc="item.pageImg" data-initsrc="/static/images/initImg.png" alt="">
        </div>
        <div class="content-box">
            <div v-if="isSocial">
                <a :href="`${item.link}`" target="_bank">
                    <p class="title ellipsis">
                        <i v-if="item.pageType=='fb'||item.pageType=='fb-pages'" class="iconfont icon-facebook facebookIcon socialIcon"></i>
                        <i v-if="item.pageType=='twitter'" class="iconfont icon-twitter twitterIcon socialIcon"></i>
                        <i v-if="item.pageType=='linkedin'" class="iconfont icon-linkedin linkedinIcon socialIcon"></i>
                        {{item.pageName}}
                    </p>
                </a>
                <div class="type clearfix">
                    <span class="pull-left typeItem ellipsis"></span>
                    <span class="pull-right typeItem ellipsis"><i class="iconfont icon-coordinate"></i>暂无</span>
                </div>
                <a class="link ellipsis" :href="`${item.link}`" target="_bank">{{item.link}}</a>
                <div ref="text" class="text">
                    {{item.description}}
                </div>
            </div>
            <div v-else class="hsContentBox">
                <p class="hsName ellipsis">{{item.companyName}}</p>
                <div class="lableBox clearfix">
                    <p class="label pull-left">交易额:</p>
                    <p class="hs-text ellipsis">${{(item.money/1000000).toFixed(2)}}M</p>
                </div>
                <div class="lableBox clearfix">
                    <p class="label pull-left">交易笔数:</p>
                    <p class="hs-text ellipsis">{{item.count}}</p>
                </div>
                <div class="lableBox clearfix">
                    <p class="label pull-left">最近交易:</p>
                    <p class="hs-text ellipsis">{{item.lastDate}}</p>
                </div>
                <div class="lableBox clearfix">
                    <p class="label pull-left">地理位置:</p>
                    <p class="hs-text ellipsis">{{item.country}}</p>
                </div>
            </div>
        </div>

        <div class="btn-box">
            <div class="centerBox clearfix">
                <el-tooltip class="item" :disabled="!isAtte" effect="dark" content="取消关注" placement="top">
                    <div class="optBtn " :class="{'isAtte':isAtte}" @click="isAtte?unFollow():toFollow()">
                        <i v-if="isUnFollowing||isFollowing" class="el-icon-loading"></i>
                        <template v-else>
                            <i class="iconfont icon-star"></i>
                            {{isAtte?'已关注':'关注'}}
                        </template>
                    </div>
                </el-tooltip>
                <div v-if="item.is_deep" class="optBtn" :class="{'isDeep':item.is_deep==3}" @click="findOpt()">
                    <i v-if="item.is_deep==2||isFinding" class="el-icon-loading"></i>
                    <template v-else>
                        <span v-if="item.is_deep==1"><i class="iconfont icon-sou-dig"></i>深挖</span>
                        <span v-else> <i class="iconfont icon-goods-attribute"></i>详情</span>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: 'CardItem',
    props: {
        isSocial: {
            type: Boolean,
            default: false
        },
        item: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            isAtte: true,
            isFollowing: false,
            isUnFollowing: false,
            isFinding: false
        }
    },
    mounted() {
        this.setClamp()
    },
    methods: {
        setClamp() {
            this.$refs.text &&
                $clamp(this.$refs.text, {
                    clamp: 2
                })
        },
        async unFollow() {
            if (this.isUnFollowing) { return }
            this.isUnFollowing = true
            try {
                const url = this.Global.baseURL + this.Global.api.v2.find_attention
                const body = {
                    id: this.item.id
                }
                let res = await this.$http.delete(url, { body })
                if (res.body.code.toString() === this.Global.RES_OK) {
                    this.isAtte = false
                } else {
                    this.$message.error(this.msg(res.body))
                }
            } catch (error) {
                this.$message.error(this.$t(this.Global.errorTitle))
            }
            this.isUnFollowing = false
        },
        async toFollow() {
            if (this.isFollowing || this.isUnFollowing) return
            try {
                this.isFollowing = true
                const url = this.Global.baseURL + this.Global.api.v2.find_attention
                let data = {
                    id: this.item.id
                }
                let res = await this.$http.post(url, data)
                if (res.body.code.toString() === this.Global.RES_OK) {
                    this.isAtte = true
                } else {
                    this.$message.error(this.msg(res.body))
                }
            } catch (error) {
                this.$message.error(this.$t(this.Global.errorTitle))
            }
            this.isFollowing = false
        },
        findOpt() {
            switch (this.item.is_deep) {
                case 1:
                    if (this.isSocial) {
                        this.toFind()
                    } else {
                        this.$emit('customsFind')
                    }
                    break
                case 3:
                    this.$emit('lookDetail')
                    break
                default:
                    break
            }
        },
        async  toFind() {
            if (this.isFinding) return
            this.isFinding = true
            try {
                let url = this.Global.baseURL + this.Global.api.v2.find_detailed

                let params = {
                    id: this.item.searchId,
                    source: '1'
                }

                let res = await this.$http.get(url, { params })

                if (res.body.code.toString() == this.Global.RES_OK) {
                    this.item.is_deep = 3
                } else {
                    this.$message.error(this.msg(res.body))
                }
            } catch (error) {
                this.$message.error(this.$t(this.Global.errorTitle))
            }
            this.isFinding = false
        }
    },
    components: {

    }
}
</script>
<style lang='less' rel='stylesheet/less' scoped>
@import "../../socialIcon.less";
@import "./zh-cn.less";
@import "./en.less";
</style>
