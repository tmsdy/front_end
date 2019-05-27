<template>
    <div class="footControl">
        <transition name="el-zoom-in-bottom">
            <!--<div class="footControlBox transition-box">-->
            <div class="footControlBox transition-box" v-show="controlData.checkedCities.length!==0">
                <span class="footControls text-hover checkbox">
                    <el-checkbox size="small"  :indeterminate="controlData.isIndeterminate" v-model="controlData.checkAll" @change="handleCheckAllChange"></el-checkbox>
                </span>
                <template v-if="listOpt.length>5">
                    <span v-for="(list,indexs) in listOpt.slice(0,4)" :key="indexs" class="footControls text-hover"  @click="listSetCommand(list)">
                        <span class="footControlsIcon">
                            <i class="iconfont" :class="list.iconURI"></i>
                        </span>
                        <div class="title">
                            <!-- 取消 -->
                            {{(list.optCode=='otFocus'&&viewType=="focus")?$t('mxpcweb.client.1529047588840')+list.optName:list.optName}}
                        </div>
                    </span>
                    <span class="footControls">
                        <el-dropdown trigger="click" @command="listSetCommand">
                            <span class="el-dropdown-link text-hover">
                                <span class="footControlsIcon">
                                    <i class="iconfont icon-more"></i>
                                </span>
                                <div class="title" style="font-size:12px;">
                                    <!-- 更多 -->
                                    {{$t('mxpcweb.client.1529047657887')}}
                                </div>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item  v-for="(list,indexs) in listOpt.slice(4)" :key="indexs" :command="list">{{list.optName}}</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </span>
                </template>
                <template v-else>
                    <span v-for="(list,indexs) in listOpt" :key="indexs" class="footControls text-hover"  @click="listSetCommand(list)">
                        <span class="footControlsIcon">
                            <i class="iconfont" :class="list.iconURI"></i>
                        </span>
                        <div class="title">
                            <!-- 取消 -->
                            {{(list.optCode=='otFocus'&&viewType=="focus")?$t('mxpcweb.client.1529047588840')+list.optName:list.optName}}
                        </div>
                    </span>
                </template>
                <span class="footControls footControlHide text-hover">
                    <span class="footControlsIcon1" @click="controlData.checkedCities = []">
                        <i class="iconfont icon-close" style="font-size:14px"></i>
                    </span>
                </span>
            </div>
        </transition>
        <div class="batchLoading" style="position: fixed;z-index:10" v-if="loading">
            <!-- 操作进行中...请稍等片刻 -->
            <div v-loading="true"  :element-loading-text="$t('mxpcweb.components.1534316960886')"></div>
        </div>
    </div>
</template>
<script>
/**
 * 描述：客户管理-客户列表-编辑客户
 * 作者：何俊峰
 * 时间：2017/11/22
 */
export default {
    name: 'footControl',
    props: {
        controlData: {
            type: Object,
            default: function() {
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
            default: function() {
                return []
            }
        },
        editSet: {
            type: Array,
            default: function() {
                return []
            }
        },
        moduleCode: {
            type: String,
            default: ''
        },
        listOpt: {
            type: Array,
            default: function() {
                return []
            }
        },
        naxtArgument: {
            type: Object,
            default: function() {
                return {
                }
            }
        },
        moduleStruct: {
            type: Object,
            default: function() {
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
            if (obj.optData.optCode == 'otFocus' && _this.viewType == 'focus') {
                obj.type = '2'
            }
            if (obj.optData.optCode == 'otListSetting') {
                obj.next = _this.getListSet
            } else {
                obj.next = _this.getListData
            }
            ep.emit('optClick', obj)
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
            let _this = this
            let num = []
            this.customerLists.forEach(function(item, indexs) {
                num.push(item[_this.moduleStruct.identField])
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
