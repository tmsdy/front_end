<template>
    <div class="guideType">
        <back-title :title="$t('mxpcweb.am.1531897436358')" iconfont="icon-mail" @toList="$emit('tabDataCheck','1')"></back-title>
        <div class="step">
            <template v-for="(item,index) in stepArry">
                <div class="box01" :key="index" :style="{'border-left':(index==0)?'':'none'}">
                    <div class="divclass">
                        <span class="spanicont">{{item.code}}</span> {{item.text}}
                    </div>

                    <div class="box02"></div>
                </div>
            </template>
        </div>
        <div class="stepDetail">

        </div>
    </div>
</template>

<script>
import BackTitle from './BackTitle/index'
export default {
    name: 'guideType',
    props: {},
    data() {
        return {
            stepArry: [
                { code: 1,
                    text: '基本信息'
                },
                { code: 2,
                    text: '收件人'
                }, { code: 3,
                    text: '编辑内容'
                }, { code: 4,
                    text: '设置发送时间'
                }
            ]
        }
    },
    created() {

    },
    methods: {},
    components: {
        'back-title': BackTitle
    }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
