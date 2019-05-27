<template>
    <div class="FollowUpList">
        <loading v-if="isLoading" style="margin-top: 55px;"></loading>
        <!-- 暂无跟进 -->
        <no-data v-if='!isLoading && timeAxisList.length === 0' :title="$t('mxpcweb.client.detail.1529995102249')" img="noFollow"></no-data>
        <template v-if="timeAxisList.length>0">
            <dl v-for="(item,index) in timeAxisList" :key='index'>
                <dt>{{item.date}}</dt>
                <dd v-for="(item2,index2) in item.dataList" :key='index2'>
                    <user-action-item-ico :trackMode='item2.trackMode'></user-action-item-ico>
                    <div class="moduleItem">
                        <div class="btnArraw">
                            <span @click="delThisTrack(item2.trackId)">
                                <i class="iconfont icon-del"></i>
                            </span>
                        </div>

                        <div class="itemTop">
                            <span class="itemName">{{item2.createName}}</span>
                            <span class="pull-right">{{axisTimeFormat(item2.trackDate)}}</span>
                        </div>
                        <div class="trackText">{{item2.trackContent}}</div>
                        <ul class="itemPic">
                            <li v-for="(item3,index3) in item2.imagesId" :key="index3">
                                <a :href="picUrl(item3,'orig')" :data-lightbox="item2.imagesId[0]" data-title="FumaMX"><img :src="picUrl(item3,'130x80')"></a>
                            </li>
                        </ul>
                        <div class="inline">
                            <!-- 联系人 -->
                            <span class="lineLabel">{{$t('mxpcweb.client.detail.1529995128332')}}：</span>
                            {{item2.contName}}
                        </div>
                        <div class="inline noLine">
                            <!-- 下次跟进时间 -->
                            <span class="lineLabel">{{$t('mxpcweb.client.detail.1529995180377')}}：</span>
                            {{formatNoSecond(item2.nextTrackDate)}}
                        </div>
                        <span class="pull-right">{{converTrackMode(item2.trackMode)}}</span>
                    </div>
                </dd>
            </dl>
            <div class="showMore">
                <!-- 查看更多 -->
                <span v-if="isShowMore" class="text-hover" @click="showMoreClick">{{$t('mxpcweb.client.detail.1529995228960')}}
                    <i class="iconfont icon-page-down"></i>
                </span>
                <!-- 没有更多了 -->
                <span v-else>{{$t('mxpcweb.client.detail.1529995260225')}}</span>
            </div>
        </template>
    </div>
</template>

<script>
/**
 * 描述：跟进动态时间轴
 * 作者：向士健
 * 时间：2018/02/06
 */
import { delEmptyStrObj } from '@/libs/utils.js'
import Loading from '@/basecomponents/Loading/index'
import NoData from '@/basecomponents/NoData/index'
// import 'lightbox2'
import userActionItemIco from './userActionItemIco'
export default {
    name: 'FollowUpList',
    props: {
        itemData: {
            type: Object,
            default: function () {
                return {}
            }
        },
        followUpModeList: {
            type: Array,
            default: function () {
                return []
            }
        },
        pageId: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            isLoading: true,
            timeAxisList: [],
            isShowMore: true, // 更多按钮是否显示
            otherReq: {},
            // 条件参数
            from: 0,
            size: 3,
            sort: 'trackDate', // 以此排序
            order: 'desc' // 降序
        }
    },
    created() {
    },
    methods: {
        // 下拉点击
        handleCommand(command) {
            if (command.code == 'del') {
                /* 确定删除这个跟进？ */
                let c = this.$t('mxpcweb.client.detail.1529995349347')
                /* 提示 */
                let t = this.$t('mxpcweb.client.detail.1529994349587')
                /* 确定 */
                let s = this.$t('mxpcweb.client.detail.1529994368552')
                /* 取消 */
                let n = this.$t('mxpcweb.client.detail.1529994393355')
                this.$confirm(c, t, {
                    confirmButtonText: s,
                    cancelButtonText: n,
                    type: 'warning'
                }).then(() => {
                    this.delThisTrack(command.item.trackId)
                }).catch(() => { })
            }
        },
        // 删除这条跟进
        delThisTrack(id) {
            /* 此操作将删除该【提醒】, 是否继续? */
            let c = this.$t('mxpcweb.client.detail.1529995349347')
            /* 提示 */
            let t = this.$t('mxpcweb.client.detail.1529994349587')
            /* 确定 */
            let s = this.$t('mxpcweb.client.detail.1529994368552')
            /* 取消 */
            let n = this.$t('mxpcweb.client.detail.1529994393355')
            this.$confirm(c, t, {
                confirmButtonText: s,
                cancelButtonText: n,
                type: 'warning'
            }).then(() => {
                let data = {
                    identFieldValue: id,
                    moduleCode: this.itemData.bindModuleCode
                }
                this.$http.delete(this.Global.baseURL + this.Global.api.v2.document_generalOperate_delete, { params: data }).then(function (res) {
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        this.getListData()
                        this.$message.success(this.msg(res.body))
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                }, function (res) {
                    this.$message.error(this.$t(this.Global.errorTitle))
                })
            }).catch(() => { })
        },
        // 获取默认数据
        getListData(req) {
            // 记一下传来的参数，给查更多用
            if (req) {
                this.otherReq = req
            }
            // 接口名称: 获取单据列表
            var p0 = new Promise((resolve, reject) => {
                // 过滤参数追加，后面覆盖前面
                let data = Object.assign({
                    searchType: 'list',
                    order: this.order,
                    from: this.from,
                    size: this.size,
                    sort: this.sort,
                    custId: this.pageId,
                    moduleCode: this.itemData.bindModuleCode
                }, this.otherReq)
                delEmptyStrObj(data, true)// 去除空
                this.$http.get(this.Global.baseURL + this.Global.api.v2.document_generalOperate_get, { params: data }).then(function (res) {
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        resolve(res.body.data)
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                }, function (res) {
                    this.$message.error(this.$t(this.Global.errorTitle))
                })
            })
            // 拥有人下拉
            var p1 = new Promise((resolve, reject) => {
                this.$http.get(this.Global.baseURL + this.Global.api.v2.accountDropList_get, { params: { dataType: 'contact', funType: 'customerSearch' } }).then(function (res) {
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        resolve(res.body.data)
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                }, function (res) {
                    this.$message.error(this.$t(this.Global.errorTitle))
                })
            })
            // 联系人列表
            var p2 = new Promise((resolve, reject) => {
                this.$http.get(this.Global.baseURL + this.Global.api.v2.document_generalOperate_get, {
                    params: {
                        custId: this.pageId,
                        searchType: 'allList',
                        moduleCode: 'BF003'
                    }
                }).then(function (res) {
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        resolve(res.body.data)
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                }, function (res) {
                    this.$message.error(this.$t(this.Global.errorTitle))
                })
            })
            Promise.all([p0, p1, p2]).then((results) => {
                this.isLoading = false
                // console.log(' >>> ')
                // console.log(results)
                // console.log(' >>> ')
                if (Object.keys(results[0]).length == 0) {
                    return
                }
                this.isShowMore = results[0].totalNum > results[0].list.length

                /**
                 * 数据按时间整理
                */
                let arrNum = []
                results[0].list.forEach((item) => {
                    if (arrNum.indexOf(this.timeShow_custom(item.trackDate, 'YYYY-MM-DD')) == -1) {
                        arrNum.push(this.timeShow_custom(item.trackDate, 'YYYY-MM-DD'))
                    }
                    // 拥有人名字，创建人名字匹配上
                    results[1].forEach((item2) => {
                        if (item.ownerCtId == item2.ctId) {
                            item['ownerName'] = item2.realName
                        }
                        if (item.createCtId == item2.ctId) {
                            item['createName'] = item2.realName
                        }
                    })
                    // 联系人名字匹配上
                    if (Object.keys(results[2]).length != 0) {
                        results[2].list.forEach((item2) => {
                            if (item.contId == item2.contId) {
                                item['contName'] = item2.contName
                            }
                        })
                    }
                })

                let arrNewData = []
                arrNum.forEach((item) => {
                    let arrList = []
                    results[0].list.forEach((item2) => {
                        if (item == this.timeShow_custom(item2.trackDate, 'YYYY-MM-DD')) {
                            arrList.push(item2)
                        }
                    })
                    arrNewData.push({
                        date: item,
                        dataList: arrList
                    })
                })
                this.timeAxisList = arrNewData
                // console.log(arrNewData)
                //
                // console.log(formulateTime("2018-03-28 14:49:28", { format: "YYYY-MM-DD" }))
            })
        },
        // 跟进方式转换
        converTrackMode(id) {
            let mode
            this.followUpModeList.forEach((item) => {
                if (item.dictItemCode == id) {
                    mode = item.itemName
                }
            })
            return mode
        },
        // 图片展示的URL
        picUrl(picId, picSize) {
            return this.getGlobalImgSrc(picId, picSize)
        },
        // 格式化成短时间
        axisTimeFormat(val) {
            return this.timeShow_custom(val, 'HH:mm')
        },
        // 下次跟进时间，没有秒
        formatNoSecond(val) {
            return this.timeShow_custom(val, 'YYYY-MM-DD HH:mm')
        },
        // 点击加载更多
        showMoreClick() {
            this.size = this.size + 2
            this.getListData()
        }
    },
    components: {
        'no-data': NoData,
        loading: Loading,
        'user-action-item-ico': userActionItemIco
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
