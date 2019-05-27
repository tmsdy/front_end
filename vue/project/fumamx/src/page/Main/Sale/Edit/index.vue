<template>
<div class="editSaleBox">
    <div class="addPeople MXscroll" v-loading="loading">
        <new-and-edit-vue v-if="moduleCode == 'SC001'" ref="newAndEditVue" @scrollTop="scrollTop" @removeTab="removeTab" optCode="otEdit"></new-and-edit-vue>
        <new-and-edit-vue2 v-if="moduleCode == 'SC002'" ref="newAndEditVue" @scrollTop="scrollTop" @removeTab="removeTab" optCode="otEdit"></new-and-edit-vue2>
    </div>
    <div class="dialogFooter">
        <el-button type="primary" :loading="submitLoading" @click="submitAddFrom(true)">
            <!-- 保存 -->
            {{$t('mxpcweb.client.1529042806774')}}
        </el-button>
        <el-button @click="removeTab">{{$t('mxpcweb.client.1529047588840')}}</el-button>
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
    name: 'editSaleBox',
    props: {
    },
    data() {
        return {
            loading: false,
            submitLoading: false,
            moduleCode: ''
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
        scrollTop(top) {
            $('.editSaleBox').scrollTop(top)
        },
        removeTab() {
            this.$emit('removeTab')
            this.$router.push('/main/sale/tabs/list/' + this.moduleCode)
        },
        submitAddFrom() {
            let newData = this.$refs.newAndEditVue.submit()
            if (!newData) {
                return
            }
            this.submitLoading = true
            this.getFormKey((formKey, msg) => {
                if (formKey && formKey != '') {
                    this.$http.put(this.Global.baseURL + this.Global.api.v2.document_quotation_put, Object.assign(newData, {
                        'formKey': formKey
                    })).then((res) => {
                        this.submitLoading = false
                        if (res.body.code.toString() == this.Global.RES_OK) {
                            this.$message.success(this.msg(res.body))
                            this.$emit('removeTab')
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
        }
    },
    watch: {
    },
    beforeDestroy: function () {
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
