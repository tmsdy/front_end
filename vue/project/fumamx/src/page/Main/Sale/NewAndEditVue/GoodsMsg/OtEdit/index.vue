<template>
<!-- 批量修改 -->
<el-dialog class="OtEdit" v-dialogDrag :title="$t('mxpcweb.sale.components.1557565183674')" :visible.sync="dialogVisible" custom-class="width720">
    <div class="OtEditBox">
        <!-- 选择规则 -->
        <el-select v-model="rule" @change="ruleChange" filterable :placeholder="$t('mxpcweb.sale.components.1557565183866')" size="mini" style="margin-left:10px;width:200px;">
            <div v-for="item in ruleLists" :key="item.value+''">
                <el-option :label="item.label" :value="item.value+''">
                </el-option>
            </div>
        </el-select>
        <span v-if="rule == '3'">
            <input type="number" v-model="toNum"
            min="0"
            style="width: 40px;"
            onkeypress="if( ! /^-?\d+\.?\d{0,1}$/.test(this.value)){ var s = this.value;this.value=s.substring(0,s.indexOf('.')+2)}"
            />
        </span>
        <span v-if="rule == '5'">
            <!-- 从 -->
            {{$t('mxpcweb.sale.components.1557565184065')}}
            <input type="number" v-model="fromNum"
            style="width: 40px;"
            min="0"
            onkeypress="if( ! /^-?\d+\.?\d{0,1}$/.test(this.value)){ var s = this.value;this.value=s.substring(0,s.indexOf('.')+2)}"
            />
            <!-- 至 -->
            {{$t('mxpcweb.sale.components.1557565184266')}}
            <input type="number" v-model="toNum"
            min="0"
            style="width: 40px;"
            onkeypress="if( ! /^-?\d+\.?\d{0,1}$/.test(this.value)){ var s = this.value;this.value=s.substring(0,s.indexOf('.')+2)}"
            />
        </span>
        <!-- 选择规则 -->
        <el-select v-model="field" @change="fieldChange" filterable :placeholder="$t('mxpcweb.sale.components.1557565183866')" size="mini" style="margin:0 10px;width:160px;">
            <template v-if="moduleCode == 'SC002'">
                <div v-for="item in fieldLists1" :key="item.value+''">
                    <el-option :label="item.label" :value="item.value+''">
                    </el-option>
                </div>
            </template>
            <template v-else>
                <div v-for="item in fieldLists" :key="item.value+''">
                    <el-option :label="item.label" :value="item.value+''">
                    </el-option>
                </div>
            </template>
        </el-select>
        <span v-if="rule!= '4' && (field == 'quotedPrice' || field == 'salePrice')">
            <input type="number" v-model="input"
            min="0"
            onkeypress="if( ! /^-?\d+\.?\d{0,1}$/.test(this.value)){ var s = this.value;this.value=s.substring(0,s.indexOf('.')+2)}"
            />
        </span>
        <span v-if="rule!= '4' && field == 'saleQty'">
            <input type="number" v-model="input"
            min="0"
            onkeyup="this.value=this.value.replace(/\D/g,'')"
            onafterpaste="this.value=this.value.replace(/\D/g,'')"
            />
        </span>
    </div>
    <span slot="footer" class="dialog-footer">
        <div style="text-align:center">
            <!-- 确 定 -->
            <el-button type="primary" @click="submit()">{{$t('mxpcweb.sale.components.1557564964547')}}</el-button>
            <!-- 取 消 -->
            <el-button @click="dialogVisible = false">{{$t('mxpcweb.sale.components.1557564617043')}}</el-button>
        </div>
    </span>
</el-dialog>
</template>

<script>
export default {
    name: 'OtEdit',
    props: {
        moduleCode: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            input: '',
            rule: '',
            fromNum: '',
            toNum: '',
            ruleLists: [{
                value: '1',
                // 以当前值替换所有空值
                label: this.$t('mxpcweb.sale.components.1557565184469')
            }, {
                value: '2',
                // 以当前值替换所有值
                label: this.$t('mxpcweb.sale.components.1557565184667')
            }, {
                value: '3',
                // 以当前值替换当前行之后几行
                label: this.$t('mxpcweb.sale.components.1557565184877')
            }, {
                value: '5',
                // 从第几行替换至几行
                label: this.$t('mxpcweb.sale.components.1557565185086')
            }, {
                value: '4',
                // 清除所有值
                label: this.$t('mxpcweb.sale.components.1557565185307')
            }],
            field: '',
            fieldLists: [{
                value: 'quotedPrice',
                // 报价
                label: this.$t('mxpcweb.sale.components.1557565036189')
            }, {
                value: 'saleQty',
                // 数量
                label: this.$t('mxpcweb.sale.components.1557565035577')
            }],
            fieldLists1: [{
                value: 'salePrice',
                // 销售单价
                label: this.$t('mxpcweb.sale.components.1557565185489')
            }, {
                value: 'saleQty',
                // 数量
                label: this.$t('mxpcweb.sale.components.1557565035577')
            }],
            dialogVisible: false
        }
    },
    methods: {
        open() {
            this.rule = ''
            this.field = ''
            this.input = ''
            this.fromNum = ''
            this.toNum = ''
            this.dialogVisible = true
        },
        ruleChange() {
            this.fromNum = ''
            this.toNum = ''
            if (this.rule == '4') {
                this.input = ''
            }
        },
        fieldChange() {
            this.input = ''
        },
        submit() {
            if (this.rule == '' || this.field == '') {
                // 修改信息不完整，请填写完整后再来！
                this.$message(this.$t('mxpcweb.sale.components.1557565185686'))
                return
            }
            if (this.rule == '5') {
                if (this.fromNum == '') {
                    // 请输入起始行
                    this.$message(this.$t('mxpcweb.sale.components.1557565185883'))
                    return
                }
                if (this.toNum == '') {
                    // 请输入结束行
                    this.$message(this.$t('mxpcweb.sale.components.1557565186069'))
                    return
                }
            }
            this.$emit('otEditList', {
                rule: this.rule,
                field: this.field,
                input: this.input,
                fromNum: this.fromNum,
                toNum: this.toNum
            })
            this.dialogVisible = false
        }
    },
    components: {
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
