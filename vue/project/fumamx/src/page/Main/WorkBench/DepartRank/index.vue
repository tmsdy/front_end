<template>
    <div class="dashboardBox DepartRank" v-bind:class='bindClass'>
        <div class="workTitle">
            <span class="pull-right">
                <ul class="tabWrap">
                    <li @click="changeType(1,$event)" :class="activeIndex == 1 ? 'active':''">
                        <span>
                            <!-- 新增 -->{{$t('mxpcweb.workbench.1530671409518')}}
                        </span>
                    </li>
                    <li @click="changeType(2,$event)" :class="activeIndex == 2 ? 'active':''">
                        <span>
                            <!-- 跟进客户 -->{{$t('mxpcweb.workbench.1530684144110')}}
                        </span>
                    </li>
                    <li @click="changeType(3,$event)" :class="activeIndex == 3 ? 'active':''">
                        <span>
                            <!-- 跟进数 -->{{$t('mxpcweb.workbench.1530672455895')}}
                        </span>
                    </li>
                    <li @click="changeType(4,$event)" :class="activeIndex == 4 ? 'active':''">
                        <span>
                            <!-- 成交 -->{{$t('mxpcweb.workbench.1530680869247')}}
                        </span>
                    </li>
                </ul>
                <!-- 请选择 -->
                <el-select v-if="deptCount>=2" v-model="departName" :placeholder="$t('mxpcweb.workbench.1530671363646')" size="small" @change="chageDepart()">
                    <el-option v-for="item in depts" :key="item.dkey" :value="item.dkey" :label="item.deptName"> </el-option>
                </el-select>
                <!-- 请选择 （日期选择）-->
                <el-select v-model="region" :placeholder="$t('mxpcweb.workbench.1530671363646')" size="small" @change="dateOptionChange">
                    <el-option v-for="item in statinterval" :key="item.intervalCode" :value="item.intervalCode" :label="item.intervalName"> </el-option>
                </el-select>
            </span>
            <span class="name">{{pannelName}}</span>

        </div>
        <div class="workBody" v-loading="isload">
            <div class="departmentInner">
                <div class="left">
                    <div class="avatar">
                        <img :src="picUrl">
                    </div>
                    <div class="newAdd">
                        <strong :class="activeIndex=='4'?'':'text-hover'" @click="toClient('1')">{{count}}</strong>
                        <div>{{spanInfo}}</div>
                    </div>
                    <div class="ranking">
                        <span v-html="$t('mxpcweb.workbench.1530687890375',[rank])"></span>
                        <div>
                            <!-- 排名 -->{{$t('mxpcweb.workbench.1530687942093')}}
                        </div>
                    </div>
                </div>
                <div class="text-center" v-if="rankInfoList.length===0">
                    <!-- 暂无排名 -->
                    <nodata :title="$t('mxpcweb.workbench.1530686530814')" img="noRank"></nodata>
                </div>
                <ol class="rightList MXscroll" v-else>
                    <li v-for="item in rankInfoList" :key="item.ctId" :value="item.ctId">
                        <span>{{item.nickName}}</span>
                        <span>{{item.count}}</span>
                        <span>
                            <i v-if="item.upOrDown==1" class="iconfont icon-arrow-up-solid"></i>
                            <i v-if="item.upOrDown==0" class="iconfont icon-minus"></i>
                            <i v-if="item.upOrDown==-1" class="iconfont icon-arrow-down-solid"></i>
                            <i v-if="item.upOrDown==-2" class="iconfont icon-minus"></i>
                        </span>
                        <div class="avatar"><img :src="getUserPicUrl(item.avatar)"></div>
                    </li>
                </ol>
                <div class="clearfix"></div>
            </div>
        </div>
    </div>
</template>

<script>
import { isObject, setStore, getStore } from '@/libs/utils.js'
import { mapGetters } from 'vuex'
import NoData from '@/basecomponents/NoData/index'
export default {
    name: 'DepartRank',
    props: ['isshow', 'data'],
    data() {
        return {
            picUrl: '/static/images/noAvatar.png',
            userPicUrl: '/static/images/noAvatar.png', // 此头像限制大小 28px * 28px
            region: '',
            isload: false,
            pannelName: '',
            selectOption: [],
            startId: 1,
            fieldId: 1,
            interval: 1,
            dkey: '',
            size: 10,
            depts: [],
            deptCount: 0,
            departName: '',
            count: 0,
            rank: 0,
            rankInfoList: [],
            bindClass: '',
            ctId: 0,
            activeIndex: 1, // 当前高亮导航 TAB 默认本周 第2项
            activeDateIndex: 0, // 当前高亮日期 TAB
            statinterval: [],
            spanInfo: this.$t('mxpcweb.workbench.1530688034464')// '您本月新增客户总数'
        }
    },
    created() {
        if (this.data.length > 0) {
            this.pannelName = this.data[0].statname
            this.ctId = this.data[0].ctId
            if (this.data[0].index == '1') {
                this.bindClass = 'rightmargin'
            } else {
                this.bindClass = 'leftmargin'
            }
            this.startId = this.data[0].statid
            this.statinterval = this.data[0].statinterval

            let selectedinterval = getStore('departRankinterval')
            var selectinterval
            if (selectedinterval != undefined && selectedinterval != '') {
                selectinterval = selectedinterval
            } else {
                selectinterval = this.data[0].selectinterval
                setStore('departRankinterval', selectinterval)
            }
            this.interval = selectinterval
            this.activeDateIndex = this.getDateIndex(selectinterval) // 当前日期选择index

            var cname = this.getName(this.interval)
            this.region = cname
            /* '本月' */
            this.spanInfo = this.spanInfo.replace(this.$t('mxpcweb.workbench.1530672883646'), this.region)

            this.depts = this.data[0].depts
            this.deptCount = this.depts.length
            if (this.depts.length > 0) {
                this.dkey = this.depts[0].dkey
                this.departName = this.depts[0].deptName
            }
            this.getDepartRankData()
        }
        this.getSrc()// 获取本人头像
    },
    computed: {
        // 使用对象展开运算符将 getters 混入 computed 对象中
        ...mapGetters([
            'personalInfo'// getters.js文件中personalInfo
        ])
    },
    methods: {
        getSrc() {
            let id = this.personalInfo.avatar
            if (id && id != '' && id != '5,01a572250c77') {
                this.picUrl = this.getGlobalImgSrc(id, '65x65')
            }
        },
        getUserPicUrl(avatar) {
            if (avatar != '') {
                return this.getGlobalImgSrc(avatar, '28x28')
            } else {
                return this.userPicUrl
            }
        },
        getName(itemCode) {
            var itemName = ''
            for (var i = 0; i < this.statinterval.length; i++) {
                if (this.statinterval[i].intervalCode == itemCode) {
                    itemName = this.statinterval[i].intervalName
                    return itemName
                }
            }
            return itemCode
        },

        // 更换展示文本
        getArrText() {
            /*
                '您今日新增客户总数', '您本周新增客户总数', '您本月新增客户总数', '您本年新增客户总数', '您全部新增客户总数',
                '您今日跟进客户总数', '您本周跟进客户总数', '您本月跟进客户总数', '您本年跟进客户总数', '您全部跟进客户总数',
                '您今日跟进数总数', '您本周跟进数总数', '您本月跟进数总数', '您本年跟进数总数', '您全部跟进数总数',
                '您今日成交总数', '您本周成交总数', '您本月成交总数', '您本年成交总数', '您全部成交总数'
            */
            let navArr = [
                this.$t('mxpcweb.workbench.1533198774665'),
                this.$t('mxpcweb.workbench.1533198806138'),
                this.$t('mxpcweb.workbench.1530688034464'),
                this.$t('mxpcweb.workbench.1533198904576'),
                this.$t('mxpcweb.workbench.1533198920827'),

                this.$t('mxpcweb.workbench.1533198935728'),
                this.$t('mxpcweb.workbench.1533198950464'),
                this.$t('mxpcweb.workbench.1533198983816'),
                this.$t('mxpcweb.workbench.1533199149072'),
                this.$t('mxpcweb.workbench.1533199161694'),

                this.$t('mxpcweb.workbench.1533199188701'),
                this.$t('mxpcweb.workbench.1533199227949'),
                this.$t('mxpcweb.workbench.1533199242557'),
                this.$t('mxpcweb.workbench.1533199254063'),
                this.$t('mxpcweb.workbench.1533199266484'),

                this.$t('mxpcweb.workbench.1533199278127'),
                this.$t('mxpcweb.workbench.1533199290147'),
                this.$t('mxpcweb.workbench.1533199300991'),
                this.$t('mxpcweb.workbench.1533199311452'),
                this.$t('mxpcweb.workbench.1533199325056')
            ]
            let newIndex = this.activeDateIndex + (this.activeIndex - 1) * this.statinterval.length
            this.spanInfo = navArr[newIndex]
        },
        getDateIndex(code) {
            let dateFlag
            this.statinterval.forEach((item, index) => {
                if (item.intervalCode == code) {
                    dateFlag = index
                }
            })
            return dateFlag
        },
        chageDepart() {
            this.isload = true
            var depart = this.departName
            this.dkey = depart

            this.getDepartRankData()
        },
        // 日期下拉改变时
        dateOptionChange(val) {
            var selectRegin = this.region
            this.interval = selectRegin
            setStore('departRankinterval', this.interval)
            this.isload = true

            this.activeDateIndex = this.getDateIndex(val) // 当前日期选择index

            this.getArrText() // 更换展示文本

            this.getDepartRankData()
        },
        changeType(type, event) {
            this.isload = true

            this.activeIndex = type
            this.fieldId = type

            this.getArrText() // 更换展示文本
            this.getDepartRankData()
        },
        getDepartRankData() {
            let _this = this
            var url = _this.Global.baseURL + _this.Global.api.v2.stat_rank_get
            _this.$http.get(url, {
                params: {
                    statId: this.startId,
                    interval: this.interval,
                    fieldId: this.fieldId,
                    size: this.size,
                    dkey: this.dkey,
                    staffId: this.ctId
                }
            }).then(
                function (res) {
                    if (res.body.code.toString() == _this.Global.RES_OK && isObject(res.body.data)) {
                        // console.log(res.body);
                        _this.count = res.body.data.count
                        _this.rank = res.body.data.rank
                        _this.rankInfoList = res.body.data.rankInfoList
                        _this.isload = false
                    } else {
                        _this.isload = false
                        if (_this.dkey != '') {
                            _this.$message.error(res.data.msg)
                        }
                    }
                },
                function (res) {
                    _this.isload = false
                    if (_this.dkey != '') {
                        _this.$message.error(_this.$t(_this.Global.errorTitle))
                    }
                }
            )
        },
        toClient() { // 跳转客户
            let modelCode = ''
            let timeType = ''
            if (this.activeIndex == 1 || this.activeIndex == 2) {
                modelCode = 'BF001'
                if (this.activeIndex == 2) {
                    timeType = '3'
                }
            } else if (this.activeIndex == 3) {
                modelCode = 'BF004'
            } else if (this.activeIndex == 4) {
                return false
            }
            let _this = this
            let data = {
                modelCode: modelCode,
                interval: _this.interval,
                argument: {}
            }
            data.argument.ownerCtId = _this.ctId
            if (timeType) {
                data.timeType = timeType
            }
            console.log(data)
            _this.toClient_g(data)
        }
    },
    components: {
        'nodata': NoData
    }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
