<template>
    <div class="Documentary">
        <template>
            <div class="contactTitle">
                <span class="titleBox">
                    <!-- 跟单流程 -->
                    {{$t('mxpcweb.sale.components.1557565147907')}}
                    <el-button v-if="optCode == 'otNew' || !disabled" class="miniButton" size="mini" @click="$refs.optVue.addDocumentary()">
                        <!-- 选择模板 -->
                        {{$t('mxpcweb.sale.components.1557564595047')}}
                    </el-button>
                    <el-button v-else disabled class="miniButton" size="mini">
                        <!-- 选择模板 -->
                        {{$t('mxpcweb.sale.components.1557564595047')}}
                    </el-button>
                </span>
                <div class="tipBox" v-if="docData.strucId_3 && docData.strucId_3.length > 0">
                    <span class="tip">
                        <!-- 颜色示意说明： -->
                        {{$t('mxpcweb.sale.components.1557564964346')}}
                        <span class="tipItem">
                            <span class="tipItemColor" style="background:#909399"></span>
                            <!-- 未开始 -->
                            {{$t('mxpcweb.sale.components.1557564915723')}}
                        </span>
                        <span class="tipItem">
                            <span class="tipItemColor" style="background:#FFB735"></span>
                            <!-- 进行中 -->
                            {{$t('mxpcweb.sale.components.1557564915950')}}
                        </span>
                        <span class="tipItem">
                            <span class="tipItemColor" style="background:#D0021B"></span>
                            <!-- 跳过 -->
                            {{$t('mxpcweb.sale.components.1557564916333')}}
                        </span>
                        <span class="tipItem">
                            <span class="tipItemColor" style="background:#00C2B3"></span>
                            <!-- 完成 -->
                            {{$t('mxpcweb.sale.components.1557564916526')}}
                        </span>
                    </span>
                </div>
            </div>
            <div class="filesBox" v-if="docData.strucId_3 && docData.strucId_3.length > 0">
                <div class="templateName">
                    <!-- 模板名称 -->
                    {{$t('mxpcweb.sale.components.1557565148114')}}<span style="color:#222222;margin-left:20px;">{{docData.templateName}}</span>
                </div>
                <documentary-vue style="text-align:center;" :optCode="optCode" :orderId="itemData.orderId + '' || ''" :docData="docData" @optClick="optClick"></documentary-vue>
            </div>
            <div class="filesBox" v-else>
                <div class="nodata">
                    <!-- 您尚未选择跟单模板噢～ -->
                    {{$t('mxpcweb.sale.components.1557565148330')}}
                </div>
            </div>
        </template>
        <opt-vue ref="optVue" @submit="submitList" :optCode="optCode"></opt-vue>
    </div>
</template>
<script>
import DocumentaryVue from '@/page/Main/Sale/components/DocumentaryVue/index'
import OptVue from '@/page/Main/Sale/components/OptVue/index'
export default {
    name: 'Documentary',
    props: {
        optCode: {
            type: String,
            default: 'otNew'
        },
        filesEditSet: {
            type: Object,
            default: () => {
                return {}
            }
        },
        domId: {
            type: String,
            default: 'file1'
        },
        itemData: {
            type: Object,
            default: () => {
                return {}
            }
        },
        docDatas: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },
    data() {
        return {
            docData: {},
            disabled: true
        }
    },
    created() {
    },
    computed: {
    },
    methods: {
        optClick(item, type) {
            this.$refs.optVue.optClick(item, type)
        },
        updata() {
            this.docData = JSON.parse(JSON.stringify(this.docDatas))
            this.disabled = false
            if (this.docData.strucId_3) {
                this.docData.strucId_3.forEach(item => {
                    if (item.taskStatus && item.taskStatus != '1') {
                        this.disabled = true
                    }
                })
            }
        },
        submit() {
            if (this.optCode == 'otEdit' && this.docDatas.strucId_3 && this.docData.strucId_3.length == this.docDatas.strucId_3.length) {
                let isSame = true
                if (this.docData.strucId_3) {
                    this.docData.strucId_3.forEach((item, index) => {
                        if (JSON.stringify(item) != JSON.stringify(this.docDatas.strucId_3[index])) {
                            isSame = false
                        }
                    })
                }
                if (isSame) {
                    return {}
                }
            }
            return {
                SC003: this.docData
            }
        },
        submitList(data) {
            let newdata = JSON.parse(JSON.stringify(data))
            this.docData = newdata
        },
        clearData() {
        }
    },
    components: {
        'documentary-vue': DocumentaryVue,
        'opt-vue': OptVue
    }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
