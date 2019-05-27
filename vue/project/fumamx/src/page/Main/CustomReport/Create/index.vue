<template>
    <div class="Create">
        <page-detail :detailTitle="subtitle" @toList="back"></page-detail>
        <div class="createBox">
            <div class="createWrap">
                <ul class="stepBox">
                    <li class="active">
                        <div class="stepitem">
                            <i>1</i>
                            <div>
                                <h2>进行中</h2>
                                <p>填写基本信息</p>
                            </div>
                        </div>
                    </li>
                    <li :class="tabData==2|| tabData==3|| tabData==4?'active':''">
                        <div class="stepitem">
                            <i>2</i>
                            <div>
                                <h2>待进行</h2>
                                <p>设置数据来源</p>
                            </div>
                        </div>
                    </li>
                    <li :class="tabData==3 || tabData==4 ?'active':''">
                        <div class="stepitem">
                            <i>3</i>
                            <div>
                                <h2>待进行</h2>
                                <p>设置取数条件</p>
                            </div>
                        </div>
                    </li>
                    <li :class="tabData==4 ?'active':''">
                        <div class="stepitem">
                            <i>4</i>
                            <div>
                                <h2>待进行</h2>
                                <p>设置使用者权限</p>
                            </div>
                        </div>
                    </li>
                </ul>
                <div class="MXscroll createMain">
                    <create-first v-show="tabData==1" @changeTabData="changeTabData" @createData="createData"></create-first>
                    <create-second v-show="tabData==2" @changeTabData="changeTabData" :reportData="reportData" @getModuleCodes="getModuleCodes" @secondParames='secondParames' ref="createSecond" @flagModule="flagModule" :tabData="tabData"></create-second>
                    <create-third v-show="tabData==3" @changeTabData="changeTabData" :moduleCodes="moduleCodes" :deptPerson="deptPerson" @thirdParames="thirdParames" ref="createThird" @changeModuleFlag="changeModuleFlag" :tabData="tabData"></create-third>
                    <create-fourth v-show="tabData==4" @changeTabData="changeTabData" :deptPerson="deptPerson" :summaryParames="parames" :tabData="tabData"></create-fourth>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// import TwolevelNav from './TwolevelNav/index'
import { mapGetters } from 'vuex'
import PageDetail from '@/components/PageDetail/index' // 大标题
import CreateFirst from './CreateFirst/index'
import CreateSecond from './CreateSecond/index'
import CreateThird from './CreateThird/index'
import CreateFourth from './CreateFourth/index'

export default {
    name: 'fm-Tabs',
    props: {},
    data() {
        return {
            // menuNavList: []
            currentView: 'collect-page',
            subtitle: '新建报表',
            tabData: '1',
            reportData: {
            },
            moduleCodes: [], // 选择的模块号
            deptPerson: {}, // 部门和人员
            parames: {}
        }
    },
    created() {
        this.getDept()
        this.isEdit()
    },
    computed: {
        ...mapGetters(['departmentList'])
    },
    methods: {
        isEdit() {
            let { reportId } = this.$route.query
            if (reportId != undefined) {
                this.subtitle = '编辑报表'
            }
        },
        flagModule(n) {
            if (n) {
                this.$refs.createThird.clear()
            }
        },
        changeModuleFlag() {
            this.$refs.createSecond.changeFlag()
        },
        secondParames(n) {
            this.parames = n
        },
        thirdParames(n) {
            let params = JSON.parse(JSON.stringify(n))
            this.parames = Object.assign(params, this.parames)
            this.parames.reportInfo.dataScope = this.parames.dataScope
            this.parames.reportInfo.deptKey = this.parames.deptKey
            delete this.parames.dataScope
            delete this.parames.deptKey
        },
        createData(n) {
            this.reportData = Object.assign(n, this.reportData)
        },
        changeTabData(n) {
            this.tabData = n
        },
        getModuleCodes(n) { // 接收第二步传来的模块号
            this.moduleCodes = n
        },
        back() {
            this.$router.back(-1)
        },
        // 获取部门和人员
        getDept() {
            this.$http.get(this.Global.baseURL + this.Global.api.v1.reportDept)
                .then(res => {
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        this.deptPerson = res.body.data
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                },
                    res => {
                        this.$message.error(this.$t(this.Global.errorTitle))
                    }
                )
        }
    },
    components: {
        'page-detail': PageDetail,
        'create-first': CreateFirst,
        'create-second': CreateSecond,
        'create-third': CreateThird,
        'create-fourth': CreateFourth
    },
    watch: {
        // 监听导航数据变化
        // navigator(val, old) {
        //     this.getMenuNavList()
        // },
        // $route() {
        //     this.toPage()
        // }
    }
}
</script>

<style lang="less" rel="stylesheet/less">
@import "./zh-cn.less";
@import "./en.less";
</style>
