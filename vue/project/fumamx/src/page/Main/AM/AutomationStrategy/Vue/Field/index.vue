<template>
    <div class="Field typePanelBox">
        <el-radio-group v-model="selItem" @change="fieldTypeChange">
            <div v-for="(item,index) in details" v-if="item.useFlag==1" class="itemline" :key="index">
                <el-radio :label="item" :disabled="item.confirmType!=selItem.confirmType&&isModify">
                    {{item.showName}}
                    <span v-if="item.childParams" v-for="(item2,index2) in item.childParams" :key="index2">
                        <template v-if="item[item.paramsKey]==fieldItem[item.paramsKey]">
                            <div class="contrlBox" v-if="item2.virtualControlType==8">
                                <el-checkbox @change="setItem(item2)" :checked="fieldItem[item2.paramsKey]==item2[item2.paramsKey]">
                                    {{item2.showName}}
                                </el-checkbox>
                            </div>
                            <div class="contrlBox" v-if="item2.virtualControlType==3" :key="index2">
                                <el-select v-for="(item,index) in [0,1,2]" :loading="isFieldLoading" v-model="fieldsArray[item]" @change="fieldChange(item2)" class="fieldSel" :key="index" placeholder="请选择">
                                    <el-option v-for="item in moduleFields" :disabled="fieldsArray.includes(item.fieldId)" :key="item.fieldId" :label="item.showName" :value="item.fieldId">
                                    </el-option>
                                </el-select>
                            </div>
                        </template>
                    </span>
                </el-radio>
            </div>
        </el-radio-group>
    </div>
</template>

<script>
export default {
    name: 'Field',
    props: {
        details: {
            type: Array,
            default: () => []
        },
        moduleCode: {
            type: String,
            default: ''
        },
        isModify: {
            type: Boolean,
            default: false
        },
        value: {
            type: Object,
            default: () => ({})
        }
    },
    model: {
        prop: 'value',
        event: 'change'
    },

    data() {
        return {
            isFieldLoading: false,
            moduleFields: [],
            fieldItem: this.value,
            selItem: {},
            fieldsArray: []
        }
    },
    computed: {
        paramsKeySet() {
            let set = new Set()
            this.details.forEach(item => {
                set.add(item.paramsKey)
                if (item.childParams) {
                    item.childParams.forEach(item2 => {
                        set.add(item2.paramsKey)
                    })
                }
            })
            return set
        }
    },
    created() {
        this.setSelItem()
        this.getModuleFields()
    },
    mounted() {
        this.fieldsArray = this.value['fieldsArray'] || []
    },
    methods: {
        setSelItem() {
            this.details.forEach(item => {
                let paramsKey = item.paramsKey
                if (item[paramsKey] == this.fieldItem[paramsKey]) {
                    this.selItem = item
                }
            })
        },

        fieldTypeChange(item) {
            this.fieldsArray = []
            let paramsKey = item.paramsKey
            let temp = { [paramsKey]: item[paramsKey] }
            let tempItem = Object.assign({}, this.fieldItem, temp)
            this.paramsKeySet.forEach(item => {
                if (item != paramsKey) {
                    delete tempItem[item]
                }
            })

            this.fieldItem = Object.assign({}, tempItem)

            this.$emit('itemChange', Object.assign({}, temp), item.showName)
        },
        setItem(item) {
            if (this.fieldItem[item.paramsKey] == item[item.paramsKey]) {
                this.fieldItem[item.paramsKey] = ''
            } else {
                this.fieldItem[item.paramsKey] = item[item.paramsKey]
            }
        },
        fieldChange(item) {
            let arr = []
            this.fieldsArray.forEach(item => {
                arr.push(item)
            })

            this.fieldItem = Object.assign({}, this.fieldItem, { [item.paramsKey]: arr })
        },
        getModuleFields() {
            this.isFieldLoading = true
            let url = this.Global.baseURL + this.Global.api.v2.autoStrategy_controlTypeV2
            let data = {
                params: {
                    actionId: 0,
                    dataType: 'modules_rely_fields',
                    moduleCode: this.moduleCode
                }
            }
            this.$http.get(url, data)
                .then(res => {
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        this.moduleFields = res.body.data.list
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                    this.isFieldLoading = false
                })
                .catch(err => {
                    this.isFieldLoading = false
                    this.$message.error(this.$t(this.Global.errorTitle))
                })
        }

    },
    watch: {
        fieldItem: {
            handler() {
                this.$emit('change', this.fieldItem)
            },
            deep: true
        }
    },
    components: {

    }
}
</script>
<style lang='less' rel='stylesheet/less' scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
