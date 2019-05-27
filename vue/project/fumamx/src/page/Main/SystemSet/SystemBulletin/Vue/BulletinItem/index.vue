<template>
    <div class="bulletinItem" :class="{isList:isList}">
        <p class="title">
            <span class="canClick" @click="toDetail(bulletinItem.noticeId)">{{bulletinItem.noticeCaption}}</span>
        </p>
        <ul class="infoBox clearfix">
            <li class="pull-left date">
                <span>{{$m_formulateTime(bulletinItem.releaseDate)}}</span>
            </li>
            <li class="pull-left type">
                <i class='iconfont' :class='getIconByNo(bulletinItem.noticeType)'></i>
                <span>{{getTypeByNo(bulletinItem.noticeType)}}</span>
            </li>
            <li class="pull-left dept">
                <i class='iconfont icon-author'></i>
                <span>{{bulletinItem.author}}</span>
            </li>
            <li class="pull-left zan" :class="{active:bulletinItem.isPraise&&bulletinItem.isPraise.toString()=='1'}">
                <i class='iconfont icon-great' :class="bulletinItem.isPraise&&bulletinItem.isPraise.toString()=='1'?'icon-praise-solid':'icon-praise'" @click="setZan(bulletinItem)"></i>
                <span>{{bulletinItem.praiseCount}}</span>
            </li>
        </ul>
        <div v-if='isList' class="summary clearfix">
            <div class="canClick pull-left" @click="toDetail(bulletinItem.noticeId)" v-html="bulletinItem.noticeAbstract"></div>
        </div>
        <div v-if='!isList' class="content systemBulletin_bulletinItem_content" v-html='bulletinItem.text'>
        </div>
        <!-- <iframe ref="artiframe" src="/static/preview/article.html" @load="loadedContent" class="artBox" frameborder='0'>
            </iframe> -->
    </div>
</template>

<script>
/**
 * 系统公告
 * 郭兵
 * 2018-07-28
 */
export default {
    name: 'BulletinItem',
    props: {
        item: {
            type: Object,
            detail: {}
        },
        isList: {
            type: Boolean,
            detail: false
        },
        index: {
            type: Number,
            detail: 0
        }
    },
    data() {
        return {
            bulletinItem: this.item,
            animation: ''
        }
    },
    created() {

    },
    methods: {
        getTypeByNo(typeNo) {
            let type = ''
            switch (typeNo) {
                case 1:
                    type = '升级日志'
                    break
                case 2:
                    type = '官方活动'
                    break
                case 3:
                    type = '企业动态'
                    break
                default:
                    type = ''
                    break
            }
            return type
        },
        getIconByNo(typeNo) {
            let icon = ''
            switch (typeNo) {
                case 1:
                    icon = 'icon-rocket-up'
                    break
                case 2:
                    icon = 'icon-hot'
                    break
                case 3:
                    icon = 'icon-pinwheel-line'
                    break
                default:
                    icon = ''
                    break
            }
            return icon
        },
        loadedContent() {
            try {
                this.$refs.artiframe.contentWindow.vm.showContent(this.bulletinItem.text)
                // this.animation = setInterval(this.setHeight, 16)
                this.animation = window.requestAnimationFrame(this.setHeight)
            } catch (e) {
                console.log('error')
            }
        },
        setHeight() {
            try {
                let autoHeight = this.$refs.artiframe.contentWindow.document.documentElement.offsetHeight + 15
                this.$refs.artiframe.style.height = autoHeight + 'px'
                this.animation = window.requestAnimationFrame(this.setHeight)
            } catch (error) {
                // clearInterval(this.animation)
                window.cancelAnimationFrame(this.animation)
            }
        },
        toDetail(noticeId) {
            this.$emit('toDetail', noticeId, this.index)
        },
        setZan() {
            let url = this.Global.baseURL + this.Global.api.v2.sysNotice_put
            let data = {
                type: 'praise',
                noticeId: this.bulletinItem.noticeId
            }
            this.$http.put(url, data)
                .then(res => {
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        if (this.bulletinItem.isPraise.toString() == '1') {
                            this.bulletinItem.isPraise = '0'
                            this.bulletinItem.praiseCount -= 1
                        } else {
                            this.bulletinItem.isPraise = '1'
                            this.bulletinItem.praiseCount += 1
                        }
                        if (!this.isList) {
                            let { isPraise, praiseCount } = this.bulletinItem
                            this.$emit('updataList', { isPraise, praiseCount })
                        }
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                })
                .catch(err => {
                    this.$message.error(this.$t(this.Global.errorTitle))
                })
        }
    }
}
</script>
<style lang="less"  rel="stylesheet/less">
.bulletinItem {
    & > .content.systemBulletin_bulletinItem_content {
        img {
            max-width: 100% !important;
        }
    }
}
</style>
<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
