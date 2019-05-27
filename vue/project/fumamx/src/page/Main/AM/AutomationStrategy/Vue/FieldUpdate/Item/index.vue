<template>
    <div class="Item">
        <el-select v-model="item.moduleCode" placeholder="请选择" @change="moduleChange()" class="selectItem">
            <el-option v-for="item in modules" :key="item.value" :label="item.showName" :value="item.moduleCode">
            </el-option>
        </el-select>
        <el-select v-model="item.fieldId" :loading="isloading" placeholder="请选择" @change="fieldChange()" class="selectItem">
            <template v-for="item2 in fields">
                <el-option v-if="item2.fieldCategory!==4" :key="item2.fieldId" :label="item2.cnFieldCaption" :value="item2.fieldId">
                </el-option>
            </template>
        </el-select>
        <span class="optFlag">=</span>
        <div class="fieldValue">
            <template v-if="item.fieldId&&Object.keys(fieldItem).length>0">
                <component dataId="control1" :showLabel="false" :nameId="fieldItem.fieldName" :moduleCode="item.moduleCode" labelPosition="left" labelWidth="0px" :checkRepeat="true" isIndependent="true" rightWidth="200px" ref="control" v-bind:is="'control'+fieldItem.controlTypeId" :itemData="fieldItem" :controlData.sync="item.fieldValue" style=""></component>
            </template>
        </div>
        <div v-if="false" class="operateBox">
            <i v-if="fieldLen>1" @click="$emit('remove')" class="itemBtn deItemBtn iconfont icon-minus">
            </i>
            <i v-if="index==fieldLen-1" @click="$emit('add')" class="itemBtn inItemBtn iconfont icon-plus-file">
            </i>
        </div>
    </div>
</template>

<script>
import Controls from '@/components/Controls/index.js'
export default {
    name: 'Item',
    props: {
        item: {
            type: Object,
            default: () => ({})
        },
        modules: {
            type: Array,
            default: () => []
        },
        index: {
            type: Number,
            default: 0
        },
        fieldLen: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            fields: [],
            fieldItem: {},
            isloading: false
        }
    },
    created() {
        this.getFields()
    },
    methods: {

        checkData() {
            if (!this.$refs.control.submitForm()) {
                return false
            }
            return this.item.fieldId !== '' && this.item.fieldValue !== ''
        },
        moduleChange() {
            this.item.fieldId = ''
            this.item.fieldValue = ''
            this.item.dictCode = ''
            this.getFields()
        },
        fieldChange() {
            this.fields.forEach(item => {
                if (this.item.fieldId == item.fieldId) {
                    this.fieldItem = item
                }
            })
            let { dictCode, cnFieldCaption, controlTypeId } = this.fieldItem
            this.item.dictCode = dictCode
            this.item.controlTypeId = controlTypeId
            this.item.fieldName = cnFieldCaption
        },
        getFields() {
            this.loading = true
            let url = this.Global.baseURL + this.Global.api.v2.fieldShow_get
            let params = {
                moduleCode: this.item.moduleCode,
                type: 'modifyEditSet'
            }
            this.$http.get(url, { params })
                .then(res => {
                    if (res.body.code.toString() === this.Global.RES_OK) {
                        let list = res.body.data || []
                        /* 过滤国家省市区 */
                        this.fields = list.filter(item => item.fieldGroup.toString() !== '1')
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                    this.loading = false
                })
                .catch(err => {
                    this.loading = false
                    this.$message.error(this.$t(this.Global.errorTitle))
                })
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
