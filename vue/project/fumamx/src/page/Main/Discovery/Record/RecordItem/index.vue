<template>
    <div class="RecoredItem">
        <div class="imgBox pull-left">
            <img class="img " v-imgsrc="item.picture" data-initsrc="/static/images/initImg.png" alt="">
        </div>
        <div class="leftBox">
            <div class="clearfix">
                <p class="title" ref="title" v-html="item.title"></p>
                <!-- <span v-if="item.source==2" class="titleTag">广交会</span> -->
            </div>
            <div v-if="item.description" class="description" ref="description" v-html="item.description"></div>
            <p class="link">
                <a :href="getWebSite(item.link)||'javascript:void(0);'" @click.prevent="openNewWindowTab(item.link)" target="_blank ">{{item.link?item.link.toLowerCase():''}}</a>
            </p>
            <p class="time">{{item.createdate}}</p>
        </div>
        <div class="delBtn " @click="recovery()">
            <i class="iconfont" :class="delStatus"></i>
        </div>
        <div class="btn btn02" @click="lookDetail()">
            详情
        </div>
    </div>
</template>

<script>
export default {
    name: 'RecoredItem',
    props: {
        item: {
            type: Object,
            default: () => ({})
        },
        isDeleted: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            isLoding: false
        }
    },
    computed: {

        delStatus() {
            return this.isLoding
                ? 'el-icon-loading'
                : this.isDeleted
                    ? 'icon-reply'
                    : 'icon-del'
        }
    },
    mounted() {
        this.setClamp()
    },
    methods: {
        setClamp() {
            $clamp(this.$refs.title, {
                clamp: 1
            })
            if (this.item.description) {
                $clamp(this.$refs.description, {
                    clamp: 2
                })
            }
        },
        getWebSite(url) {
            if (!url) { return false }
            let reg = new RegExp(/HTTP|HTTPS/i)
            return reg.test(url) ? url.toLowerCase() : 'http://' + url.toLowerCase()
        },
        lookDetail() {
            this.$emit('lookDetail')
        },
        recovery() {
            if (this.isLoding) return
            let url = this.Global.baseURL + this.Global.api.v2.find_detailed
            let data = {
                body: {
                    id: this.item.id
                }
            }
            this.isLoding = true
            this.$http.delete(url, data)
                .then(res => {
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        this.$emit('statusChange')
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                    this.isLoding = false
                })
                .catch(err => {
                    this.isLoding = false
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
