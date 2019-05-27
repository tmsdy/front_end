<template>
    <div class="GoodsAnalyseBox">
        <!-- 商品分析 -->
        <page-title :title="$t('mxpcweb.PP001.PP001List.1543304408011')" iconfont="icon-goods-analyse"></page-title>
        <div class="GoodsAnalyse MXscroll">
            <div class="listBox">
                <div class="title">
                    <!-- 商品概括 -->
                    {{$t('mxpcweb.PP001.PP001List.1543304390715')}}
                    <!-- <div class="addInput">
                        <el-select class="right10" v-model="goodsType" size="mini" style="width:120px;" placeholder="今日实时" filterable>
                        </el-select>
                        <span>
                            {{time1}}
                        </span>
                        <span class="text-hover" style="color:#C0C4CC" @click="updateTime1">
                            <i class="iconfont icon-refresh-round" style="font-size: 20px;vertical-align: middle;"></i>
                        </span>
                    </div> -->
                </div>
                <div class="content">
                    <div class="contentList">
                        <!-- 商品分布 -->
                        <div class="contentTitle">{{$t('mxpcweb.PP001.PP001List.1543304407797')}}</div>
                        <div class="contentBox">
                            <div class="typeList">
                                <span class="iconBox">
                                    <i class="iconfont icon-goods-simple"></i>
                                </span>
                                <div class="count"><span @click="toGoodsList('0')" class="text-hover">{{allData.onSaleNum || allData.onSaleNum == '0'?allData.onSaleNum:'0'}}</span></div>
                                <!-- 在售商品数 -->
                                <div class="countTitle">{{$t('mxpcweb.PP001.PP001List.1543304425147')}}</div>
                            </div>
                            <div class="typeList">
                                <span class="iconBox">
                                    <i class="iconfont icon-star-simple"></i>
                                </span>
                                <div class="count"><span @click="toGoodsList('1')" class="text-hover">{{allData.recommendNum || allData.recommendNum == '0'?allData.recommendNum:'0'}}</span></div>
                                <!-- 推荐商品数 -->
                                <div class="countTitle">{{$t('mxpcweb.PP001.PP001List.1543304425363')}}</div>
                            </div>
                        </div>
                    </div>
                    <div class="contentList">
                        <!-- 商品访问 -->
                        <div class="contentTitle">{{$t('mxpcweb.PP001.PP001List.1543304425548')}}</div>
                        <div class="contentBox">
                            <div class="typeList">
                                <span class="iconBox">
                                    <i class="iconfont icon-page-view"></i>
                                </span>
                                <div class="count">{{allData.visitedNum || allData.visitedNum == '0'?allData.visitedNum:'0'}}</div>
                                <!-- 被访问商品数 -->
                                <div class="countTitle">{{$t('mxpcweb.PP001.PP001List.1543304425707')}}</div>
                            </div>
                            <div class="typeList">
                                <span class="iconBox">
                                    <i class="iconfont icon-mouse"></i>
                                </span>
                                <div class="count">{{allData.UV || allData.UV == '0'?allData.UV:'0'}}</div>
                                <!-- 商品访问数（商品UV） -->
                                <div class="countTitle">{{$t('mxpcweb.PP001.PP001List.1543304440306')}}</div>
                            </div>
                            <div class="typeList">
                                <span class="iconBox">
                                    <i class="iconfont icon-click-data"></i>
                                </span>
                                <div class="count">{{allData.PV || allData.PV == '0'?allData.PV:'0'}}</div>
                                <!-- 商品浏览量（商品PV） -->
                                <div class="countTitle">{{$t('mxpcweb.PP001.PP001List.1543304440507')}}</div>
                            </div>
                        </div>
                    </div>
                    <div class="contentList">
                        <!-- 商品转化 -->
                        <div class="contentTitle">{{$t('mxpcweb.PP001.PP001List.1543304447275')}}</div>
                        <div class="contentBox">
                            <div class="typeList">
                                <span class="iconBox">
                                    <i class="iconfont icon-msg-ask"></i>
                                </span>
                                <div class="count"><span @click="toClient({enquSource: '2'})" class="text-hover">{{allData.enquiryNum || allData.enquiryNum == '0'?allData.enquiryNum:'0'}}</span></div>
                                <!-- 询盘 -->
                                <div class="countTitle">{{$t('mxpcweb.PP001.PP001List.1543304447474')}}</div>
                            </div>
                            <div class="typeList">
                                <span class="iconBox">
                                    <i class="iconfont icon-change"></i>
                                </span>
                                <div class="count">{{allData.enquiryNum && allData.enquiryNum == '0' && allData.UV && allData.UV == '0' ? parseInt(allData.enquiryNum)/parseInt(allData.UV) + '%' : '0'}}</div>
                                <!-- 转化率 -->
                                <div class="countTitle">{{$t('mxpcweb.PP001.PP001List.1543304460483')}}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="listBox listBox1 MXscroll" style="margin-top:16px">
                <div class="title">
                    <!-- 商品效果 -->
                    {{$t('mxpcweb.PP001.PP001List.1543304460675')}}
                    <div class="addInput">
                        <el-input class="right10" style="width:160px;" size="mini" v-model="keywords" placeholder="搜索"  icon="search" @keyup.enter.native="getListData1" :on-icon-click="getListData1">
                        </el-input>

                        <!-- <el-select class="right10" v-model="goodsType" size="mini" style="width:120px;" placeholder="今日实时" filterable>
                        </el-select>
                        <span>
                            {{time2}}
                        </span>
                        <span class="text-hover" style="color:#C0C4CC" @click="updateTime2">
                            <i class="iconfont icon-refresh-round" style="font-size: 20px;vertical-align: middle;"></i>
                        </span> -->
                    </div>
                </div>
                <div class="content" style="padding:0 10px;">
                    <div>
                        <el-row class="list" :gutter="20">
                            <!-- 商品信息 -->
                            <el-col :span="8" class="ellipsis" :title="$t('mxpcweb.PP001.PP001List.1540347651057')">{{$t('mxpcweb.PP001.PP001List.1540347651057')}}</el-col>
                            <!-- 推荐次数 -->
                            <el-col :span="3" class="ellipsis" :title="$t('mxpcweb.PP001.PP001List.1543304479619')">{{$t('mxpcweb.PP001.PP001List.1543304479619')}}</el-col>
                            <!-- 商品访客数（商品UV） -->
                            <el-col :span="5" class="ellipsis" :title="$t('mxpcweb.PP001.PP001List.1543304479795')">{{$t('mxpcweb.PP001.PP001List.1543304479795')}}</el-col>
                            <!-- 商品浏览量（商品PV） -->
                            <el-col :span="5" class="ellipsis" :title="$t('mxpcweb.PP001.PP001List.1543304440507')">{{$t('mxpcweb.PP001.PP001List.1543304440507')}}</el-col>
                            <!-- 询盘 -->
                            <el-col :span="3" class="ellipsis" :title="$t('mxpcweb.PP001.PP001List.1543304447474')">{{$t('mxpcweb.PP001.PP001List.1543304447474')}}</el-col>
                        </el-row>
                    </div>
                    <no-data v-if="list.length==0" style="background:rgba(255,255,255,0)"></no-data>
                    <el-row v-else class="list1" :gutter="20" v-for="(item,index) in list" :key="index">
                        <el-col :span="8">
                            <div class="listContent">
                                <img v-lazy="avatarSrc(item)" alt="" style="width:70px;height:70px;">
                                <div class="listContentBox1 ellipsis" :title="item.spuCode">{{item.spuCode}}</div>
                                <div :title="item.spuName" class="listContentBox1 ellipsis">{{item.spuName}}</div>
                                <!-- <div v-else class="listContentBox1 ellipsis text-hover"  @click="openGoodsDetail(item)">{{item.spuName}}</div> -->
                                <p class="listContentBox2" :title="item.displayDesc">
                                    {{item.displayDesc}}
                                </p>
                            </div>
                        </el-col>
                        <el-col :span="3" class="goodsMsg">
                            {{item.recommendNum || item.recommendNum == '0'?item.recommendNum:'0'}}
                        </el-col>
                        <el-col :span="5" class="goodsMsg">{{item.UV || item.UV == '0'?item.UV:'0'}}</el-col>
                        <el-col :span="5" class="goodsMsg">{{item.PV || item.PV == '0'?item.PV:'0'}}</el-col>
                        <el-col :span="3" class="goodsMsg">
                            {{item.enquiryNum || item.enquiryNum == '0'?item.enquiryNum:'0'}}
                        </el-col>
                    </el-row>
                </div>
                <list-page style="background:#f7f8f9;text-align:center" :blockData="blockData"  @getListData="getListData1"></list-page>
            </div>
        </div>
    </div>
</template>

<script>
import listPage from '@/components/listPage/index' // 分页
import PageTitle from '@/components/PageTitle/index' // 大标题
import NoData from '@/basecomponents/NoData/index'
import { isArray } from '@/libs/utils'
export default {
    name: 'GoodsAnalyse',
    props: {},
    data() {
        return {
            goodsType: '',
            keywords: '',
            time1: '',
            time2: '',
            allData: {},
            defaultImg: 'this.src="/static/images/goods/noImg.jpg"',
            list: [],
            // 分页操作
            blockData: {
                pageSize: 20,
                total: 0,
                fromNum: 0
            },
            pageUrl: ''
        }
    },
    created() {
        this.pageUrl = this.$route.path
    },
    mounted() {
        this.updateTime1()
        this.updateTime2()
        this.clampInit()
    },
    methods: {
        toGoodsList(type) {
            this.$router.push({
                path: '/main/goods/goodsList',
                query: {
                    type: type
                }
            })
        },
        toClient(obj) { // 跳转客户
            let data = {
                modelCode: 'PS001',
                interval: '',
                argument: {}
            }
            if (obj) {
                data.argument = obj
            }
            this.toClient_g(data)
        },
        // 图像
        avatarSrc(list) {
            let imgId
            if (!list.imagesId || list.imagesId.length === 0) {
                return '/static/images/goods/noImg.jpg'
            } else {
                imgId = list.imagesId[0] // 取第一个数组项为默认头像
                return this.getGlobalImgSrc(imgId, '90x90')
            }
        },
        // 打开详情
        openGoodsDetail (item) {
            window.open(
            this.getGoodsLink(item.spuId, true),
            '_blank'
            )
            this.openNewWindowTab(this.getGoodsLink(item.spuId, true))
        },
        getListData() {
            let _this = this
            _this.$http.get(this.Global.baseURL + this.Global.api.v2.document_product_productAnalysis_get).then((res) => {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    _this.allData = res.body.data
                } else {
                    _this.allData = {}
                    _this.$message.error(_this.msg(res.body))
                }
            }, (res) => {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },
        async getListData1() {
            let data = {
                moduleCode: 'PP001',
                searchType: 'list',
                from: this.blockData.fromNum,
                size: this.blockData.pageSize,
                offFlag: '0',
                sort: 'shelfDate',
                order: 'desc'
            }
            if (this.keywords != '') {
                data.keywords = this.keywords
            }
            let res = await this.$http.get(this.Global.baseURL + this.Global.api.v2.document_product, {
              params: data
            })
            if (res.body.code.toString() == this.Global.RES_OK && isArray(res.body.data.list)) {
                this.list = res.body.data.list
                this.blockData.total = res.body.data.totalNum
                let _this = this
                setTimeout(function() {
                    _this.clampInit()
                }, 20)
            } else {
                this.$message.error(this.msg(res.body))
            }
            if (this.loading) {
                this.loading = false
            }
        },
        clampInit() {
            $('.listContent .listContentBox2').each((index, ele) => {
                $clamp(ele, {
                    clamp: 2
                })
            })
        },
        updateTime1() {
            this.time1 = this.$m_unifiedTime(new Date())
            this.getListData()
        },
        updateTime2() {
            this.time2 = this.$m_unifiedTime(new Date())
            this.getListData1()
        }
    },
    components: {
        'page-title': PageTitle,
        'list-page': listPage,
        'no-data': NoData
    },
    watch: {
        $route(val, old) {
            if (val.path === this.pageUrl) {
                this.updateTime1()
                this.updateTime2()
            }
        }
    }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
