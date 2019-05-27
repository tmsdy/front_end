<template>
    <div class="TableWrap MXscroll">
        <table class="commonTable" v-if="defaultData.reportType != 2">
            <colgroup>
                <col width="100" v-for="(item,index) in defaultData.fields" :key="index">
            </colgroup>
            <thead>
                <tr>
                    <th v-for="(item,index) in defaultData.fields" :key="index">{{item.value}}</th>
                </tr>
            </thead>
            <tbody v-if="defaultData.reportType == 0">
                <tr v-for="(items,indexs) in tableBody.resultData" :key="indexs">
                    <td v-for="(item,index) in defaultData.fields" :key="index">
                        <component v-if="item.controlTypeId!=17&&item.controlTypeId!=31" v-bind:is="'control'+item.controlTypeId" ref="control" :itemData="item" :value="{value:returnValue(item,items)}"></component>
                        <div v-else>
                            {{items[item.key]?items[item.key]:""}}
                        </div>
                    </td>
                </tr>
            </tbody>
            <!-- 汇总报表 有分组字段 -->
            <template v-if="defaultData.reportType == 1 && isGroupFields">
                <tbody v-for="(value, key, index) in tableBody.resultData" :key="index">
                    <tr v-for="(items,indexs) in value" :key="indexs">
                        <td v-if="indexs==0" :rowspan="value.length">
                            <component v-if="groupFields.controlTypeId!=17&&groupFields.controlTypeId!=31&&groupFields.controlTypeId!=1" v-bind:is="'control'+groupFields.controlTypeId" ref="control" :itemData="groupFields" :value="{value:returnValue(groupFields,items)}"></component>
                            <div v-else>
                                {{key}}
                            </div>
                        </td>
                        <td v-for="(item,index) in groupHeader" :key="index" rowspan='1'>
                            <component v-if="item.controlTypeId!=17&&item.controlTypeId!=31&&item.controlTypeId!=1" v-bind:is="'control'+item.controlTypeId" ref="control" :itemData="item" :value="{value:returnValue(item,items)}"></component>
                            <div v-else>
                                {{items[item.key]?items[item.key]:""}}
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>记录数</td>
                        <td :colspan="groupHeader.length" style="text-align: right">{{value.length}}</td>
                    </tr>
                    <tr v-if="defaultData.avgFields&& defaultData.avgFields.length>0">
                        <td v-for="(item,index) in defaultData.fields" :key="index">
                            <div v-if="index==0">平均值</div>
                            <div v-else>
                                <div v-for="(ele,indexn) in avgFields" :key="indexn">
                                    <span v-if="item.key == ele.key">{{sumData(value,ele.key).min}}</span>
                                    <span v-else>--</span>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr v-if="defaultData.maxFields&&defaultData.maxFields.length>0">
                        <td v-for="(item,index) in defaultData.fields" :key="index">
                            <div v-if="index==0">最大值</div>
                            <div v-else>
                                <div v-for="(ele,indexn) in maxFields" :key="indexn">
                                    <span v-if="item.key == ele.key">{{sumData(value,ele.key).max}}</span>
                                    <span v-else>--</span>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr v-if="defaultData.minFields&&defaultData.minFields.length>0">
                        <td v-for="(item,index) in defaultData.fields" :key="index">
                            <div v-if="index==0">最小值</div>
                            <div v-else>
                                <div v-for="(ele,indexn) in minFields" :key="indexn">
                                    <span v-if="item.key == ele.key">{{sumData(value,ele.key).min}}</span>
                                    <span v-else>--</span>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr v-if="defaultData.sumFields&&defaultData.sumFields.length>0">
                        <td v-for="(item,index) in defaultData.fields" :key="index">
                            <div v-if="index==0">合计</div>
                            <div v-else>
                                <div v-for="(ele,indexn) in sumFields" :key="indexn">
                                    <span v-if="item.key == ele.key">{{sumData(value,ele.key).sum}}</span>
                                    <span v-else>--</span>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </template>
            <tbody v-if="defaultData.reportType == 1">
                <tr v-if="tableBody.maxData&&tableBody.maxData.length>0">
                    <td v-for="(item,index) in defaultData.fields" :key="index">
                        <div v-if="index==0" class="total">最大值</div>
                        <div v-else>
                            <div v-for="(ele,indexn) in tableBody.maxData" :key="indexn">
                                <span v-if="ele.hasOwnProperty(item.key)"> {{ele[item.key]}} </span>
                                <span v-else>--</span>
                            </div>
                        </div>
                    </td>
                </tr>
                <tr v-if="tableBody.minData&&tableBody.minData.length>0">
                    <td v-for="(item,index) in defaultData.fields" :key="index">
                        <div v-if="index==0" class="total">最小值</div>
                        <div v-else>
                            <div v-for="(ele,indexn) in tableBody.minData" :key="indexn">
                                <span v-if="ele.hasOwnProperty(item.key)"> {{ele[item.key]}} </span>
                                <span v-else>--</span>
                            </div>
                        </div>
                    </td>
                </tr>
                <tr v-if="tableBody.avgData&&tableBody.avgData.length>0">
                    <td v-for="(item,index) in defaultData.fields" :key="index">
                        <div v-if="index==0" class="total">平均值</div>
                        <div v-else>
                            <div v-for="(ele,indexn) in tableBody.avgData" :key="indexn">
                                <span v-if="ele.hasOwnProperty(item.key)"> {{ele[item.key]}} </span>
                                <span v-else>--</span>
                            </div>
                        </div>
                    </td>
                </tr>
                <tr v-if="tableBody.sumData&&tableBody.sumData.length>0">
                    <td v-for="(item,index) in defaultData.fields" :key="index">
                        <div v-if="index==0" class="total">合计</div>
                        <div v-else>
                            <div v-for="(ele,indexn) in tableBody.sumData" :key="indexn">
                                <span v-if="ele.hasOwnProperty(item.key)"> {{ele[item.key]}} </span>
                                <span v-else>--</span>
                            </div>
                        </div>
                    </td>
                </tr>
            </tbody>
            <!-- 汇总报表没有求和字段 -->
            <tbody v-if="defaultData.reportType == 1 && !isGroupFields" class="aaa">
                <tr v-for="(items,indexs) in tableBody.resultData" :key="indexs">
                    <td v-for="(item,index) in defaultData.fields" :key="index">
                        <component v-if="item.controlTypeId!=17&&item.controlTypeId!=31" v-bind:is="'control'+item.controlTypeId" ref="control" :itemData="item" :value="{value:returnValue(item,items)}"></component>
                        <div v-else>
                            {{items[item.key]?items[item.key]:""}}
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
        <!-- 交叉报表 -->
        <table class="crossoverTable commonTable" v-if="defaultData.reportType == 2" :class="{ fixTable: crossoverDataCross.length<2}">
            <thead>
                <tr>
                    <th class="first" colspan="2" width="150">
                        <span class="title1">{{defaultData.yField.value}}</span><br>
                        <span class="title2">{{defaultData.countField}}</span><br>
                        <span class="title3">{{defaultData.xField.value}}</span>
                    </th>
                    <th v-for="(val, index) in crossoverDataCross" :key="index" rowspan='1'>
                        <component v-if="crossoverUnifyY.controlTypeId!=17&&crossoverUnifyY.controlTypeId!=31&&crossoverUnifyY.controlTypeId!=1" v-bind:is="'control'+crossoverUnifyY.controlTypeId" ref="control" :itemData="crossoverUnifyY" :value="{value:returnValue(crossoverUnifyY,val)}"></component>
                        <div v-else>
                            {{val[crossoverUnifyY.key]?val[crossoverUnifyY.key]:""}}
                        </div>
                    </th>
                    <th>小计</th>
                    <!-- <tr v-for="(items,indexs) in tableBody.resultData" :key="indexs">
                        <td v-for="(item,index) in defaultData.fields" :key="index">
                            <component v-if="item.controlTypeId!=17&&item.controlTypeId!=31" v-bind:is="'control'+item.controlTypeId" ref="control" :itemData="item" :value="{value:returnValue(item,items)}"></component>
                            <div v-else>
                                {{items[item.key]?items[item.key]:""}}
                            </div>
                        </td>
                    </tr> -->
                </tr>
            </thead>
            <tbody>
                <tr v-for="(ele, index) in crossoverData.resultData" :key="index" rowspan='1'>
                    <td class="first" colspan="2" width="150">
                        <div v-for="(val, key, indexs) in ele" :key="indexs">
                            <div v-if="key == crossoverUnifyX.key">
                                <component v-if="crossoverUnifyX.controlTypeId!=17&&crossoverUnifyX.controlTypeId!=31&&crossoverUnifyX.controlTypeId!=1" v-bind:is="'control'+crossoverUnifyX.controlTypeId" ref="control" :itemData="crossoverUnifyX" :value="{value:val}"></component>
                                <div v-else>
                                    {{ele[crossoverUnifyX.key]?ele[crossoverUnifyX.key]:""}}
                                </div>
                            </div>
                        </div>
                    </td>
                    <td v-for="(val, key, indexs) in ele[crossoverUnifyY.key]" :key="indexs">
                        {{val}}
                    </td>
                    <td>
                        {{ele['countYData']['subtotal']}}
                    </td>
                </tr>
                <tr>
                    <!--  v-if="countXData.hasOwnProperty('key') && countXData.hasOwnProperty('value')" -->
                    <td class="first total" colspan="2" width="150">
                        小计
                    </td>
                    <template v-if="!isNull">
                        <td v-for="(val, key, indexs) in countXData['subtotal']" :key="indexs" class="total">
                            {{val}}
                        </td>
                    </template>
                    <template v-else>
                        <td v-for="(val,index) in crossoverDataCross" :key="index" rowspan='1'>
                            --
                        </td>
                    </template>
                    <td class="total">{{countXData.totalCount}}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import ListShow from '@/components/ListShowControls/index.js'
import { mapGetters } from 'vuex'
export default {
    name: 'tableData',
    props: {
        defaultData: {
            type: Object,
            default: function () {
                return {}
            }
        },
        tableBody: {
            type: Object,
            default: function () {
                return {}
            }
        }
    },
    data() {
        return {
            groupHeader: [],
            groupFields: {
            },
            sumFields: [], // 合计
            isGroupFields: false,
            crossoverData: {},
            crossoverUnifyY: {}, // 交叉报表yField属性
            crossoverDataCross: [], // 交叉报表横向数据
            countYData: {},
            crossoverUnifyX: {}, // 交叉报表xField属性
            countXData: {}, // 交叉报表最底部统计数（后端返回）
            isNull: false
        }
    },
    created() {
    },
    computed: {
        ...mapGetters(['sysBoxValueShow']),
        sumData(x, targetLabel) {
            return function (x, targetLabel) {
                let result = {
                    sum: 0,
                    avg: 0,
                    min: 0,
                    max: 0
                }
                x.forEach(item => {
                    result.sum = result.sum + parseFloat(item[targetLabel])
                    if (result.max < parseFloat(item[targetLabel])) {
                        result.max = parseFloat(item[targetLabel])
                    }
                    if (result.min > parseFloat(item[targetLabel])) {
                        result.min = parseFloat(item[targetLabel])
                    }
                })
                result.avg = result.sum / x.length
                return result
            }
        },
        tableDefaultData() {
            const { tableBody, defaultData } = this
            return {
                tableBody,
                defaultData
            }
        }
    },
    mounted() { },
    methods: {
        returnValue(item, data) {
            if (item.key) {
                return data[item.key]
            }
        },
        editGroupHeader() {
            var groupLabel = this.defaultData.groupFields
            let arrIndex = 0
            this.groupHeader.map((item, index) => {
                if (item.key == groupLabel[0].key) {
                    arrIndex = index
                }
            })
            this.groupHeader.splice(arrIndex, 1)
        },
        processCrossData() {
            this.crossoverData = this.tableBody.resultData
            if (this.crossoverData.hasOwnProperty('resultData') && this.crossoverData.resultData.length > 0) {
                let resultDataY = this.tableBody.resultData.resultData[0]
                this.countYData = resultDataY.countYData
                let yKey = this.crossoverUnifyY.key
                let obj = resultDataY[yKey]
                let objHeader = []
                for (let key in obj) {
                    let item = {}
                    item[yKey] = key
                    objHeader.push(item)
                }
                this.crossoverDataCross = objHeader
            }
            if (this.crossoverData.hasOwnProperty('countXData')) {
                this.countXData = this.crossoverData.countXData
                if (Object.keys(this.countXData['subtotal']).length == 0) {
                    this.isNull = true
                } else {
                    this.isNull = false
                }
            }
        }
    },
    watch: {
        defaultData() {
            if (this.defaultData.reportType == 1) {
                this.groupHeader = JSON.parse(JSON.stringify(this.defaultData.fields))
                if (this.defaultData.groupFields.length > 0) {
                    this.editGroupHeader()
                    this.isGroupFields = true
                }
            }
            if (this.defaultData.hasOwnProperty('groupFields') && this.defaultData.groupFields.length > 0) {
                this.groupFields = this.defaultData.groupFields[0]
            }
            this.sumFields = this.defaultData.sumFields
            this.maxFields = this.defaultData.maxFields
            this.minFields = this.defaultData.minFields
            this.avgFields = this.defaultData.avgFields
            // 交叉报表特有属性
            if (this.defaultData.hasOwnProperty('yField')) {
                this.crossoverUnifyY = this.defaultData.yField
                this.crossoverUnifyX = this.defaultData.xField
            }
        },
        tableDefaultData() {
            if (this.tableBody.hasOwnProperty('resultData')) {
                this.processCrossData()
            }
        }
    },
    components: Object.assign({}, ListShow)
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
