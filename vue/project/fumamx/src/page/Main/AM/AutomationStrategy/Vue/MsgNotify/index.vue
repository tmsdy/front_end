<template>
    <div class="MsgNotify">
        <el-dialog v-dialogDrag title="短信通知" :visible.sync="dialogVisible" size="small" :before-close="beforeClose">
            <div class="toolBar clearfix">
                <div class="pull-right">
                    <el-input class="search " placeholder="搜索通知名称" icon="search" v-model="searchKey" :on-icon-click="handleSearch" @keyup.enter.native="handleSearch">
                    </el-input>
                    <el-button type="primary" class="button " @click="handleCreate">新建短信通知</el-button>
                </div>
            </div>
            <div class="notifyListBox"></div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'MsgNotify',
    data() {
        return {
            dialogVisible: false,
            searchKey: ''
        }
    },
    methods: {
        open() {
            this.dialogVisible = true
        },
        beforeClose(done) {
            done()
        },
        handleSearch() { },
        handleCreate() { }
    },
    components: {

    }
}
</script>
<style lang='less' rel='stylesheet/less' scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
