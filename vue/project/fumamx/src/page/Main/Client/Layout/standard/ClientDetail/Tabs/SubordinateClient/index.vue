<template>
    <div class="SubordinateClient">
        <div class="customerListsBox">
            <loading v-if="isLoading" style="margin-top: 55px;"></loading>
            <no-data v-if="!isLoading && customerLists1.length==0" style="margin-top: 55px;"></no-data>
            <div v-if="customerLists1.length>0">
                <customer ref="customerList" :moduleCode="moduleCode" :isShowCheck="false" :dynamicTags="dynamicTags" @getListData="getListData" :blockData="blockData" :moduleStruct="moduleStruct" :listSet="listSet"></customer>
                <!--分页-->
                <list-page :style="setPagination" class="pagination" :blockData="blockData" @getListData="getListData"></list-page>
            </div>
        </div>
        <!-- 新增下级客户 -->
        <fly-button @flyBtnClick="otAddLowerCust" :fly="false" :title="$t('mxpcweb.client.detail.1530001097572')" :mainObj="mainObj"></fly-button>
    </div>
</template>
<script>
import NoData from '@/basecomponents/NoData/index'
import Loading from '@/basecomponents/Loading/index'
import customer from '../../../ClientManagIndex/customerLists/view/customer'
import listPage from '@/components/listPage/index'
import { mapGetters } from 'vuex'
import { isArray, isObject } from '@/libs/utils.js'
import FlyButton from '../../FlyButton/index.vue'
/**
 * 描述：客户详情-下级客户
 * 作者：何俊峰
 * 时间：2017/11/15
 */
export default {
    name: 'SubordinateClient',
    props: {
        windowMode: {
            type: Boolean,
            default: false
        },
        itemData: {
            type: Object,
            default: function () {
                return {}
            }
        },
        moduleCode: {
            type: String,
            default: ''
        },
        pageId: {
            type: String,
            default: ''
        },
        mainObj: {
            type: Object,
            default: function () {
                return {}
            }
        }
    },
    data() {
        return {
            isLoading: true,
            listSet: {
                listSetAllow: [],
                listSet: []
            },

            moduleStruct: {},
            dynamicTags: [], // 标签
            customerLists1: [],
            // 分页操作
            blockData: {
                pageSize: 10,
                total: 0,
                fromNum: 0
            }
        }
    },
    mounted() {
        // this.getTabData()
    },
    computed: {
        setPagination() {
            return this.windowMode ? 'left:auto;width:800px;' : ''
        },
        ...mapGetters([
            'individualConfigInfo'
        ])
    },
    methods: {
        otAddLowerCust() {
            let obj = {
                optData: {
                    optCode: 'otAddLowerCust',
                    optModuleCode: this.moduleCode
                },
                itemData: this.mainObj,
                billId: this.pageId,
                moduleCode: this.moduleCode,
                next: () => {
                    this.getTabData() // update
                }
            }
            // console.log(obj)
            ep.emit('optClick', obj)
        },
        // 转化结构字段数据
        swidchListSet(list) {
            let newLList = []
            list.forEach((element) => {
                if (element.fieldCategory == 2) {
                    newLList.push(element)
                }
            })
            return newLList
        },
        // 获取模块结构
        getTabData() {
            if (this.isLoading) {
                this.unit()
            } else {
                this.getListData()
            }
        },
        unit() {
            let _this = this
            var p1 = new Promise((resolve, reject) => {
                let argument = {
                    moduleCode: 'BF001',
                    searchType: 'lowLevelList',
                    order: 'desc',
                    sort: 'createDate',
                    parCustId: _this.pageId,
                    from: _this.blockData.fromNum,
                    size: _this.blockData.pageSize
                }
                _this.$http.get(this.Global.baseURL + this.Global.api.v2.document_generalOperate_get, { params: argument }).then(function (res) {
                    if (res.body.code.toString() == _this.Global.RES_OK && isObject(res.body.data)) {
                        resolve(res.body.data)
                    } else {
                        _this.isLoading = false
                        _this.$message.error(_this.msg(res.body))
                    }
                }, function (res) {
                    _this.isLoading = false
                    _this.$message.error(_this.$t(_this.Global.errorTitle))
                })
            })
            var p2 = new Promise((resolve, reject) => {
                _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.label_get, { params: { searchType: 'list', moduleCode: _this.moduleCode } }).then(function (res) {
                    if (res.body.code.toString() == _this.Global.RES_OK && isArray(res.body.data)) {
                        resolve(res.body.data)
                    } else {
                        _this.isLoading = false
                        _this.$message.error(_this.msg(res.body))
                    }
                }, function (res) {
                    _this.isLoading = false
                    _this.$message.error(_this.$t(_this.Global.errorTitle))
                })
            })
            var p3 = new Promise((resolve, reject) => {
                _this.$http.get(this.Global.baseURL + this.Global.api.v2.moduleStruct + _this.moduleCode, { params: {} }).then(function (res) {
                    if (res.body.code.toString() == _this.Global.RES_OK && isObject(res.body.data)) {
                        resolve(res.body.data)
                    } else {
                        _this.isLoading = false
                    }
                }, function (res) {
                    _this.isLoading = false
                    _this.$message.error(_this.$t(_this.Global.errorTitle))
                })
            })
            var p4 = new Promise((resolve, reject) => {
                _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.fieldShow_get, { params: {
                    moduleCode: _this.moduleCode,
                    type: 'listSet'
                } }).then(function (res) {
                    if (res.body.code.toString() == _this.Global.RES_OK && isArray(res.body.data)) {
                        resolve(res.body.data)
                    } else {
                        _this.isLoading = false
                        _this.$message.error(_this.msg(res.body))
                    }
                }, function (res) {
                    _this.isLoading = false
                    _this.$message.error(_this.$t(_this.Global.errorTitle))
                })
            })
            Promise.all([p1, p2, p3, p4]).then(function(results) {
                _this.dynamicTags = results[1]
                _this.moduleStruct = results[2]
                _this.listSet = _this.upListSet(results[3])
                if (results[0].list) {
                    _this.customerLists1 = results[0].list
                    _this.totalNum = results[0].totalNum
                    setTimeout(function () {
                        if (_this.$refs.customerList) {
                            if (_this.$refs.customerList.switchList) {
                                _this.$refs.customerList.switchList(_this.customerLists1, 'createDate', true, true)
                                _this.blockData.total = _this.totalNum
                            }
                        }
                    }, 10)
                } else {
                    _this.customerLists1 = []
                }
                _this.isLoading = false
            })
        },
        upListSet (list) {
            let allColumnWidth = 0
            list.forEach(function(item) {
                if (item.controlTypeId == 2) {
                    item.code = -1
                }
                allColumnWidth += parseInt(item.columnWidth)
            })
            return {
                listSet: list,
                listSetAllow: list,
                allColumnWidth: allColumnWidth
            }
        },
        // 列表
        getListData() { // 获取列表数据
            let _this = this
            var p1 = new Promise((resolve, reject) => {
                let argument = {
                    moduleCode: 'BF001',
                    searchType: 'lowLevelList',
                    order: 'desc',
                    sort: 'createDate',
                    parCustId: _this.pageId,
                    from: _this.blockData.fromNum,
                    size: _this.blockData.pageSize
                }
                _this.$http.get(this.Global.baseURL + this.Global.api.v2.document_generalOperate_get, { params: argument }).then(function (res) {
                    if (res.body.code.toString() == _this.Global.RES_OK && isObject(res.body.data)) {
                        resolve(res.body.data)
                    } else {
                        _this.$message.error(_this.msg(res.body))
                    }
                }, function (res) {
                    _this.$message.error(_this.$t(_this.Global.errorTitle))
                })
            })
            var p2 = new Promise((resolve, reject) => {
                _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.label_get, { params: { searchType: 'list', moduleCode: _this.moduleCode } }).then(function (res) {
                    if (res.body.code.toString() == _this.Global.RES_OK && isArray(res.body.data)) {
                        resolve(res.body.data)
                    } else {
                        _this.$message.error(_this.msg(res.body))
                    }
                }, function (res) {
                    _this.$message.error(_this.$t(_this.Global.errorTitle))
                })
            })
            Promise.all([p1, p2]).then(function(results) {
                _this.dynamicTags = results[1]
                if (results[0].list) {
                    _this.customerLists1 = results[0].list
                    _this.totalNum = results[0].totalNum
                    setTimeout(function () {
                        if (_this.$refs.customerList) {
                            if (_this.$refs.customerList.switchList) {
                                _this.$refs.customerList.switchList(_this.customerLists1, 'createDate', true, true)
                                _this.blockData.total = _this.totalNum
                            }
                        }
                    }, 10)
                } else {
                    _this.customerLists1 = []
                }
            })
        }
    },
    components: {
        'customer': customer,
        'no-data': NoData,
        'loading': Loading,
        'list-page': listPage,
        'fly-button': FlyButton
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
