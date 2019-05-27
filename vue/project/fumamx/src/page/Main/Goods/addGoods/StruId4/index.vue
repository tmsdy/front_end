<template>
<div class="StruId4">
    <span class="title">
    {{items.strucName}}
    </span>
    <div class="strucListBox">
    <el-row class="strucIdList" style="background:#eef1f6;font-size:12px;">
        <el-col :span="3">
            <!-- 操作 -->
            {{$t('mxpcweb.PP001.PP001List.1540347670738')}}
        </el-col>
        <el-col :span="Math.floor(12/fieldList.length)" v-for="(item,index) in fieldList" :key="index">
            <div class="grid-content">{{item.cnFieldCaption}}<span style="color:#ff7f7f" v-if="item.isNotNull == '1'">*</span></div>
        </el-col>
        <el-col :span="9">
            <!-- 预览（可根据买家采购的不同数量设置不同价格） -->
            <div class="grid-content">
            {{$t('mxpcweb.PP001.PP001List.1543302803172')}}</div>
        </el-col>
    </el-row>
    <el-row class="strucIdList" v-for="(items1, indexs1) in strucIdList1" :key="indexs1" v-show="items1.isShow">
        <el-col :span="3" style="font-size:16px;padding-left:3px;">
            <span class="text-hover" style="margin-right:6px" @click="addStrucIdList1()">+</span>
            <!-- 清除 -->
            <!-- 删除 -->
            <span class="text-hover" style="position:relative;top:-2px;" :title="indexs1 == 0 ? $t('mxpcweb.PP001.PP001List.1543302803388') : $t('mxpcweb.PP001.PP001List.1543302803587')" @click="cutStrucIdList1(items1)">-</span>
        </el-col>
        <el-col :span="Math.floor(12/fieldList.length)" v-for="(item,index) in fieldList" :key="index">
            <div class="grid-content" style="overflow:hidden;">
                <!-- 请输入 -->
                <input v-if="item.controlTypeId == 1"  ref="strucIdList1" :dataId="indexs1 + '' + item.fieldName"  @blur="checkValue" @change="change()" @keyup.enter="checkValue" :showFormat="item.showFormat?item.showFormat:''" type="number" style="border:0;outline:none" :placeholder="$t('mxpcweb.PP001.PP001List.1540348068137')">
                <!-- 请输入 -->
                <input v-else-if="item.controlTypeId == 9"  ref="strucIdList1" :dataId="indexs1 + '' + item.fieldName"  @blur="checkValue" @change="numChange" @keyup.enter="checkValue" :showFormat="item.showFormat?item.showFormat:''" type="number" style="border:0;outline:none" :placeholder="$t('mxpcweb.PP001.PP001List.1540348068137')">
                <!-- 请输入 -->
                <input v-else  ref="strucIdList1" :dataId="indexs1 + '' + item.fieldName"  type="text" style="border:0;outline:none" :placeholder="$t('mxpcweb.PP001.PP001List.1540348068137')">
            </div>
        </el-col>
        <el-col :span="9">
            <div class="grid-content">{{items1.lookData}}</div>
        </el-col>
    </el-row>
    </div>
</div>
</template>

<script>
export default {
    name: 'StruId4',
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
            strucIdList1: [{isShow: true, lookData: ''}],
            fieldList: [],
            list: [{isShow: true, lookData: ''}],
            saleCur: '',
            unit: ''
        }
    },
    created() {
    },
    mounted() {
        this.fieldList = this.items.fieldList
    },
    methods: {
        checkValue (e) {
            let value = e.target.value != '' ? parseFloat(e.target.value) : 0
            let showFormat = e.target.attributes.showFormat.value
            if (showFormat && showFormat != '') {
                let showFormat1 = showFormat.slice(2)
                e.target.value = value.toFixed(showFormat1.length)
            }
            this.change()
        },
        clearData() {
            // console.log(2222222222)
            this.updata([{}])
            // this.saleCur = ''
            // this.unit = ''
        },
        numChange(e) {
            let showFormat = e.target.attributes.showFormat.value
            if (showFormat && showFormat != '') {
                let value = e.target.value != '' ? parseFloat(e.target.value) : 0
                let valueList = (value + '').split('.')
                let length = 0
                if (valueList.length == 2) {
                length = (value + '').split('.')[1].length
                }
                let showFormat1 = showFormat.slice(2)
                if (length > showFormat1.length) {
                    e.target.value = (value + '').substring(0, (value + '').indexOf('.') + showFormat.length + 1)
                }
            }
            this.change()
        },
        selectStruId4(data) {
            // console.log(44444444444444)
            // console.log(data)
            if (data && data.saleCur) {
                this.saleCur = data.saleCur
            }
            if (data && data.unit) {
                this.unit = data.unit
            }
            this.change()
        },
        updata(list) {
            this.list = list
            let list1 = []
            list.forEach(item => {
                // list1.push({isShow: true, lookData: '≥ ' + item[this.fieldList[0].fieldName] + ' 个：' + item[this.fieldList[1].fieldName] + ' 元 / 个'})
                list1.push({isShow: true, lookData: ''})
            })
            if (list1.length == 0) {
                list1.push({isShow: true, lookData: ''})
                this.strucIdList1 = list1
            } else {
                this.strucIdList1 = list1
                let _this = this
                setTimeout(function() {
                    _this.strucIdList1.forEach((item, itemIndex) => {
                        _this.fieldList.forEach((element, index) => {
                            _this.$refs.strucIdList1.forEach((elements, indexs) => {
                                if (elements.getAttribute('dataId') == itemIndex + '' + element.fieldName) {
                                    if (list[itemIndex] && list[itemIndex][element.fieldName]) {
                                        elements.value = list[itemIndex][element.fieldName]
                                        _this.change()
                                    } else {
                                        elements.value = ''
                                        _this.change()
                                    }
                                }
                            })
                        })
                    })
                }, 100)
            }
        },
        change() {
            let unitsaleCur = ' ' + this.saleCur + (this.unit != '' ? ' /' + this.unit : '')
            let unit = ' ' + this.unit + '：'
            this.strucIdList1.forEach((item, indexs) => {
                this.fieldList.forEach((element, index) => {
                    if (indexs != 0 && element.fieldName == 'quantity') {
                        let topValue = ''
                        this.$refs.strucIdList1.forEach(elements => {
                            if (elements.getAttribute('dataId') == (indexs - 1 + '' + element.fieldName)) {
                                topValue = elements.value
                            }
                        })
                        this.$refs.strucIdList1.forEach(elements => {
                            if (elements.getAttribute('dataId') == (indexs + '' + element.fieldName)) {
                                if (parseInt(elements.value) <= parseInt(topValue)) {
                                    elements.value = ''
                                    // '请输入大于' + parseInt(topValue) + '的数值'
                                    this.$message.error(this.$t('mxpcweb.PP001.PP001List.1543303966092', {ok: parseInt(topValue)}))
                                }
                            }
                        })
                    }
                    if (indexs == 0) {
                        let value1 = ''
                        let value2 = ''
                        this.$refs.strucIdList1.forEach(element => {
                            if (element.getAttribute('dataId') == (indexs + 'quantity')) {
                                value1 = element.value
                            }
                            if (element.getAttribute('dataId') == (indexs + 'salePrice')) {
                                value2 = element.value
                            }
                        })
                        if (value1 != '' && value2 != '') {
                            this.strucIdList1[indexs].lookData = '≥ ' + value1 + unit + value2 + unitsaleCur
                        } else {
                            this.strucIdList1[indexs].lookData = ''
                        }
                    } else {
                        let value = ''
                        let values = ''
                        let value1 = ''
                        let value2 = ''
                        this.$refs.strucIdList1.forEach(element => {
                            if (element.getAttribute('dataId') == (indexs - 1 + 'quantity')) {
                                value = element.value
                            }
                            if (element.getAttribute('dataId') == (indexs - 1 + 'salePrice')) {
                                values = element.value
                            }
                            if (element.getAttribute('dataId') == (indexs + 'quantity')) {
                                value1 = element.value
                            }
                            if (element.getAttribute('dataId') == (indexs + 'salePrice')) {
                                value2 = element.value
                            }
                        })
                        if (value1 != '' && value2 != '') {
                            if (value != '' && values != '') {
                                this.strucIdList1[indexs - 1].lookData = value + '~' + (value1 - 1) + unit + values + unitsaleCur
                                this.strucIdList1[indexs].lookData = '≥' + value1 + unit + value2 + unitsaleCur
                            } else {
                                this.strucIdList1[indexs].lookData = '≥' + value1 + unit + value2 + unitsaleCur
                            }
                        } else {
                            this.strucIdList1[indexs].lookData = ''
                        }
                    }
                })
            })
        },
        addStrucIdList1() {
            this.strucIdList1.push({isShow: true, lookData: ''})
            this.list = this.strucIdList1
        },
        cutStrucIdList1(item) {
            item.isShow = false
            let num = 0
            this.strucIdList1.forEach(item => {
                if (item.isShow) {
                    num++
                }
            })
            if (num == 0) {
                this.strucIdList1.push({isShow: true, lookData: ''})
            }
        },
        submitForm() {
            let strucIdListData = []
            this.strucIdList1.forEach((items, itemsIndex) => {
                if (items.isShow) {
                    let itemsData = {}
                    this.fieldList.forEach((elements, elementIndex) => {
                        this.$refs.strucIdList1.forEach(element => {
                            if (element.getAttribute('dataId') == (itemsIndex + '' + elements.fieldName)) {
                                if (element.value != '') {
                                    itemsData[elements.fieldName] = element.value
                                }
                            }
                        })
                    })
                    if (JSON.stringify(itemsData) != '{}') {
                        strucIdListData.push(itemsData)
                    }
                }
            })
            if (this.type == 'edit' && this.isSame(strucIdListData)) {
                return {}
            } else {
                return {
                    strucId_4: strucIdListData
                }
            }
        },
        isSame(list) {
            let isSame = true
            let list1 = []
            this.list.forEach(item => {
                if (JSON.stringify(item) != '{}') {
                    list1.push(item)
                }
            })
            if (list.length == list1.length) {
                list1.forEach((item, index) => {
                    this.fieldList.forEach(element => {
                        if (JSON.stringify(element) != '{}' && JSON.stringify(item) != '{}') {
                            if (item[element.fieldName] != list[index][element.fieldName]) {
                                isSame = false
                            }
                        }
                    })
                })
            } else {
                isSame = false
            }
            return isSame
        }
    },
    components: {
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.StruId4{
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
        }
        .strucIdList:last-child{
            border: 0;
        }
    }
}
</style>
