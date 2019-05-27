<template>
    <span>
        <el-select :loading="loading" clearable v-model="ruleForm.input" filterable remote :remote-method="getData" :placeholder="$t('mxpcweb.am.1531897682965')" @change="change" :size="size" :style="{width: inputWidth}">
            <div  v-for="(item, index) in options" :key="index">
                <!-- (公共) -->
                <el-option :label="item.isPublic == '1'?item.name + $t('mxpcweb.am.1543300746180'):item.name" :value="item.invokeName+''">
                </el-option>
            </div>
        </el-select>
        <!-- 预览 -->
        <span v-if="showPreview && ruleForm.input != ''" class="text-hover" style="color:#d0021b;margin-left:10px;" @click="look()">{{$t('mxpcweb.client.list.1542166026623')}}</span>
        <!-- 预览 -->
        <editor-preview ref="preview"></editor-preview>
    </span>
</template>

<script>
import editorPreview from '@/components/editorPreview/index' // 预览
import { mapGetters } from 'vuex'
export default {
    name: 'Controls-Customer',
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
        moduleCode: '',
        loading: false
        }
    },
    created () {
    },
    mounted () {
        let _this = this
        // 滚动区域
        $(this.$el).find('.customer .el-select-dropdown__wrap').scroll(function () {
        var h = $(this).height() // div可视区域的高度
        var sh = $(this)[0].scrollHeight // 滚动的高度，$(this)指代jQuery对象，而$(this)[0]指代的是dom节点
        var st = $(this)[0].scrollTop // 滚动条的高度，即滚动条的当前位置到div顶部的距离
        if (h + st >= sh - 4) {
            _this.more()
        }
        })
    },
    methods: {
        moduleCodeChange(moduleCode) {
            this.moduleCode = moduleCode
            this.ruleForm.input = ''
            this.getData()
        },
        look() {
            this.$refs.preview.isShowTemplate(this.ruleForm.input)
        },
        // 修改时调用，用于更新传入的数据
        updatas (value) { // 判断是否列表已存在此客户数据，如果没有去请求客户详情push进列表选项中
            let _this = this
            let thisHave = false
            setTimeout(function () {
                _this.options.forEach(function (item) {
                    if (item.invokeName == value) {
                        thisHave = true
                    }
                })
                if (!thisHave) { // 如果不存在
                    // 如果不存在则执行最终方案--请求客户详情数据，push进列表，已解决客户名称不能显示问题
                    let itemData = {}
                    _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.template_list, {
                        params: {
                            invokeName: value
                        }
                    }).then(function (res) {
                        if (res.body.code.toString() == _this.Global.RES_OK) {
                            itemData = res.body.data
                            _this.options.push(itemData)
                            _this.ruleForm.input = value + ''
                            _this.change()
                        } else {
                            _this.ruleForm.input = ''
                            _this.change()
                        }
                    }, function (res) {
                        _this.$message.error(_this.$t(_this.Global.errorTitle))
                    })
                } else { // 如果客户存在列表中给选择框赋值并提交数据
                    _this.ruleForm.input = value + ''
                    _this.change()
                }
            }, 20)
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
                pageN: this.blockData.fromNum,
                pageSize: this.blockData.pageSize,
                moduleCode: this.moduleCode,
                emailType: 1,
                subCtId: _this.company.ctId
            }
            if (val) {
                argument.keyword = this.argument
            }
            if (!type) {
                _this.loading = true
            }
            _this.$http.get(this.Global.baseURL + this.Global.api.v2.template_list, { params: argument }).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    _this.options = res.body.data.tmplList
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
        }
    },
    computed: {
        ...mapGetters([
            'company'
        ])
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
