<template>
    <div class="ConditionItem">
        <div class="itemMain ">
            <div class="indexFlag">{{item.orderNo}}</div>
            <div class="contentBox clearfix">
                <span class="contentItem  module ellipsis  pull-left">{{modulesMap[item.moduleCode]}}</span>
                <span class="contentItem field ellipsis pull-left">{{fieldItem['showName']}}</span>
                <span class="contentItem type ellipsis pull-left">{{typeItem['showName']}}</span>
                <span class="contentItem params ellipsis pull-left">
                    <template v-if="fieldItem.fieldType==4">
                        <!-- 走控件展示的 -->
                        <component :is="'control'+fieldItem.fieldList.controlTypeId" ref="control" :itemData="fieldItem.fieldList" :value="{value:item.eqParam}"></component>
                    </template>
                    <template v-else>
                        <template v-if="typeItem.showType==0||typeItem.showType==2">{{item.eqParam}}</template>
                        <template v-if="typeItem.showType==1||typeItem.showType==3">
                            {{item.gtParam&&item.gtParam.split(' ')[0]}} <span class="hyphen">-</span> {{item.ltParam&&item.ltParam.split(' ')[0]}}
                        </template>
                    </template>
                </span>
            </div>
        </div>
        <div class="itemCalc" v-if="!isLast">
            <div class="Btn">
                {{logic==='|'?'或':'与'}}
            </div>
        </div>
    </div>
</template>

<script>
import Controls from '@/components/ListShowControls'
export default {
    name: 'ConItem',
    props: {
        item: {
            type: Object,
            default: () => ({})
        },
        modules: {
            type: Array,
            default: () => []
        },
        isLast: {
            type: Boolean,
            default: false
        },
        logic: {
            type: String,
            default: '|'
        }
    },
    data() {
        return {
            fieldItem: {},
            typeItem: {}
        }
    },
    created() {
        this.initData()
    },
    computed: {
        modulesMap() {
            return this.modules.reduce((obj, item) => Object.assign(obj, { [item.moduleCode]: item.showName }), {})
        }
    },
    methods: {
        async initData() {
            let params01 = {
                actionId: 0,
                dataType: 'modules_rely_fields',
                moduleCode: this.item.moduleCode
            }
            let res01 = await this._getData({ params: params01 })
            if (!res01.flag) {
                return
            }
            res01.data.forEach(item => {
                if (item.fieldId == this.item.fieldId) {
                    this.fieldItem = item
                }
            })

            let params02 = {
                actionId: 0,
                dataType: 'module_fields_cond',
                fieldType: this.fieldItem.fieldType
            }
            let res02 = await this._getData({ params: params02 })

            if (!res02.flag) {
                return
            }

            res02.data.forEach(item => {
                if (item.typeId == this.item.typeId) {
                    this.typeItem = item
                }
            })
        },
        async _getData(data) {
            try {
                let url = this.Global.baseURL + this.Global.api.v2.autoStrategy_controlTypeV2

                let res = await this.$http.get(url, data)

                if (res.body.code.toString() == this.Global.RES_OK) {
                    return { data: res.body.data.list || [], flag: true }
                } else {
                    this.$message.error(this.msg(res.body))
                }
            } catch (error) {
                this.$message.error(this.$t(this.Global.errorTitle))
            }
            return { flag: true }
        }
    },
    watch: {
        item: {
            handler() {
                this.initData()
            },
            deep: true
        }
    },
    components: {
        ...Controls
    }
}
</script>
<style lang='less' rel='stylesheet/less' scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
