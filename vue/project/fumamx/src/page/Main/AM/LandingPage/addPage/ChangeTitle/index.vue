<template>
    <div class="content">
        <span class="editShow" v-if="showEdit">
            <el-input v-model="currentData" style="width:180px;" @blur.prevent="changeCount()"></el-input>
            <span class="editClose" @click="showEdit=!showEdit;changeCount()">
                <i class="iconfont icon-close"></i>
            </span>
        </span>
        <span class="fieldShow" v-show="!showEdit">
            <span clas="showVal">{{currentData}}</span>
            <span class="edit" @click="showEdit=!showEdit;">
                <i class="iconfont icon-edit-round"></i>
            </span>
        </span>
    </div>
</template>

<script>
export default {
    name: 'ChangeTitle',
    data() {
        return {
            showEdit: false,
            currentData: this.titleData,
            backupData: ''
        }
    },
    props: {
        titleData: {
            type: String,
            default: '无标题表单'
        }
    },
    created() {
        this.backupData = this.titleData// 备份
    },
    mounted() { },
    methods: {
        // visibleChange(is) {
        //     if (is || this.titleData === this.backupData) { return }// 展开下拉时，不提交。值没变也不提交
        //     this.$emit('modifyData', this.currentData)
        //     this.showEdit = false
        //     this.backupData = this.currentData// 备份
        // }
        changeCount() {
            if (this.currentData != this.backupData) {
                this.$emit('visibleChange', this.currentData)
                // this.$emit('visibleChange', this.currentData)
            }
            this.showEdit = false
        }
    },
    watch: {
        // currentData: function (val) {
        //     console.log(val)
        // }
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
