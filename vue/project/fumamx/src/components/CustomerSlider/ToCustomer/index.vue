<template>
    <div class="ToCustomer">
        <div class="text-center">
            <el-button type="primary" style="width:120px;" @click="_add('BF001')">新增客户</el-button>
            <el-button type="primary" style="width:120px;" @click="_add('BF003')">新增联系人</el-button>
        </div>
    </div>
</template>

<script>
/**
 * 描述：客户滑动抽屉
 * 作者：向士健
 * 时间：2018/03/07
 */
export default {
    name: 'ToCustomer',
    props: {
        mail: {
            type: String,
            default: ''
        }
    },
    methods: {
        _add(mdCode) {
            let _this = this
            let data = {
                moduleCode: mdCode,
                optCode: 'otNew',
                identFieldValue: 0
            }
            ep.emit('setGlobalLoading', {
                val: true, // 打开loading
                text: '权限校验中...'
            })
            // 校验权限先
            _this.$http.get(this.Global.baseURL + this.Global.api.v2.document_rightCheck_do, { params: data }).then(function (res) {
                ep.emit('setGlobalLoading', {
                    val: false // 关闭loading
                })
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    this.flyBtnCheck('otNew', mdCode)
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
            })
        },
        flyBtnCheck(ot, Mcode) {
            let title = ''
            if (ot == 'otNew' && Mcode == 'BF003') {
                title = this.$t('mxpcweb.client.detail.1529994507329') // 新增联系人
            }
            if (ot == 'otNew' && Mcode == 'BF001') {
                title = this.$t('mxpcweb.client.1529042727717') // 新增客户
            }
            let obj = {
                optData: {
                    optCode: ot,
                    optModuleCode: Mcode,
                    optName: title
                },
                otherObj: {
                    value: this.mail,
                    fieldName: 'mailAddress',
                    model: 'BF003', //* 这里都为 联系人
                    disable: true
                },
                next: () => {
                    this.$emit('tellFather') // update
                }
            }
            // console.log(obj)
            ep.emit('optClick', obj)
        }
    }
}
</script>
