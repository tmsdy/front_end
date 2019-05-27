<template>
    <div class="ResItem">
        <div class="leftBox">
            <div class="titleBox clearfix ">
                <p class="title pull-left" ref="title" v-html="title"></p>
                <i v-if="isSocial" @click="lookInfo()" class="infoIcon iconfont icon-personal-data"></i>
                <span v-if="item.custId" @click="handleOpenCustPage()" class="Chip" :class="{'noPower':!canLook}">
                    <span>客</span>
                    已建档
                </span>
            </div>
            <div class="description" ref="description" v-html="item.description"></div>
            <p class="link">
                <a :href="item.link" @click.prevent="openNewWindowTab(item.link)" target="_blank ">{{item.link}}</a>
            </p>
        </div>
        <div v-if="item.is_deep==3&&item.deepName" class="deepFlag" :class="{'notFollow':!(isSocial&&item.is_atte)}">
            {{item.deepName}}&nbsp;已挖
        </div>
        <div v-if="isSocial&&item.is_atte&&(!isArchive||isFollow)" class="btn followBtn" :class="{'isAtte':isFollow}" @click="handleFollow()">
            <i v-if="isFollowLoading" class="el-icon-loading"></i>
            <template v-else>
                <i class="iconfont icon-star"></i>
                {{isFollow?'已关注':'关注'}}
            </template>
        </div>
        <!--  -->
        <div v-if="item.is_deep!=3&&!isArchive" class="btn btn01">
            <i v-if="isLoading||item.is_deep==2" class="el-icon-loading"></i>
            <span v-else class="deepBtn" @click="toFind()">
                <i class="iconfont icon-sou-dig"></i>深挖
            </span>
        </div>
        <div v-if="item.is_deep==3||canLook" class="btn btn02" :class="{'noPower':noPower}" @click="noPower?'':lookDetail()">
            <i class="iconfont icon-goods-attribute"></i>
            详情
        </div>
    </div>
</template>

<script>

export default {
    name: 'ResItem',
    props: {
        item: {
            type: Object,
            default: () => ({})
        },
        pageType: {
            type: String,
            default: ''
        },
        isAdmin: {
            type: Boolean,
            default: false
        },
        isSocial: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            isLoading: false,
            isFollowLoading: false,
            isFind: false,
            previousRequest: null
        }
    },
    computed: {
        canLook() {
            return (this.item.is_cust || 0).toString() === '1'
        },
        title() {
            return this.item.title ? this.item.title.replace('- Home | Facebook', '').replace('| LinkedIn', '') : ''
        },
        noPower() {
            return this.item.deepName && !this.isAdmin
        },
        isFollow() {
            return this.item.is_atte && this.item.is_atte.toString() === '2'
        },
        isArchive() {
            return !!this.item.custId
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
            $clamp(this.$refs.description, {
                clamp: 2
            })
        },
        handleOpenCustPage() {
            if (!this.canLook) { return }
            ep.emit('custSliderOpen', {
                title: '客户信息',
                constId: this.item.custId
            })
        },
        handleFollow() {
            if (this.isFollowLoading) { return }
            if (this.isFollow) {
                this.unFollow()
            } else {
                this.toFollow()
            }
        },
        lookInfo() {
            this.$emit('lookInfo')
        },
        lookDetail() {
            this.$emit('lookDetail')
        },
        toFind() {
            if (this.isLoading) return

            let url = this.Global.baseURL + this.Global.api.v2.find_detailed
            let data = {
                params: {
                    id: this.item.id,
                    source: '1'
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
        },
        async toFollow() {
            try {
                this.isFollowLoading = true
                const url = this.Global.baseURL + this.Global.api.v2.find_attention
                let { id: searchId, keywords, picture: pageImg, link, description } = this.item
                let pageId = ''
                let reg = new RegExp('[^/]+(?!.*/)', 'g')
                if (new RegExp('/$', 'g').test(link)) {
                    pageId = reg.exec(link.substring(0, link.length - 1))[0]
                } else {
                    pageId = reg.exec(link)[0]
                }
                let data = {
                    pageId,
                    pageImg,
                    searchId,
                    link,
                    pageName: this.title,
                    description,
                    keywords,
                    pageType: this.pageType
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
            this.isFollowLoading = false
        },
        async unFollow() {
            this.isFollowLoading = true
            try {
                const url = this.Global.baseURL + this.Global.api.v2.find_attention
                const body = {
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
            this.isFollowLoading = false
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
