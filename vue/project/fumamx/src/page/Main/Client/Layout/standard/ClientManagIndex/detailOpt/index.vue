<template>
    <div class="detailOpt" :class="[isHidden?'hidden':'']" v-if="detailOptData != []">
        <!-- 取消 -->
        <!-- 关注 -->
        <template v-for="(item,index) in detailOptData">
            <span :class="styleType=='mini'?'iBoxMini':' iBox'"  :key="index" :title="item.optCode!='otFocus'?item.optName:(isFocusBill(itemData.focusTargets)?$t('mxpcweb.client.1529047588840')+(useType == 'customer'?$t('mxpcweb.client.1529047620343'):item.optName):(useType == 'customer'?$t('mxpcweb.client.1529047620343'):item.optName))" @click="optClick(item)" v-if="index<4">
                <template v-if="item.optCode=='otFocus'">
                    <i class="iconfont" :class="item.iconURI || 'icon-dot'" :style="'font-size:' + fontSize"></i>
                </template>
                <i v-else class="iconfont" :class="item.iconURI || 'icon-dot'" :style="'font-size:' + fontSize"></i>
            </span>
        </template>
        <el-dropdown @command="optClick"  trigger="click"  v-if="detailOptData.length>4">
            <!-- 更多 -->
            <span class="el-dropdown-link text-hover" :class="styleType=='mini'?'iBoxMini':'iBox'" style="margin-left:-4px;margin-right:8px;position: relative;top: 1px;" :title="$t('mxpcweb.client.1529047657887')">
                <i class="iconfont icon-kehubankuaiyoushangfang-gengduo" :style="'font-size:' + fontSize"></i>
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
            default: function() {
                return {}
            }
        },
        isHidden: {
            type: Boolean,
            default: false
        },
        detailOptData: {
            type: Array,
            default: function() {
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
            default: function() {
                return []
            }
        },
        fontSize: {
            type: String,
            default: ''
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
                next: function() {
                    _this.$emit('getListData')
                }
            }
            if (item.optCode == 'otAddAttach') {
                _this.addAttach(obj)
                return false
            }
            ep.emit('setGlobalLoading', {
                val: true,
                // 权限校验中...
                text: this.$t('mxpcweb.client.list.1550126019122') + '...'
            })
            _this.$http.get(this.Global.baseURL + this.Global.api.v2.document_rightCheck_do, { params: {
                moduleCode: _this.moduleCode,
                identFieldValue: _this.itemData[_this.moduleStructId],
                optCode: item.optCode
            } }).then((res) => {
                ep.emit('setGlobalLoading', {
                    val: false,
                    text: ''
                })
                _this.$nextTick(() => {
                    if (res.body.code.toString() == _this.Global.RES_OK) {
                        ep.emit('optClick', obj)
                    } else {
                        _this.$message.error(_this.msg(res.body))
                    }
                })
            }, (res) => {
                ep.emit('setGlobalLoading', {
                    val: false,
                    text: ''
                })
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
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
        width:24px;
        height:24px;
        line-height: 24px;
        text-align: center;
        vertical-align: top;
        i{
            font-size: 20px;
            color: #606266;
        }
        &:hover {
            cursor: pointer;
            i{
                color:#E6001F;
            }
        }
    }
    .iBoxMini {
        margin-right: 6px;
        display: inline-block;
        width:20px;
        height:20px;
        line-height: 20px;
        text-align: center;
        i{
            color: #606266;
            font-size: 16px;
        }
        &:hover {
            cursor: pointer;
            i{
                color:#D0021B;
            }
        }
    }
}
</style>
