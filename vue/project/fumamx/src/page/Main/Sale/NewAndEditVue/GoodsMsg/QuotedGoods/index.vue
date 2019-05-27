<template>
    <div class="QuotedGoods">
        <!-- 引入报价单 -->
        <el-dialog :title="$t('mxpcweb.sale.components.1557565186281')" v-dialogDrag :visible.sync="dialogVisible" custom-class="width1020" class="addRemindDialog" :modal-append-to-body="false">
            <div class="formBox">
                <div class="titleBox">
                    <div class="floatLeft">
                        <!-- 商品分类 -->
                        {{$t('mxpcweb.sale.components.1557565186473')}}
                        <div class="inputBox">{{goodsTypeData.catgName || ''}}</div>
                    </div>
                    <div class="floatRight">
                        <!-- 客户名称 -->
                        {{$t('mxpcweb.sale.components.1557565186675')}}
                        <div class="inputBox">{{custData.custName || ''}}</div>
                    </div>
                </div>
                <div class="searchBox">
                    <div class="time">
                        <!-- 近30天 -->
                        <div class="leftLabel" :class="checkLabelTime == '1' ? 'checkLabel' : 'text-hover'" @click="checkLabelTime = '1';getData()">{{$t('mxpcweb.sale.components.1557565186864')}}</div>
                        <!-- 近60天 -->
                        <div class="label" :class="checkLabelTime == '2' ? 'checkLabel' : 'text-hover'" @click="checkLabelTime = '2';getData()">{{$t('mxpcweb.sale.components.1557565187106')}}</div>
                        <!-- 近90天 -->
                        <div class="rightLabel" :class="checkLabelTime == '3' ? 'checkLabel' : 'text-hover'" @click="checkLabelTime = '3';getData()">{{$t('mxpcweb.sale.components.1557565264420')}}</div>
                    </div>
                    <div class="timeBox">
                        <!-- 报价日期 -->
                        {{$t('mxpcweb.sale.components.1557565264648')}}
                        <el-date-picker v-model="startTime" type="daterange" align="right" style="margin-left:10px;width:164px" :picker-options="pickerOptions">
                        </el-date-picker>
                    </div>
                    <div class="searchInput">
                        <!-- 请输入商品编号/商品名/商品条码 -->
                        <el-input :placeholder="$t('mxpcweb.sale.components.1557565264875')" v-model="keywords" @keyup.enter.native="getData" :on-icon-click="getData" style="width:280px;">
                        </el-input>
                        <!-- 搜索 -->
                        <span class="seach" @click="getData()">{{$t('mxpcweb.sale.components.1557565265083')}}</span>
                    </div>
                </div>
                <div>
                    <div v-loading="loading">
                        <div class="goodsBox" v-if="list.length != '0'">
                            <div class="tableBox">
                                <div class="floatLeft">
                                    <span class="allCheck">
                                        <el-checkbox size="small"  :indeterminate="controlData.isIndeterminate" v-model="controlData.checkAll" @change="handleCheckAllChange"></el-checkbox>
                                    </span>
                                    <el-checkbox-group v-model="controlData.checkedCities" @change="handleCheckedCitiesChange">
                                        <table style="width:360px;border-color:rgba(192,196,204,1)" align="center">
                                            <tr class="title">
                                                <th style="width:66px;padding-left:28px;">
                                                    <!-- 全选 -->
                                                    {{$t('mxpcweb.sale.components.1557565265289')}}
                                                </th>
                                                <!-- 图片 -->
                                                <th v-if="showImg">{{$t('mxpcweb.sale.components.1557565034286')}}</th>
                                                <!-- 商品货号 -->
                                                <th>{{$t('mxpcweb.sale.components.1557565320581')}}</th>
                                                <!-- 商品名称 -->
                                                <th>{{$t('mxpcweb.sale.components.1557565034761')}}</th>
                                            </tr>
                                            <tr class="list" v-for="(item, index) in list" :key="index" :class="(hoverItem == index + 1) ? 'list1' : ''" @mouseenter="hoverItem = index + 1" @mouseleave="hoverItem = ''">
                                                <td>
                                                    <el-checkbox class="checkbox" :label="item.spuId" size="small">&nbsp;</el-checkbox>
                                                </td>
                                                <td @click.stop v-if="showImg">
                                                    <template v-if="item.spuCode">
                                                        <el-popover
                                                            v-if="item.imagesId && item.imagesId[0]"
                                                            placement="right"
                                                            width="424"
                                                            trigger="hover">
                                                            <div class="imgBox" slot="reference">
                                                                <img :src="checkPic(item.imagesId[0], '40x40')" alt="">
                                                                <span class="imgNum" v-if="item.imagesId">{{item.imagesId.length}}</span>
                                                            </div>
                                                            <div class="largeImgBox" >
                                                                <img :src="checkPic(item.imagesId[0], '400x400')" alt="">
                                                            </div>
                                                        </el-popover>
                                                        <div class="imgBoxNo text-hover" v-else>
                                                            <!-- 暂无 -->
                                                            <div>{{$t('mxpcweb.sale.components.1557565035173')}}</div>
                                                        </div>
                                                    </template>
                                                </td>
                                                <td @click.stop>
                                                    <span style="color:#008CEE">
                                                        {{item.spuCode}}
                                                    </span>
                                                </td>
                                                <td style="min-width:100px;">{{item.spuName}}</td>
                                            </tr>
                                        </table>
                                    </el-checkbox-group>
                                </div>
                                <div class="floatRight MXscroll">
                                    <table style="min-width:1110px;border-color:rgba(192,196,204,1)" align="center">
                                        <tr class="title">
                                            <th>
                                                <!-- 数量 -->
                                                <div>{{$t('mxpcweb.sale.components.1557565035577')}}</div>
                                            </th>
                                            <th>
                                                <!-- 计量单位 -->
                                                <div>{{$t('mxpcweb.sale.components.1557565035776')}}</div>
                                            </th>
                                            <th>
                                                <!-- 标准价格 -->
                                                <div>{{$t('mxpcweb.sale.components.1557565036001')}}</div>
                                            </th>
                                            <th>
                                                <!-- 报价 -->
                                                <div>{{$t('mxpcweb.sale.components.1557565036189')}}</div>
                                            </th>
                                            <th>
                                                <!-- 折扣 -->
                                                <div>{{$t('mxpcweb.sale.components.1557565036391')}}</div>
                                            </th>
                                            <th>
                                                <!-- 折扣率 -->
                                                <div>{{$t('mxpcweb.sale.components.1557565036581')}}</div>
                                            </th>
                                            <th>
                                                <!-- 金额 -->
                                                <div>{{$t('mxpcweb.sale.components.1557565036789')}}</div>
                                            </th>
                                            <th>
                                                <!-- 规格 -->
                                                <div>{{$t('mxpcweb.sale.components.1557565036995')}}</div>
                                            </th>
                                            <th v-for="(items, indexs) in specFields" :key="indexs">
                                                <div>{{items.cnFieldCaption}}</div>
                                            </th>
                                            <!-- <th>
                                                <div>描述属性</div>
                                            </th> -->
                                            <th>
                                                <!-- 单箱净重(kg) -->
                                                <div>{{$t('mxpcweb.sale.components.1557565037217')}}</div>
                                            </th>
                                            <th>
                                                <!-- 单箱毛重(kg) -->
                                                <div>{{$t('mxpcweb.sale.components.1557565037425')}}</div>
                                            </th>
                                            <th>
                                                <!-- 单箱体积(m³) -->
                                                <div>{{$t('mxpcweb.sale.components.1557565037611')}}</div>
                                            </th>
                                            <th>
                                                <!-- 单箱数量 -->
                                                <div>{{$t('mxpcweb.sale.components.1557565037833')}}</div>
                                            </th>
                                            <th>
                                                <!-- 箱数 -->
                                                <div>{{$t('mxpcweb.sale.components.1557565099068')}}</div>
                                            </th>
                                            <th>
                                                <!-- 总净重(kg) -->
                                                <div>{{$t('mxpcweb.sale.components.1557565105831')}}</div>
                                            </th>
                                            <th>
                                                <!-- 总毛重(kg) -->
                                                <div>{{$t('mxpcweb.sale.components.1557565106099')}}</div>
                                            </th>
                                            <th>
                                                <!-- 总体积(m³) -->
                                                <div>{{$t('mxpcweb.sale.components.1557565106315')}}</div>
                                            </th>
                                            <th>
                                                <!-- 40尺柜数量 -->
                                                <div>{{$t('mxpcweb.sale.components.1557565106513')}}</div>
                                            </th>
                                            <th>
                                                <!-- 报价编号 -->
                                                <div>{{$t('mxpcweb.sale.components.1557565375001')}}</div>
                                            </th>
                                        </tr>
                                        <tr class="list" v-for="(item, index) in list" :key="index" :class="(hoverItem == index + 1) ? 'list1' : ''" @mouseenter="hoverItem = index + 1" @mouseleave="hoverItem = ''">
                                            <td>
                                                {{item.saleQty}}
                                            </td>
                                            <td>
                                                <component v-bind:is="'control55'" ref="control" :value="{value:item.unit}"></component>
                                            </td>
                                            <td>{{item.salePrice}}</td>
                                            <td>
                                                {{item.quotedPrice}}
                                            </td>
                                            <td>
                                                <!-- 无折扣 -->
                                                {{item.offAmt == '0' ? $t('mxpcweb.sale.components.1557565106759') : item.offAmt}}
                                            </td>
                                            <td>{{item.offRT || 0}}%</td>
                                            <td>{{item.totAmt || 0}}</td>
                                            <td>{{item.spuSpec}}</td>
                                            <td v-for="(items, indexs) in specFields" :key="indexs"  @click.stop>
                                                {{item[items.fieldName]&&item[items.fieldName].itemName ? item[items.fieldName].itemName : ''}}
                                            </td>
                                            <td>{{item.unitNW}}</td>
                                            <td>{{item.unitGW}}</td>
                                            <td>{{item.unitVol}}</td>
                                            <td>{{item.unitQty}}</td>
                                            <td>
                                                {{item.boxQty}}
                                            </td>
                                            <td>
                                                <template v-if="item.spuCode">
                                                    {{item.NW}}
                                                </template>
                                            </td>
                                            <td>
                                                <template v-if="item.spuCode">
                                                    {{item.GW}}
                                                </template>
                                            </td>
                                            <td>
                                                <template v-if="item.spuCode">
                                                    {{item.volume}}
                                                </template>
                                            </td>
                                            <td>
                                                <template v-if="item.spuCode">
                                                    {{item.cont40R || '0'}}
                                                </template>
                                            </td>
                                            <td>
                                                <template v-if="item.spuCode">
                                                    {{item.strucId_1 ? item.strucId_1.quotaCode : ''}}
                                                </template>
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <no-data v-else></no-data>
                    </div>
                    <div class="pageSizeBox">
                        <el-pagination
                        :current-page.sync="currentPage"
                        :page-size="5"
                        @current-change="getData"
                        layout="total, prev, pager, next"
                        :total="total">
                        </el-pagination>
                    </div>
                </div>
            </div>
            <div class="text-center">
                <el-button type="primary" @click="submitForm()">
                    <!-- 保 存 -->{{$t('mxpcweb.workbench.1530703569155')}}
                </el-button>
                <el-button @click="dialogVisible = false">
                    <!-- 取 消 -->{{$t('mxpcweb.workbench.1530703557306')}}
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import NoData from '@/basecomponents/NoData/index'
import ListShow from '@/components/ListShowControls/index'
export default {
    name: 'QuotedGoods',
    props: {
        custData: {
            type: Object,
            default: () => {
                return {}
            }
        },
        goodsTypeData: {
            type: Object,
            default: () => {
                return {}
            }
        },
        specFields: {
            type: Array,
            default: () => {
                return []
            }
        },
        showImg: {
            type: Boolean,
            default: false
        },
        moduleCode: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            // 底部操作
            controlData: {
                checkedCities: [],
                checkAll: false, // 列表全选状态弹框
                isIndeterminate: false//
            },
            dialogVisible: false,
            checkLabelTime: '',
            keywords: '',
            startTime: ['', ''],
            list: [],
            total: 0,
            hoverItem: '',
            currentPage: 1,
            pickerOptions: {
                shortcuts: [{
                    // 最近一周
                    text: this.$t('mxpcweb.sale.components.1557565265491'),
                    onClick(picker) {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                        picker.$emit('pick', [start, end])
                    }
                }, {
                    // 最近一个月
                    text: this.$t('mxpcweb.sale.components.1557565265682'),
                    onClick(picker) {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                        picker.$emit('pick', [start, end])
                    }
                }, {
                    // 最近三个月
                    text: this.$t('mxpcweb.sale.components.1557565265899'),
                    onClick(picker) {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                        picker.$emit('pick', [start, end])
                    }
                }]
            },
            loading: true
        }
    },
    created() {
    },
    mounted() {
    },
    computed: {
    },
    methods: {
        checkPic(imgId, size) {
            return this.getGlobalImgSrc(imgId, size)
        },
        // 返回全选列表
        returnLists() {
            let num = []
            this.list.forEach(function(item, indexs) {
                num.push(item.spuId)
            })
            return num
        },
        // 底部菜单栏操作
        // 全选、反选
        handleCheckAllChange(event) {
            this.controlData.checkedCities = event.target.checked ? this.returnLists() : []
            this.controlData.isIndeterminate = false
        },
        // 单选触发事件
        handleCheckedCitiesChange(value) {
            let checkedCount = value.length
            this.controlData.checkAll = checkedCount === this.list.length// 选中的个数是否等于总个数
            this.controlData.isIndeterminate = checkedCount > 0 && checkedCount < this.list.length
        },
        getData() {
            let data = {
                moduleCode: 'SC001',
                searchType: 'pickList',
                strucId: '2',
                sort: 'quotaDate',
                order: 'DESC',
                from: (this.currentPage - 1) * 5,
                size: 5
            }
            if (this.checkLabelTime == '1') {
                data.quotaDate_gt = this.$m_unifiedTime(funDate(30))
            } else if (this.checkLabelTime == '2') {
                data.quotaDate_gt = this.$m_unifiedTime(funDate(60))
            } else if (this.checkLabelTime == '3') {
                data.quotaDate_gt = this.$m_unifiedTime(funDate(90))
            }
            if (this.startTime[0] && this.startTime[0] != '') {
                let startBeginDate = this.timeShow_custom(this.$m_unifiedTime(this.startTime[0]), 'YYYY-MM-DD')
                data.quotaDate_gt = startBeginDate
            }
            if (this.startTime[1] && this.startTime[1] != '') {
                let endBeginDate = this.timeShow_custom(this.$m_unifiedTime(this.startTime[1]), 'YYYY-MM-DD')
                data.quotaDate_lt = endBeginDate
            }
            if (this.keywords != '') {
                data.wildcardWords = this.keywords
            }
            function funDate(aa) { // 获取多少天前后的日期
                let date1 = new Date()
                let date2 = new Date(date1)
                date2.setDate(date1.getDate() - aa)
                return date2
            }
            this.loading = true
            this.$http.get(this.Global.baseURL + this.Global.api.v2.document_quotation_get, { params: data }).then((res) => {
                if (res.body.code.toString() == this.Global.RES_OK) {
                    this.list = res.body.data.list || []
                    this.total = res.body.data.totalNum || 0
                    this.loading = false
                    this.controlData = {
                        checkedCities: [],
                        checkAll: false, // 列表全选状态弹框
                        isIndeterminate: false//
                    }
                } else {
                    this.list = []
                    this.total = 0
                    this.loading = false
                    this.$message.error(this.msg(res.body))
                }
            }, (res) => {
                this.loading = false
                this.list = []
                this.total = 0
                this.$message.error(this.$t(this.Global.errorTitle))
            })
        },
        showDialog() {
            this.controlData = {
                checkedCities: [],
                checkAll: false, // 列表全选状态弹框
                isIndeterminate: false//
            }
            this.checkLabelTime = ''
            this.keywords = ''
            this.startTime = ['', '']
            this.list = []
            this.total = 0
            this.currentPage = 1
            this.dialogVisible = true
            this.getData()
        },
        // 提交表单
        submitForm() {
            if (this.controlData.checkedCities.length == 0) {
                // 请先选择商品
                this.$message(this.$t('mxpcweb.sale.components.1557565266121'))
                return
            }
            let checkLists = []
            if (this.list.length > 0) {
                this.list.forEach(item => {
                    this.controlData.checkedCities.forEach(items => {
                        if (item.spuId == items) {
                            let itemObj = JSON.parse(JSON.stringify(item))
                            checkLists.push(itemObj)
                        }
                    })
                })
            }
            this.$emit('checkGoodsList', checkLists)
            this.dialogVisible = false
        },
        // 重置表单
        resetForm() {
        }
    },
    components: Object.assign({
        'no-data': NoData
    }, ListShow)
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
