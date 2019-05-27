<template>
    <div class="Documentary">
        <template>
            <div class="contactTitle">
                <div class="tipBox">
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
            <div class="filesBox" v-if="itemData.SC003">
                <documentary-vue @optClick="optClick" isProgress optCode="otView" @getData="getData" :orderId="itemData.orderId + ''" :docData="itemData.SC003"></documentary-vue>
            </div>
            <div class="filesBox" v-else>
                <div class="nodata">
                    <!-- 您尚未选择跟单模板噢～ -->
                    {{$t('mxpcweb.sale.components.1557565148330')}}
                    <div style="text-align:center;" v-if="company.ctId == itemData.ownerCtId">
                        <span class="text-hover" style="color:#008CEE;" @click="$refs.optVue.addDocumentary(itemData)">选择模板</span>
                    </div>
                </div>
            </div>
        </template>
        <opt-vue ref="optVue" @getData="getData" optCode="otView"></opt-vue>
    </div>
</template>
<script>
import DocumentaryVue from '@/page/Main/Sale/components/DocumentaryVue/index'
import OptVue from '@/page/Main/Sale/components/OptVue/index'
import { mapGetters } from 'vuex'
export default {
    name: 'Documentary',
    props: {
        filesEditSet: {
            type: Object,
            default: () => {
                return {}
            }
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
        }
    },
    created() {
    },
    mounted() {
    },
    computed: {
        ...mapGetters([
            'company'
        ])
    },
    methods: {
        updata() {
            this.docData = JSON.parse(JSON.stringify(this.docDatas))
        },
        getData() {
            this.$emit('getData')
        },
        optClick(item, type) {
            this.$refs.optVue.optClick(item, type)
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
