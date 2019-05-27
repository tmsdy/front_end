<template>
    <div class="SeendStatus">
        <!-- 一对一发送状态： -->
        <div class="name" v-if="DetailData.source=='FMD'&&DetailData.type==1">{{$t('mxpcweb.mail.1528709370013')}}：</div>
        <div class="stateName" :class="DetailData.deliveryStatus!=1?'text-red':''" v-if="DetailData.source=='FMD'&&DetailData.type==1">
            <span class="statet">{{getStatus(DetailData.deliveryStatus)}}</span>
            <!-- 将在%{a}发送 -->
            <span class="statet" v-if="!DetailData.realTime&&DetailData.deliveryStatus==-1&& Date.parse(DetailData.deliveryTime)>(new Date()).getTime() ">&nbsp; &nbsp; &nbsp; {{$t('mxpcweb.mail.1528719497515',{a:DetailData.deliveryTime})}}
            </span>
            <span v-if="DetailData.deliveryStatus==-2&&DetailData.singleMailDeliveryStatuses&&DetailData.singleMailDeliveryStatuses.length>0">
                <!-- 失败原因 -->
                <span class="stateClass">{{$t('mxpcweb.mail.1528709375920')}}:{{DetailData.singleMailDeliveryStatuses[0].state}}</span>
            </span>
            <!-- 查看详情 -->
            <span class="statetColor text-hover" @click="$emit('stateShowChange',true)" v-if="!stateShow&&DetailData.deliveryStatus !=-2&&DetailData.deliveryStatus !=-1&&DetailData.deliveryStatus !=-3&&DetailData.deliveryStatus !=-4">&nbsp; &nbsp; &nbsp;{{$t('mxpcweb.mail.1528709376530')}}</span>
            <!-- 隐藏详情 -->
            <span class="statetColor text-hover" @click="$emit('stateShowChange',false)" v-if="stateShow&&DetailData.deliveryStatus !=-2&&DetailData.deliveryStatus !=-1&&DetailData.deliveryStatus !=-3&&DetailData.deliveryStatus !=-4">&nbsp; &nbsp; &nbsp;{{$t('mxpcweb.mail.1528709376782')}}</span>
            <!-- 刷新 -->
            <span class="statetColor text-hover" v-if="DetailData.deliveryStatus ==2||DetailData.deliveryStatus ==0" @click="$emit('getDeliveryStatus',DetailData.mId,DetailData.fromEx[0].address)">&nbsp;&nbsp;&nbsp;{{$t('mxpcweb.mail.1528709377044')}}</span>
            <span class="statetColor" v-if="!DetailData.realTime&&DetailData.deliveryStatus==-1" @click="DeleteTimeTask(DetailData.mId,DetailData.fromEx[0].address)">
                &nbsp;&nbsp;&nbsp; {{$t('mxpcweb.mail.1528709377426')}}
            </span>

        </div>

        <!-- <div class="item " > -->
        <!-- 发送状态 -->
        <div class="name " v-if="DetailData.source=='FMD' &&DetailData.type==0 ">{{$t('mxpcweb.mail.1528709377866')}}：</div>
        <div class="stateName" :class="DetailData.deliveryStatus!=1? 'text-red': '' " v-if="DetailData.source=='FMD' &&DetailData.type==0 ">
            <span class="statet">{{getStatus(DetailData.deliveryStatus)}}</span>
            <span v-if="DetailData.deliveryStatus==-2&&DetailData.singleMailDeliveryStatuses &&DetailData.singleMailDeliveryStatuses.length>0">
                <span class="stateClass">
                    <!-- 失败原因 -->
                    {{$t('mxpcweb.mail.1528709375920')}}:{{DetailData.singleMailDeliveryStatuses[0].state}}
                </span>
            </span>
            <!-- 将在%{a}发送 -->
            <span class="statet" v-if="!DetailData.realTime&&DetailData.deliveryStatus==-1&& Date.parse(DetailData.deliveryTime)>(new Date()).getTime()  ">&nbsp; &nbsp; &nbsp; {{ $t('mxpcweb.mail.1528719497515',{a:DetailData.deliveryTime}) }}</span>
            <!-- 刷新 -->
            <span class="statetColor " v-if="DetailData.deliveryStatus ==2||DetailData.deliveryStatus ==0 " @click="$emit('getDeliveryStatus',DetailData.mId,DetailData.fromEx[0].address) ">&nbsp;&nbsp;&nbsp;{{$t('mxpcweb.mail.1528709377044')}}</span>
            <!-- 撤销发送 -->
            <span class="statetColor " v-if="!DetailData.realTime&&DetailData.deliveryStatus==-1&& Date.parse(DetailData.deliveryTime)>(new Date()).getTime() " @click="DeleteTimeTask(DetailData.mId,DetailData.fromEx[0].address) ">
                &nbsp;&nbsp;&nbsp;{{$t('mxpcweb.mail.1528709377426')}}
            </span>
            <!-- </div> -->

        </div>

    </div>

</template>
<script>
export default {
    name: 'SeendStatus',
    props: {
        DetailData: {
            type: Object,
            default: function () {
                return {}
            }
        },
        stateShow: {
            type: Boolean,
            default: function () {
                return false
            }

        }
    },
    data() {
        return {
        }
    },
    computed: {

    },
    created() {

    },
    methods: {
        getStatus(deliveryStatus) {
            let sata = ''
            if (deliveryStatus == 1) {
                sata = this.$t('mxpcweb.mail.1528782772184')// 发送成功
            } else if (deliveryStatus == 2) {
                sata = this.$t('mxpcweb.mail.1528782788052')// '发送中';
            } else if (deliveryStatus == -2) {
                sata = this.$t('mxpcweb.mail.1528782788353')// '发送失败';
            } else if (deliveryStatus == -1) {
                sata = this.$t('mxpcweb.mail.1528782788708')// '等待发送中';
            } else if (deliveryStatus == 0) {
                sata = this.$t('mxpcweb.mail.1528782789206')// '部分成功';
            } else if (deliveryStatus == -3) {
                sata = this.$t('mxpcweb.mail.1528782808086')// '已撤销发送';
            } else if (deliveryStatus == -4) {
                sata = this.$t('mxpcweb.mail.1528782808822')// '发送超时';
            } else if (deliveryStatus == -5) {
                sata = this.$t('mxpcweb.mail.1536744353613')// '任务创建失败';
            }
            return sata
        },
        // 邮件撤销发送
        DeleteTimeTask(mId, address) {
            let data = {
                'moduleCode': 'EM001',
                'identifyValue': mId,
                'identifyField': 'mId'
            }
            this.$http.post(this.Global.baseURL + this.Global.api.Mail.DeleteTimeTask, data).then(function (res) {
                if (res.body.code.toString() == this.Global.RES_OK) {
                    this.$message.success(this.$t('mxpcweb.mail.1530004720561'))// 撤销发送成功！
                    // this.DetailData.deliveryStatus = -3
                    this.$emit('LastListCenter', [this.DetailData.mId], '')
                } else {
                    this.$message.error(res.body.msg)
                }
            },
                function (res) {
                    this.$message.error(this.$t(this.Global.errorTitle))
                })
        }
    }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
