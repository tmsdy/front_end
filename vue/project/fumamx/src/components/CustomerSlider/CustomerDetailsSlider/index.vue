<template>
    <div class="CustomerDetailsSlider">
        <div class="row"></div>
        <div class="tab">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <!-- 往来邮件 -->
                <el-tab-pane :label="$t('mxpcweb.mail.1546590005065')" name="first"></el-tab-pane>
                <!-- 行为跟踪 -->
                <el-tab-pane :label="$t('api-am.1542271554050')" name="second"></el-tab-pane>

                <!-- 附件 -->
                <el-tab-pane :label="$t('mxpcweb.mail.1528709296344')" name="third">
                    <Attachment :mailAddress="mailAddress" :windowMode="true" />
                </el-tab-pane>
            </el-tabs>
        </div>
        <div class="tabDetail">
            <track-detail-body v-show="activeName=='second'" :moduleCode="'EM001'" :mailAddress="mailAddress"></track-detail-body>
            <!-- :custId="'3528552'" -->
            <list-center ref="ListCenter" v-show="activeName=='first'" :mailAddress="mailAddress" @OperationTrigger="OperationTrigger"></list-center>
        </div>
        <puablic-action ref="puablicAction" @LastListCenter="LastListCenter"></puablic-action>
    </div>

</template>
<script>
import TrackDetailBody from '@/basecomponents/TrackDetailBody/index.vue'
import ListCenter from '@/page/Main/Mail/Home/ListCenter/index.vue'
import puablicAction from '@/page/Main/Mail/Home/vue/puablicAction.vue'
import Attachment from '@/page/Main/Client/Layout/standard/ClientDetail/Tabs/Attachment/'
export default {
    name: 'CustomerDetailsSlider',
    props: {
        mailAddress: {
            type: String,
            default: ''
        }

    },
    data() {
        return {
            activeName: 'first'
        }
    },
    computed: {

    },
    created() {

    },
    methods: {
        LastListCenter(mIds, actionName) {
            this.$refs.ListCenter.LastListCenter(mIds, actionName)
        },
        // 操作
        OperationTrigger(key, key2, key3, key4) {
            this.$refs.puablicAction.OperationTrigger(key, key2, key3, key4)
        },
        handleClick(tab, event) {

        }

    },
    components: {
        'track-detail-body': TrackDetailBody,
        'list-center': ListCenter,
        'puablic-action': puablicAction,
        Attachment
    }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
.CustomerDetailsSlider {
    margin-top: 50px;
    min-height: 390px;
    .row {
        background: #eff2f4;
        height: 12px;
    }

    .tab {
        border: 1px solid transparent;
        // background: rgba(208, 2, 27, 0.05);
    }
    // .tabDetail {
    //     border: 1px solid red;
    // }
}
</style>
