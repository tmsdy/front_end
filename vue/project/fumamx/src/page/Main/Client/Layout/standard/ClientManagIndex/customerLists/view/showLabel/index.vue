<template>
    <span class="labels">
        <span v-for="(list,index) in tags" :key="index">
            <el-tag class="label" v-if="returnLabelName(list)!=''" :style="returnColor(list)" >{{returnLabelName(list)}}</el-tag>
        </span>
    </span>
</template>
<script>
import { tagsBgColor } from '@/libs/utils.js'
/**
 * 描述：客户管理-客户列表-编辑客户
 * 作者：何俊峰
 * 时间：2017/11/22
 */
export default {
    name: 'showLabel',
    props: {
        dynamicTags: {
            type: Array,
            default: function() {
                return []
            }
        },
        tags: {
            type: Array,
            default: function() {
                return []
            }
        },

        moduleCode: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
        }
    },
    created() {

    },
    mounted() {
    },
    computed: {
    },
    methods: {
        returnLabelName(labelId) {
            let labelName = ''
            this.dynamicTags.forEach(function(item) {
                if (item.labelId == labelId) {
                    labelName = item.labelName
                    return false
                }
            })
            return labelName
        },
        returnColor(id) {
            let _this = this
            let color = ''
            this.dynamicTags.forEach(function(item) {
                if (item.labelId == id) {
                    color = _this.setBgColor(item.color)
                    return false
                }
            })
            return color
        },
        // 背景色
        setBgColor(id) {
            return tagsBgColor(id)
        }
    },
    watch: {

    },
    components: {
    },
    beforeDestroy: function () {
        this.returnLabelName = null
        this.returnColor = null
        this.setBgColor = null
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.labels{
        display: inline-block;
        .el-tag {
            height: 20px;
            line-height: 19px;
            margin-right: 4px;
        }
}
</style>
