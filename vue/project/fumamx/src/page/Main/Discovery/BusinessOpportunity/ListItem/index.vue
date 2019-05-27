/*
 * Discription:发现商机•列表项
 * -----
 * Created Date: Wednesday, 6th March 2019 3:12:37 pm
 * Author: 郭兵 (guobing93@163.com)
 * -----
 * Last Modified: Wednesday, 6th March 2019 4:19:33 pm
 * Modified By: name (email)
 */

<template>
    <el-row class="ListItem">
        <el-col :span="6" class="body-col">
            <div class="from-page">
                <div class="clearfix">
                    <a class="pull-left title ellipsis" :title="item.name_pg" :href="`//${pg_domain}/${item.page_id}`" target="_blank"> {{item.name_pg}}</a>
                    <!--  <i @click="lookInfo()" class="infoIcon iconfont icon-personal-data"></i> -->
                </div>
                <div class="clearfix">
                    <!-- <div @click="handleFollow()" :class="{'active':item.is_atte==2}" class="optBtn pull-left">
                        <i v-if="isFollowing" class="el-icon-loading"></i>
                        <template v-else>
                            <i class="btnIcon iconfont icon-star"></i>
                            {{item.is_atte==2?'已关注':'关注'}}
                        </template>
                    </div> -->
                    <!--  <div @click="handleFind()" class="optBtn pull-left">
                        <i class="btnIcon iconfont icon-sou-dig"></i>
                        深挖
                    </div> -->
                </div>
            </div>
        </el-col>
        <el-col :span="6">
            <a ref="text" class="context-link" target="_blank" :title="item.comment" :href="item.comment_id ?`//${pg_domain}/${item.comment_id}`:'javascript:void(0);'">{{item.comment||'&nbsp;'}}</a>
        </el-col>
        <el-col :span="6">
            <span class="key-words">{{item.keyword||'&nbsp;'}}</span>
        </el-col>
        <el-col :span="6">
            {{item.recommend_date||'&nbsp;'}}
            <!-- <div class="update-date">
                {{item.lastupdate}}
            </div>
            <div class="notFun-btn">
                <el-button @click="remove()" class="pull-right" size="small"><i class="iconfont icon-close-bold"></i> 不感兴趣</el-button>
            </div> -->
        </el-col>
    </el-row>
</template>

<script>
export default {
    name: 'ListItem',
    props: {
        item: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            pg_domain: 'www.facebook.com',
            isFollowing: false
        }
    },
    mounted() {
        this.setClamp()
    },
    methods: {
        setClamp() {
            $clamp(this.$refs.text, {
                clamp: 2
            })
        },
        /* 查看信息 */
        lookInfo() {
            this.$emit('lookInfo')
        },
        handleFollow() {
            if (this.isFollowing) return
            switch (this.item.is_atte) {
                case 1:
                    this._addFollow()
                    break
                case 2:
                    this._removeFollow()
                    break
                default:
                    break
            }
        },
        handleFind() {

        },
        /* 关注 */
        async _addFollow() {
            this.isFollowing = true
            try {
                const url = this.Global.baseURL + this.Global.api.v2.find_attention
                let { page_id: pageId, name_pg: pageName, keyword: keywords } = this.item
                let data = {
                    pageId,
                    link: `https://${this.pg_domain}/${pageId}`,
                    pageName,
                    keywords,
                    description: '-',
                    pageType: 'fb-pages'
                }
                let res = await this.$http.post(url, data)
                if (res.body.code.toString() === this.Global.RES_OK) {
                    this.item.is_atte = 2
                    this.item.atteId = res.body.data.id
                } else {
                    this.$message.error(this.msg(res.body))
                }
            } catch (error) {
                console.log(error)

                this.$message.error(this.$t(this.Global.errorTitle))
            }
            this.isFollowing = false
        },
        async  _removeFollow() {
            this.isFollowing = true
            try {
                const url = this.Global.baseURL + this.Global.api.v2.find_attention
                let body = {
                    id: this.item.atteId
                }
                let res = await this.$http.delete(url, { body })
                if (res.body.code.toString() === this.Global.RES_OK) {
                    this.item.is_atte = 1
                } else {
                    this.$message.error(this.msg(res.body))
                }
            } catch (error) {
                this.$message.error(this.$t(this.Global.errorTitle))
            }
            this.isFollowing = false
        },
        /* 深挖 */
        toFind() { },
        /* 不感兴趣 */
        remove() { }
    },
    components: {

    }
}
</script>
<style lang='less' rel='stylesheet/less' scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
