<template>
    <div class="mailFilter" ref="mailFilter">
        <!-- <el-button class="btnHign" size="mini" @click="AdvancedSearch()">
                <i class="el-icon-search"></i> {{$t('mxpcweb.mail.1528721310083')}} -->
        <!-- 搜索 -->
        <!-- </el-button>-->
        <div class="topBtn">
            <el-button class="btnOpen text-hover" type="text" @click="isFilterBox=!isFilterBox;showMailFilter()">{{boxName}}
                <i v-if="selectedBoxId.id!='-2000'&&selectedBoxId.id!='-3000'" :class="[isFilterBox ? 'el-icon-arrow-up' : 'el-icon-arrow-down']"></i>
            </el-button>
            <i class="el-icon-search btnHign text-hover" @click="showQuick()"></i>

        </div>

        <div class="topSearch" v-show="isShow" @keyup.enter="QuickSearch()">
            <el-dropdown class="dropClass" @command="selectChange">
                <span class="el-dropdown-link">
                    {{modelvalue}}<i class="el-icon-caret-bottom el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown" style="margin-top:-10px; ">
                    <el-dropdown-item style="font-size: 10px;" :command='{showName:boxNameShow,type:"single"}'>{{boxNameShow}}</el-dropdown-item>
                    <el-dropdown-item style="font-size: 10px;" :command='{showName:"全部",type:"all"}'>全部</el-dropdown-item>

                </el-dropdown-menu>
            </el-dropdown>
            <input v-model="input" :placeholder="$t('mxpcweb.mail.1528963582691')">
            <!-- 请输入主题/正文/收件人/发件人 -->

            <i class="iconfont close icon-close pull-right text-hover" @click="isShow=false"></i>

            <span class="btnOpen2 pull-right" @click="AdvancedSearch()">
                <!-- 高级搜索 -->
                {{$t('mxpcweb.mail.1528955423785')}}
            </span>

        </div>

        <div class="filterBox" v-if="isFilterBox&&selectedBoxId.id!='-2000'&&selectedBoxId.id!='-3000'">
            <dl v-if="dynamicTags.length>0" style="margin-bottom: 12px;">
                <div>{{$t('mxpcweb.mail.1528702726743')}}：
                    <!-- 标签 -->
                </div>
                <dt :class="labelName==''?'active':''" @click="labelChecked('')">{{$t('mxpcweb.mail.1528720680450')}}</dt>

                <span class="tagSpan text-hover" v-for="(item,index) in dynamicTags" :key="index" @click="labelChecked(item.labelId,index)" :class="labelName==item.labelId?'active':''">
                    <!-- style="height:30px;line-height:30px;font-size:13px; border-radius: 20px;"  -->
                    <el-tag type="primary" style="height:28px;line-height:28px;font-size:13px; border-radius: 20px; margin-right: 5px;margin-bottom: 6px;" :style="setBgColor(item.color,index)">{{item.labelName}}</el-tag>
                </span>

            </dl>
            <dl style="margin-bottom: 13px;">
                <div>{{$t('mxpcweb.mail.1528702539712')}}：
                    <!-- 批注 -->
                </div>
                <dt :class="color==''?'comment com1 active':'comment com1'" @click="colorChecked('')">{{$t('mxpcweb.mail.1528720680450')}}</dt>
                <dd v-for="(item,index) in arrMailSign" :key="index" :class="color==item?'comment com'+item+' active':'comment com'+item" :style="setCommentsColor(item)" @click="colorChecked(item)">
                    <i class="iconfont icon-dot"></i>
                </dd>
            </dl>
            <dl>
                <div>{{$t('mxpcweb.mail.1528709296344')}}：
                    <!-- 附件 -->
                </div>
                <dt :class="attach==''?'active':''" @click="attachChecked('')">{{$t('mxpcweb.mail.1528720680450')}}</dt>
                <dd :class="attach=='true'?'active':''" @click="attachChecked('true')">{{$t('mxpcweb.mail.1528721624048')}}</dd>
                <dd :class="attach=='false'?'active':''" @click="attachChecked('false')">{{$t('mxpcweb.mail.1528721626364')}}</dd>
            </dl>
            <dl>
                <div>{{$t('mxpcweb.mail.1528721207257')}}：
                    <!-- 阅读 -->
                </div>
                <dt :class="readFlag==''?'active':''" @click="readFlagChecked('')">{{$t('mxpcweb.mail.1528720680450')}}</dt>
                <dd :class="readFlag=='1'?'active':''" @click="readFlagChecked('1')">{{$t('mxpcweb.mail.1528721626678')}}</dd>
                <dd :class="readFlag=='-1'?'active':''" @click="readFlagChecked('-1')">{{$t('mxpcweb.mail.1528721627451')}}</dd>
            </dl>
        </div>
    </div>
</template>

<script>
/**
 * 描述：邮件部分
 * 作者：向士健(CSS) / ***(API)
 * 时间：2017/11/11
 */
import { mapGetters } from 'vuex'
import { tagsBgColor, commentsColor } from '@/libs/utils.js'

export default {
    name: 'ListCenter',
    props: ['dynamicTags'],
    data() {
        return {
            tagIndexSelect: -1,
            isFilterBox: false, // 邮件筛选下拉，是否展开
            attach: '', // 附件
            color: '', // 批注
            readFlag: '', // 是否以阅读
            labelName: '', // 标签
            moduleCode: 'EM001', // 模块号
            //   dynamicTags: [],//常规标签
            boxName: '',
            arrMailSign: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'], // 标记组
            isShow: false,
            input: '',
            usualStyle: {
                height: '30px',
                'line-height': '28px',
                'font-size': '13px',
                'border-radius': '20px',
                border: 'none'
            },
            modelvalue: '',
            boxNameShow: '',
            modeType: 'single',
            boxId: ''
        }
    },
    computed: {
        ...mapGetters('mail', [
            'selectedBoxName',
            'selectedBoxId'
        ]),
        ...mapGetters(['screenWidth', 'screenHeight'])
    },
    mounted() {
        // let _this = this
        this.showMailFilter()
        // window.onresize = function temp() {
        //     _this.showMailFilter()
        // }
    },
    methods: {
        selectChange(command) {
            this.modelvalue = command.showName
            this.modeType = command.type
        },
        showQuick() {
            this.isShow = true
            this.input = ''
        },

        QuickSearch() {
            if (this.input != '') {
                if (this.modeType == 'all') {
                    this.$emit('SearchClick', this.input, 'F', true, this.modeType)
                } else {
                    this.$emit('SearchClick', this.input, 'F', true, this.boxId)
                }
            }
        },
        // 批注色彩
        setCommentsColor(flag) {
            return commentsColor(flag)
        },
        // 点击过滤按钮下拉
        showMailFilter() {
            let _this = this
            // this.isFilterBox = !this.isFilterBox;
            setTimeout(function () {
                let filterHeight = _this.$refs.mailFilter.offsetHeight
                _this.$emit('mailListHeight', filterHeight)
            }, 20)
        },
        attachChecked(item) {
            this.attach = item
            this.$emit('filterGetMail', this.attach, this.color, this.readFlag, this.labelName, 'filterType', 'F')
        },
        colorChecked(item) {
            this.color = item
            this.$emit('filterGetMail', this.attach, this.color, this.readFlag, this.labelName, 'filterType', 'F')
        },
        readFlagChecked(item) {
            this.readFlag = item
            this.$emit('filterGetMail', this.attach, this.color, this.readFlag, this.labelName, 'filterType', 'F')
        },
        labelChecked(item, index) {
            this.tagIndexSelect = index
            this.labelName = item
            this.$emit('filterGetMail', this.attach, this.color, this.readFlag, this.labelName, 'filterType', 'F')
        },
        // 背景色
        setBgColor(id, index) {
            if (this.tagIndexSelect === index) {

            } else {
                return tagsBgColor(id)
            }
        },
        // 高级搜索
        AdvancedSearch() {
            this.$emit('OpenAdvancedSearch')
        }
    },
    watch: {
        selectedBoxName: {
            handler(curVal, oldvalue) {
                this.boxName = curVal
                this.isShow = false
            },
            deep: true
        },
        selectedBoxId: {
            handler(curVal, oldvalue) {
                this.attach = ''
                this.color = ''
                this.readFlag = ''
                this.labelName = ''
                this.tagIndexSelect = -1
                if (curVal.target == 'toplist' || curVal.target == 'undistributed' || curVal.target ==
                    'Quicklist' || curVal.target == 'advancedlist') { // 高级搜索
                    this.isFilterBox = false
                } else {
                    this.boxId = curVal.id
                    this.boxNameShow = this.selectedBoxName
                    this.modelvalue = this.selectedBoxName
                }
            },
            deep: true
        },
        screenWidth (val) { // 监听屏幕宽度变化
            this.showMailFilter()
        },
        screenHeight (val) { // 监听屏幕宽度变化
            this.showMailFilter()
        }
    }

}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
