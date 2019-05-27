<template>
    <div class="Order">
        <div ref="searchHeight">
            <div class="searchBox">
                <div class="divSearch">
                    <div class="ax_default text-hover" @click="setScreenMenu()">
                        <!-- 筛选 -->
                        {{$t('mxpcweb.client.1529049672082')}}
                        <span>
                            <i v-if="screenMenu" class="iconfont icon-arrow-up hover" style="font-size:12px"></i>
                            <i v-else class="iconfont icon-arrow-down hover" style="font-size:12px"></i>
                        </span>
                    </div>
                    <li :class="screenMenu ? 'liselect1' : 'liselect'">
                        <span class="labelBox">单据状态</span>
                        <span v-if="screenMenu" class="rightBox">
                            <span class="label text-hover" :class="stateValue == item.state ? 'label2' : 'label1'" v-for="item in stateList" :key="item.state" @click="stateValue = item.state;getDocumentaryList()">{{item.label}}</span>
                        </span>
                        <el-select v-else v-model="stateValue" placeholder="请选择" style="width:100px;" @change="getDocumentaryList()">
                            <el-option v-for="item in stateList" :key="item.state" :label="item.label" :value="item.state">
                            </el-option>
                        </el-select>
                    </li>
                    <li :class="screenMenu ? 'liselect1' : 'liselect'">
                        <span class="labelBox">拥有人</span>
                        <!-- <el-select v-model="contactValue" filterable placeholder="请选择" style="width:100px;" @change="getDocumentaryList()">
                            <el-option v-for="item in contactListArry" :key="item.ctId" :label="item.realName" :value="item.ctId">
                            </el-option>
                        </el-select> -->
                        <drop-down labelKey="realName" valueKey="ctId" :ruleForm="ruleForm" inUse @change="ctIdChange" :list="contactListArry" rightWidth="100px"></drop-down>
                    </li>
                    <!-- <li class="liselect">
                        <span>客户名称</span>
                        <el-select v-model="value" filterable placeholder="请选择" style="width:100px;">
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </li> -->
                </div>
                <div class="inputSesrch">
                    <el-input placeholder="跟单号/订单编号/客户名称" @keyup.enter.native="getDocumentaryList()" @blur="getDocumentaryList()" v-model="keyWords" style="width:260px;">
                        <el-button slot="append" icon="search" @click="getDocumentaryList()"></el-button>
                    </el-input>
                </div>
            </div>
            <div class="filter">
                <template v-for="(item,index) in filterTable">
                    <!-- box01 -->
                    <div class="box01 text-hover" :key="index" v-if="item.showFlag==1" :style="(activeIndex==index || activeIndex == -1) ? gettagColor(index,index) : ''" @click="nodeIdChange(item.nodeId,index)">
                        <span class="icontClass"><i :class="'iconfont '+(item.nodeUrl?item.nodeUrl:'icon-followOrder')" style="font-size: 30px;"></i></span>
                        <span class="divshow">
                            <div style="font-size:20px;">{{item.documentaryNum}}</div>
                            <div>{{item.nodeName}}</div>
                        </span>
                        <div class="box02" :style="(activeIndex==index || activeIndex==-1) ? gettagColor(index,1, true) : 'border-color:white;'"></div>
                    </div>
                </template>
                <div class="sttingClass">
                    <span class="text-hover" @click="$refs.AddTracking.showDialog()">设置</span>
                    <span v-show="activeIndex!=-1" class="text-hover" @click="activeIndex=-1">重置</span>
                </div>
            </div>
        </div>
        <div class="tableList MXscroll" :style="{top: topHeight + 'px'}">
            <no-data v-if="DocumentaryList.length == 0"></no-data>
            <div v-else class="listclass" v-for="(item,index) in DocumentaryList" :key="index">
                <div class="tilediv">
                    <span style="margin-right:30px">{{item.doctryCode}}</span>
                    <span style="margin-right:60px">
                        <span @click="custListTab(item)" class="text-hover" style="color:#008CEE;">{{item.custName}}</span>
                    </span>
                    <span style="margin-right:40px">订单编号：
                        <span @click="listaddTab(item)" class="text-hover" style="color:#008CEE;">{{item.orderCode}}</span>
                    </span>
                    <span style="margin-right:40px">拥有人：{{contactList[item.ownerCtId]}}</span>
                    <span v-if="item.participant && item.participant.length > 0">协作人：
                        <span v-for="(item2,index2) in item.participant" :key="index2">
                            {{contactList[item2]}}
                            <span v-if="item.participant.length > 1 && index2 < item.participant.length - 1">,</span>
                        </span>
                    </span>
                    <span class="pull-right" :style="getStateColor(item.finStatus,true)">{{getStateColor(item.finStatus,false)}}</span>
                </div>
                <div class="contndiv">
                    <documentary-vue ref="DocumentaryVue" @getData="getDocumentaryList" @optClick="optClick" optCode="otView" :orderId="item.orderId + '' || ''" :docData="item"></documentary-vue>
                </div>

            </div>
        </div>
        <!--分页-->
        <!-- <div>
            <list-page style="background:#ffff;text-align:center" :blockData="blockData" :moduleCode="'SC003'"></list-page>

        </div> -->
        <div class="listPage" style="background:#ffff;text-align:center">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="blockData.fromNum" :page-sizes="[10, 20, 30, 40,50,100]" :page-size="blockData.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="blockData.total">
            </el-pagination>
        </div>
        <add-tracking ref="AddTracking" :filterTable="filterTable" @filterTableRefresh="filterTableRefresh"></add-tracking>
        <opt-vue ref="optVue" optCode="otView" @getData="getDocumentaryList"></opt-vue>

    </div>
</template>

<script>
import NoData from '@/basecomponents/NoData/index'
import listPage from '@/components/listPage/index' // 分页
import ctIdName from '@/components/ListShowControls/Owner/index' // 分页
import footControl from '@/page/Main/Client/Layout/standard/ClientManagIndex/customerLists/footControl/index'
import DocumentaryVue from '../components/DocumentaryVue/index'
import OptVue from '@/page/Main/Sale/components/OptVue/index'
import AddTracking from './AddTracking/index'
import { mapGetters } from 'vuex'
import { isObject } from '@/libs/utils.js'
import Dropdown from '@/components/Controls/AControlsVue/Dropdown'
export default {
    name: 'Order',
    props: {
    },
    data() {
        return {
            // formInline: {
            //     state: 0,
            //     ower: 0,
            //     custId: 0
            // }
            ruleForm: {
                input: ''
            },
            // contactValue: '',
            contactListArry: [],
            stateValue: '1',
            stateList: [{ state: '-2', label: '不限' }, { state: '0', label: '未开始' }, { state: '1', label: '进行中' }, { state: '2', label: '已完成' }, { state: -1, label: '已终止' }],
            options: [],
            value: '',
            keyWords: '',
            filterTable: [],
            DocumentaryList: [],
            blockData: {
                pageSize: 20,
                total: 0,
                fromNum: 0
            },
            colorindex: 0,
            addIndex: 0,
            nodeId: '',
            activeIndex: -1,
            path: '',
            topHeight: 150,
            screenMenu: false
        }
    },
    created() {
        this.path = this.$route.path
        this.contactListGet()
        // this.getfilterTable()
        this.getDocumentaryList()
    },
    mounted() {
        this.setHeights()
    },
    computed: {
        ...mapGetters([
            'contactList',
            'screenWidth'
        ])

    },
    methods: { // 设置固定高
        listaddTab(list) {
            list.billId = list.orderId
            list.moduleCode = 'SC002'
            ep.emit('saleAddTab', list)
        },
        custListTab(list) {
            this.$router.push('/main/client/tabs/list/BF001/' + list.custId)
            this.$nextTick(() => {
                ep.emit('listaddTab', Object.assign(list))
            })
        },
        setHeights() {
            this.$nextTick(() => {
                if (this.$refs.searchHeight) {
                    if (this.$refs.searchHeight.offsetHeight) {
                        let topHeight = this.$refs.searchHeight.offsetHeight + 34
                        this.topHeight = topHeight > 140 ? topHeight : 140
                    }
                } else {
                    setTimeout(() => {
                        this.setHeights()
                    }, 20)
                }
            })
        },
        setScreenMenu() {
            this.screenMenu = !this.screenMenu
            this.setHeights()
        },
        ctIdChange() {
            this.getDocumentaryList()
        },
        nodeIdChange(nodeId, index) {
            if (this.nodeId == nodeId) {
                this.nodeId = ''
                this.activeIndex = -1
                return
            }
            this.nodeId = nodeId
            this.activeIndex = index
            this.getDocumentaryList()
            // actvtie
        },
        filterTableRefresh(list) {
            this.filterTable = list
            this.setHeights()
        },
        handleSizeChange(val) {
            this.blockData.pageSize = val
            this.getDocumentaryList()
        },
        handleCurrentChange(val) {
            this.blockData.fromNum = val
            this.getDocumentaryList()
        },
        optClick(item, type) {
            this.$refs.optVue.optClick(item, type)
        },
        gettagColor(colorId, index, type) {
            let str = ''
            let tagsBgColors = [
                '#D0021B',
                '#FF7500',
                '#FFA000',
                '#67B5EC',
                '#006CC5',
                '#B542C6',
                '#67BD00'
            ]
            if (this.activeIndex != -1 && type) {
                str += 'border-color:white;'
            }
            str += 'background-color:'
            return str + tagsBgColors[colorId % 7]
        },
        getStateColor(state, iscolor) {
            let str = ''
            switch (state) {
                case 0:
                    str = iscolor ? '#606266' : this.$t('mxpcweb.g.1556177204143')// 未开始
                    break

                case 1:
                    str = iscolor ? '#FFB735' : this.$t('mxpcweb.g.1556177257719')// 进行中
                    break
                case 2:
                    str = iscolor ? '#37CBE3' : this.$t('mxpcweb.g.1556177258198')// 已完成
                    break
                case -1:
                    str = iscolor ? '#D0021B' : this.$t('mxpcweb.g.1556177258682') // 终止
                    break
            }
            let returnstr = ''
            if (iscolor) {
                returnstr = 'color:' + str
            } else {
                returnstr = str
            }
            return returnstr
        },
        contactListGet() {
            let contactData = {
                dataType: 'contact',
                funType: 'withRight',
                moduleCode: 'AM001',
                optCode: 'otView'
            }
            this.$http.get(this.Global.baseURL + this.Global.api.v2.accountDropList_get, { params: contactData }).then((res) => {
                if (res.body.code.toString() == this.Global.RES_OK) {
                    let arry = res.body.data
                    arry.splice(0, 0, { realName: '不限', ctId: 0 })
                    this.contactListArry = arry
                } else {
                    this.$message(this.msg(res.body))
                }
            }, (res) => {
                this.$message.error(this.$t(this.Global.errorTitle))
            })
        },
        getfilterTable() {
            let data = {
                type: 'list',
                nodeStatus: '0'
            }
            let that = this
            this.$http.get(this.Global.baseURL + this.Global.api.v2.orderNode, { params: data })
                .then(res => {
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        // this.filterTable = res.body.data.list
                        console.log(this.Global.api.v2.orderNode)
                    } else {
                        this.$message.error(that.msg(res.body))
                    }
                },
                    res => {
                        this.$message.error(that.$t(that.Global.errorTitle))
                    }
                )
        },
        getDocumentaryList() {
            let data = {
                moduleCode: 'SC003',
                strucId: 1,
                from: this.blockData.fromNum > 0 ? (this.blockData.fromNum - 1) * this.blockData.pageSize : this.blockData.fromNum * this.blockData.pageSize,
                size: this.blockData.pageSize
            }
            if (this.ruleForm.input != '') { // 拥有人
                data.ownerCtId = this.ruleForm.input
            }
            if (this.stateValue != -2) { // 状态
                data.finStatus = this.stateValue
            }
            if (this.nodeId != '') { // 节点ID
                data.nodeId = this.nodeId
            }
            // 缺少模糊搜索
            if (this.keyWords != '') {
                data.wildCardQuery = this.keyWords
            }

            let that = this
            this.$http.get(this.Global.baseURL + this.Global.api.v2.document_documentary_list, { params: data })
                .then(res => {
                    if (res.body.code.toString() == this.Global.RES_OK && isObject(res.body.data)) {
                        this.filterTable = res.body.data.orderNode
                        this.DocumentaryList = res.body.data.list || []
                        this.blockData.total = res.body.data.totalNum || 0
                        this.setHeights()
                    } else {
                        this.$message.error(that.msg(res.body))
                    }
                },
                    res => {
                        this.$message.error(that.$t(that.Global.errorTitle))
                    }
                )
        }

    },
    watch: {
        screenWidth(val) { // 监听屏幕宽度变化
            this.setHeights()
        },
        $route(val, old) {
            if (val.path == this.path) {
                this.getDocumentaryList()
            }
        }
    },
    components: {
        'no-data': NoData,
        'list-page': listPage,
        'ctId-name': ctIdName,
        'foot-control': footControl,
        'documentary-vue': DocumentaryVue,
        'opt-vue': OptVue,
        'add-tracking': AddTracking,
        'drop-down': Dropdown
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
