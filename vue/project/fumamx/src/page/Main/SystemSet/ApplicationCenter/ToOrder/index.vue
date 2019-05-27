<template>
    <div class="ToOrder" ref="ToOrder">
        <div class="header">
            <el-button class="pull-right" @click="$emit('close')">返回</el-button>
            <span>续费和升级配置</span>
            <!-- <el-button class="reset" type="primary" @click="resetData" :loading="isLoading">重置</el-button> -->
        </div>
        <div class="leftBox MXscroll">
            <div class="table">
                <table>
                    <tr>
                        <th>当前配置</th>
                        <th></th>
                    </tr>
                    <tr>
                        <td>套餐名称：<span>{{selectConfig.pkname}}</span></td>
                        <td>到期时间：<span>{{selectConfig.expirationtime ? selectConfig.expirationtime.split(' ')[0] : ''}}</span></td>
                    </tr>
                    <tr>
                        <td>用户许可数：<span>{{selectConfig.authcount}}</span></td>
                        <td>云空间：<span>{{selectConfig.spacecount+'G'}}</span></td>
                    </tr>
                </table>
            </div>
            <dl class="orderTop">
                <dt>
                    <el-checkbox v-model="checked02" @change="changeCheck02" :disabled="checked01 || minYear>3 || noUpPackage">升级</el-checkbox>
                </dt>
                <template v-if="checked02">
                    <dt>套餐名称</dt>
                    <dd class="btns">
                        <template v-for="(item,index) in pkData">
                            <span :key="index" class="mx_btn" @click="formObj.pkValue = item.pkCode; getPrice()" :class="[formObj.pkValue == item.pkCode ? 'active' :'']">{{item.cnName}}</span>
                        </template>
                    </dd>
                    <dd style="margin-top:8px;">升级后套餐：<span style="color:#d0021b">{{getpkName}}</span></dd>
                    <dt>选择升级时间：</dt>
                    <dd class="stepperBox btns">
                        <template v-for="(item,index) in upYearData">
                            <span class="mx_btn" @click="choiceUpYear(item.value)" :key="index" :class="[item.text && item.text != '' ? 'mx_gift' : '', upgradeYear == item.value? 'active' :'',item.value< minYear? 'disable': '']" v-show="isFlag || item.value !=1">
                                {{item.value}}年</span>
                        </template>
                    </dd>
                    <dd style="margin-top:8px;">升级后到期时间：<span style="color:#d0021b">{{upEndTime}}</span></dd>
                </template>
            </dl>
            <dl class="orderTop">
                <dt>
                    <span class="pull-right">剩余天数：{{selectConfig.totalDays - selectConfig.useDays}}天</span>
                    <el-checkbox v-model="checked01" @change="changeCheck01" :disabled="checked02">续费</el-checkbox>
                </dt>
                <template v-if="checked01">
                    <dt>购买时长</dt>
                    <dd class="btns">
                        <template v-for="(item,index) in yearData">
                            <span class="mx_btn" :key="index" @click="formObj.yearValue = item.value; getPrice()" :class="[item.text && item.text != '' ? 'mx_gift' : '', formObj.yearValue == item.value ? 'active' :'']" v-show="isFlag || item.value !=1">
                                {{item.value}}年
                                <div class="tip" v-if="item.text && item.text != ''&&item.offCost!=0">{{item.value}}年付立省¥ {{item.offCost}}元 </div>
                            </span>
                        </template>
                    </dd>
                    <dd style="margin-top:8px;">购买后到期时间：<span style="color:#d0021b">{{getEndTime}}</span></dd>
                </template>
            </dl>
            <dl class="orderTop">
                <dt>
                    <el-checkbox v-model="checked03" @change="changeCheck03">增加用户</el-checkbox>
                </dt>
                <template v-if="checked03">
                    <dt>用户许可数</dt>
                    <dd>
                        <el-input-number @change="changeUser" v-model="formObj.memberNum" :min="1" :max="999" :step="1" style="margin-bottom:10px;"></el-input-number>
                    </dd>
                    <dd>
                        购买后用户许可数：<span style="color:#d0021b">{{selectConfig.authcount + formObj.memberNum}}人</span>
                    </dd>
                </template>
            </dl>
            <dl class="orderTop" style="margin-bottom:60px;">
                <dt>
                    <!-- <span class="pull-right">剩余空间：33333GB</span> -->
                    <el-checkbox v-model="checked04" @change="changeCheck04">增加云空间</el-checkbox>
                </dt>
                <template v-if="checked04">
                    <dt>云空间</dt>
                    <dd>
                        <el-input-number @change="changeSpace" v-model="formObj.spaceAdd" :min="20" :max="10000" :step="20" style="margin-bottom:10px;"></el-input-number>
                    </dd>
                    <dd>
                        购买后云空间：<span style="color:#d0021b">{{selectConfig.spacecount + formObj.spaceAdd}}GB</span>
                    </dd>
                </template>
            </dl>

        </div>
        <div class="rightBox orderSheet">
            <div class="top">购物清单</div>
            <div class="current" v-if="checked01||checked02||checked03||checked04">
                <span>当前配置</span>
                <ul>
                    <li>
                        <span>产品名称：</span>
                        <em>{{getpkName==''?selectConfig.pkname:getpkName}}</em>
                    </li>
                    <li>
                        <span>到期时间：</span>
                        <!-- 续费时 upEndTime，升级时getEndTime， 都不选时原到期时间-->
                        <em>{{checked01?getEndTime:checked02?upEndTime:selectConfig.expirationtime.split(' ')[0]}}</em>
                    </li>
                    <li>
                        <span>用户许可数：</span>
                        <em>{{checked03?selectConfig.authcount + formObj.memberNum : selectConfig.authcount}}</em>
                    </li>
                    <li>
                        <span>云空间：</span>
                        <em>{{availSpace}}G</em>
                    </li>
                </ul>
            </div>
            <template v-if="checked01">
                <div class="title">
                    <div>续费<span>{{selectConfig.pkname}} ({{priceConfig.packageMember}}用户)</span></div>
                    <em :class="priceConfig.offCost != 0 ?'original':''">￥{{priceConfig.standandPrice + priceConfig.offCost}}</em>
                </div>
                <ul>
                    <li v-show="priceConfig.offCost != 0">
                        <div class="left"><span class="gift">省</span>{{formObj.yearValue}}年付立省{{Math.abs(priceConfig.offCost)}}元</div>
                        <em class="blod">￥{{priceConfig.standandPrice}}</em>
                    </li>
                </ul>
            </template>
            <template v-if="checked02">
                <div class="title">
                    <div>升级<span>{{getpkName}} ({{priceConfig.packageMember}}用户)</span></div>
                    <em :class="priceConfig.offCost != 0 ?'original':''" class="blod">￥{{priceConfig.standandPrice + priceConfig.offCost}}</em>
                </div>
                <ul>
                    <li v-show="priceConfig.offCost != 0">
                        <div class="left"><span class="gift">省</span>{{upgradeYear}}年付立省{{Math.abs(priceConfig.offCost)}}元</div>
                        <em class="blod">￥{{priceConfig.standandPrice}}</em>
                    </li>
                </ul>
            </template>
            <template v-if="isAddMember">
                <div class="title">
                    <div>增加用户*{{priceConfig.outMember != 0 ? priceConfig.outMember : formObj.memberNum}}用户</div>
                    <em class="blod">￥{{priceConfig.memberCost}}</em>
                </div>
                <ul>
                    <li>
                        <span>费用小计：</span>
                        <span v-if="checked01 && priceConfig.outMember != 0 && checked03">
                            {{priceConfig.costOfMember}}元/ 365天*({{priceConfig.totalDays}}天 - {{priceConfig.useDays}}天)
                            *{{priceConfig.outMember == 0 ? formObj.memberNum :priceConfig.outMember}}用户
                            <em v-show="priceConfig.outMember!=0">+</em>
                        </span>
                        <span v-else-if="checked02 || priceConfig.outMember == 0">
                        </span>
                        <span v-else>
                            {{priceConfig.costOfMember}}元/ 365天*({{selectConfig.totalDays}}天 - {{selectConfig.useDays}}天)
                            *{{priceConfig.outMember}}用户
                            <em v-show="priceConfig.outMember!=0 && (checked02 || checked01)">+</em>
                        </span>
                        <span v-if="priceConfig.outMember!=0 &&checked02">{{priceConfig.costOfMember}}元*{{priceConfig.outMember}}用户*{{upgradeYear}}年 </span>
                        <span v-if="priceConfig.outMember!=0 &&checked01">{{priceConfig.costOfMember}}元*{{priceConfig.outMember}}用户*{{formObj.yearValue}}年</span>
                        <span><i v-if="priceConfig.memberCost!=0"> = </i>{{priceConfig.memberCost}}元</span>
                    </li>
                </ul>
            </template>
            <template v-if="isAddSpace">
                <div class="title">
                    <div>增加云空间 {{checked01||checked02?originalAddSpace+formObj.spaceAdd:formObj.spaceAdd}}G</div>
                    <em class="blod">￥{{priceConfig.spaceCost + priceConfig.hisSpaceCost}}</em>
                </div>
                <ul>
                    <li class="space">
                        <span>费用小计：</span>
                        <!-- 升级 -->
                        <span v-if="checked02">
                            <!-- 原套餐增加过空间 -->
                            <i v-show="originalAddSpace !=0">{{originalAddSpace}}G/20G*500元/365天*({{upgradeYear}}年*365天 -({{priceConfig.totalDays}}天 - {{priceConfig.useDays}}天)) <i v-show="formObj.spaceAdd!=0">+</i></i>
                            <i v-show="formObj.spaceAdd!=0">{{formObj.spaceAdd}}G/20G*500元*{{upgradeYear}}年</i>
                        </span>
                        <!-- 续费 -->
                        <span v-else-if="checked01">
                            <!-- 把现在增加的空间数在套餐剩下的时间内补齐-->
                            <i v-show="formObj.spaceAdd!=0">{{formObj.spaceAdd}}G/20G*500元/365天*({{priceConfig.totalDays}}天 - {{priceConfig.useDays}}天)+</i>
                            <i>{{originalAddSpace+formObj.spaceAdd}}G/20G*500元*{{formObj.yearValue}}年</i>
                        </span>
                        <!-- 仅仅增加空间 -->
                        <span v-else>
                            {{formObj.spaceAdd}} G/20G*500元/ 365天*({{selectConfig.totalDays}}天 - {{selectConfig.useDays}}天)
                        </span>
                        <span>={{priceConfig.spaceCost + priceConfig.hisSpaceCost}}元</span>
                    </li>
                </ul>
            </template>
            <template v-if="checked02">
                <ul>
                    <li class="listTitle">
                        <span>原套餐剩余金额抵扣</span>
                        <em class="red">-￥{{priceConfig.leftValue}}</em>
                    </li>
                    <li>
                        <div class="left">原套餐金额</div>
                        <em class="original">￥{{priceConfig.actualreceiveamount}}</em>
                    </li>
                    <li>
                        <span>费用小计：</span>
                        <span>（{{priceConfig.totalDays}}天-{{priceConfig.useDays}}天）/{{priceConfig.totalDays}}天 *{{priceConfig.actualreceiveamount}}元 = {{priceConfig.leftValue}}元</span>
                    </li>
                </ul>
            </template>
            <dl v-if="priceConfig.totalCost">
                <dt v-show="isChecked">￥<span>{{returnFloat(priceConfig.totalCost)}}元</span></dt>
            </dl>

            <div class="submit">
                <el-button class="widthFull" style="height:40px;" type="primary" @click="submit()" :loading="submitLoading" :disabled="!checked01 && !checked02 && !checked03 && !checked04">立即购买</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getStore } from '@/libs/utils.js'
export default {
    name: 'ToOrder',
    props: {},
    data() {
        return {
            upYearData: [
                {
                    value: 1,
                    text: ''
                },
                {
                    value: 2,
                    text: ''
                },
                {
                    value: 3,
                    text: ''
                }
            ],
            minYear: 1,
            upgradeYear: 1, // 升级年限
            submitLoading: false,
            checked01: false,
            yearData: [
                {
                    value: 1
                },
                {
                    value: 2
                },
                {
                    value: 3
                }
            ],
            checked02: true,
            pkData: [
                {
                    value: 'PK0001',
                    label: 'CRM'
                },
                {
                    value: 'PK0002',
                    label: '发现'
                },
                {
                    value: 'PK0003',
                    label: '营销云'
                },
                {
                    value: 'PK0006',
                    label: '销售云-Pro'
                },
                {
                    value: 'PK0005',
                    label: '销售云-企业版'
                }
            ],
            checked03: false,
            checked04: false,
            formObj: {
                yearValue: 1, // 续费年限
                pkValue: '',
                memberNum: 5,
                spaceAdd: 0
            },
            selectConfig: {}, // 客户订单配置
            priceConfig: {}, // 选配置后 算出来的结果
            // activityConfig: {}, // 选配置后 算出来的活动优惠
            currentActivity: {}, // 正在进行的活动
            usesAmount: 0,
            // saveMoney: 0,
            isDiscounts: true,
            isFlag: true,
            isChecked: true,
            currentPkcode: '',
            isLoading: false,
            isActivity: true,
            noUpPackage: false // 是否有可升级的套餐
        }
    },
    async created() {
        await this.getData()
        await this.getAllPackage()
        await this.getPrice()
        if (this.minYear > 3) {
            this.checked02 = false
        }
    },
    computed: {
        ...mapGetters(['company']),
        upEndTime() {
            var now = new Date()
            let upMonth = this.upgradeYear
            let myDate = now.setFullYear(now.getFullYear() + upMonth)
            return new Date(myDate).toLocaleDateString()
        },
        getEndTime() {
            if (this.selectConfig.hasOwnProperty('expirationtime')) {
                var myDate = new Date(this.selectConfig.expirationtime.replace(/-/g, '/'))
                // if (this.activityConfig.type == 'day') {
                //     myDate = myDate.setDate(myDate.getDate() + this.activityConfig.moneyCut)
                //     myDate = new Date(myDate)
                // }
                let newDate = this.DateAdd(this.formObj.yearValue, myDate)
                return newDate.toLocaleDateString()
            }
        },
        getpkName() {
            if (this.formObj.pkValue != '') {
                let clickItem = this.pkData.filter((item) => {
                    return item.pkCode == this.formObj.pkValue
                })
                if (clickItem.length > 0) {
                    return clickItem[0].cnName
                } else {
                    return ''
                }
            }
        },
        notAllChecked() {
            let allFalse
            if (!this.checked01 && !this.checked02 && !this.checked03 && !this.checked04) {
                allFalse = true
            }
            return allFalse
        },
        //  最终可以用的空间
        availSpace() {
            if (this.checked04) {
                return this.selectConfig.spacecount + this.formObj.spaceAdd + this.formObj.memberNum * 20
            } else {
                return this.selectConfig.spacecount + this.formObj.memberNum * 20
            }
        },
        // 原来增加的空间
        originalAddSpace() {
            return this.selectConfig.spacecount - this.selectConfig.authcount * 20
        },
        // 清单列表是否显示增加用户
        isAddMember() {
            let isAdd = (this.priceConfig.outMember != 0 && this.checked02) || this.checked03 || (this.priceConfig.outMember != 0 && this.checked01)
            return isAdd
        },
        // 清单列表是否显示增加云空间
        isAddSpace() {
            let isSpace = this.checked04 || (this.originalAddSpace > 0 && this.checked02) || (this.originalAddSpace > 0 && this.checked01)
            return isSpace
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.getWinHeight()
            $(window).resize(() => {
                this.getWinHeight()
            })
        })
    },
    methods: {
        async getAllPackage() { // 全部套餐
            await this.$http.get(this.Global.baseURL + this.Global.api.v2.allPackages).then(res => {
                if (res.body.code.toString() == this.Global.RES_OK) {
                    let allPackage = res.data.data
                    let currentPkLevel // 当前套餐级别
                    allPackage.map((item, index) => {
                        if (item.pkCode == this.selectConfig.pkcode) {
                            currentPkLevel = item.pkLevel
                        }
                    })
                    this.pkData = allPackage.filter(item => item.pkLevel >= currentPkLevel && item.pkCode != this.selectConfig.pkcode) // 过滤出可升级的套餐
                    if (this.pkData.length == 0) { // 没有可升级的套餐，则禁用升级按钮
                        this.noUpPackage = true
                        this.checked02 = false
                        // this.checked01 = true
                    } else {
                        this.formObj.pkValue = this.pkData[0].pkCode // 设置默认升级的套餐
                    }
                } else {
                    this.$message.error(res.body.msg)
                }
            }, (res) => {
                this.$message.error(this.$t(this.Global.errorTitle))
            })
        },
        choiceUpYear(x) {
            if (x >= this.minYear) {
                this.upgradeYear = x
                //  this.getOffCost(x)
                this.getPrice()
            }
        },
        changeCheck02() {
            if (!this.noUpPackage && this.minYear <= 3) {
                this.getPrice()
            }
        },
        changeCheck01() {
            // if (this.checked01) {
            //     this.getActivity()
            // }
            this.getPrice()
        },
        changeCheck04() {
            if (!this.checked04) {
                this.formObj.spaceAdd = 0
            } else {
                this.formObj.spaceAdd = 20
            }
            this.getPrice()
        },
        changeCheck03() {
            // if (this.checked03) {
            //     this.getOffCost(this.formObj.yearValue)
            // }
            this.getPrice()
        },
        returnFloat(x) {
            var value = Math.round(parseFloat(x) * 100) / 100
            var xsd = value.toString().split('.')
            if (xsd.length == 1) {
                value = value.toString() + '.00'
                return value
            }
            if (xsd.length > 1) {
                if (xsd[1].length < 2) {
                    value = value.toString() + '0'
                }
                return value
            }
        },
        showDiscounts() {
            if (this.formObj.memberNum == 3 || this.formObj.memberNum == 4) {
                // (this.formObj.yearValue == 2 && ) || (this.formObj.yearValue == 3 && this.formObj.memberNum == 3)
                this.isDiscounts = false
            } else {
                this.isDiscounts = true
            }
        },
        // 优惠金额体现
        // async getOffCost(x) {
        //     let _this = this
        //     let pkCode
        //     if (!_this.checked01) {
        //         pkCode = this.formObj.pkValue
        //     } else {
        //         pkCode = this.selectConfig.pkcode // 如果升级时pkcode是当前的套餐
        //     }
        //     let params = {
        //         yearCount: x,
        //         pkCode: pkCode,
        //         memberCount: this.selectConfig.authcount // 原套餐用户数
        //     }
        //     let count = params.memberCount
        //     if (this.checked03) {
        //         params.addMember = this.formObj.memberNum
        //         count = params.memberCount + params.addMember
        //     }
        //     if (count >= 5) {
        //         await this.$http.get(this.Global.baseURL + this.Global.api.v2.offCost, { params: params }).then(res => {
        //             if (res.data.code.toString() == this.Global.RES_OK) {
        //                 this.saveMoney = Math.abs(res.data.data)
        //             } else {
        //                 this.$message.error(res.data.msg)
        //             }
        //         }, (res) => {
        //             this.$message.error(this.$t(this.Global.errorTitle))
        //         })
        //     }
        // },
        DateAdd(number, date) {
            date.setFullYear(date.getFullYear() + number)
            return date
        },
        getOrderType() {
            let type = (this.checked01 ? 'R' : '-') + ',' + (this.checked02 ? 'H' : '-') + ',' + (this.checked03 ? 'U' : '-') + ',' + (this.checked04 ? 'U' : '-')
            type = type.replace(/U,U/g, 'U')
            type = type.replace(/-,|,-/g, '')
            return type
        },
        async changeUser(value) {
            await this.getPrice(this.upgradeYear, value, this.formObj.spaceAdd)
            // await this.getActivity()
        },
        async changeUpgrade(value) {
            await this.getPrice(value, this.formObj.memberNum, this.formObj.spaceAdd)
        },
        changeSpace(value) {
            this.getPrice(this.upgradeYear, this.formObj.memberNum, value)
        },
        async getPrice(upgrade, addCount, addSpace) {
            let _this = this
            let menberCount
            if (!_this.checked03) { // 当增加用户选择去掉时
                menberCount = 0
            } else {
                if (typeof (addCount) != 'number') { // 当用户选择勾上时，还没有改变计数器时typeof (value)是object
                    menberCount = this.formObj.memberNum
                } else {
                    menberCount = addCount
                }
            }
            let pkCode
            let year = 0
            if (_this.checked02) {
                pkCode = this.formObj.pkValue
                if (typeof (upgrade) != 'number') { // 当用户选择勾上时，还没有改变计数器时typeof (value)是object
                    year = this.upgradeYear
                } else {
                    year = upgrade
                }
            } else {
                pkCode = this.selectConfig.pkcode
            }
            let spaceCount
            if (!_this.checked04) {
                spaceCount = 0
            } else {
                if (typeof (addSpace) != 'number') { // 当用户选择勾上时，还没有改变计数器时typeof (value)是object
                    spaceCount = this.formObj.spaceAdd
                } else {
                    spaceCount = addSpace
                }
            }
            let yearCount
            if (!_this.checked01) {
                yearCount = 0
            } else {
                yearCount = this.formObj.yearValue
                pkCode = this.selectConfig.pkcode // 如果升级时pkcode是当前的套餐
            }
            let data = {
                orderType: this.getOrderType(),
                pkCode: pkCode,
                yearCount: yearCount,
                memberCount: menberCount,
                spaceCount: spaceCount,
                year: year
                // custId: 10133963
            }
            // console.log('++', data.spaceCount)
            // this.formObj.memberNum = data.memberCount
            // this.formObj.spaceAdd = data.spaceCount
            // this.formObj.yearUpgrade = data.year
            // this.formObj.yearRenew = data.yearCount
            // this.formObj.pkValue = data.pkCode
            if (this.getOrderType() != '-') {
                await this.$http.get(this.Global.baseURL + this.Global.api.v2.priceCount, { params: data })
                    .then((res) => {
                        if (res.body.code.toString() == _this.Global.RES_OK) {
                            this.priceConfig = res.data.data
                        } else {
                            this.$message.error(res.body.msg)
                        }
                    }, (res) => {
                        _this.$message.error(_this.$t(_this.Global.errorTitle))
                    })
                // this.getActivity()
            }
        },
        // getActivity() {
        //     this.$http.get(this.Global.baseURL + this.Global.api.v2.activity, { params: { type: 'now' } }).then(res => {
        //         if (res.data.code.toString() == this.Global.RES_OK) {
        //             if (res.data.data.length > 0) {
        //                 let obj = res.data.data[0]
        //                 this.currentActivity = obj
        //                 // if (this.checked01) {
        //                 //     this.getDataActivity(obj.activityId, this.selectConfig.pkcode)
        //                 // } else if (this.checked02) {
        //                 //     this.getDataActivity(obj.activityId, this.formObj.pkValue)
        //                 // }
        //                 // // 处理当前的活动，展示用户看
        //                 if (!this.currentActivity.activityInfos) {
        //                     return
        //                 }
        //                 let PK0001 = this.currentActivity.activityInfos.filter(item => item.pkCode == this.selectConfig.pkcode)
        //                 PK0001.forEach(item => {
        //                     this.yearData[item.yearCount - 1].text = item.description
        //                 })
        //                 // let that = this
        //                 // // 设置2年，3年的优惠金额
        //                 // async function test() {
        //                 //     for (let x of that.yearData) {
        //                 //         if (x.value > 1) {
        //                 //             that.saveMoney = 0
        //                 //           //  await that.getOffCost(x.value)
        //                 //             that.$set(x, 'offCost', that.saveMoney)
        //                 //         }
        //                 //     }
        //                 // }
        //                 // test()
        //             } else {
        //                 this.isActivity = false
        //             }
        //         } else {
        //         }
        //     }, (res) => {
        //         _this.$message.error(_this.$t(_this.Global.errorTitle))
        //     })
        // },
        // getDataActivity(id, code) {
        //     let yearCount
        //     if (!this.checked01 || !this.checked02) {
        //         yearCount = 0
        //     } else {
        //         yearCount = this.formObj.yearValue
        //     }
        //     let data = {
        //         type: 'infoDetail',
        //         activityId: id,
        //         yearCount: yearCount,
        //         pkCode: code
        //     }
        //     console.log('++')
        //     this.$http.get(this.Global.baseURL + this.Global.api.v2.activity, { params: data }).then(res => {
        //         if (res.data.code.toString() == this.Global.RES_OK) {
        //             this.activityConfig = res.data.data
        //         } else {
        //         }
        //     }).catch(error => {
        //         console.log(error)
        //     })
        // },
        async getData() {
            let _this = this
            await this.$http.get(this.Global.baseURL + this.Global.api.v2.getAuthInfo, { params: { cid: this.company.cId } })
                .then((res) => {
                    if (res.body.code.toString() == _this.Global.RES_OK) {
                        this.selectConfig = res.body.data
                        let pkcode = parseFloat(this.selectConfig.pkcode.slice(3))
                        this.currentPkcode = pkcode
                        if (this.selectConfig.authcount < 5) { // 当前套餐数少于5人时
                            this.formObj.yearValue = 2 // 设置套餐升级默认值为2年
                        }
                        // usesAmount
                        if (this.selectConfig.authcount >= 20) {
                            this.usesAmount = 20
                        } else if (this.selectConfig.authcount < 20 && this.selectConfig.authcount >= 10) {
                            this.usesAmount = 10
                        } else if (this.selectConfig.authcount < 10 && this.selectConfig.authcount >= 5) {
                            this.usesAmount = 5
                        } else {
                            this.usesAmount = this.selectConfig.authcount
                        }
                        let surplusDay = this.selectConfig.totalDays - this.selectConfig.useDays // 设置升级套餐年限最小值
                        let surplusYear = Math.floor(surplusDay / 365)
                        if (this.selectConfig.authcount < 5 && surplusYear + 1 < 2) { // 当前用户少于5时，升级最少是2年
                            this.minYear = 2
                            this.upgradeYear = 2
                        } else {
                            this.minYear = surplusYear + 1
                            this.upgradeYear = surplusYear + 1
                        }
                        if (this.selectConfig.authcount < 5) {
                            this.isFlag = false
                        }
                        // this.getActivityData()
                    }
                }, (res) => {
                    _this.$message.error(_this.$t(_this.Global.errorTitle))
                })
        },
        async resetData() {
            this.isLoading = true
            this.checked02 = true
            this.checked01 = this.checked03 = this.checked04 = false
            // this.formObj = {
            //     yearValue: 1, // 续费年限
            //     pkValue: 'PK0002',
            //     memberNum: 1,
            //     spaceAdd: 20
            // }
            // this.selectConfig = {} // 客户订单配置
            // this.priceConfig = {} // 选配置后 算出来的结果
            // this.priceConfig.totalCost = 0
            await this.getPrice()
            this.isLoading = false
        },
        // 提交下单
        submit() {
            // let _this = this
            // this.$confirm('提交订单后，等待财务审核，是否提交订单？', '提示', {
            //   confirmButtonText: '确定',
            //   cancelButtonText: '取消',
            //   type: 'warning'
            // }).then(() => {
            this.toPay() // 保存订单
            // }).catch(() => {})
        },
        toPay() {
            // 支付
            this.$http.get(this.Global.baseURL + this.Global.api.v2.payCenter_onlinepay, {
                params: {
                    totalAmount: this.priceConfig.totalCost,
                    giveAmount: this.giveNum(),
                    product: 'all'
                }
            }).then((res) => {
                if (res.body.code.toString() === this.Global.RES_OK) {
                    let url = 'https://openapi.alipay.com/gateway.do?' + res.body.data.resultString // 后更改页面地址
                    this.openNewWindowTab(url)
                    // this.payDialog = true
                    // this.$emit('close')
                } else if (res.body.code.toString() != '-3') {
                    this.$message.error(_this.msg(res.body))
                }
                this.submitLoading = false
            }, function (res) {
                this.submitLoading = false
                this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },
        giveNum() {
            if (this.priceConfig.totalCost < 1000) {
                return 0
            }
            if (this.priceConfig.totalCost >= 1000 && this.priceConfig.totalCost < 2000) {
                return 50
            }
            if (this.priceConfig.totalCost >= 2000 && this.priceConfig.totalCost < 3000) {
                return 200
            }
            if (this.priceConfig.totalCost >= 3000) {
                return 1000
            }
        },
        saveOrder() {
            this.submitLoading = true
            let auth = getStore('auth')
            let _this = this
            let data = {
                ordertype: this.getOrderType(),
                phone: auth.mobile,
                productcode: this.formObj.pkValue,
                authcount: Number(this.formObj.memberNum),
                rType: 3,
                nums: Number(this.formObj.yearValue) * 12,
                spacecount: Number(this.formObj.spaceAdd),
                payamount: Number(this.priceConfig.totalCost),
                // // paymentvoucher: ,
                // // paytradeno: ,
                // // remark: ,
                username: auth.userName,
                useremail: auth.email,
                actualreceiveamount: Number(this.priceConfig.totalCost)
            }
            this.$http.post(this.Global.baseURL + this.Global.api.v2.companyOrder, data)
                .then((res) => {
                    this.submitLoading = false
                    if (res.body.code.toString() == _this.Global.RES_OK) {
                        this.saveOrder() // 保存订单
                        _this.$message.success(res.body.msg)
                        // console.log(res)
                        this.$emit('close')
                    } else {
                        _this.$message.error(res.body.msg)
                    }
                }, (res) => {
                    _this.$message.error(_this.$t(_this.Global.errorTitle))
                })
        },
        // 设置固定高
        getWinHeight() {
            const _this = this
            let winHeight = document.body.clientHeight
            if (_this.$refs.ToOrder) {
                _this.$refs.ToOrder.style.height = winHeight - 130 + 'px'
                this.tableHeight = winHeight - 250
            }
        }
    },
    components: {
    },
    watch: {
        notAllChecked(val, old) {
            if (val) {
                this.isChecked = false
            } else {
                this.isChecked = true
            }
        }
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
.textTips {
    color: #909399;
    font-size: 12px;
}
</style>
