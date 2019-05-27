<template>
    <span @click="SendClick()" class="colorg">
        <span class="box1">
            <i class="iconfont icon-send"></i>{{$t('mxpcweb.mail.1528701612107')}}
        </span>
        <!-- 发送 -->
        <span @click.stop="stopBubbling" class="box2">
            <el-dropdown trigger="click" @command="SendingTime">
                <span>
                    <i class="iconfont icon-arrow-down"></i>
                </span>
                <el-dropdown-menu slot="dropdown" style="margin-top:-3px;">
                    <el-dropdown-item :command='{type:"immediately" }'>
                        <i class="iconfont icon-send"></i>{{$t('mxpcweb.mail.1528786177598')}}
                        <!-- 立即发送 -->
                    </el-dropdown-item>
                    <el-dropdown-item :command='{type:"timing"}'>
                        <i class="iconfont icon-time"></i>{{$t('mxpcweb.mail.1528786189128')}}
                        <!-- 定时发送 -->
                    </el-dropdown-item>
                    <el-dropdown-item :command='{type:"delayed"}'>
                        <i class="iconfont icon-arrow-down-empty"></i>{{$t('mxpcweb.mail.1528786238556')}}
                        <!-- 延时发送 -->
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </span>
    </span>

</template>
<script>
export default {
    name: 'OrdinarySend',
    props: ['ParameterData', 'sendType', 'sourceMid', 'originMid'],
    data() {
        return {
            params: {}

        }
    },
    computed: {

    },
    created() {
    },
    mounted() {
    },
    methods: {
        SendClick() {
            this.$emit('senndAction', 'ordinary')
        },
        // 发送类型
        SendingTime(command) {
            this.$emit('senndAction', command.type)
        },
        stopBubbling() {

        },
        // 根据设定的时间发送
        OrdinarySend() {
            this.params = this.ParameterData
            this.params.action = 'send'
            this.params.type = 0 // 一对多
            this.params.realTime = true
            this.params.sendType = this.sendType
            if (this.sourceMid != '') {
                this.params.sourceMid = this.sourceMid
            }
            if (this.originMid != '' && this.sendType != 'new') {
                this.params.originMid = this.originMid
            }
            this.$emit('SendMailAction', this.params, 0)
        },
        SendImmediately(ParameterData) { // 立即发送
            this.params = ParameterData
            this.params.action = 'send'
            this.params.type = 0 // 一对多
            this.params.realTime = true
            this.params.sendType = this.sendType
            if (this.sourceMid != '') {
                this.params.sourceMid = this.sourceMid
            }
            if (this.originMid != '' && this.sendType != 'new') {
                this.params.originMid = this.originMid
            }
            let data = new Date().getTime()
            this.params.deliverDate = this.$m_unifiedTime(data)

            this.$emit('SendMailAction', this.params, 1)
        },
        // 延迟发送
        delayModeSeend() {
            this.delayShow = false
            this.params = this.ParameterData
            this.params.realTime = false
            this.params.type = 0 // 一对多
            this.params.sendType = this.sendType
            this.params.action = 'send'
            if (this.sourceMid != '') {
                this.params.sourceMid = this.sourceMid
            }
            if (this.originMid != '' && this.sendType != 'new') {
                this.params.originMid = this.originMid
            }
            // let sendTime = new Date().getTime() + item.action * 1000 * 60
            // this.params.deliverDate = this.$m_unifiedTime(sendTime)
            // let curTime = new Date().getTime()
            // if (sendTime <= curTime) {
            //     this.$dialog.alert({ message: '发送时间不能小于当前时间！' })
            //     return
            // }
            this.$emit('SendMailAction', this.params, 0)
        },
        // 定时发送
        timingModeSeend() {
            this.params = this.ParameterData
            this.params.type = 0 // 一对多
            this.params.realTime = false
            this.params.sendType = this.sendType
            if (this.sourceMid != '') {
                this.params.sourceMid = this.sourceMid
            }
            if (this.originMid != '' && this.sendType != 'new') {
                this.params.originMid = this.originMid
            }
            this.params.action = 'send'
            // let curTime = new Date().getTime()
            // this.params.deliverDate = this.$m_unifiedTime(value)
            // let sendTime = value.getTime()
            // if (sendTime <= curTime) {
            //     this.$dialog.alert({ message: '发送时间不能小于当前时间！' })
            //     return
            // }
            this.$emit('SendMailAction', this.params, 0)
        }

    },
    watch: {
        // ParameterData: {
        //     handler(curVal, oldvalue) {
        //         console.log('bianle')
        //     }
        // }
        // $route() {
        //     this.pageInit()
        // }
    }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
.box1 {
    background: #7bbb63;
    display: inline-block;
    padding: 0 10px;
    border-top-left-radius: 2px;
    border-bottom-left-radius: 2px;
    &:hover {
        background-color: #91d279;
        border-color: #91d279;
         cursor: pointer;
    }
}
.box2 {
    background: #7bbb63;
    border-left:1px solid #62ad46;
    display: inline-block;
    padding: 0 10px;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    border-bottom-right-radius: 2px;
    border-top-right-radius: 2px;
    &:hover {
        background-color: #91d279;
        border-color: #91d279;
         cursor: pointer;
    }
}
.el-dropdown {
    // margin-left: 3px;

    .icon-arrow-down {
        font-size: 12px;
        color: #ffffff;
    }
}
</style>
