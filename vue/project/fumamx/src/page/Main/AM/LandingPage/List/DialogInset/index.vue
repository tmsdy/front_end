<template>
    <el-dialog title="嵌入选项" :close-on-click-modal="false" :visible.sync="dialogVisible" size="small" :before-close="handleClose">
        <div class="dialogBody">
            <p>{{text01}}</p>
            <div>
                {{text03}}
                <el-select v-model="value" placeholder="弹层" class="dialog-select" @change="changeSelect">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="textWrap" v-loading="loading">
                <div data-v-61d19167="" class="textareaBox el-textarea">
                    <textarea readonly="readonly" type="textarea" rows="2" autocomplete="off" validateevent="true" class="el-textarea__inner" style="min-height: 96px; height: 96px;" v-model="textarea" id="foo"></textarea>
                </div>
                <div class="tips" v-html="tips">
                </div>
                <!-- <input style="height:0;opacity:0;" type="textarea" :value="textarea" ref="offlineauthno_value" class="contents"> -->
            </div>
            <div style="text-align:center">
                <el-button type="primary" class="finishBtn" ref="copyButton" @click="Copy()" data-clipboard-action="copy" data-clipboard-target="#foo">复制代码</el-button>
                <el-button type="primary" class="finishBtn" @click="handleClose">完成</el-button>
            </div>
        </div>
    </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import Clipboard from 'clipboard'
import { goodsEncrypt } from '@/libs/utils.js'

export default {
    name: 'DialogInset',
    data() {
        return {
            dialogVisible: false,
            text01: '请使用下面的代码片段从您的网站捕捉线索，并对访客进行行为跟踪',
            text03: '您的网页表单代码格式：',
            options: [
                {
                    value: 'jswrap',
                    label: '弹层'
                }, {
                    value: 'html',
                    label: '源'
                }, {
                    value: 'js',
                    label: '嵌入'
                }, {
                    value: 'iFrame',
                    label: 'iFrame'
                }],
            value: 'jswrap',
            textarea: '',
            textData: {},
            itemData: {},
            loading: false,
            tips: '',
            apiUrl: window.location.protocol + '//' + window.location.hostname + this.Global.baseURL + this.Global.api.landingPage.landingPageDocument
        }
    },
    // props: {
    //     itemData: {
    //         type: Object,
    //         default: function () {
    //             return {

    //             }
    //         }
    //     }
    // },
    created() {
        // this.getDetailPage()
    },
    mounted() { },
    computed: {
        ...mapGetters(['company'])
    },
    methods: {
        copyText() {
            this.focus()
            this.select()
        },
        open(data) {
            this.dialogVisible = true
            this.itemData = data
            this.value = 'jswrap'
            this.textarea = ''
            this.getDetailPage()
        },
        handleClose() {
            this.dialogVisible = false
        },
        handleSelect() {
            // console.log(this.textarea)
        },
        getDetailPage() {
            this.loading = true
            let data = {
                type: 'detail',
                pageId: this.itemData.pageId
            }
            this.$http.get(this.Global.baseURL + this.Global.api.v2.landingPage, { params: data })
                .then(res => {
                    this.loading = false
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        this.textData = res.body.data
                        // this.textarea = this.textData.originalCode
                        var dd = this.apiUrl + '?cId=' + goodsEncrypt(this.company.cId) + '&' + 'pageId=' + goodsEncrypt(this.textData.pageId) + '&' + 'type=jsWrapCode'
                        this.textarea = '<script src="' + dd + '">' + '</' + 'script>'
                        this.tips = '<p>1.复制‘弹层代码’</p><p>2.在您的网站或支持的网站使用它。</p><p>3.在您的网站上需要点击触发弹层弹出的按钮上加上方法名为showdiv的方法，如:&lt;button onclick="showdiv()">&lt;/button></p>'
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                },
                    res => {
                        this.$message.error(this.$t(this.Global.errorTitle))
                    }
                )
        },
        changeSelect() {
            var dd = this.apiUrl + '?cId=' + goodsEncrypt(this.company.cId) + '&' + 'pageId=' + goodsEncrypt(this.textData.pageId) + '&' + 'type='
            switch (this.value) {
                case 'js':
                    dd = dd + 'js'
                    if (this.textData.embedCode) {
                        this.textarea = '<script src="' + dd + '">' + '</' + 'script>'
                        this.tips = '<p>1.复制‘嵌入代码’</p><p>2.在您的网站或支持的网站使用它。</p>'
                    }
                    break
                case 'html':
                    if (this.textData.originalCode) {
                        this.textarea = this.textData.originalCode
                        this.tips = '<p>1.复制‘源代码’</p><p>2.在您的网站或支持的网站使用它。</p>'
                    }
                    break
                case 'iFrame':
                    dd = dd + 'iFrame'
                    if (this.textData.iframeCode) {
                        this.textarea = '<iframe width="800px" height="700px" src="' + dd + '">' + '</' + 'iframe>'
                        this.tips = '<p>1.复制‘iFrame代码’</p><p>2.在您的网站或支持的网站使用它。</p><p>3.通过iframe代码提交的记录将不会验证网页表单中定义的表单位置URL。</p>'
                    }
                    break
                case 'jswrap':
                    dd = dd + 'jsWrapCode'
                    this.textarea = '<script src="' + dd + '">' + '</' + 'script>'
                    this.tips = '<p>1.复制‘弹层代码’</p><p>2.在您的网站或支持的网站使用它。</p><p>3.在您的网站上需要点击触发弹层弹出的按钮上加上方法名为showdiv的方法，如:&lt;button onclick="showdiv()">&lt;/button></p>'
                    break
            }
        },
        Copy() {
            if (this.$refs.copyButton.$el) {
                let clipboard = new Clipboard(this.$refs.copyButton.$el)
                clipboard.on('success', (e) => {
                    this.$message.success(this.$t('mxpcweb.am.1531904029672')) // 复制成功
                })
            }
        }
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
