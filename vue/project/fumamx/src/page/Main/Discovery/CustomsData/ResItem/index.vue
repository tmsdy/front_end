<template>
    <el-row class="ResItem">
        <el-col :span="7" class="firstCol ">
            <el-checkbox class="checkBox" true-label="" :label="item.companyId"></el-checkbox>
            <div @click="handleLookDetail()" class="ellipsis companyName" v-html="item.title||'&nbsp;'"></div>
        </el-col>
        <el-col :span="3">{{Money||'0'}}</el-col>
        <el-col :span="3">{{item.count||0}}</el-col>
        <el-col :span="3">{{item.lastDate||'-'}}</el-col>
        <el-col :span="3">{{item.countryEn||'&nbsp;'}}</el-col>
        <el-col :span="5" class="clearfix">
            <div class="pull-right clearfix">
                <div @click="handleFollow()" :class="{'active':item.is_atte==2}" class="optBtn pull-left">
                    <i v-if="isFollowing" class="el-icon-loading"></i>
                    <template v-else>
                        <i class="iconfont icon-star"></i>
                        {{item.is_atte==2?'已关注':'关注'}}
                    </template>
                </div>
                <div @click="handleFind()" :class="{'active':item.is_deep!=3 }" class="optBtn pull-left">
                    <i v-if="isFinding||item.is_deep==2" class="el-icon-loading"></i>
                    <template v-else-if="item.is_deep==1">
                        <i class="iconfont icon-sou-dig"></i>
                        深挖
                    </template>
                    <template v-else-if="item.is_deep==3">
                        <i class="iconfont icon-goods-attribute"></i>
                        详情
                    </template>
                </div>
            </div>
        </el-col>
    </el-row>
</template>

<script>
export default {
    name: 'ResItem',
    props: {
        item: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            isFollowing: false,
            isFinding: false
        }
    },
    computed: {
        Money() {
            let { money: m } = this.item
            if (m) {
                return `$${(m / 1000000).toFixed(2)}M`
            } else {
                return '-'
            }
        }
    },
    methods: {
        handleLookDetail() {
            this.$emit('lookDetail')
            // this.$router.push({ name: 'CustomsDetail', params: { item: this.item } })
        },
        /* 关注 */
        handleFollow() {
            if (this.isFollowing) { return }
            switch (this.item.is_atte) {
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

        /* 深挖 */
        handleFind() {
            switch (this.item.is_deep) {
                case 1:
                    this.$emit('toFind')
                    break
                case 2:
                    console.log('深挖中')
                    break
                case 3:
                    this.$emit('lookDetail')
                    break
                default:
                    break
            }
        },
        async _addFolllow() {
            this.isFollowing = true
            try {
                const url = this.Global.baseURL + this.Global.api.v2.find_customsAttentionDeep
                let data = {
                    companys: this.item.companyId,
                    country: this.item.country
                }
                let res = await this.$http.post(url, data)
                if (res.body.code.toString() === this.Global.RES_OK) {
                    this.item.is_atte = 2
                    this.item.atteId = res.body.data.id
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
        }
    },
    components: {

    }
}
</script>
<style lang='less' rel='stylesheet/less' scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
