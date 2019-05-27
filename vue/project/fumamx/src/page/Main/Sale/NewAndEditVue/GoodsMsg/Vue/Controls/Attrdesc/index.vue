<template>
<div class="DescriptionBox">
    <div class="Description text-hover ellipsis" @click="dialogOpen()" :title="text">
        {{text}}
    </div>
    <el-dialog title="描述字段" v-dialogDrag :visible.sync="dialog" :closeOnClickModal="false" custom-class="width820" :modal-append-to-body="false">
        <div class="dialog">
            <div class="DescriptionList" v-for="(item, index) in list" :key="index">
                <component optCode="otNew" moduleCode="BF001" style="padding-left:20px;padding-right:20px" labelPosition="left" labelWidth="100px" :key="index" rightWidth="250px" ref="control" v-bind:is="'control'+item.controlTypeId" :itemData="item" :controlData.sync="item.controlData"></component>
            </div>
            <div v-if="list.length == 0">
                暂无描述字段,请前往 <span class="text-hover" style="color:blue" @click="toSeting()">设置-商品大类属性</span> 界面新增。
            </div>
        </div>
        <div slot="footer" style="text-align:center">
            <!-- 取消 -->
            <el-button @click="cancel">{{$t('mxpcweb.client.1529047588840')}}</el-button>
            <!-- 确定 -->
            <el-button type="primary" @click="submit">{{$t('mxpcweb.client.1529047741736')}}</el-button>
        </div>
    </el-dialog>
</div>
</template>

<script>
import Controls from '@/components/Controls/attrdesc.js'
export default {
    name: 'Description',
    props: {
        itemData: {
            type: Object,
            default: function () {
                return {}
            }
        },
        valueData: {
            type: Object,
            default: function () {
                return {}
            }
        },
        styleData: {
            type: String,
            default: ''
        },
        size: {
            type: String,
            default: 'mini'
        }
    },
    data() {
        return {
            list: [],
            text: '',
            dialog: false,
            DescriptionKey: {},
            DescriptionKeyBase: {}
        }
    },
    created() {
    },
    mounted() {
    },
    methods: {
        toSeting() {
            this.dialog = false
            this.$router.push('/main/systemset/goodsClass')
        },
        getData() {
            this.list = []
            if (this.valueData.category == '') {
                return
            }
            let p0 = new Promise((resolve, reject) => {
                this.$http.get(this.Global.baseURL + this.Global.api.v2.document_product_attr, { params: {
                    catgId: this.valueData.category
                } }).then(res => {
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        let list = res.body.data || []
                        resolve(list)
                    } else {
                        resolve([])
                        this.$message.error(this.msg(res.body))
                    }
                }, () => {
                    resolve([])
                    this.$message.error(this.$t(this.Global.errorTitle))
                })
            })
            let p1 = new Promise((resolve, reject) => {
                this.$http.get(this.Global.baseURL + this.Global.api.v2.document_product_attr_sysBox, { params: {
                    catgId: this.valueData.category
                } }).then(res => {
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        let options = res.body.data || []
                        resolve(options)
                    } else {
                        resolve([])
                        this.$message.error(this.msg(res.body))
                    }
                }, () => {
                    resolve([])
                    this.$message.error(this.$t(this.Global.errorTitle))
                })
            })
            Promise.all([p0, p1]).then((results) => {
                let list1 = []
                results[0].forEach(element => {
                    let data = {
                        'cnFieldCaption': element.attrCaption,
                        'controlTypeId': element.controlTypeId,
                        'dictCode': element.dictCode,
                        'fieldName': element.attrName,
                        'inDefaultValue': element.inDefaultValue,
                        'isNotNull': element.isNotNull,
                        'controlData': '',
                        'fieldValue': ''
                    }
                    results[1].forEach(item => {
                        if (data.dictCode == item.dictCode) {
                            data.dictItems = item.dictItems
                        }
                    })
                    list1.push(data)
                })
                this.list = list1
                this.updateShow()
            })
        },
        dialogOpen () {
            if (this.valueData.category == '') {
                this.$message('请先选择商品大类')
                return false
            }
            this.dialog = true
            this.getData()
            if (this.list.length != 0) {
                this.list.forEach(element => {
                    element.fieldValue = this.DescriptionKey[element.fieldName] || ''
                })
                this.$nextTick(() => {
                    this.$refs.control.forEach(element => {
                        element.updata()
                    })
                })
            }
        },
        updata () {
            this.DescriptionKey = this.itemData.fieldValue || {}
            this.DescriptionKeyBase = this.itemData.fieldValue || {}
            this.text = ''
            this.updateShow()
        },
        updatas (value) {
            this.DescriptionKey = value || {}
            this.DescriptionKeyBase = value || {}
            this.text = ''
            this.updateShow()
        },
        updateShow () {
            if (JSON.stringify(this.DescriptionKey) != '{}' && this.list.length != 0) {
                let text = []
                this.list.forEach(element => {
                    element.controlData = this.DescriptionKey[element.fieldName]
                    if (this.DescriptionKey[element.fieldName] && this.DescriptionKey[element.fieldName] != '') {
                        if (element.controlTypeId == 60) {
                            element.dictItems.forEach(item => {
                                if (item.dictItemCode == this.DescriptionKey[element.fieldName]) {
                                    element.controlData = this.DescriptionKey[element.fieldName]
                                    text.push(element.cnFieldCaption + ': ' + item.itemName)
                                }
                            })
                        } else if (element.controlTypeId == 61) {
                            let itemText = []
                            this.DescriptionKey[element.fieldName].split(',').forEach(items => {
                                element.dictItems.forEach(item => {
                                    if (item.dictItemCode == items) {
                                        itemText.push(item.itemName)
                                    }
                                })
                            })
                            if (itemText.length > 0) {
                                text.push(element.cnFieldCaption + ': ' + itemText.join(', '))
                            }
                        } else {
                            text.push(element.cnFieldCaption + ': ' + this.DescriptionKey[element.fieldName])
                        }
                    }
                })
                this.text = text.join('; ')
            }
            this.$emit('update:controlData', this.check(this.DescriptionKey))
        },
        submit() {
            let text = []
            let key = {}
            if (this.$refs.control) {
                let isPass = true
                this.$refs['control'].forEach(item => {
                    if (!item.submitForm()) {
                        isPass = false
                    }
                })
                if (!isPass) {
                    return false
                }
                this.list.forEach(function(element) {
                    if (element.controlData && element.controlData != '' && element.controlData != []) {
                        key[element.fieldName] = element.controlData
                        if (element.controlTypeId == 60) {
                            element.dictItems.forEach(item => {
                                if (item.dictItemCode == element.controlData) {
                                    text.push(element.cnFieldCaption + ': ' + item.itemName)
                                }
                            })
                        } else if (element.controlTypeId == 61) {
                            let itemText = []
                            element.controlData.split(',').forEach(items => {
                                element.dictItems.forEach(item => {
                                    if (item.dictItemCode == items) {
                                        itemText.push(item.itemName)
                                    }
                                })
                            })
                            if (itemText.length > 0) {
                                text.push(element.cnFieldCaption + ': ' + itemText.join(', '))
                            }
                        } else {
                            text.push(element.cnFieldCaption + ': ' + element.controlData)
                        }
                    }
                })
            }
            this.DescriptionKey = key
            this.text = text.join('; ')
            this.$emit('update:controlData', this.check(key))
            this.dialog = false
        },
        check(obj) {
            let newObj = {}
            for (let key in this.DescriptionKeyBase) {
                if (this.DescriptionKeyBase[key] && obj[key]) {
                    if (obj[key] != this.DescriptionKeyBase[key]) {
                        newObj[key] = obj[key]
                    }
                } else if (this.DescriptionKeyBase[key] && !obj[key]) {
                    newObj[key] = ''
                } else if (!this.DescriptionKeyBase[key] && obj[key]) {
                    newObj[key] = obj[key]
                }
            }
            for (let key in obj) {
                if (this.DescriptionKeyBase[key] && obj[key]) {
                    if (obj[key] != this.DescriptionKeyBase[key]) {
                        newObj[key] = obj[key]
                    }
                } else if (this.DescriptionKeyBase[key] && !obj[key]) {
                    newObj[key] = ''
                } else if (!this.DescriptionKeyBase[key] && obj[key]) {
                    newObj[key] = obj[key]
                }
            }
            return newObj
        },
        clearData () {
            this.DescriptionKey = {}
            this.text = ''
        },
        cancel() {
            this.dialog = false
        },
        submitForm() {
            let isPass = true
            this.list.forEach((element) => {
                if (element.isNotNull == 1 && !this.DescriptionKey[element.fieldName]) {
                    isPass = false
                }
            })
            if (!isPass) {
                this.dialogOpen()
                this.$nextTick(() => {
                    this.submit()
                })
                return false
            }
            return true
        }
    },
    components: Object.assign({
    }, Controls),
    watch: {
        valueData() {
            this.getData()
        }
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
    .Description{
        padding-top: 8px;
        height: 32px;
        overflow: hidden;
        font-size: 12px;
        color: #606266;
        background-image: none;
        border: 1px solid transparent;;
        border-radius: 3px;
        :hover{
            border: 1px solid #D0021B;
        }
    }
    .dialog{
        min-height: 100px;
        .DescriptionList{
            display: inline-block;
            width: 49%;
            position: relative;
            line-height: 40px;
            min-height: 50px;
            vertical-align: top;
            .listTitle{
                position: absolute;
                left: 10px;
            }
        }
    }
</style>
