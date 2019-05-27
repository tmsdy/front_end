<template>
    <div class="app" v-topFloorPoint v-if="isLockScreen">
        <router-view></router-view>
        <button class="reqLogButton" v-if="isShow" @click="isShowLow = !isShowLow">请求日志</button>
        <log-statistics v-if="isShowLow"></log-statistics>
    </div>
</template>
<script>
import { mapMutations } from 'vuex'
import logStatistics from '@/components/logStatistics/index.vue'

export default {
    name: 'app',
    data() {
        return {
            isLockScreen: true,
            isShow: false,
            isShowLow: false
        }
    },
    created() {
        let _this = this
        function urlParameters() {
            var url = location.search.substr(1)
            var strs = url.split('&')
            var theRequest = {}
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split('=')[0] || ''] = strs[i].split('=')[1] || ''
            }
            return theRequest
        }
        var deb = urlParameters().debugger
        if (deb && deb == 'true') {
            this.isShow = true
        }

        // .注册刷新事件，刷新系统状态
        window.AppLockScreen = () => {
            console.log('刷新应用')
            _this.isLockScreen = false
            setTimeout(() => {
                // 移除全部事件
                ep.removeAllListeners()
                _this.isLockScreen = true
            }, 200)
        }

        this.set_individualconfiginfo(_individualConfigInfo)
    },
    methods: {
        // 同步设置
        ...mapMutations({
            set_individualconfiginfo: 'SET_INDIVIDUALCONFIGINFO'
        })
    },
    watch: {},
    components: {
        'log-statistics': logStatistics
    }
}
</script>
<style lang="less" rel="stylesheet/less">
@import "../less/reset.less";
@import "../less/base.less";
@import "../less/media.less";
@import "./zh-cn.less";
@import "./en.less";
</style>
