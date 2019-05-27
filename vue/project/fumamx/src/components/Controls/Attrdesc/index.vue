<template>
<div class="DescriptionBox" v-show="list.length != 0">
    <div style="padding-left: 10px;height: 44px;">{{itemData.cnFieldCaption}}</div>
    <div class="dialog">
        <div class="DescriptionList" v-for="(item, index) in list" :key="index" style="width:50%;">
            <component optCode="otNew" style="padding-left:30px;" :labelPosition="labelPosition" :labelWidth="labelWidth" :key="index" :rightWidth="rightWidth" ref="control" v-bind:is="'control'+item.controlTypeId" :itemData="item" :controlData.sync="item.controlData"></component>
        </div>
        <!-- <div v-if="list.length == 0">
            暂无描述字段,请前往 <span class="text-hover" style="color:blue" @click="toSeting()">设置-商品大类属性</span> 界面新增。
        </div> -->
    </div>
</div>
</template>

<script>
import Controls from '@/components/Controls/attrdesc.js'
export default {
    name: 'Description',
    props: {
        size: {
            type: String,
            default: 'small'
        },
        rightWidth: {
            type: String,
            default: '160px'
        },
        labelWidth: {
            type: String,
            default: '100px'
        },
        itemData: {
            type: Object,
            default: function () {
                return {}
            }
        },
        labelPosition: {
            type: String,
            default: 'right'
        },
        isProp: {
            type: Boolean,
            default: false
        },
        showLabel: {
            type: Boolean,
            default: true
        },
        isRow: {
            type: Boolean,
            default: false
        },
        catgId: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            list: [],
            DescriptionKey: {},
            DescriptionKeyBase: {}
        }
    },
    created() {
    },
    mounted() {
        this.getData()
    },
    methods: {
        toSeting() {
            this.$router.push('/main/systemset/goodsClass')
        },
        getData() {
            this.list = []
            if (this.catgId == '') {
                return
            }
            let p0 = new Promise((resolve, reject) => {
                this.$http.get(this.Global.baseURL + this.Global.api.v2.document_product_attr, { params: {
                    catgId: this.catgId
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
                    catgId: this.catgId
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
        updata () {
            this.DescriptionKey = this.itemData.fieldValue || {}
            this.DescriptionKeyBase = this.itemData.fieldValue || {}
            this.updateShow()
        },
        updatas (value) {
            this.DescriptionKey = value || {}
            this.DescriptionKeyBase = value || {}
            this.updateShow()
        },
        updateShow () {
            if (JSON.stringify(this.DescriptionKey) != '{}' && this.list.length != 0) {
                this.list.forEach(element => {
                    element.controlData = this.DescriptionKey[element.fieldName] || ''
                    element.fieldValue = this.DescriptionKey[element.fieldName] || ''
                })
                this.$nextTick(() => {
                    this.$refs.control.forEach(element => {
                        element.updata()
                    })
                })
            }
            this.$emit('update:controlData', this.check(this.DescriptionKey))
        },
        submit() {
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
                    }
                })
            }
            this.DescriptionKey = key
            this.$emit('update:controlData', this.check(key))
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
            this.list = []
        },
        submitForm() {
            this.submit()
            let isPass = true
            this.list.forEach((element) => {
                if (element.isNotNull == 1 && !this.DescriptionKey[element.fieldName]) {
                    isPass = false
                }
            })
            if (!isPass) {
                return false
            }
            return true
        }
    },
    components: Object.assign({
    }, Controls),
    watch: {
        catgId(val) {
            this.getData()
        }
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.DescriptionBox{
    position: relative;
    padding: 10px 0 20px;
    .labelWidth{
        position: absolute;
        left: 0;
        display: inline-block;
    }
    .label:after {
        content: '*';
        color: #ff7f7f;
        margin-left: 3px;
        position: relative;
        top: 2px;
    }
    .Description{
        min-height: 50px;
        display: inline-block;
        resize: vertical;
        padding: 5px 7px;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        font-size: 14px;
        color: #606266;
        background-image: none;
        border: 1px solid #DFE2E4;
        border-radius: 3px;
        -webkit-transition: border-color .2s cubic-bezier(.645,.045,.355,1);
        transition: border-color .2s cubic-bezier(.645,.045,.355,1);
        :hover{
            border: 1px solid #D0021B;
        }
    }
    .dialog{
        .DescriptionList{
            display: inline-block;
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
}
</style>
