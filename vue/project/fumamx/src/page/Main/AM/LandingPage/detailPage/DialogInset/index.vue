<template>
    <div class="dialogBody">
        <p>{{text01}}</p>
        <p>{{text02}}</p>
        <div>
            {{text03}}
            <el-select v-model="value" placeholder="源" class="dialog-select">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
        </div>
        <div class="textWrap">
            <!-- <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 4}" v-model="textarea" readonly="readonly" @select="handleSelect">
            </el-input> -->
            <div data-v-61d19167="" class="textareaBox el-textarea">
                <textarea readonly="readonly" type="textarea" rows="2" autocomplete="off" validateevent="true" class="el-textarea__inner" style="min-height: 96px; height: 96px;" value="textarea"></textarea>
            </div>
            <div class="tips">
                <p>1.复制‘源代码’</p>
                <p>2.在您的网站或支持的网站使用它。</p>
            </div>
        </div>
        <el-button type="primary" class="finishBtn">完成</el-button>
    </div>
</template>

<script>
export default {
    name: 'DialogInset',
    data() {
        return {
            text02: '请使用下面的代码片段从您的网站捕捉线索，并对访客进行行为跟踪',
            text03: '您的网页表单代码格式：',
            options: [{
                value: '选项1',
                label: '源'
            }, {
                value: '选项2',
                label: '嵌入'
            }, {
                value: '选项3',
                label: 'iFrame'
            }],
            value: '选项1',
            textarea: '<span>dsdasd</span>',
            textData: {}
        }
    },
    props: {
        itemData: {
            type: Object,
            default: function () {
                return {

                }
            }
        }
    },
    created() {
        this.getDetailPage()
    },
    mounted() { },
    methods: {
        handleClose(done) {
            this.$confirm('确认关闭？')
                .then(_ => {
                    done()
                })
                .catch(_ => { })
        },
        handleSelect() {
            // console.log(this.textarea)
        },
        getDetailPage() {
            this.isLoading = true
            let { accessToken } = this.getToken()
            let data = {
                accessToken: accessToken,
                type: 'detail',
                pageId: this.itemData.pageId
            }
            this.$http.get(this.Global.baseURL + this.Global.api.v2.landingPage, { params: data })
                .then(res => {
                    this.isLoading = false
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        this.textData = res.body.data
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                },
                    res => {
                        this.$message.error(this.$t(this.Global.errorTitle))
                    }
                )
        }
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
