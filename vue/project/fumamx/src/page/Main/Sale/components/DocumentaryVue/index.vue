<template>
<div class="DocumentaryVueBox MXscroll" :style="isProgress ? 'padding-top:38px;' : ''">
    <div class="DocumentaryVue">
        <div class="optLine">
        </div>
        <div class="optListBox" v-if="docData.strucId_3 && docData.strucId_3.length > 0">
            <template v-for="(item, index) in docData.strucId_3">
                <list-item @getData="getData" :ownerCtId="docData.ownerCtId ? docData.ownerCtId + '' : ''" :doctryId="docData.doctryId + ''" :doctryNodeId="docData.doctryNodeId + ''" :isProgress="isProgress" :isUse="getIsUse(index)" :finStatus="docData.finStatus || '0'" :orderId="orderId" :optCode="optCode" @optClick="optClick" :key="index" :item="item"></list-item>
            </template>
            <div class="optItemBoxOver">
                <span class="optItemColorBox">
                    <span class="optItemColor" :class="'optItemColor' + (docData.finStatus || '0')"></span>
                </span>
                <div class="optItemContentBox">
                    <!-- 完成 -->
                    <div class="contentTit">{{$t('mxpcweb.sale.components.1557564916526')}}
                        <span v-if="company.ctId == docData.ownerCtId && optCode == 'otView' && docData.doctryId" class="text-hover" @click="optClick({
                            doctryId: docData.doctryId
                        }, 'resultsCompleted')">
                            <i class="iconfont icon-arrow-down-empty" style="font-size: 14px;"></i>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
import ListItem from './Vue/ListItem'
export default {
    name: 'DocumentaryVue',
    props: {
        isProgress: {
            type: Boolean,
            default: false
        },
        optCode: {
            type: String,
            default: ''
        },
        orderId: {
            type: String,
            default: ''
        },
        docData: {
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
        this.change()
    },
    computed: {
        ...mapGetters([
            'company'
        ])
    },
    methods: {
        getData() {
            this.$emit('getData')
        },
        getIsUse(index) {
            if ((this.docData.finStatus == '2' || this.docData.finStatus == '-1') || (this.docData.queueFlag == '1' && index > 0 && this.docData.strucId_3[index - 1].taskStatus != 3 && this.docData.strucId_3[index - 1].taskStatus != 4)) {
                return false
            } else {
                return true
            }
        },
        optClick(item, type) {
            this.$emit('optClick', item, type)
        },
        change() {
            this.finStatus = '0'
            if (this.docData.strucId_3) {
                this.docData.strucId_3.forEach(element => {
                    if (element.taskStatus && element.taskStatus != '4') {
                        this.finStatus = parseInt(element.taskStatus) > parseInt(this.finStatus) ? parseInt(this.finStatus) + '' : parseInt(element.taskStatus) + ''
                    }
                })
            }
        }
    },
    components: {
        'list-item': ListItem
    },
    watch: {
        docData(val) {
            this.change()
        }
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
