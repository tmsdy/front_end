<template>
    <div class="SocialMedia">
        <div class="tabsBox" v-if="tabShow">
            <el-tabs v-model="activeName" class="subTabs-pullRight">
                <el-tab-pane label="商品发布" name="0"></el-tab-pane>
                <el-tab-pane label="内容发布" name="1"></el-tab-pane>
                <el-tab-pane label="社交互动" name="2"></el-tab-pane>
                <el-tab-pane label="社交私信" name="3"></el-tab-pane>
            </el-tabs>
        </div>

        <share v-if="activeName==0" @tabToggle="tabToggle"></share>
        <immediata v-if="activeName==1" @tabToggle="tabToggle"></immediata>
        <interactive v-if="activeName==2"></interactive>
        <private-letter v-if="activeName==3"></private-letter>

    </div>
</template>

<script>
import Share from './Share'
import Immediata from './Immediata'
import Interactive from './Interactive'
import PrivateLetter from './PrivateLetter'
export default {
    name: 'SocialMedia',
    data() {
        return {
            tabShow: true,
            activeName: 0
        }
    },
    methods: {
        tabToggle(bool) {
            this.tabShow = bool
        }
    },
    components: {
        'share': Share,
        'immediata': Immediata,
        'interactive': Interactive,
        'private-letter': PrivateLetter
    }
}
</script>
<style lang='less' rel='stylesheet/less' scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
