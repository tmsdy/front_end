<template>
    <el-dialog title="文章预览" class="PreviewArticle" top="10px" custom-class="PreviewArticle-myDialog" :visible.sync="dialogTableVisible" :before-close="beforeClose">
        <div class="bulletinItem" v-loading="isLoading">
            <p class="title">{{bulletinItem.noticeCaption}}</p>
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
                    <span>{{bulletinItem.praiseCount||0}}</span>
                </li>
            </ul>
            <div class="content articleManage_previewArticle_content" v-html="bulletinItem.text">
            </div>
            <!-- <iframe v-if="dialogTableVisible" ref="artiframe" src="/static/preview/article.html" @load="loadedContent" class="artBox" frameborder='0'>
            </iframe> -->
        </div>
    </el-dialog>
</template>

<script>
/**
 * 文章预览
 * 郭兵
 * 2018-07-30
 */

export default {
    name: 'PreviewArticle',
    props: {
        moduleCode: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            dialogTableVisible: false,
            isLoading: false,
            bulletinItem: {},
            animation: ''
        }
    },
    computed: {

    },
    methods: {
        show(data) {
            this.bulletinItem = data
            this.dialogTableVisible = true
            this.loadedContent()
        },
        open(noticeId) {
            this.dialogTableVisible = true
            this.bulletinItem.text = ''
            this.getDetail(noticeId)
        },
        beforeClose(done) {
            /*  window.cancelAnimationFrame(this.animation) */
            /*  window.requestAnimationFrame(() => {
                 this.$refs.artiframe.style.height = '0px'
             }) */
            done()
        },
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
                window.cancelAnimationFrame(this.animation)
            }
        },
        getDetail(noticeId) {
            this.isLoading = true
            let url = this.Global.baseURL + this.Global.api.v2.sysNotice_get
            let params = {
                type: 'detail',
                noticeId: noticeId,
                moduleCode: this.moduleCode
            }
            this.$http.get(url, { params })
                .then(res => {
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        let { author, mailFlag, noticeAbstract, noticeCaption, noticeState, noticeId, noticeType, popupFlag, releaseDate, text, praiseCount } = res.body.data.detail
                        if (noticeState == 0) {
                            noticeState = 1
                        }
                        this.bulletinItem = { author, mailFlag, noticeAbstract, noticeCaption, noticeState, noticeId, noticeType, popupFlag, releaseDate, text, praiseCount }

                        //  this.$refs.artiframe.contentWindow.initHtml(this.bulletinItem.text)
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                    this.isLoading = false
                    this.loadedContent()
                })
                .catch(err => {
                    this.isLoading = false
                    this.$message.error(this.$t(this.Global.errorTitle))
                })
        }
    },
    components: {

    }
}
</script>
<style lang="less">
.PreviewArticle-myDialog {
  width: 840px !important;
  .content.articleManage_previewArticle_content {
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
