<template>
    <span class="ActionMail">
        <!-- 请选择触发邮件 -->
        <el-select :loading="loading" clearable v-model="ruleForm.input" filterable remote :remote-method="getData" :placeholder="$t('mxpcweb.client.list.1542165968887')" @change="change" :size="size" :style="{width: inputWidth}">
            <el-option v-for="(item,index) in options" :key="index" :label="item.detailActionName + (item.sendType == '2'?'（普通邮箱发送）':'（平台推广发送）')" :value="item.detailActionId+''"> </el-option>
        </el-select>
        <!-- 预览 -->
        <span v-if="showPreview && ruleForm.input != ''" class="text-hover" style="color:#d0021b;margin-left:10px;" @click="look()">{{$t('mxpcweb.client.list.1542166026623')}}</span>
        <!-- 预览 -->
        <editor-preview ref="preview"></editor-preview>
    </span>
</template>

<script>
import editorPreview from '@/components/editorPreview/index' // 预览
export default {
    name: 'Controls-ActionMail',
    props: {
        inputWidth: {
            type: String,
            default: '160px'
        },
        size: {
            type: String,
            default: 'small'
        },
        showPreview: {
            type: Boolean,
            default: true
        },
        moduleCode: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            options: [], // 下拉框选项列表
            ruleForm: {// 输入框数据
                input: ''
            },
            blockData: { // 分页
                fromNum: 0,
                pageSize: 50
            },
            loading: false,
            isMore: false
        }
    },
    created () {
        this.getData()// 获取下拉框选项列表
    },
    mounted () {
        // 滚动区域
        $(this.$el).find('.ActionMail .el-select-dropdown__wrap').on('scroll', this.bindScroll)
    },
    beforeDestroy: function () {
        $(this.$el).find('.ActionMail .el-select-dropdown__wrap').off('scroll', this.bindScroll)
    },
    methods: {
        bindScroll(e) {
            if (this.isMore) {
                return false
            }
            this.isMore = true
            let time = setTimeout(() => {
                let h = e.target.clientHeight // div可视区域的高度
                let sh = e.target.scrollHeight // 滚动的高度，$(this)指代jQuery对象，而$(this)[0]指代的是dom节点
                let st = e.target.scrollTop // 滚动条的高度，即滚动条的当前位置到div顶部的距离
                if (h + st >= sh - 4) {
                this.more()
                }
                h = null
                sh = null
                st = null
                this.isMore = false
                window.clearTimeout(time)
            }, 300)
        },
        look() {
            let template = {
                invokeName: this.ruleForm.input
            }
            this.$refs.preview.isShowTemplate(template)
        },
        // 修改时调用，用于更新传入的数据
        updata (items) {
        },
        more () { // 下拉刷新触发事件，每次新增50条数据
            this.blockData.pageSize += 50
            this.getData(false, true)
        },
        getData (val, type) { // 获取客户下拉框列表数据
            let _this = this
            if (val) {
                this.blockData.pageSize = 50
                this.argument = val
            }
            let argument = {
                pageN: this.blockData.fromNum + 1,
                pageSize: this.blockData.pageSize,
                actionId: '1',
                type: 'list',
                moduleCode: this.moduleCode
            }
            if (val) {
                argument.wildcardWords = this.argument
            }
            if (!type) {
                _this.loading = true
            }
            _this.$http.post(this.Global.baseURL + this.Global.api.v2.autoStrategy_actionListPick, argument).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                _this.options = res.body.data.list
                if (!type) {
                    _this.loading = false
                }
                } else {
                if (!type) {
                    _this.loading = false
                }
                _this.$message.error(_this.msg(res.body))
                }
            }, function (res) {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },
        resetForm () { // 重置表单数据方法，暂不需要
            this.$refs.ruleForm.resetFields()
        },
        clearData () { // 清除表单方法，父组件使用v-if后暂时不用
            this.ruleForm.input = ''
        },
        change () { // 数据改变重置分页条数，提交数据
            this.blockData.pageSize = 50
            let newValue = this.ruleForm.input
            newValue = newValue == -1 ? '' : newValue
            this.$emit('update:actionMail', newValue)
            let items = {}
            this.options.forEach((item) => {
                if (newValue == (item.detailActionId + '')) {
                    items = item
                }
            })
            this.$emit('update:actionMails', items)
        }
    },
    components: {
        'editor-preview': editorPreview
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.more{
    text-align:center;
    color:grey;
    margin-bottom:10px;
}
</style>
