<template>
<div class="screenMenus">
    <div class="ax_default text-hover" @click="setScreenMenu()">
        <!-- 筛选 -->
        {{$t('mxpcweb.client.1529049672082')}}
        <span>
            <i v-if="screenMenu" class="iconfont icon-arrow-up hover" style="font-size:12px"></i>
            <i v-else class="iconfont icon-arrow-down hover" style="font-size:12px"></i>
        </span>
    </div>
    <div class="screenMenuVertical MXscroll" v-show="screenMenu">
        <template v-for="(list,index) in searchSetRow">
            <div class="list" :key="index"  v-if="list.isTop==1" >
                <div class="fixedLeft">
                    <span class="labelName">{{list.cnFieldCaption}}</span>
                </div>
                <div class="fixedRight">
                    <search-labelsV :moduleCode="moduleCode"  ref="ver" :list="list" @change="change" :controlData.sync="list.controlData"></search-labelsV>
                </div>
            </div>
        </template>
        <div class="list" v-if="moduleCode=='BF001' || moduleCode=='BF003' || moduleCode=='SC002'">
            <div class="fixedLeft">
                <span class="labelName">{{tags.cnFieldCaption}}</span>
            </div>
            <div class="fixedRight">
                <search-labelsVTags :moduleCode="moduleCode" ref="verTags" :list="tags" @change="change" :controlData.sync="tags.controlData"></search-labelsVTags>
            </div>
        </div>
    </div>
     <div class="screenMenuRow" v-show="!screenMenu">
         <template v-for="(list,index) in searchSetRow">
            <div class="searchList" v-if="list.isTop==1" :key="index">
                <search-labels :moduleCode="moduleCode" dataId  ref="row" :list='list' @change="change"  :key="index"></search-labels>
            </div>
         </template>
    </div>
</div>
</template>
<script>
/**
 * 描述：客户管理-客户列表
 * 作者：何俊峰
 * 时间：2017/11/11
 */
import searchLabels from './Vue/searchLabels.vue'
import searchLabelsV from './Vue/searchLabelsV.vue'
import searchLabelsVTags from './Vue/searchLabelsVTags.vue'
export default {
    name: 'screenMenuRow',
    props: {
        searchSetRow: {
            type: Array,
            required: true
        },
        moduleCode: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            otherArgument: {},
            screenMenu: false,
            tags: {
                cnFieldCaption: this.$t('mxpcweb.client.detail.1529996301986'),
                cnFieldHint: '',
                columnWidth: 120,
                controlTypeId: 'tags',
                dictCode: 11673,
                editState: 1,
                fieldCategory: 3,
                fieldGroup: 0,
                fieldId: 68,
                fieldLength: 10,
                fieldName: 'tags',
                inDefaultValue: '',
                isNotNull: 0,
                moduleCode: 'BF001',
                parFilterField: '',
                stDefaultValue: '',
                strucId: 1,
                uniqueCheck: 0
            }
        }
    },
    created() {
    },
    mounted() {
    },
    computed: {
    },
    beforeDestroy: () => {
        this.change = null
        this.setScreenMenu = null
    },
    methods: {
        setScreenMenu() {
            this.screenMenu = !this.screenMenu
            this.$nextTick(() => {
                this.$emit('setHeights')
            })
        },
        change(newValue, type) {
            let next = (key) => {
                this.$emit('getListData', this.otherArgument)
                if (type == 'row') {
                    this.$refs['ver'].forEach((item, index) => {
                        item.updata(key)
                    })
                } else if (type == 'ver') {
                    this.$refs['row'].forEach((item, index) => {
                        item.updata(key)
                    })
                }
            }
            if (newValue.value === '' || newValue.value == undefined) {
                if (this.otherArgument[newValue.key]) {
                    delete this.otherArgument[newValue.key]
                    next(newValue.key)
                }
            } else {
                if (this.otherArgument[newValue.key]) {
                    if (this.otherArgument[newValue.key] != newValue.value) {
                        this.otherArgument[newValue.key] = newValue.value
                        next(newValue.key)
                    }
                } else {
                    this.otherArgument[newValue.key] = newValue.value
                    next(newValue.key)
                }
            }
        }
    },
    watch: {
    },
    components: {
        'search-labelsV': searchLabelsV,
        'search-labelsVTags': searchLabelsVTags,
        'search-labels': searchLabels
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
