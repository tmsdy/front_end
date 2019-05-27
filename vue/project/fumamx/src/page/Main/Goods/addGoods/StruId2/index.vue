<template>
<span class="StruId2">
    <span class="title">
        {{items.strucName}}
    </span>
    <div style="height:44px;">
        <!-- 批量填充： -->
        {{$t('mxpcweb.PP001.PP001List.1540348051584')}}
        <template v-for="(item, index) in fieldList">
            <span :key="index" v-if="item.controlTypeId != '11' && item.controlTypeId != '51'">
                <el-input v-if="item.controlTypeId != 9" style="width:120px;margin-right:10px;" :key="index" :placeholder="item.cnFieldCaption" v-model="item.controlData"></el-input>
                <el-input-number v-else v-model="item.controlData" :key="index" style="width:120px;margin-right:10px;" :placeholder="item.cnFieldCaption" :controls="false"></el-input-number>
            </span>
        </template>
        <!-- 确定 -->
        <el-button @click="update()">{{$t('mxpcweb.PP001.PP001List.1543302086532')}}</el-button>
    </div>
    <div class="strucListBox">
        <el-row class="strucIdList" style="background:#eef1f6;font-size:12px;">
            <el-col :span="Math.floor(24/fieldList.length)" v-for="(item,index) in fieldList" :key="index">
                <div class="grid-content">{{item.cnFieldCaption}}<span style="color:#ff7f7f" v-if="item.isNotNull == '1'">*</span></div>
            </el-col>
        </el-row>
        <el-row class="strucIdList" v-for="(items1, indexs1) in strucIdList2" :key="indexs1">
            <el-col :span="Math.floor(24/fieldList.length)" v-for="(item,index) in fieldList" :key="index">
                <div class="grid-content" style="overflow:hidden;">
                    <div v-if="item.controlTypeId == '11' || item.controlTypeId == '51'" ref="strucIdList2" :dataId="indexs1 + '' + item.fieldName" :value="items1[item.fieldName]">{{returnFieidValue(items1[item.fieldName], item.dictCode)}}&nbsp;</div>
                    <!-- 请输入 -->
                    <input v-else-if="item.controlTypeId == 9" ref="strucIdList2" @change="change" :dataId="indexs1 + '' + item.fieldName" @blur="checkValue" @keyup.enter="checkValue" :showFormat="item.showFormat?item.showFormat:''" type="number" style="border:0;outline:none" :placeholder="$t('mxpcweb.PP001.PP001List.1540348068137')">
                    <!-- 请输入 -->
                    <input v-else ref="strucIdList2" :dataId="indexs1 + '' + item.fieldName" type="text" style="border:0;outline:none" :placeholder="$t('mxpcweb.PP001.PP001List.1540348068137')">
                </div>
            </el-col>
        </el-row>
    </div>
</span>
</template>

<script>
export default {
    name: 'StruId2',
    props: {
        items: {
            type: Object,
            default: function () {
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
            strucIdList2: [],
            fieldList: [],
            list: [], // 数据备份
            colorList: [],
            sizeList: []
        }
    },
    created() {
    },
    mounted() {
        this.fieldChange()
    },
    methods: {
        clearData() {
            this.updata([])
        },
        change (e) {
            // console.log(1111111111)
            // let showFormat = e.target.attributes.showFormat.value
            // console.log(showFormat)
            // if (showFormat && showFormat != '') {
            //     let value = parseFloat(e.target.value)
            //     let valueList = (value + '').split('.')
            //     let length = 0
            //     if (valueList.length == 2) {
            //         length = (value + '').split('.')[1].length
            //     }
            //     let showFormat1 = showFormat.slice(2)
            //     if (length > showFormat.length) {
            //         e.target.value = (value + '').substring(0, (value + '').indexOf('.') + showFormat1.length + 1)
            //     }
            // }
        },
        checkValue (e) {
            let showFormat = e.target.attributes.showFormat.value
            if (showFormat && showFormat != '') {
                let value = parseFloat(e.target.value)
                let showFormat1 = showFormat.slice(2)
                e.target.value = value.toFixed(showFormat1.length)
            }
        },
        returnFieidValue(dictItemCode, dictCode) {
            let value = ''
            if (dictCode == '35') {
                this.colorList.forEach(item => {
                    if (dictItemCode == item.dictItemCode) {
                        value = item.itemName
                    }
                })
            } else if (dictCode == '36') {
                this.sizeList.forEach(item => {
                    if (dictItemCode == item.dictItemCode) {
                        value = item.itemName
                    }
                })
            }
            return value
        },
        fieldChange() {
            this.fieldList = this.items.fieldList
        },
        addList() {
            let list = []
            if (this.colorList.length != 0) {
                this.colorList.forEach(item => {
                    if (this.sizeList.length != 0) {
                        this.sizeList.forEach(items => {
                            let data = {
                                spec1: item.dictItemCode,
                                spec2: items.dictItemCode
                            }
                            list.push(data)
                        })
                    } else {
                        let data = {
                            spec1: item.dictItemCode
                        }
                        list.push(data)
                    }
                })
            } else {
                this.sizeList.forEach(item => {
                    if (this.colorList.length != 0) {
                        this.colorList.forEach(items => {
                            let data = {
                                spec1: items.dictItemCode,
                                spec2: item.dictItemCode
                            }
                            list.push(data)
                        })
                    } else {
                        let data = {
                            spec2: item.dictItemCode
                        }
                        list.push(data)
                    }
                })
            }
            this.strucIdList2 = list
        },
        colorChange(list) {
            this.colorList = list
            this.addList()
        },
        sizeChange(list) {
            this.sizeList = list
            this.addList()
        },
        updata(list) {
            this.addList()
            if (list.length == 0) {
                return false
            }
            let time = setTimeout(() => {
                this.strucIdList2.forEach((item, itemIndex) => {
                    this.fieldList.forEach((element, index) => {
                        this.$refs.strucIdList2.forEach((elements, indexs) => {
                            if (elements.getAttribute('dataId') == itemIndex + '' + element.fieldName) {
                                let value = list[itemIndex][element.fieldName]
                                if (list[itemIndex] && value) {
                                    if (element.controlTypeId == '11') {
                                        elements.innerHTML = value != '' ? value : '&nbsp;'
                                    } else {
                                        elements.value = value
                                    }
                                } else {
                                    if (element.controlTypeId == '11') {
                                        elements.innerHTML = ''
                                    } else {
                                        elements.value = ''
                                    }
                                }
                            }
                        })
                    })
                    if (list[itemIndex].skuId && list[itemIndex].skuId != '') {
                        item.skuId = list[itemIndex].skuId
                    }
                })
                window.clearTimeout(time)
            }, 1000)
        },
        isSame(list) {
            let isSame = true
            if (list.length == this.list.length) {
                this.list.forEach((item, index) => {
                    this.fieldList.forEach(element => {
                        if (element.controlTypeId != '11' && item[element.fieldName] != list[index][element.fieldName]) {
                            isSame = false
                        }
                    })
                })
            } else {
                isSame = false
            }
            return isSame
        },
        optAdd(type) {
            if (type == 'add') {
                this.strucIdList2.push({})
            }
        },
        update() {
            this.fieldList.forEach((elements, elementIndex) => {
                if (elements.controlData != '' && elements.controlTypeId != '11' && elements.controlTypeId != '51') {
                    this.$refs.strucIdList2.forEach(element => {
                        if (element.getAttribute('dataId').indexOf(elements.fieldName) != -1) {
                            element.value = elements.controlData
                        }
                    })
                }
            })
        },
        submitForm() {
            let _this = this
            let strucIdListData = []
            _this.strucIdList2.forEach((items, itemsIndex) => {
                let itemsData = {}
                _this.fieldList.forEach((elements, elementIndex) => {
                    _this.$refs.strucIdList2.forEach(element => {
                        if (element.getAttribute('dataId') == (itemsIndex + '' + elements.fieldName)) {
                            if (element.value && element.value != '') {
                                itemsData[elements.fieldName] = element.value
                            }
                            if (element.getAttribute('value') && element.getAttribute('value') != '') {
                                itemsData[elements.fieldName] = element.getAttribute('value')
                            }
                        }
                    })
                })
                if (JSON.stringify(itemsData) != '{}') {
                    if (items.skuId) {
                        itemsData.skuId = items.skuId
                    }
                    strucIdListData.push(itemsData)
                }
            })
            if (this.type == 'edit' && this.isSame(strucIdListData)) {
                return {}
            } else {
                return {
                    strucId_2: strucIdListData
                }
            }
        }
    },
    components: {
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.StruId2{
    >.title{
        position: absolute;
        left: -4px;
    }
    .strucListBox{
        border: 1px solid #DFE2E4;
        width:100%;
        max-width:897px;
        .strucIdList{
            height: 32px;
            line-height: 32px;
            border-bottom: 1px solid #DFE2E4;
            padding-left: 50px;
            position: relative;
            /* 谷歌 */
            input::-webkit-outer-spin-button,
            input::-webkit-inner-spin-button {
                -webkit-appearance: none;
                appearance: none;
                margin: 0;
            }
            /* 火狐 */
            input{
                -moz-appearance:textfield;
            }
            .optAdd{
                position: absolute;
                right: -64px;
                width: 64px;
                padding-left: 12px;
                >span{
                    width: 16px;
                    height: 16px;
                    line-height: 15px;
                    text-align: center;
                    border-radius: 16px;
                    color: white;
                    background: #D0021B;
                    display: inline-block;
                    margin-right: 5px;
                    &:hover {
                        cursor: pointer;
                    }
                }
            }
        }
        .strucIdList:last-child{
            border: 0;
        }
    }
}
</style>
