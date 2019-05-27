<template>
    <el-dialog v-dialogDrag :title="itemData.groupName" :visible.sync="isOpen" custom-class="width920" @close="resetForm()">
        <div class="text-right" style="margin:-15px 0 10px;">
            <el-input placeholder="请输入商品编号/商品名" icon="search" v-model="keywords" @keyup.enter.native="handleIconClick" :on-icon-click="handleIconClick" style="width:320px;"></el-input>
        </div>

        <el-table :data="tableData3" height="550" class="goodsList widthFull" v-loading="isLoading">
            <el-table-column label="商品名" width="120">
                <template slot-scope="scope">
                    <img class="pic" :src="checkPic(scope.row)" />
                </template>
            </el-table-column>
            <el-table-column label="" width="220">
                <template slot-scope="scope">
                    <div>{{scope.row.spuCode}}</div>
                    <div>{{scope.row.spuName}}</div>
                    <div class="displayDesc" :title="scope.row.displayDesc">{{scope.row.displayDesc}}</div>
                    <div class="otherField">
                        <el-popover ref="popover1" placement="bottom-start" width="200" trigger="hover">
                            <ul>
                                <li>单箱毛重：{{scope.row.unitGW&&scope.row.unitGW!=''?parseFloat(scope.row.unitGW).toFixed(2) + 'kg':'无'}}</li>
                                <li>单箱体积：{{scope.row.unitVol&&scope.row.unitVol!=''?parseFloat(scope.row.unitVol).toFixed(2) + 'm³':'无'}}</li>
                                <li>单箱数量：{{scope.row.unitQty&&scope.row.unitQty!=''?parseInt(scope.row.unitQty) + '件':'无'}}</li>
                                <li>40尺高柜数量：{{scope.row.cont40LR&&scope.row.cont40LR!=''?parseInt(scope.row.cont40LR) + '个':'无'}}</li>
                            </ul>
                        </el-popover>
                        <i class="iconfont icon-goods text-hover" style="font-size:16px;" v-popover:popover1></i>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="标准售价" width="130" align="center">
                <template slot-scope="scope">
                    {{scope.row.salePrice && scope.row.salePrice != '' ? returnCurrency(scope.row.saleCur)+ Number(scope.row.salePrice).toFixed(2) : ''}}
                </template>
            </el-table-column>
            <el-table-column label="计量单位" width="130" align="center">
                <template slot-scope="scope">
                    {{scope.row.unit ? returnUnit(scope.row.unit) : ''}}
                </template>
            </el-table-column>
            <el-table-column label="创建时间" align="center">
                <template slot-scope="scope">
                    {{timeShow_custom(scope.row.createDate, 'YYYY-MM-DD HH:MM')}}
                </template>
            </el-table-column>

            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="danger" size="mini" @click="removeThis(scope.row)">移除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="text-center" style="margin-top:10px;">
            <el-pagination @size-change="eachNumChange" @current-change="currentPageChange" :current-page="paging.currentPage" :page-sizes="paging.arrEachNum" :page-size="paging.eachNum" layout="total, sizes, prev, pager, next, jumper" :total="paging.total">
            </el-pagination>
        </div>
        <div class="text-right" style="margin-top:10px;">
            <!-- <el-button type="primary" @click="isOpen = false">确定</el-button> -->
            <!-- <el-button @click="isOpen = false">取消</el-button> -->
        </div>

    </el-dialog>
</template>

<script>
export default {
    name: 'goosView',
    props: {},
    data() {
        return {
            isLoading: false,
            isOpen: false,
            keywords: '',
            itemData: {},
            tableData3: [],
            paging: {
                from: 0, // 第几条开始
                total: 0, // 总条数
                currentPage: 1, // 默认当前第几页
                eachNum: 5, // 每页条数
                arrEachNum: [5, 50, 100, 150] // 可选的每页条数
            },
            unitList: [] // 计量单位
        }
    },
    created() { },
    methods: {
        returnUnit(unitId) {
            let name = ''
            this.unitList.forEach(item => {
                if (unitId == item.unitId) {
                    name = item.name
                }
            })
            return name
        },
        checkPic(item) {
            // console.log(item)
            let imgId
            if (!item.imagesId || item.imagesId.length === 0) {
                return '/static/images/goods/noImg.jpg'
            } else {
                imgId = item.imagesId[0] // 取第一个数组项为默认头像
                return this.getGlobalImgSrc(imgId, '55x55')
            }
        },
        // 每页条数
        eachNumChange(val) {
            this.paging.eachNum = val
            this.getList()
        },
        // 当前第几页
        currentPageChange(val) {
            this.paging.currentPage = val
            this.paging.from = this.paging.eachNum * (val - 1)
            this.getList()
        },
        handleIconClick(ev) {
            // console.log(this.keywords)
            this.getList()
        },
        // 重置表单
        resetForm() {
            this.keywords = ''
            this.tableData3 = []
            this.paging.from = 0
            this.paging.currentPage = 1
        },
        open(item) {
            // console.log(item)
            this.itemData = item
            this.isOpen = true
            this.getList()
        },
        // 获取所有计量单位
        getUn() {
            let _this = this
            _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.dictionary + 'unit').then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    _this.unitList = res.body.data
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
            })
        },
        // 获取所有计量单位
        getUn2() {
            let _this = this
            _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.dictionary + 'currency').then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    _this.currencyList = res.body.data
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
            })
        },
        returnCurrency(currencyCode) {
            let symbol = ''
            this.currencyList.forEach(item => {
                if (currencyCode == item.currencyCode) {
                    symbol = item.symbol
                }
            })
            return symbol
        },
        getList() {
            if (!this.itemData.groupId) { return }
            this.getUn() // 获取所有计量单位
            this.getUn2() // 获取所有计量单位
            this.isLoading = true
            let data = {
                moduleCode: 'PP001',
                searchType: 'list',
                from: this.paging.from,
                size: this.paging.eachNum,
                sort: 'createDate',
                group: this.itemData.groupId
                // offFlag: '0'
            }
            if (this.keywords != '') {
                data.keywords = this.keywords
            }
            this.$http.get(this.Global.baseURL + this.Global.api.v2.document_product, { params: data }).then(res => {
                if (res.body.code.toString() == this.Global.RES_OK) {
                    // console.log(res.body.data)
                    this.isLoading = false
                    this.tableData3 = res.body.data.list
                    this.paging.total = res.body.data.totalNum
                } else {
                    this.$message.error(this.msg(res.body))
                }
            }, res => {
                this.$message.error(this.$t(this.Global.errorTitle))
            })
        },
        removeThis(item) {
            // console.log(item)
            let data = {
                optCode: 'outGroup',
                group: this.itemData.groupId,
                optModuleCode: 'PP001',
                targets: item.spuId
            }
            this.$http.put(this.Global.baseURL + this.Global.api.v2.document_operate_listOpt_put, data).then(res => {
                if (res.body.code.toString() == this.Global.RES_OK) {
                    this.$message.success(this.$t('mxpcweb.g.1539654736016')) // 移除成功
                    // this.isOpen = false
                    this.getList()
                } else {
                    this.$message.error(this.msg(res.body))
                }
            }, res => {
                this.$message.error(this.$t(this.Global.errorTitle))
            })
        }
    }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
