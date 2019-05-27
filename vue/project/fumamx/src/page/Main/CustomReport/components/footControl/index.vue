<template>
    <div class="footControl">
        <transition name="el-zoom-in-bottom">
            <div class="footControlBox transition-box" v-show="controlData.checkedCities.length!==0">
                <span class="footControls text-hover" style="padding-left:25px;">
                    <el-checkbox size="small" :indeterminate="controlData.isIndeterminate" v-model="controlData.checkAll" @change="handleCheckAllChange"></el-checkbox>
                </span>
                <span v-for="(list,indexs) in listOpt.slice(0,4)" :key="indexs" class="footControls text-hover" @click="listSetCommand(list)">
                    <span class="footControlsIcon">
                        <i class="iconfont" :class="list.iconURI"></i>
                    </span>
                    <!-- 取消 -->
                    {{(list.optCode=='otFocus'&&viewType=="focus")?$t('mxpcweb.client.1529047588840')+list.optName:list.optName}}
                </span>
                <span class="footControls" v-if="listOpt.length>4">
                    <el-dropdown trigger="click" @command="listSetCommand">
                        <span class="el-dropdown-link text-hover">
                            <span class="footControlsIcon">
                                <i class="iconfont icon-more"></i>
                            </span>
                            <!-- 更多 -->
                            {{$t('mxpcweb.client.1529047657887')}}
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item v-for="(list,indexs) in listOpt.slice(4)" :key="indexs" :command="list">{{list.optName}}</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </span>
                <span class="footControls footControlHide text-hover">
                    <span class="footControlsIcon1" @click="controlData.checkedCities = []">
                        <i class="iconfont icon-close" style="font-size:14px"></i>
                    </span>
                </span>
            </div>
        </transition>
        <div class="batchLoading" style="position: fixed;z-index:10" v-if="loading">
            <!-- 操作进行中...请稍等片刻 -->
            <div v-loading="true" :element-loading-text="$t('mxpcweb.components.1534316960886')"></div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'footControl',
    props: {
        controlData: {
            type: Object,
            default: function () {
                return {
                    // 底部操作
                    checkAll: false, // 列表全选状态弹框
                    isIndeterminate: false, //
                    checkedCities: []//
                }
            }
        },
        useType: {
            type: String,
            default: ''
        },
        customerLists: {
            type: Array,
            default: function () {
                return []
            }
        },
        editSet: {
            type: Array,
            default: function () {
                return []
            }
        },
        moduleCode: {
            type: String,
            default: ''
        },
        listOpt: {
            type: Array,
            default: function () {
                return []
            }
        },
        naxtArgument: {
            type: Object,
            default: function () {
                return {
                }
            }
        },
        moduleStruct: {
            type: Object,
            default: function () {
                return {}
            }
        }
    },
    data() {
        return {
            firstOpen: true,
            viewType: '',
            loading: false
        }
    },
    created() {
        this.viewType = this.getRoute().viewType
    },
    mounted() {
    },
    computed: {
    },
    methods: {
        listSetCommand(item) {
            let _this = this
            let obj = {
                optData: item,
                billId: _this.controlData.checkedCities,
                moduleCode: _this.moduleCode,
                type: '1',
                customerLists: this.customerLists,
                naxtArgument: this.naxtArgument
            }
            if (obj.optData.optCode == 'otDelete') {
                let textContent = '此操作将批量删除选中文件, 是否继续?'
                this.openDialog(textContent)
            }
            if (obj.optData.optCode == 'otFocus') {
                this.batchCollect() // 批量收藏
            }
            if (obj.optData.optCode == 'otRestore') {
                this.deleteList('otRestore') // 批量恢复
            }
            if (obj.optData.optCode == 'otPerDelete') {
                let text = '此操作将永久删除选中文件, 是否继续?'
                this.$confirm(text, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.permanDel() // 批量恢复
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
            }
        },
        deleteList(x) {
            let _this = this
            let delArr = this.controlData.checkedCities
            let batchArr = []
            delArr.forEach(item => {
                let index = item.indexOf('_')
                let str = item.slice(index + 1, item.length)
                batchArr.push(str)
            })
            this.startLoad()
            this.$http.put(this.Global.baseURL + this.Global.api.v1.createReport, { reportId: batchArr, optCode: x })
                .then(res => {
                    _this.endLoad()
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        _this.$message.success(_this.msg(res.body))
                        _this.$emit('getListReport') // 刷新报表列表
                        _this.$emit('clearChecked') // 清空已选择项目
                        _this.getListData()
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                },
                    res => {
                        this.$emit('iconLoading', false)
                        this.$message.error(this.$t(this.Global.errorTitle))
                    }
                )
        },
        batchCollect() {
            let _this = this
            let batchArr = this.controlData.checkedCities
            let batchCollectObj = {}
            batchArr.forEach(item => {
                let index = item.indexOf('_')
                let value = item.slice(0, index)
                let key = item.slice(index + 1, item.length)
                batchCollectObj[key] = parseInt(value)
            })
            this.startLoad()
            this.$http.post(this.Global.baseURL + this.Global.api.v1.batchCollect, { reportMap: batchCollectObj })
                .then(res => {
                    _this.endLoad()
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        _this.$message.success(_this.msg(res.body))
                        _this.$emit('getListReport') // 刷新报表列表
                        _this.$emit('clearChecked') // 清空已选择项目
                        _this.getListData()
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                },
                    res => {
                        this.$emit('iconLoading', false)
                        this.$message.error(this.$t(this.Global.errorTitle))
                    }
                )
        },
        permanDel() { // 永久删除
            let _this = this
            let delArr = this.controlData.checkedCities
            let batchArr = []
            delArr.forEach(item => {
                let index = item.indexOf('_')
                let str = item.slice(index + 1, item.length)
                batchArr.push(str)
            })
            this.startLoad()
            this.$http.delete(this.Global.baseURL + this.Global.api.v1.createReport, { params: { reportId: batchArr } })
                .then(res => {
                    _this.endLoad()
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        _this.$message.success(_this.msg(res.body))
                        _this.$emit('getListReport') // 刷新报表列表
                        _this.$emit('clearChecked') // 清空已选择项目
                        _this.getListData()
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                },
                    res => {
                        this.$emit('iconLoading', false)
                        this.$message.error(this.$t(this.Global.errorTitle))
                    }
                )
        },
        openDialog(text) {
            this.$confirm(text, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deleteList('otDelete') // 批量放入回收站
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                })
            })
        },
        startLoad() { // 开始loading
            this.loading = true
        },
        endLoad() { // 结束loading
            this.loading = false
        },
        clearSelect() {
            this.controlData.checkedCities = []
        },
        getListSet() {
            this.$emit('getListSet')
        },
        getListData() {
            this.clearSelect()
            this.$emit('getListData')
        },
        // 返回全选列表
        returnLists() {
            // let _this = this
            let num = []
            this.customerLists.forEach(function (item, indexs) {
                // num.push(item[_this.moduleStruct.identField])
                num.push(item.reportFolderId + '_' + item.reportId)
            })
            return num
        },
        // 底部菜单栏操作
        // 全选、反选
        handleCheckAllChange(event) {
            let _this = this
            _this.controlData.checkedCities = event.target.checked ? _this.returnLists() : []
            _this.controlData.isIndeterminate = false
        }
    },
    watch: {

    },
    components: {
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
