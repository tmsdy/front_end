<template>
    <div class="NewBuild">
        <page-detail title="自动化策略" detailTitle="新建自动化策略" iconfont="icon-share-set" @toList="pageBack()"></page-detail>
        <div class="newBuildBox ">
            <strategy-des v-if="isOneStep||isModify" :isModify="isModify" @nextStep="nextStep" :strategyDesForm="strategyDesForm"></strategy-des>
            <strategy-edit ref="strategyEdit" v-show="!isOneStep&&!isModify" :strategyDesForm="strategyDesForm" @modifyDes="modifyDes()" @cancel="pageBack()" @saved="$emit('pageBack')"></strategy-edit>
        </div>
    </div>
</template>
<script>
import PageDetail from '@/components/PageDetail/index'
import StrategyDes from '../StrategyDes/index'
import StrategyEdit from '../StrategyEdit/index'
export default {
    name: 'NewBuild',
    data() {
        return {
            isOneStep: true,
            isModify: false,

            strategyDesForm: {
                moduleName: '',
                moduleCode: '',
                strategyName: '',
                discription: ''
            },
            backup_strategyDes: {

            }
        }
    },
    mounted() { },
    methods: {
        modifyDes() {
            this.isModify = true
            Object.assign(this.backup_strategyDes, this.strategyDesForm)
        },
        pageBack() {
            this.$confirm('此操作将不会保存正在编辑的策略!', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$emit('pageBack')
            }).catch(() => {
                console.log('click cancel')
            })
        },
        nextStep(flag) {
            if (this.isOneStep) {
                this.isOneStep = false
                this.$refs.strategyEdit.getBeginData()
            }
            if (this.isModify) {
                this.isModify = false
                if (!flag) {
                    Object.assign(this.strategyDesForm, this.backup_strategyDes)
                }
            }
        }

    },
    components: {
        'page-detail': PageDetail,
        'strategy-des': StrategyDes,
        'strategy-edit': StrategyEdit
    }
}
</script>
<style lang='less' rel='stylesheet/less' scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
