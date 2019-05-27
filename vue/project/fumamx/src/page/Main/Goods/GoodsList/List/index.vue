<template>
    <div class="GoodsList MXscroll">
        <div class="Search">
            <div class="addButtonBox">
                <span class="text-hover" style="margin-right:10px;" :style="{color: listType == 'list'?'#d0021b':''}" @click="listType = 'list'"><i class="iconfont icon-list-line"></i></span>
                <span class="text-hover" style="margin-right:10px;" :style="{color: listType == 'img'?'#d0021b':''}" @click="listType = 'img'"><i class="iconfont icon-list-o"></i></span>
                <!-- 新建商品 -->
                <el-button class="addButton" type="primary" size="small" @click="$emit('pageClick', '1')">{{$t('mxpcweb.PP001.PP001List.1540347574642')}}</el-button>
                <!-- 导入商品 -->
                <el-button type="primary" @click="importGoods()" size="small">{{$t('mxpcweb.PP001.PP001List.1550125254602')}}</el-button>
            </div>
            <!-- 商品 -->
            {{$t('mxpcweb.PP001.PP001List.1540347621354')}}
            <!-- 请输入商品编号/商品名 -->
            <el-input class="addInput" v-model="keywords" clearable :placeholder="$t('mxpcweb.PP001.PP001List.1540347636888')" icon="search" @keyup.enter.native="getListData" @blur="getListData" :on-icon-click="getListData"></el-input>
            <!-- 分类 -->
            <!-- {{$t('mxpcweb.PP001.PP001List.1540347637176')}} -->
            <!-- 选择分类 -->
            <!-- <el-select v-model="goodsType" filterable clearable :placeholder="$t('mxpcweb.PP001.PP001List.1543304945491')" @change="getListData()" style="margin:0 10px;">
                <el-option :label="$t('mxpcweb.client.1529060999660')" value="">
                </el-option>
                <div v-for="item in classTypeInUseList" :key="item.value+''">
                    <el-option :label="item.label" :value="item.value+''">
                    </el-option>
                </div>
            </el-select> -->
            <!-- 搜索 -->
            <el-button type="primary" @click="getListData()">{{$t('mxpcweb.PP001.PP001List.1540347637440')}}</el-button>
        </div>
        <div v-show="listType == 'img'">
            <div class="titleBox" style="padding-right:20px;">
                <span class="titleTimeControl">
                    <el-dropdown trigger="click" @command="sortListClick">
                        <span class="el-dropdown-link" style="color:#909399;">
                            {{nowSort.cnFieldCaption}}&nbsp;&nbsp;
                        </span>
                        <el-dropdown-menu slot="dropdown" style="margin-top:10px;">
                            <el-dropdown-item v-for="(item,index) in sortSet" :key="index" :command="index">
                                <div>
                                    <span v-if="item.selected"><i class="iconfont icon-correct" style="color:#D0021B"></i></span>
                                    <span style="display: inline-block;width: 21px;line-height: 20px;" v-else></span>
                                    {{item.cnFieldCaption}}
                                </div>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <span class="titleTimeBox text-hover">
                        <div v-if="titleTime" @click.stop="upSort()" class="triangle-up-grey"></div>
                        <div v-if="!titleTime" class="triangle-up-blue"></div>
                        <div v-if="!titleTime" @click.stop="downSort()" class="triangle-down-grey"></div>
                        <div v-if="titleTime" class="triangle-down-blue"></div>
                    </span>
                </span>
            </div>
            <div class="boxListImg boxTitImg MXscroll" ref="customerTables" v-loading="loading">
                <no-data v-if="list.length==0" style="background:rgba(255,255,255,0)"></no-data>
                <div v-else class="boxListImgBox">
                    <div class="list" v-for="(item,index) in list" :key="index">
                        <div class="imgBox">
                            <img v-if="updata" class="text-hover" @click="openGoodsDetail(item)" v-lazy="avatarSrc(item, '200x200')" alt="">
                            <div v-if="tabData == '2'" class="optCode">
                                <!-- 编辑 -->
                                <span class="optButton right10" @click="toEditThis(item)" :title="$t('mxpcweb.am.1531893071733')">
                                    <i class="iconfont icon-edit" style="font-size: 14px"></i>
                                </span>
                                <!-- 复制 -->
                                <span class="optButton right10" @click="toCopyThis(item)" :title="$t('mxpcweb.PP001.PP001List.1543305123427')">
                                    <i class="iconfont icon-copy" style="font-size: 14px"></i>
                                </span>
                                <!-- 删除 -->
                                <span class="optButton right10" @click="deleteItem(item)" :title="$t('mxpcweb.am.1531893085173')">
                                    <i class="iconfont icon-del" style="font-size: 14px"></i>
                                </span>
                            </div>
                            <div v-else class="optCode">
                                <!-- 编辑 -->
                                <span class="optButton right10" @click="toEditThis(item)" :title="$t('mxpcweb.am.1531893071733')">
                                    <i class="iconfont icon-edit" style="font-size: 14px"></i>
                                </span>
                                <!-- 复制商品 -->
                                <span class="optButton right10" @click="toCopyThis(item)" :title="$t('mxpcweb.PP001.PP001List.1543305122075')">
                                    <i class="iconfont icon-copy" style="font-size: 14px"></i>
                                </span>

                                <!-- 复制链接 -->
                                <span class="optButton right10" :title="$t('mxpcweb.PP001.PP001List.1543305123427')" @click="Copy(item)">
                                    <i class="iconfont icon-link" style="font-size: 14px"></i>
                                </span>

                                <!-- 分享 -->
                                <span class="optButton right10" :title="$t('mxpcweb.PP001.PP001List.1540347766752')" @click="shareLink(item)">
                                    <i class="iconfont icon-forward" style="font-size: 14px"></i>
                                </span>
                            </div>
                        </div>
                        <p class="listContentBox2" :title="item.spuName">
                            <span class="text-hover" @click="openGoodsDetail(item)">{{item.spuName}}</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <div v-show="listType == 'list'">
            <div class="titleBox" :style="{'padding-right': hasScrollbarValue ? '6px' : '0'}">
                <el-row class="list" :gutter="20">
                    <!-- 商品信息 -->
                    <el-col :span="10">{{$t('mxpcweb.PP001.PP001List.1540347651057')}}</el-col>
                    <!-- 标准售价 -->
                    <el-col :span="3">{{$t('mxpcweb.PP001.PP001List.1540347651264')}}</el-col>
                    <!-- 计量单位 -->
                    <el-col :span="3">{{$t('mxpcweb.PP001.PP001List.1540347651448')}}</el-col>
                    <!-- 状态 -->
                    <el-col :span="3" v-if="tabData == '2'">{{$t('mxpcweb.PP001.PP001List.1540347662369')}}</el-col>
                    <!-- 创建时间 -->
                    <el-col :span="3" v-else>
                        <span class="titleTimeControl">
                            <el-dropdown trigger="click" @command="sortListClick">
                                <span class="el-dropdown-link" style="color:#909399;">
                                    {{nowSort.cnFieldCaption}}
                                </span>
                                <el-dropdown-menu slot="dropdown" style="margin-top:10px;">
                                    <el-dropdown-item v-for="(item,index) in sortSet" :key="index" :command="index">
                                        <div>
                                            <span v-if="item.selected"><i class="iconfont icon-correct" style="color:#D0021B"></i></span>
                                            <span style="display: inline-block;width: 21px;line-height: 20px;" v-else></span>
                                            {{item.cnFieldCaption}}
                                        </div>
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                            <span class="titleTimeBox text-hover">
                                <div v-if="titleTime" @click.stop="upSort()" class="triangle-up-grey"></div>
                                <div v-if="!titleTime" class="triangle-up-blue"></div>
                                <div v-if="!titleTime" @click.stop="downSort()" class="triangle-down-grey"></div>
                                <div v-if="titleTime" class="triangle-down-blue"></div>
                            </span>
                        </span>
                    </el-col>
                    <el-col :span="3" class="goodsMsg">
                        <!-- 拥有人 -->
                        {{$t('mxpcweb.PP001.PP001List.1543305031587')}}
                    </el-col>
                    <!-- 操作 -->
                    <!-- <el-col :span="5">{{$t('mxpcweb.PP001.PP001List.1540347670738')}}</el-col> -->
                </el-row>
            </div>
            <el-checkbox-group v-model="controlData.checkedCities" @change="handleCheckedCitiesChange">
                <div class="boxList boxTit MXscroll" ref="customerTables" v-loading="loading" :style="{'padding-bottom': blockData.total > blockData.pageSize ? '44px':'0'}">
                    <no-data v-if="list.length==0" style="background:rgba(255,255,255,0)"></no-data>
                    <el-row v-else class="list1" :gutter="20" v-for="(item,index) in list" :key="index">
                        <el-col :span="10">
                            <div class="listContent">
                                <img v-if="updata" class="text-hover" @click="openGoodsDetail(item)" v-lazy="avatarSrc(item, '90x90')" alt="" style="width:90px;height:90px;">
                                <div class="listContentBox1 ellipsis" :title="item.spuCode">
                                    <span class="text-hover" @click="openGoodsDetail(item)">{{item.spuCode}}</span>
                                </div>
                                <div v-if="tabData == '2'" :title="item.spuName" class="listContentBox1 ellipsis">
                                    <span class="text-hover" @click="openGoodsDetail(item)">{{item.spuName}}</span>
                                </div>
                                <div v-else class="listContentBox1 ellipsis">
                                    <span class="text-hover" @click="openGoodsDetail(item)">{{item.spuName}}</span>
                                </div>
                                <p class="listContentBox2" :title="item.displayDesc">
                                    <span class="text-hover" @click="openGoodsDetail(item)">{{item.displayDesc}}</span>
                                </p>
                                <div class="listContentBox3">
                                    <span class="text-hover" style="color:#606266">
                                        <!-- 商品规格 -->
                                        <el-popover placement="bottom" trigger="hover">
                                            <div style="color:#303133;line-height: 20px;">
                                                <li style="height: 20px;">
                                                    <!-- 单箱毛重： -->
                                                    <!-- 无 -->
                                                    {{$t('mxpcweb.PP001.PP001List.1540347670939')}}{{item.unitGW&&item.unitGW!=''?parseFloat(item.unitGW).toFixed(2) + 'kg':$t('mxpcweb.PP001.PP001List.1540347697240')}}
                                                </li>
                                                <li style="height: 20px;margin-top:16px;">
                                                    <!-- 单箱体积： -->
                                                    <!-- 无 -->
                                                    {{$t('mxpcweb.PP001.PP001List.1540347671128')}}{{item.unitVol&&item.unitVol!=''?parseFloat(item.unitVol).toFixed(2) + 'm³':$t('mxpcweb.PP001.PP001List.1540347697240')}}
                                                </li>
                                                <li style="height: 20px;margin-top:16px;">
                                                    <!-- 单箱数量： -->
                                                    <!-- 件 -->
                                                    <!-- 无 -->
                                                    {{$t('mxpcweb.PP001.PP001List.1540347685745')}}{{item.unitQty&&item.unitQty!=''?parseInt(item.unitQty) + $t('mxpcweb.PP001.PP001List.1540347738233'):$t('mxpcweb.PP001.PP001List.1540347697240')}}
                                                </li>
                                                <li style="height: 20px;margin-top:16px;">
                                                    <!-- 40尺高柜数量： -->
                                                    <!-- 个 -->
                                                    <!-- 无 -->
                                                    {{$t('mxpcweb.PP001.PP001List.1540347686129')}}{{item.cont40LR&&item.cont40LR!=''?parseInt(item.cont40LR) + $t('mxpcweb.PP001.PP001List.1540347748832'):$t('mxpcweb.PP001.PP001List.1540347697240')}}
                                                </li>
                                            </div>
                                            <i class="iconfont icon-goods text-hover" slot="reference" title="" style="vertical-align: middle;font-size:16px;"></i>
                                        </el-popover>
                                    </span>
                                </div>
                            </div>
                        </el-col>
                        <el-col :span="3" class="goodsMsg">
                            <span v-if="item.salePrice && item.salePrice != ''">
                                <component v-bind:is="'controlCurrency'" ref="control" :value="{value:item.saleCur}"></component>
                                {{parseFloat(item.salePrice)}}
                            </span>
                            <span v-else>-</span>
                        </el-col>
                        <el-col :span="3" class="goodsMsg">
                            <component v-bind:is="'control55'" ref="control" :value="{value:item.unit}"></component>
                        </el-col>
                        <el-col :span="3" class="goodsMsg" v-if="tabData == '2'">
                            <!-- 草稿 -->
                            <component v-bind:is="'control2'" ref="control" :list="item" :itemData="{
                                fieldName: 'auditState',
                                dictCode: '16'
                            }" :value="{value:item.auditState}"></component>
                        </el-col>
                        <el-col :span="3" class="goodsMsg" v-else>{{nowSort.fieldName == 'createDate' ? item[nowSort.fieldName].substr(0,10) : item[nowSort.fieldName]}}</el-col>
                        <el-col :span="3" class="goodsMsg ownerCtId">
                            {{peopleListReturn(item.ownerCtId)}}&nbsp;
                        </el-col>
                        <el-col :span="5" class="listCol4">
                            <div v-if="tabData == '2'" class="listCol4Item">
                                <!-- 查看 -->
                                <span class="optButton right10" @click="openGoodsDetail(item)" :title="$t('mxpcweb.PP001.PP001List.1542266515374')">
                                    <i class="iconfont icon-eye"></i>
                                </span>
                                <!-- 编辑 -->
                                <span class="optButton right10" @click="toEditThis(item)" :title="$t('mxpcweb.am.1531893071733')">
                                    <i class="iconfont icon-edit"></i>
                                </span>
                                <!-- 复制商品 -->
                                <span class="optButton right10" @click="toCopyThis(item)" :title="$t('mxpcweb.PP001.PP001List.1543305122075')">
                                    <i class="iconfont icon-copy"></i>
                                </span>
                                <!-- 删除 -->
                                <span class="optButton right10" @click="deleteItem(item)" :title="$t('mxpcweb.am.1531893085173')">
                                    <i class="iconfont icon-del"></i>
                                </span>
                            </div>
                            <div v-else class="listCol4Item">
                                <!-- 查看 -->
                                <span class="optButton right10" @click="openGoodsDetail(item)" :title="$t('mxpcweb.PP001.PP001List.1542266515374')">
                                    <i class="iconfont icon-eye"></i>
                                </span>
                                <!-- 编辑 -->
                                <span class="optButton right10" @click="toEditThis(item)" :title="$t('mxpcweb.am.1531893071733')">
                                    <i class="iconfont icon-edit"></i>
                                </span>
                                <!-- 复制商品 -->
                                <span class="optButton right10" @click="toCopyThis(item)" :title="$t('mxpcweb.PP001.PP001List.1543305122075')">
                                    <i class="iconfont icon-copy"></i>
                                </span>
                                <!-- 发信 -->
                                <!-- <span class="optButton right10" title="发信">
                                    <i class="iconfont icon-send"></i>
                                </span> -->
                                <!-- 暂时隐藏 -->

                                <!-- 复制链接 -->
                                <span class="optButton right10" :title="$t('mxpcweb.PP001.PP001List.1543305123427')" @click="Copy(item)">
                                    <i class="iconfont icon-link"></i>
                                </span>

                                <!-- 分享 -->
                                <span class="optButton right10" :title="$t('mxpcweb.PP001.PP001List.1540347766752')" @click="shareLink(item)">
                                    <i class="iconfont icon-forward"></i>
                                </span>
                            </div>
                        </el-col>
                        <div :class="controlData.checkedCities.length==0?'checkboxLeft':'checkboxLeft1'">
                            <el-checkbox :label="item.spuId" size="small">&nbsp;</el-checkbox>
                        </div>
                    </el-row>
                </div>
            </el-checkbox-group>
            <!--footer-->
            <foot-control ref="footControl" moduleCode="GD001" :moduleStruct="moduleStruct" @getListData="getListData" :listOpt="tabData=='2'?listOpt1:tabData=='1'?listOpt2:listOpt" :customerLists="list" :controlData="controlData" iseType="通用"></foot-control>
        </div>
        <share ref="share"></share>
        <!-- 商品 -->
        <page-title :showTitle="false" :title="$t('mxpcweb.PP001.PP001List.1540347621354')" iconfont="icon-goods-list">
        </page-title>
        <!--分页-->
        <list-page v-show="controlData.checkedCities.length==0" style="background:#f7f8f9;text-align:center" :blockData="blockData" @getListData="getListData"></list-page>
        <div class="pageTab">
            <el-tabs class="subTabs-pullRight" v-model="tabData" @tab-click="getListData()">
                <!-- 在售商品 -->
                <el-tab-pane :label="$t('mxpcweb.PP001.PP001List.1540347786649')" name="0">
                </el-tab-pane>
                <!-- 推荐商品 -->
                <el-tab-pane :label="$t('mxpcweb.PP001.PP001List.1540347790106')" name="1">
                </el-tab-pane>
                <!-- 下架商品 -->
                <el-tab-pane :label="$t('mxpcweb.PP001.PP001List.1540347794353')" name="2">
                </el-tab-pane>
            </el-tabs>
        </div>
        <otImport ref="otImport" :classTypeInUseList="classTypeInUseList" @getListData="getListData"></otImport>
    </div>
</template>

<script>
import PageTitle from '@/components/PageTitle/index' // 大标题
import listPage from '@/components/listPage/index' // 分页
import ListShow from '@/components/ListShowControls/index' // 分页
import NoData from '@/basecomponents/NoData/index'
import share from './dialog/share.vue'
import otImport from './otImport/index.vue'
import footControl from '@/page/Main/Client/Layout/standard/ClientManagIndex/customerLists/footControl/index'
import { mapGetters } from 'vuex'
export default {
    name: 'GoodsList',
    props: {
        activeId: {
            type: String,
            default: ''
        },
        classTypeList: {
            type: Array,
            default: function () {
                return []
            }
        },
        classTypeInUseList: {
            type: Array,
            default: function () {
                return []
            }
        }
    },
    data() {
        return {
            // 分页操作
            blockData: {
                pageSize: 20,
                total: 1,
                fromNum: 0
            },
            moduleStruct: {
                identField: 'spuId'
            },
            // 底部操作
            controlData: {
                checkedCities: [],
                checkAll: false, // 列表全选状态弹框
                isIndeterminate: false//
            },
            keywords: '',
            // goodsType: '',
            list: [],
            tabData: '',
            listOpt: [{
                iconURI: 'icon-shelves-off',
                optCode: 'offShelves',
                optModuleCode: 'PP001',
                // 批量下架
                optName: this.$t('mxpcweb.PP001.PP001List.1540347807424')
            }, {
                iconURI: 'icon-thumbs-up',
                optCode: 'recommend',
                optModuleCode: 'PP001',
                // 批量推荐
                optName: this.$t('mxpcweb.PP001.PP001List.1540347811752')
            }],
            listOpt1: [{
                iconURI: 'icon-shelves-on',
                optCode: 'onShelves',
                optModuleCode: 'PP001',
                // 批量上架
                optName: this.$t('mxpcweb.PP001.PP001List.1540347816057')
            }, {
                iconURI: 'icon-del',
                optCode: 'otDelete',
                optModuleCode: 'PP001',
                // 批量删除
                optName: this.$t('mxpcweb.PP001.PP001List.1543307859066')
            }],
            listOpt2: [{
                iconURI: 'icon-shelves-off',
                optCode: 'offShelves',
                optModuleCode: 'PP001',
                // 批量下架
                optName: this.$t('mxpcweb.PP001.PP001List.1540347807424')
            }, {
                iconURI: 'icon-thumbs-down',
                optCode: 'cancelRecommend',
                optModuleCode: 'PP001',
                // 取消推荐
                optName: this.$t('mxpcweb.PP001.PP001List.1540347826521')
            }],
            loading: true,
            path: '',
            defaultImg: 'this.src="/static/images/goods/noImg.jpg"',
            listType: 'list',
            sortSet: [{
                // 创建时间
                fieldName: 'createDate',
                cnFieldCaption: this.$t('mxpcweb.PP001.PP001List.1540347662584'),
                selected: true
            }],
            nowSort: {
                // 创建时间
                fieldName: 'createDate',
                cnFieldCaption: this.$t('mxpcweb.PP001.PP001List.1540347662584')
            },
            order: 'desc', // 当前升序还是降序
            titleTime: true,
            hasScrollbarValue: true,
            updata: true,
            timeUse: false,
            time: '' // 防抖
        }
    },
    created() {
        this.path = this.$route.path
        this.unitTabData()
        this.getListData()
        this.getSortSet()
    },
    mounted() {
    },
    methods: {
        unitTabData() {
            this.tabData = this.$route.query.type || '0'
        },
        importGoods() {
            this.$refs.otImport.openWindow()
        },
        getSortSet() { // 获取排序字段数据
            let _this = this
            let data = {
                moduleCode: 'PP001',
                type: 'sortSet'
            }
            _this.$http.get(this.Global.baseURL + this.Global.api.v2.fieldShow_get, { params: data }).then((res) => {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    let sortSet = res.body.data
                    let isHave = false
                    sortSet.forEach(function (item, index) {
                        if (item.fieldName == 'createDate') {
                            isHave = true
                            _this.sortSet = _this.sortListSelect(sortSet, index)
                        }
                    })
                    if (!isHave) {
                        _this.sortSet = _this.sortListSelect(sortSet, 0)
                    }
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
            }, (res) => {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },
        sortListClick(command) { // 排序方式
            this.sortSet = this.sortListSelect(this.sortSet, command)
            this.getListData()
        },
        sortListSelect(list, itemIndex) {
            list.forEach((elemennt, index) => {
                if (index == itemIndex) {
                    elemennt.selected = true
                    this.nowSort = elemennt
                } else {
                    elemennt.selected = false
                }
            })
            return list
        },
        upSort() { // 列表升序
            let _this = this
            _this.titleTime = !_this.titleTime
            _this.order = 'asc'
            _this.getListData()
        },
        downSort() { // 列表降序
            let _this = this
            _this.titleTime = !_this.titleTime
            _this.order = 'desc'
            _this.getListData()
        },
        peopleListReturn(ctId) {
            if (!ctId || ctId == '') {
                return ''
            }
            if (ctId == '10000') {
                return '系统'
            }
            let content = ''
            if (this.contactList instanceof Object) {
                content = this.contactList[ctId] || ''
            }
            return content
        },
        // 图像
        avatarSrc(list, value) {
            let imgId
            if (!list.imagesId || list.imagesId.length === 0) {
                return '/static/images/goods/noImg.jpg'
            } else {
                imgId = list.imagesId[0] // 取第一个数组项为默认头像
                return this.getGlobalImgSrc(imgId, value)
            }
        },
        hasScrollbar() {
            let _this = this
            let time = setTimeout(function () {
                let thisDom = _this.$refs.customerTables
                if (thisDom) {
                    _this.hasScrollbarValue = thisDom.scrollHeight > thisDom.clientHeight
                } else {
                    _this.hasScrollbarValue = false
                }
                window.clearTimeout(time)
            }, 5)
        },
        getListData(loading) {
            this.controlData = {
                checkedCities: [],
                checkAll: false, // 列表全选状态弹框
                isIndeterminate: false//
            }
            let data = {
                moduleCode: 'PP001',
                searchType: 'list',
                from: this.blockData.fromNum,
                size: this.blockData.pageSize,
                order: this.order,
                sort: this.nowSort.fieldName ? this.nowSort.fieldName : 'createDate'
            }
            if (this.tabData == '1') {
                data.recommendFlag = '1'
                data.offFlag = '0'
            } else if (this.tabData == '2') {
                data.offFlag = '1'
            } else {
                data.offFlag = '0'
            }
            if (this.keywords != '') {
                data.keywords = this.keywords
            }
            // if (this.goodsType != '') {
            //     data.category = this.goodsType
            // }
            if (this.activeId) {
                data.category = this.activeId
            }
            if (loading) {
                this.loading = true
            }
            let _this = this
            _this.$http.get(this.Global.baseURL + _this.Global.api.v2.document_product, {
                params: data
            }).then((res) => {
                _this.loading = false
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    _this.list = res.body.data.list || []
                    _this.blockData.total = res.body.data.totalNum || 0
                    _this.updata = false
                    _this.$nextTick(() => {
                        _this.updata = true
                        setTimeout(function () {
                            _this.clampInit()
                        }, 20)
                    })
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
                if (_this.loading) {
                    _this.loading = false
                }
            })
        },
        // 打开详情
        openGoodsDetail(item) {
            this.openNewWindowTab(this.getGoodsLink(item.spuId, true))
            // window.open(
            // this.getGoodsLink(item.spuId, true),
            // '_blank'
            // )
        },
        shareLink(item) {
            this.$refs.share.open(item)
        },
        toCopyThis(item) {
            this.$emit('pageClick', '1', item)
        },
        toEditThis(item) {
            this.$emit('pageClick', '2', item)
        },
        deleteItem(item) {
            let _this = this
            // 是否删除该商品
            // 提示
            _this.$confirm(_this.$t('mxpcweb.PP001.PP001List.1540347842008'), _this.$t('mxpcweb.PP001.PP001List.1540347846416'), {
                confirmButtonText: _this.$t('mxpcweb.client.1529047741736'),
                cancelButtonText: _this.$t('mxpcweb.client.1529047588840'),
                type: 'warning'
            }).then(() => {
                _this.optDelete(item)
            }).catch(() => {
            })
        },
        // 单选触发事件
        handleCheckedCitiesChange(value) {
            let checkedCount = value.length
            this.controlData.checkAll = checkedCount === this.list.length// 选中的个数是否等于总个数
            this.controlData.isIndeterminate = checkedCount > 0 && checkedCount < this.list.length
        },
        Copy(item) {
            let Url2 = this.getGoodsLink(item.spuId)
            let oInput = document.createElement('input')
            oInput.value = Url2
            document.body.appendChild(oInput)
            oInput.select() // 选择对象
            document.execCommand('Copy') // 执行浏览器复制命令
            oInput.style.display = 'none'
            // 复制成功
            this.$message.success(this.$t('mxpcweb.am.1531904029672'))
        },
        async optDelete(item) {
            let res = await this.$http.delete(this.Global.baseURL + this.Global.api.v2.document_product, {
                params: {
                    'moduleCode': 'PP001',
                    'identFieldValue': item.spuId
                }
            })
            if (res.body.code.toString() == this.Global.RES_OK) {
                this.getListData()
                this.$message.success(this.msg(res.body))
            } else {
                this.$message.error(this.msg(res.body))
            }
        },
        clampInit() {
            $('.listContentBox2').each((index, ele) => {
                $clamp(ele, {
                    clamp: 2
                })
            })
        }
    },
    computed: {
        ...mapGetters([
            'company',
            'contactList'
        ])
    },
    watch: {
        $route(val, old) {
            if (val.path === this.path) {
                this.unitTabData()
                this.getListData()
            }
        },
        classTypeListInUse(val, old) {
            this.returnOptions()
        },
        activeId(val) {
            if (this.timeUse) {
                clearTimeout(this.time)
            } else {
                this.timeUse = true
            }
            this.time = setTimeout(() => {
                this.timeUse = false
                this.getListData(true)
            }, 100)
        }
    },
    components: Object.assign({
        'page-title': PageTitle,
        'no-data': NoData,
        'list-page': listPage,
        'foot-control': footControl,
        'share': share,
        'otImport': otImport
    }, ListShow)
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
