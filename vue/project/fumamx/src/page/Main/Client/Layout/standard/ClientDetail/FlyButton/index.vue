<template>
    <div class="FlyButton" ref="FlyButton">

        <!-- delState  seasFlag 为1时，特殊 任何一个为1时，禁止点
        2018.7.4 改为 都不显示-->
        <div v-if="mainObj.delState == 1 || mainObj.seasFlag == 1"></div>
        <div class="switch" :class="isOpen ? 'transition_all':''" v-else @click="plusClick()" :title="title">
            <i class="iconfont icon-plus-file"></i>
        </div>

        <div class="Open" :class="isOpen ? 'action':''">
            <div class="list comment" @click="plusClick(moduleCode,'otComment')">
                <span class="iconBox transition_all">
                    <i class="iconfont icon-dot"></i>
                </span>
                <!-- 批注 -->
                <span class="text">{{$t('mxpcweb.client.detail.1530003497197')}}</span>
            </div>
            <div class="list remind" @click="plusClick(moduleCode,'otReminder')">
                <span class="iconBox transition_all">
                    <i class="iconfont icon-clock"></i>
                </span>
                <!-- 提醒 -->
                <span class="text">{{$t('mxpcweb.client.detail.1529998862595')}}</span>
            </div>
            <div class="list contacts" @click="plusClick('BF003','otNew')">
                <span class="iconBox transition_all">
                    <i class="iconfont icon-contacts"></i>
                </span>
                <!-- 联系人 -->
                <span class="text">{{$t('mxpcweb.client.detail.1529995128332')}}</span>
            </div>
            <div class="list attachment" @click="attachmentClick()">
                <span class="iconBox transition_all">
                    <i class="iconfont icon-attachment"></i>
                </span>
                <!-- 附件 -->
                <span class="text">{{$t('mxpcweb.client.detail.1530003645283')}}</span>
            </div>
            <div class="list follow-up" @click="plusClick('BF004','otNew')">
                <span class="iconBox transition_all">
                    <i class="iconfont icon-foot"></i>
                </span>
                <!-- 跟进 -->
                <span class="text">{{$t('mxpcweb.client.detail.1530003673172')}}</span>
            </div>
        </div>

    </div>
</template>

<script>
/**
 * 漂浮展示按钮
*/
export default {
    name: 'FlyButton',
    props: {
        fly: {
            type: Boolean,
            default: true
        },
        title: {
            type: String,
            default: ''
        },
        moduleCode: {
            type: String,
            default: ''
        },
        pageId: {
            type: String,
            default: ''
        },
        mainObj: {
            type: Object,
            default: function () {
                return {}
            }
        }
    },
    data() {
        return {
            isOpen: false
        }
    },
    mounted() {
        let _this = this
        // 点击其他隐藏
        $(document).on('click', (e) => {
            try {
                if (!_this.$refs['FlyButton'].contains(e.target)) {
                    _this.isOpen = false
                }
            } catch (e) {
                // console.log("FlyButton" + e)
            }
        })
    },
    methods: {
        plusClick(moduleNum, ot) {
            if (this.fly) {
                this.isOpen = !this.isOpen
            }
            this.$emit('flyBtnClick', moduleNum, ot)
        },
        // 附件点击单独处理
        attachmentClick() {
            let data = {
                url: this.Global.api.v2.folders_files, // api（必传）
                fileSource: 3,
                billId: this.pageId,
                custId: this.pageId,
                remarks: '',
                moduleCode: this.moduleCode,
                fn(res) {
                    // 重置状态
                }
            }
            ep.emit('selectFile', data)// 相当于触发标记
        }
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
