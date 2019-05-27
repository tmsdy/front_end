<template>
    <div class="rightTopControls"  :class="fastMenuShows?'fastBox':''" style="text-align:right">
        <span  v-for="(list,indexs) in fastOpt" :key="indexs" >
            <span class="rightTopControl hover" v-if="list.optCode == 'otQuery'" @click="$emit('dialogSeniorClick')">
                <el-tooltip :content="list.optName" placement="bottom" effect="light">
                    <i class="iconfont" :class="list.iconURI"></i>
                </el-tooltip>
            </span>
            <span class="rightTopControl hover" v-else-if="list.optCode == 'otSort'">
                <el-dropdown trigger="click" @command="sortListClick">
                    <span class="el-dropdown-link">
                        <el-tooltip :content="list.optName" placement="bottom" effect="light">
                            <i class="iconfont" :class="list.iconURI"></i>
                        </el-tooltip>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-for="(item,index) in sortSetList" :key="index" :command="index">
                            <div>
                                <span  v-if="item.selected"><i class="iconfont icon-correct" style="color:#D0021B"></i></span>
                                <span style="display: inline-block;width: 21px;line-height: 20px;" v-else></span>
                                {{item.cnFieldCaption}}
                            </div>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </span>
            <span class="rightTopControl hover"  v-else-if="list.optCode == 'otQuickQuery'" @click="$emit('fastMenuShow',true)">
                <el-tooltip :content="list.optName" placement="bottom" effect="light">
                    <i class="iconfont"  :class="list.iconURI"></i>
                </el-tooltip>
            </span>
            <span class="rightTopControl hover"  v-else @click="optClick(list)">
                <el-tooltip :content="list.optName" placement="bottom" effect="light">
                    <i class="iconfont"  :class="list.iconURI"></i>
                </el-tooltip>
            </span>
        </span>
    </div>
</template>
<script>
/**
 * 描述：客户管理-客户列表
 * 作者：何俊峰
 * 时间：2017/11/11
 */
export default {
    name: 'rightTopControls',
    props: {
        fastOpt: {// 获取空间操作按钮列表
            type: Array,
            default: function() {
                return []
            }
        },
        fastMenuShows: {
            type: Boolean,
            default: false
        },
        sortSet: {
            type: Array,
            default: function() {
                return []
            }
        }
    },
    data() {
        return {
            params: {},
            sortSetList: []
        }
    },
    created() {
    },
    mounted() {
        this.params.moduleCode = this.getRoute().moduleCode
        this.params.viewLayout = this.getRoute().viewLayout
        this.getSortSet()
    },
    computed: {
    },
    methods: {
        optClick(optData) {
            let _this = this
            ep.emit('setGlobalLoading', {
                val: true,
                // 权限校验中...
                text: this.$t('mxpcweb.client.list.1550126019122') + '...'
            })
            _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.document_rightCheck_do, { params: {
                moduleCode: _this.params.moduleCode,
                identFieldValue: 0,
                optCode: optData.optCode
            } }).then((res) => {
                ep.emit('setGlobalLoading', {
                    val: false,
                    text: ''
                })
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    let obj = {
                        optData: optData,
                        next: function() {
                            _this.$emit('getListData')
                        }
                    }
                    ep.emit('optClick', obj)
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
            }, (res) => {
                ep.emit('setGlobalLoading', {
                    val: false,
                    text: ''
                })
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },
        sortListClick(command) { // 排序方式
            this.sortSetList = this.sortListSelect(this.sortSetList, command)
        },
        sortListSelect(list, itemIndex, updata) {
            let _this = this
            list.forEach((elemennt, index) => {
                if (index == itemIndex) {
                    _this.$emit('update:nowSort', elemennt)
                    if (!updata) {
                        _this.$emit('getListData', false, false, elemennt.fieldName)
                    }
                    elemennt.selected = true
                } else {
                    elemennt.selected = false
                }
            })
            return list
        },
        getSortSet() { // 获取排序字段数据
            let _this = this
            _this.sortSet.forEach(function(item, index) {
                if (item.fieldName == (_this.params.viewLayout == 'classicSeasCustomer' ? 'inSeaDate' : 'createDate')) {
                    let sortSet = []
                    _this.sortSet.forEach(elemennt => {
                        sortSet.push({
                            cnFieldCaption: elemennt.cnFieldCaption,
                            selected: false,
                            fieldName: elemennt.fieldName
                        })
                    })
                    _this.sortSetList = []
                    _this.sortSetList = _this.sortListSelect(sortSet, index, true)
                }
            })
        }
    },
    watch: {
        sortSet(val) {
            this.getSortSet()
        }
    },
    components: {
    },
    beforeDestroy: function () {
        this.sortSetList = null
        this.getSortSet = null
        this.sortListSelect = null
        this.sortListClick = null
        this.optClick = null
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.fastBox{
    -webkit-filter: blur(2px);
    filter: blur(2px);
}
.rightTopControls{
    width:214px;
    height: 24px;
    position: absolute;
    top: 28px;
    right: 20px;
    text-align: right;
    .hover{
        cursor: pointer;
    }
    .rightTopControl{
        width:28px;
        height:28px;
        border-radius: 14px;
        display: inline-block;
        vertical-align: top;
        line-height: 28px;
        text-align: center;
        margin-right:10px;
        .iconfont{
            color: #606266;
            font-size: 24px;
        }
    }
    .rightTopControl:hover{
        .iconfont{
            color: #E6001F;
        }
    }
}
</style>
