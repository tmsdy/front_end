<template>
    <div class="SystemBulletin mainWrap ">
        <div v-show="!isDetail">
            <!-- 文章管理 -->
            <page-title title="系统公告" iconfont="icon-system-notice"></page-title>
            <div v-loading="isLoading" class="mainBody MXscroll">
                <transition name="el-fade-in-linear">
                    <div v-if="!isLoading" class="bulletinList">
                        <bulletin-item v-for="(item,key) in bulletinList" :key='key' :index='key' :item='item' :isList='true' @toDetail='toDetail'></bulletin-item>
                        <el-pagination v-show="page.total>page.size" @current-change="changePage" background layout="total,prev, pager, next" :page-size="page.size" :current-page="page.now" :total="page.total">
                        </el-pagination>
                    </div>
                </transition>
                <transition name="el-fade-in-linear">
                    <no-data v-if="!isLoading&&bulletinList.length<=0"></no-data>
                </transition>
            </div>
        </div>
        <!-- 公告详情 -->
        <bulletin-detail v-show="isDetail" ref='bulletinDetail' :moduleCode="moduleCode" @pageBack="isDetail=false" @updataList="updataListItem"></bulletin-detail>
    </div>
</template>

<script>
/**
 * 系统公告
 * 郭兵
 * 2018-07-28
 */
import bulletinItem from './Vue/BulletinItem/index'
import BulletinDetail from './BulletinDetail/index'
import PageTitle from '@/components/PageTitle/index' // 大标题
import NoData from '@/basecomponents/NoData/index'
export default {
    name: 'SystemBulletin',
    data() {
        return {
            isLoading: false,
            isDetail: false,
            bulletinList: [],
            moduleCode: 'SY021',
            page: {
                now: 1,
                size: 10,
                total: 0
            }
        }
    },
    created() {
        this.getBulletinList()
        setTimeout(() => {
            this.pageShow()
        }, 5)
    },
    methods: {
        updataListItem(index, data) {
            Object.assign(this.bulletinList[index], data)
        },
        toDetail(noticeId, index) {
            this.isDetail = true
            this.$refs.bulletinDetail.open(noticeId, index)
        },
        /* 点击分页 */
        changePage(i) {
            this.page.now = i
            this.getBulletinList()
        },
        getBulletinList() {
            this.isLoading = true
            let url = this.Global.baseURL + this.Global.api.v2.sysNotice_get
            let params = {
                type: 'list',
                moduleCode: this.moduleCode,
                pageN: this.page.now,
                pageSize: this.page.size,
                sort: 'releaseDate',
                order: 'desc'
            }
            this.$http.get(url, { params })
                .then(res => {
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        this.bulletinList = res.body.data.result
                        this.page.total = res.body.data.totalNum
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
        pageShow() {
            if (this.$route.path == '/main/systemset/systembulletin') {
                let { noticeId } = this.$route.query
                if (noticeId) {
                    this.toDetail(noticeId)
                } else {
                    this.getBulletinList()
                }
            }
        }
    },
    watch: {
        /* 更新弹框点击的时候跳过来 */
        $route(to, from) {
            this.pageShow()
        }
    },
    components: {
        'page-title': PageTitle,
        'bulletin-detail': BulletinDetail,
        'bulletin-item': bulletinItem,
        'no-data': NoData
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "../../public-zh-cn.less";
@import "../../public-en.less";
@import "./zh-cn.less";
@import "./en.less";
</style>
