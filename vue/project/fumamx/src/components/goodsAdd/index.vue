<template>
    <el-dialog v-dialogDrag :title="itemData.groupName||title" :visible.sync="isOpen" custom-class="width920" :close-on-click-modal="false" @close="resetForm()" :modal-append-to-body="false" top="10%">
        <div class="text-right" style="margin:-15px 0 10px;">
            <el-input placeholder="请输入商品编号/商品名" icon="search" v-model="keywords" @keyup.enter.native="handleIconClick" :on-icon-click="handleIconClick" style="width:320px;"></el-input>
        </div>

        <el-table :data="tableData3" height="550" ref="multipleTable" @selection-change="handleSelectionChange" class="goodsList widthFull" v-loading="isLoading">
            <el-table-column type="selection" width="45"></el-table-column>
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
                    {{scope.row.salePrice && scope.row.salePrice != '' ? returnCurrency(scope.row.saleCur) + Number(scope.row.salePrice).toFixed(2) : ''}}
                </template>
            </el-table-column>
            <el-table-column label="计量单位" width="130" align="center">
                <template slot-scope="scope">
                    {{scope.row.unit ? returnUnit(scope.row.unit) : ''}}
                </template>
            </el-table-column>
            <el-table-column label="创建时间" align="center">
                <template slot-scope="scope">
                    {{scope.row.createDate}}
                    <!-- {{timeShow_custom(scope.row.createDate, 'YYYY-MM-DD HH:MM')}} -->
                </template>
            </el-table-column>
        </el-table>

        <div class="text-center" style="margin-top:10px;">
            <el-pagination @size-change="eachNumChange" @current-change="currentPageChange" :current-page="paging.currentPage" :page-sizes="paging.arrEachNum" :page-size="paging.eachNum" layout="total, sizes, prev, pager, next, jumper" :total="paging.total">
            </el-pagination>
        </div>
        <div class="text-right" style="margin-top:10px;">
            <el-button type="primary" @click="submitForm()">确定</el-button>
            <el-button @click="isOpen = false">取消</el-button>
        </div>

    </el-dialog>
</template>

<script>
export default {
    name: 'goodsAdd',
    props: {
        title: {
            type: String,
            default: ''
        },
        selOne: {
            type: Boolean,
            default: false
        },
        selData: {
            type: Array,
            default: () => []
        },
        isReturnData: {
            type: Boolean,
            default: false
        },
        isMail: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            isLoading: false,
            isOpen: false,
            // isOpen: true,
            keywords: '',
            itemData: {},
            multipleSelection: [],
            tableData3: [],
            paging: {
                from: 0, // 第几条开始
                total: 0, // 总条数
                currentPage: 1, // 默认当前第几页
                eachNum: 5, // 每页条数
                arrEachNum: [5, 50, 100, 150] // 可选的每页条数
            },
            currencyList: []
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
                return this.getGlobalImgSrc(imgId, '200x200')
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
        submitForm() {
            // console.log(this.multipleSelection)
            // 有选择才往下进行
            if (this.multipleSelection.length === 0) {
                this.$message('请选择商品') // 请选择商品
                return
            }
            if (this.isMail) { // 写邮件
                this.isOpen = false
                this.$emit('goodsAddChange', this.multipleSelection)
                return
            }
            if (this.isReturnData) {
                if (this.selOne && this.multipleSelection.length > 1) {
                    this.$message.error('只能选取单个')
                    return
                }
                this.$emit('add', this.multipleSelection, this.currencyList)
                this.isOpen = false
                return
            }
            let selectArr = this.multipleSelection.map(item => {
                return item.spuId
            })

            // console.log(selectArr)
            let data = {
                optCode: 'inGroup',
                group: this.itemData.groupId,
                optModuleCode: 'PP001',
                targets: selectArr.join(',')
            }
            this.$http.put(this.Global.baseURL + this.Global.api.v2.document_operate_listOpt_put, data).then(res => {
                if (res.body.code.toString() == this.Global.RES_OK) {
                    this.$message.success(this.$t('mxpcweb.document.global.1529397938602')) // 添加成功
                    this.isOpen = false
                } else {
                    this.$message.error(this.msg(res.body))
                }
            }, res => {
                this.$message.error(this.$t(this.Global.errorTitle))
            })
        },
        handleIconClick(ev) {
            // console.log(this.keywords)
            this.getList()
        },
        // 重置表单
        resetForm() {
            this.keywords = ''
            this.tableData3 = []
            this.multipleSelection = []
            this.paging.from = 0
            this.paging.currentPage = 1
        },
        // 父来调打开
        open(itemObj = {}) {
            // console.log(item)
            if (itemObj) {
                this.itemData = itemObj
            }
            this.isOpen = true
            this.getList()
        },
        toggleSelection(rows) {
            if (rows) {
                rows.forEach(row => {
                    this.$refs.multipleTable.toggleRowSelection(row)
                })
            } else {
                this.$refs.multipleTable.clearSelection()
            }
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
            this.getUn() // 获取所有计量单位
            this.getUn2() // 获取所有计量单位
            this.isLoading = true
            let data = {
                moduleCode: 'PP001',
                searchType: 'list',
                from: this.paging.from,
                size: this.paging.eachNum,
                sort: 'createDate',
                offFlag: '0'
            }
            // console.log(data)
            if (this.keywords != '') {
                data.keywords = this.keywords
            }
            // return
            this.$http.get(this.Global.baseURL + this.Global.api.v2.document_product, { params: data }).then(res => {
                if (res.body.code.toString() == this.Global.RES_OK) {
                    this.isLoading = false
                    // console.log(res.body.data)
                    this.tableData3 = res.body.data.list
                    this.paging.total = res.body.data.totalNum
                    if (res.body.data.list.length > 0) {
                        if (this.isReturnData) {
                            let selected = []
                            this.selData.forEach(item => {
                                this.tableData3.forEach(item2 => {
                                    if (item2.spuId == item.spuId) {
                                        selected.push(item2)
                                    }
                                })
                            })
                            this.$nextTick(() => {
                                this.toggleSelection(selected)
                            })
                        } else {
                            this.toSelectedArr() // 当前页有数据，去查给选中
                        }
                    }
                } else {
                    this.$message.error(res.body.msg)
                    // this.$message.error(this.msg(res.body))
                }
            }, res => {
                this.$message.error(this.$t(this.Global.errorTitle))
            })
        },
        // 查给选中
        toSelectedArr() {
            let data = {
                moduleCode: 'PP001',
                searchType: 'list',
                group: this.itemData.groupId
            }
            this.$http.get(this.Global.baseURL + this.Global.api.v2.document_product, { params: data }).then(res => {
                if (res.body.code.toString() == this.Global.RES_OK) {
                    if (res.body.data.list && res.body.data.list.length > 0) {
                        let selected = []
                        res.body.data.list.forEach(item => {
                            this.tableData3.forEach(item2 => {
                                if (item2.spuId == item.spuId) {
                                    selected.push(item2)
                                }
                            })
                        })
                        this.toggleSelection(selected)
                    }
                } else {
                    this.$message.error(this.msg(res.body))
                }
            }, res => {
                this.$message.error(this.$t(this.Global.errorTitle))
            })
        },
        handleSelectionChange(val) {
            this.multipleSelection = val
        }
    }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
