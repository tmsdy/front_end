<template>
    <div class="addName MXscroll">
        <el-dialog :close-on-click-modal="false" v-dialogDrag title="新建模板" :visible.sync="isOpen" custom-class="width620" :closeOnClickModal="false" :modal-append-to-body="false">
            <div class="list">
                <div class="name">模板名称</div>
                <el-input placeholder="方便管理模板，不超过10个字" :maxlength="10"></el-input>
                <div class="name">内容</div>
                <el-input type="textarea" :rows="12" placeholder="短信每67个字计费一条（含签名）。长短信发送按照67个字计费一条，不超过300字（含签名），正文部分无需再添加签名。"></el-input>
                <div class="name">
                    <span class="text-hover" style="color:#6CA2FF">选择签名</span>
                    <span style="float:right">已输入0字/计费0条</span>
                </div>
                <div class="name" style="text-align:center">
                    <el-button type="primary">保存并提交审核</el-button>
                    <el-button type="primary">保存</el-button>
                    <el-button>取消</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'addName',
    props: {

    },
    data() {
        return {
            isOpen: false
        }
    },
    methods: {
        addName() {
        },
        show() {
            this.isOpen = true
        }
    }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
.addName {
    .list {
        padding: 0 10px;
        .name {
            height: 50px;
            line-height: 40px;
        }
    }
}
</style>
