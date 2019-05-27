<template>
    <div class="mainWrap SetIndex MXscroll">
        <!--大标题-->
        <!-- 邮件设置 -->
        <page-title :showTitle="false" :title="$t('mxpcweb.systemset.mailset.setindex.1528978118541')" iconfont="icon-mail"></page-title>

        <el-tabs v-model="activeName" @tab-click="handleClick" class="subTabs-pullRight">
            <!-- <el-tab-pane :label="$t('mxpcweb.systemset.mailset.setindex.1528978345059')常规" name="first">
        <routine class="mainBodyTab" :arrylist="routineData"></routine>
      </el-tab-pane> -->
            <!-- 阅读和显示 -->
            <el-tab-pane :label="$t('mxpcweb.systemset.mailset.setindex.1528978193379')" name="second">
                <read-show class="mainBodyTab" :arrylist="readData" :checkeList="writeList.checkeList"></read-show>
            </el-tab-pane>
            <!-- 写邮件 -->
            <el-tab-pane :label="$t('mxpcweb.systemset.mailset.setindex.1528978193678')" name="third">
                <write-mail class="mainBodyTab" :arrylist="writeList"></write-mail>
            </el-tab-pane>
            <!-- 白名单 -->
            <el-tab-pane :label="$t('mxpcweb.systemset.mailset.setindex.1528978193914')" name="Four">
                <white-list></white-list>
            </el-tab-pane>
            <!-- 黑名单 -->
            <el-tab-pane :label="$t('mxpcweb.systemset.mailset.setindex.1528978194113')" name="Five">
                <black-list class="mainBodyTab"></black-list>
            </el-tab-pane>
        </el-tabs>

    </div>
</template>

<script>
/**
 * 描述：系统设置=>邮件设置
 * 作者：UI:向士健/逻辑:陈媛媛/后台:汤坚生
 * 时间：2017/11/8
 */
import PageTitle from '@/components/PageTitle/index' // 大标题
import routine from './Tabs/routine.vue'
import readShow from './Tabs/readShow.vue'
import writeMail from './Tabs/writeMail.vue'
import BlackList from './Tabs/BlackList.vue'
import WhiteList from './Tabs/WhiteList.vue'
import { isArray } from '@/libs/utils.js'

export default {
    name: 'SetIndex',
    props: {},
    data() {
        return {
            rootData: [],
            routineData: [],
            readData: [],
            writeData: [],
            writeList: {
                writeData: [],
                checkeList: []
            },
            activeName: 'second' // 当前活动的右tab
        }
    },
    created() {
        let _this = this
        _this.getData() // 获取页面数据
    },
    mounted() { },
    methods: {
        getData() {
            let _this = this
            _this.$http.get(_this.Global.baseURL + _this.Global.api.SystemSet.mailset.setindex.GetOptions, { params: {} }).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    _this.routineData = []
                    _this.readData = []
                    _this.writeData = []
                    if (isArray(res.body.data.mailOptionList)) {
                        _this.rootData = res.body.data.mailOptionList
                        _this.rootData.forEach(element => {
                            // if (element.type == 0) {

                            _this.routineData.push(element)
                            // } else if (element.type == 1) {

                            _this.readData.push(element)
                            // } else {

                            _this.writeData.push(element)
                            // }
                        })
                        _this.writeList.writeData = _this.writeData
                        _this.writeList.checkeList = res.body.data.sendCheckList
                    }
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
            }, function (res) {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },
        // 点右上角的tab切换
        handleClick(tab, event) {
            this.activeName = tab.name
            let _this = this
            if (tab.name != 'Five' && tab.name != 'Four' && tab.name != 'first') {
                _this.getData()
            }
        }
    },
    components: {
        'page-title': PageTitle,
        'routine': routine,
        'read-show': readShow,
        'write-mail': writeMail,
        'black-list': BlackList,
        'white-list': WhiteList
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
