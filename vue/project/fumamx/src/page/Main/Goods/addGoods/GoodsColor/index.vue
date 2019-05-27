<template>
<div class="Controls-Color">
    <span class="title" :style="{'width': '100px'}">{{itemData.cnFieldCaption}}</span>
    <el-checkbox-group v-model="checkList" @change="change">
        <div class="spanList" v-for="(item, index) in baseList" :key="index" v-show="item.inUse=='1'">
            <el-checkbox :label="item.dictItemCode + ''">&nbsp;</el-checkbox>
            <span class="colorSpanBox"><span class="colorSpan" v-if="/^[0-9]+$/.test(item.dictItemCode)" :style="{'background': returnColor(item.dictItemCode)}"></span>{{item.itemName + ''}}</span>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <!-- 备注（如偏深偏浅等） -->
            <el-input style="width:160px;" :placeholder="$t('mxpcweb.PP001.PP001List.1543302474420')" v-model="item.remarks"></el-input>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <up-load :value.sync="item.imagesId" ref="upLoad" v-if="itemData.picFlag == '1'" :imagesId="item.imagesId"></up-load>
        </div>
        <div class="spanList">
            <!-- 自定义 -->
            <el-input style="width:150px;" :placeholder="$t('mxpcweb.PP001.PP001List.1543302476771')+itemData.cnFieldCaption" v-model="autoRemarks">
                <el-button slot="append" icon="plus" @click="addOption()"></el-button>
            </el-input>
        </div>
    </el-checkbox-group>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
import upLoad from './upLoad'
export default {
    name: 'Controls-Color',
    props: {
        itemData: {
            type: Object,
            default: function() {
                return {}
            }
        },
        items: {
            type: Object,
            default: function() {
                return {}
            }
        },
        type: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            checkList: [],
            baseList: [],
            autoRemarks: '',
            autoNum: 0
        }
    },
    created() {
        this.getData()
    },
    mounted() {
    },
    computed: {
        ...mapGetters([
        'sysBoxValue'
        ])
    },
    methods: {
        addOption() {
            if (this.autoRemarks != '') {
                let data = {
                    dictItemCode: 'auto' + this.autoNum,
                    itemName: this.autoRemarks,
                    remarks: '',
                    inUse: '1',
                    imagesId: ''
                }
                this.baseList.push(data)
                this.autoNum = this.autoNum + 1
                this.autoRemarks = ''
            }
        },
        returnList () {
            let list = []
            this.baseList.forEach(element => {
                this.checkList.forEach(item => {
                    if (element.dictItemCode == item) {
                        list.push(element)
                    }
                })
            })
            return list
        },
        getData () {
            let options = []
            if (this.sysBoxValue instanceof Array) {
                this.sysBoxValue.forEach(element => {
                    if (element.dictCode == this.itemData.dictCode) {
                        element.dictItems.forEach(item => {
                            let obj = {
                                dictItemCode: item.dictItemCode + '',
                                imagesId: '',
                                remarks: '',
                                itemName: item.itemName,
                                inUse: item.inUse
                            }
                            options.push(obj)
                        })
                    }
                })
            }
            if (this.type == 'edit') {
                this.items[this.itemData.fieldName].forEach(element => {
                    let isHave = false
                    options.forEach(elements => {
                        if (elements.dictItemCode == element.dictItemCode) {
                            isHave = true
                        }
                    })
                    if (!isHave) {
                        this.autoNum = this.autoNum + 1
                        options.push(element)
                    }
                })
            }
            this.baseList = options
        },
        submitForm() {
            let data = {}
            data[this.itemData.fieldName] = this.returnList()
            return data
        },
        updatas(value) {
            let list = value && value != '' ? value : []
            list.forEach(element => {
                let isHave = false
                this.baseList.forEach(elements => {
                    if (elements.dictItemCode == element.dictItemCode) {
                        isHave = true
                    }
                })
                if (!isHave) {
                    this.baseList.push(element)
                    this.autoNum = this.autoNum + 1
                }
            })
            let checkList = []
            if (list.length > 0) {
                list.forEach(item => {
                    checkList.push(item.dictItemCode + '')
                })
                list.forEach(item => {
                    this.baseList.forEach(element => {
                        if (item.dictItemCode + '' == element.dictItemCode + '') {
                            element.remarks = item.remarks
                            element.imagesId = item.imagesId
                        }
                    })
                })
            }
            this.checkList = checkList

            this.change()
            if (this.$refs.upLoad) {
                this.$refs.upLoad.forEach(item => {
                    item.updata()
                })
            }
        },
        updata() {
            let list = this.itemData.fieldValue && this.itemData.fieldValue != '' ? this.itemData.fieldValue : []
            let checkList = []
            if (list.length > 0) {
                list.forEach(item => {
                    checkList.push(item.dictItemCode + '')
                })
                list.forEach(item => {
                    this.baseList.forEach(element => {
                        if (item.dictItemCode + '' == element.dictItemCode + '') {
                            element.remarks = item.remarks
                            element.imagesId = item.imagesId
                        }
                    })
                })
            }
            this.checkList = checkList
            this.change()
            if (this.$refs.upLoad) {
                this.$refs.upLoad.forEach(item => {
                    item.updata()
                })
            }
        },
        change() {
            this.$emit('colorChange', this.returnList())
        },
        returnColor(code) {
            let codes = parseInt(code)
            let color = codes.toString(16)
            if (color.length == '1') {
                color = '00000' + color
            } else if (color.length == '2') {
                color = '0000' + color
            } else if (color.length == '3') {
                color = '000' + color
            } else if (color.length == '4') {
                color = '00' + color
            } else if (color.length == '5') {
                color = '0' + color
            }
            return '#' + color
        }
    },
    components: {
        'up-load': upLoad
    },
    watch: {
        itemData(val) {
            this.getData()
        }
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.Controls-Color{
    min-height: 36px;
    margin-bottom: 10px;
    padding-left: 100px;
    position: relative;
    .title{
        position: absolute;
        top: 0;
        left: 0;
        display: inline-block;
    }
    .spanList{
        height: 44px;
        .colorSpanBox{
            display: inline-block;
            width:200px;
            height:32px;
            line-height: 29px;
            border-radius:3px;
            border: 1px solid #eaedef;
            padding-left: 10px;
            .colorSpan{
                display: inline-block;
                width: 16px;
                height: 16px;
                vertical-align: middle;
                border-radius: 2px;
                border: 1px solid #eaedef;
                margin-right: 10px;
            }
        }
    }
}
</style>
