<template>
<div class="addSaleBox">
    <div class="addSale MXscroll" v-loading="loading">
        <new-and-edit-vue @themeChange="themeChange" v-if="moduleCode == 'SC001'" ref="newAndEditVue" @scrollTop="scrollTop" @removeTab="removeTab" optCode="otNew"></new-and-edit-vue>
        <new-and-edit-vue2 @themeChange="themeChange" v-if="moduleCode == 'SC002'" ref="newAndEditVue" @scrollTop="scrollTop" @removeTab="removeTab" optCode="otNew"></new-and-edit-vue2>
    </div>
    <div class="dialogFooter">
        <el-button type="primary" :loading="submitLoading" @click="submitAddFrom(true)">
            <!-- 保存 -->
            {{$t('mxpcweb.client.1529042806774')}}
        </el-button>
        <el-button type="primary" :loading="submitLoading" @click="submitAddFrom()">
            <!-- 保存后继续新增 -->
            {{$t('mxpcweb.client.1529042822379')}}
        </el-button>
        <el-button @click="removeTab()">{{$t('mxpcweb.client.1529047588840')}}</el-button>
    </div>
</div>
</template>
<script>
import NewAndEditVue from '../NewAndEditVue/index.vue'
import NewAndEditVue2 from '../NewAndEditVue/indexSC002.vue'
/**
 * 描述：客户管理-客户列表-新增单据
 * 作者：何俊峰
 * 时间：2019/3/8
 */
export default {
    name: 'addSale',
    props: {
    },
    data() {
        return {
            loading: false,
            submitLoading: false,
            optName: this.$t('mxpcweb.client.1529043854407'),
            moduleCode: '',
            callback: () => {}
        }
    },
    created() {
        let { moduleCode } = this.$route.params
        this.moduleCode = moduleCode
    },
    mounted() {
    },
    computed: {
    },
    methods: {
        themeChange(val) {
            this.$emit('updateTab', val)
        },
        removeTab() {
            this.$emit('removeTab')
            this.$router.push('/main/sale/tabs/list/' + this.moduleCode)
        },
        scrollTop(top) {
            $('.addSale').scrollTop(top)
        },
        submitAddFrom(close) {
            let newData = this.$refs.newAndEditVue.submit()
            if (!newData) {
                return
            }
            this.submitLoading = true
            this.getFormKey((formKey, msg) => {
                if (formKey && formKey != '') {
                    this.$http.post(this.Global.baseURL + this.Global.api.v2.document_quotation_post, Object.assign(newData, {
                        'formKey': formKey
                    })).then((res) => {
                        this.submitLoading = false
                        if (res.body.code.toString() == this.Global.RES_OK) {
                            this.$message.success(this.msg(res.body))
                            if (close) {
                                this.removeTab()
                            } else {
                                this.clearData()
                            }
                        } else {
                            this.$message.error(this.msg(res.body))
                        }
                        this.updateFormKey()
                    }, (res) => {
                        this.submitLoading = false
                        this.$message.error(this.$t(this.Global.errorTitle))
                    })
                } else {
                    this.submitLoading = false
                    this.$message.error(msg)
                }
            })
        },
        clearData() {
            $('.addSale').scrollTop(0)
            this.$refs.newAndEditVue.clearData()
        }
    },
    watch: {
    },
    beforeDestroy: () => {
    },
    components: {
        'new-and-edit-vue': NewAndEditVue,
        'new-and-edit-vue2': NewAndEditVue2
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
