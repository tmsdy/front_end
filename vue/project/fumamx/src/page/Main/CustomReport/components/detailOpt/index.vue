<template>
    <div class="detailOpt" :class="[isHidden?'hidden':'']" v-if="detailOptData != []">
        <!-- 取消 -->
        <!-- 关注 -->
        <template v-for="(item,index) in detailOptData">
            <span :class="styleType=='mini'?'iBoxMini':' iBox'" :key="index" :title="item.optCode=='otFocus' && itemData.collect ? '取消收藏':item.optName" @click="optClick(item)" v-if="index<4">
                <template v-if="item.optCode=='otFocus'">
                    <i class="iconfont" :class="item.iconURI || 'icon-dot'"></i>
                </template>
                <i v-else class="iconfont" :class="item.iconURI || 'icon-dot'"></i>
            </span>
        </template>
        <el-dropdown @command="optClick" trigger="click" v-if="detailOptData.length>3">
            <!-- 更多 -->
            <span class="el-dropdown-link text-hover" :class="styleType=='mini'?'iBoxMini':'iBox'" style="margin-left:-4px;margin-right:8px;position: relative;top: 1px;" :title="$t('mxpcweb.client.1529047657887')">
                <i class="iconfont icon-more"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
                <template v-for="(item,index) in detailOptData">
                    <el-dropdown-item :key="index" :command="item" v-if="index>3">
                        <!-- 取消 -->
                        <!-- 关注 -->
                        {{item.optCode!='otFocus'?item.optName:(isFocusBill(itemData.focusTargets)?$t('mxpcweb.client.1529047588840')+(useType == 'customer'?$t('mxpcweb.client.1529047620343'):item.optName):(useType == 'customer'?$t('mxpcweb.client.1529047620343'):item.optName))}}
                    </el-dropdown-item>
                    <!-- <li class="el-dropdown-menu__item" :key="index" v-if="index>3&&item.optCode=='otAddAttach'" style="width:100%;height:100%" @click="otAddAttach(item.optCode)">{{item.optName}}</li> -->
                </template>
            </el-dropdown-menu>
        </el-dropdown>
    </div>
</template>
<script>
export default {
    name: 'detailOpt',
    props: {
        itemData: {
            type: Object,
            default: function () {
                return {}
            }
        },
        isHidden: {
            type: Boolean,
            default: false
        },
        detailOptData: {
            type: Array,
            default: function () {
                return []
            }
        },
        moduleStructName: {
            type: String,
            default: ''
        },
        moduleStructId: {
            type: String,
            default: ''
        },
        moduleCode: {
            type: String,
            default: ''
        },
        useType: {
            type: String,
            default: ''
        },
        styleType: {
            type: String,
            default: 'small'
        },
        owners: {
            type: Array,
            default: function () {
                return []
            }
        }
    },
    data() {
        return {
            dialogSetScreen: false
        }
    },
    created() {
    },
    mounted() {
    },
    methods: {
        optClick(item) {
            let _this = this
            let obj = {
                optData: item,
                itemData: _this.itemData,
                billId: _this.itemData[_this.moduleStructId],
                billName: _this.itemData[_this.moduleStructName],
                moduleCode: _this.moduleCode,
                next: function () {
                    _this.$emit('getListData')
                }
            }
            if (item.optCode == 'otAddAttach') {
                _this.addAttach(obj)
                return false
            }
            // ep.emit('setGlobalLoading', {
            //     val: true,
            //     text: '权限校验中...'
            // })
            // 收藏
            if (item.optCode == 'otFocus' && !this.itemData.collect) {
                this.collectList()
            } else if (item.optCode == 'otFocus' && this.itemData.collect) {
                this.deleteCollect()
            }
            if (item.optCode == 'otDelete') {
                this.deleteList('otDelete')
            }
            if (item.optCode == 'otEdit') {
                this.$router.push({ path: '/main/customReport/create', query: { reportId: this.itemData.reportId } })
            }
            if (item.optCode == 'otPerDelete') { // 彻底删除
                this.permanDel()
            }
            if (item.optCode == 'otRestore') { // 恢复
                this.deleteList('otRestore')
            }
        },
        addAttach(obj) {
            let { optData, billId } = obj
            let { optModuleCode } = optData
            let _this = this
            let data = {
                url: _this.Global.api.v2.folders_files, // api（必传）
                fileSource: 3,
                billId: billId,
                custId: billId,
                remarks: '',
                moduleCode: optModuleCode,
                fn(res) {
                    _this.$emit('getListData', true)
                }
            }
            ep.emit('selectFile', data)// 相当于触发标记
        },
        collectList() {
            let _this = this
            this.$emit('iconLoading', true)
            this.$http.post(this.Global.baseURL + this.Global.api.v1.reportCollect, {
                reportId: _this.itemData.reportId,
                type: 'collect'
            })
                .then(res => {
                    this.$emit('iconLoading', false)
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        _this.$message.success(_this.msg(res.body))
                        _this.$emit('getListReport') // 刷新报表列表
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
        permanDel() {
            let _this = this
            let delArr = [_this.itemData.reportId]
            this.$emit('iconLoading', true)
            this.$http.delete(this.Global.baseURL + this.Global.api.v1.createReport, { params: { reportId: delArr } })
                .then(res => {
                    this.$emit('iconLoading', false)
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        _this.$message.success(_this.msg(res.body))
                        _this.$emit('getListReport') // 刷新报表列表
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
        deleteCollect() {
            let _this = this
            this.$emit('iconLoading', true)
            this.$http.delete(this.Global.baseURL + this.Global.api.v1.reportCollect, { params: { reportId: _this.itemData.reportId, type: 'collect' } })
                .then(res => {
                    this.$emit('iconLoading', false)
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        _this.$message.success(_this.msg(res.body))
                        _this.$emit('getListReport') // 刷新报表列表
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
        deleteList(x) {
            let _this = this
            let delArr = [_this.itemData.reportId]
            this.$emit('iconLoading', true)
            this.$http.put(this.Global.baseURL + this.Global.api.v1.createReport, { reportId: _this.itemData.reportId, reportId: delArr, optCode: x })
                .then(res => {
                    this.$emit('iconLoading', false)
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        _this.$message.success(_this.msg(res.body))
                        _this.$emit('getListReport') // 刷新报表列表
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                },
                    res => {
                        this.$emit('iconLoading', false)
                        this.$message.error(this.$t(this.Global.errorTitle))
                    }
                )
        }
    },
    components: {
    },
    beforeDestroy: function () {
        this.addAttach = null
        this.optClick = null
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.detailOpt {
    // border:1px solid red;
    text-align: right;
    padding-top: 8px;
    .iBox {
        margin-right: 10px;
        display: inline-block;
        width: 24px;
        height: 24px;
        background: linear-gradient(
            135deg,
            rgba(255, 105, 124, 1),
            rgba(208, 2, 27, 1)
        );
        border-radius: 12px;
        line-height: 24px;
        text-align: center;
        box-shadow: 0 3px 10px 0 rgba(208, 2, 27, 0.3);
        vertical-align: top;
        i {
            color: white;
            font-size: 12px;
        }
        &:hover {
            cursor: pointer;
            background: #e6001f;
            i {
                font-size: 14px;
            }
        }
    }
    .iBoxMini {
        margin-right: 6px;
        display: inline-block;
        width: 20px;
        height: 20px;
        background: linear-gradient(
            135deg,
            rgba(255, 105, 124, 1),
            rgba(208, 2, 27, 1)
        );
        border-radius: 10px;
        line-height: 20px;
        text-align: center;
        box-shadow: 0 3px 10px 0 rgba(208, 2, 27, 0.3);
        i {
            color: white;
            font-size: 12px;
        }
        &:hover {
            cursor: pointer;
            background: #e6001f;
        }
    }
}
</style>
