<template>
    <span class="lineRight" @click="handleOneToOne">
        <span class="box1">
            <i class="iconfont icon-one-to-one"></i>{{$t('mxpcweb.mail.1528709370013')}}
        </span>
        <!-- 一对一 -->
        <span @click.stop="stopBubbling" class="box2">
            <el-dropdown trigger="click" @command="handleOneToOneCommand">
                <span class="el-dropdown-link">
                    <i class="iconfont icon-arrow-down"></i>
                </span>
                <el-dropdown-menu slot="dropdown" style="margin-top:-3px;">
                    <el-dropdown-item :command='{actionName:"showOneToOneDialogNow"}'>
                        <i class="iconfont icon-one-to-one"></i>{{$t('mxpcweb.mail.1528786247686')}}
                        <!-- 立即一对一发送 -->
                    </el-dropdown-item>
                    <el-dropdown-item :command='{actionName:"timingShowOneToOneDialog"}'>
                        <i class="iconfont icon-time"></i>{{$t('mxpcweb.mail.1528786247988')}}
                        <!-- 定时一对一发送 -->
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </span>
    </span>
</template>
<script>
export default {
    name: 'OneToOneTransmission',
    data() {
        return {

        }
    },
    computed: {

    },
    created() {
    },
    mounted() {
    },
    methods: {
        handleOneToOne() { // 一对一发送
            this.$emit('senndAction', 'ordinaryOneToOne')
        },
        handleOneToOneCommand(command) {
            if (command.actionName == 'showOneToOneDialogNow') { // 立即发送
                this.$emit('senndAction', 'showOneToOneDialogNow')
            } else if (command.actionName == 'timingShowOneToOneDialog') { // 定时发送
                this.$emit('senndAction', 'timingShowOneToOneDialog')
            }
        },
        stopBubbling() {

        }

    }
    //  ,
    // watch: {
    //     $route() {
    //         this.pageInit();
    //     }
    // }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
.box1 {
    display: inline-block;
    padding: 0 10px;
    border-top-left-radius: 2px;
    border-bottom-left-radius: 2px;
    // border: 1px #eaeaea solid;
    border-right: 1px solid transparent;
    &:hover {
        z-index: 2;
        color: #e6001f;
        // border: 1px #e6001f solid;
        border-right: 1px solid #e6001f;
        background: rgba(208, 2, 27, 0.05);
        cursor: pointer;
    }
}
.box2 {
    display: inline-block;
    padding: 0 10px;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    // border-bottom-right-radius: 2px;
    // border-top-right-radius: 2px;
    // border: 1px #eaeaea solid;
    border-left: 1px #eaeaea solid;
    &:hover {
        border-color: #e6001f;
        background: rgba(208, 2, 27, 0.05);
        cursor: pointer;

        > i {
            color: #e6001f;
        }
        .el-dropdown {
            color: #e6001f;
            cursor: pointer;

            > i {
                color: #e6001f;
            }

            .icon-page-down {
                color: #e6001f;
            }
        }
    }
}
</style>
