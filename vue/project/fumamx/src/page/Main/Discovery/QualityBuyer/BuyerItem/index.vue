<template>
    <div class="BuyerItem">
        <div class="imgBox pull-left">
            <!--   <i class="iconfont icon-canton-fair"></i> -->
            <img class="img" :class="{'initImg':!item.picture}" :src="item.picture||'/static/images/initImg.png'" alt="">
        </div>
        <div class="leftBox">
            <p class="title" ref="title">{{item.name[0]}}</p>
            <p class="contacts clearfix">
                <i class="iconfont icon-buyer pull-left"></i>
                <span class="pull-left">{{item.contacts.name}}</span>
            </p>
            <p class="email clearfix">
                <i class="iconfont icon-mail-meeting pull-left"></i>
                <span class="pull-left">{{item.email[0]}}</span>
            </p>
            <p class="link clearfix">
                <a :href="getWebSite(item.website[0])||'javascript:void(0);'" target="_blank">
                    <i class="iconfont icon-web pull-left"></i>
                    <span class="pull-left">{{item.website[0]?item.website[0].toLowerCase():''}}</span>
                </a>
            </p>
            <div class="type clearfix">
                <p class="countryItem">{{item.state}}</p>
                <p v-for="(ind,i) in item.industry" :key="i" class="industryItem">{{ind}}</p>
            </div>
        </div>
        <div v-if="item.is_deep==3&&item.deepName" class="deepFlag">
            {{item.deepName}}&nbsp;已挖
        </div>
        <div v-if="item.is_deep!=3" class="btn btn01">
            <i v-if="isLoading||item.is_deep==2" class="el-icon-loading"></i>
            <span v-if="!isLoading&&item.is_deep==1" class="deepBtn" @click="toFind()">深挖</span>
        </div>
        <div v-if="item.is_deep==3" class="btn btn02" :class="{'notAllowed':(!isAdmin&&item.deepName)}" @click="(!isAdmin&&item.deepName)?'':lookDetail()">
            详情
        </div>
    </div>
</template>

<script>
export default {
    name: 'BuyerItem',
    props: {
        item: {
            type: Object,
            default: () => ({})
        },
        isAdmin: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            isLoading: false
        }
    },
    methods: {
        getWebSite(url) {
            if (!url) { return false }
            let reg = new RegExp(/HTTP|HTTPS/i)
            return reg.test(url) ? url.toLowerCase() : 'http://' + url.toLowerCase()
        },
        lookDetail() {
            this.$emit('lookDetail')
        },
        toFind() {
            if (this.isLoading) { return }
            let domain = this.item.website[0] // this.getWebSite(this.item.website[0])
            if (!domain) {
                this.$emit('needSearch')
                return
            }
            let url = this.Global.baseURL + this.Global.api.v2.find_detailed
            let data = {
                params: {
                    domain,
                    emails: this.item.email[0],
                    fumaCode: this.item.fumaCode,
                    source: '2'
                },
                before(request) {
                    if (this.previousRequest) {
                        this.previousRequest.abort()
                    }
                    this.previousRequest = request
                }
            }
            this.isLoading = true
            this.$http.get(url, data)
                .then(res => {
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        this.item.is_deep = 3
                        Object.assign(this.item, { id: res.body.data.id })
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                    this.isLoading = false
                })
                .catch(err => {
                    if (err.status == 0) {
                        return false
                    }
                    this.isLoading = false
                    this.$message.error(this.$t(this.Global.errorTitle))
                })
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
