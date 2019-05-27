<template>
    <div class="BulletinDetail">
        <!-- 文章管理 -->
        <page-detail title="系统公告" detailTitle="文章详情" iconfont="icon-system-notice" @toList="pageBack"></page-detail>
        <div v-loading="isLoading" class="mainBody MXscroll">
            <transition name="el-fade-in-linear">
                <bulletin-item v-if="!isLoading&&Object.keys(bulletinItem).length>0" class="articleBox" :item="bulletinItem" @updataList="updataList"></bulletin-item>
            </transition>
        </div>
    </div>
</template>

<script>
/**
 * 公告详情
 * 郭兵
 * 2018-07-30
 */
import BulletinItem from '../Vue/BulletinItem/index'
import PageDetail from '@/components/PageDetail/index' // 大标题
export default {
    name: 'BulletinDetail',
    props: {
        moduleCode: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            isLoading: false,
            bulletinItem: {},
            index: 0
        }
    },
    computed: {

    },
    methods: {
        updataList(data) {
            this.$emit('updataList', this.index, data)
        },
        pageBack() {
            this.bulletinItem = {}
            this.$emit('pageBack')
        },
        open(noticeId, index) {
            this.noticeId = noticeId
            this.index = index
            this.getDetail()
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
                    icon = 'icon-rocket'
                    break
                case 2:
                    icon = 'icon-gift'
                    break
                case 3:
                    icon = 'icon-pinwheel'
                    break
                default:
                    icon = ''
                    break
            }
            return icon
        },
        getDetail() {
            let url = this.Global.baseURL + this.Global.api.v2.sysNotice_get
            let params = {
                type: 'detail',
                noticeId: this.noticeId,
                moduleCode: this.moduleCode
            }
            this.isLoading = true
            this.$http.get(url, { params })
                .then(res => {
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        this.bulletinItem = res.body.data.detail
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                    this.isLoading = false
                })
                .catch(err => {
                    this.isLoading = false
                    this.$message.error(this.$t(this.Global.errorTitle))
                })
        }
    },
    components: {
        'page-detail': PageDetail,
        'bulletin-item': BulletinItem
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "../../../public-zh-cn.less";
@import "../../../public-en.less";
@import "./zh-cn.less";
@import "./en.less";
</style>
