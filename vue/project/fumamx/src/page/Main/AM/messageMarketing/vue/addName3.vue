<template>
    <div class="addName MXscroll">
        <el-dialog v-dialogDrag title="新建签名" :visible.sync="isOpen" custom-class="width620" :closeOnClickModal="false" :close-on-click-modal="false" :modal-append-to-body="false">
            <div class="list">
                <div class="name">签名名称</div>
                <el-input></el-input>
                <div class="name">签名类型</div>
                <el-radio class="radio" v-model="radio" label="1">国内短信</el-radio>
                <el-radio class="radio" v-model="radio" label="2">国外短信</el-radio>
                <div style="margin:20px 0 15px;">
                    短信模板签名请按照规定编写：
                </div>
                <div style="height:60px;font-size:12px;">
                    1.签名内容只能由纯中文、中文+英文、中文+数字和中文+英文+数字这四种中的一种构成。3~8个字。<br>
                    2.不支持配置中性签名（例如不能指向公司或产品名称的签名，【验证码】）
                </div>
                <div class="name" style="text-align:center">
                    <el-button type="primary">保存并提交审核</el-button>
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
            isOpen: false,
            radio: '1'
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
