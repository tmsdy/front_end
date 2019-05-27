<template>
<div>
    <custom ref="custom"></custom>
    <other ref="other"></other>
</div>
</template>
<script>
/**
 * 描述：客户管理-客户列表-编辑客户
 * 作者：何俊峰
 * 时间：2017/11/22
 */
import custom from './Vue/custom.vue'
import other from './Vue/other.vue'
export default {
    name: 'sendEmailBox',
    props: {
    },
    data() {
        return {
        }
    },
    created() {
    },
    mounted() {
    },
    computed: {
    },
    methods: {
        openWindow(obj) {
            if (obj.moduleCode == 'BF001') {
                this.$refs.custom.openWindow(obj)
            } else {
                this.$refs.other.openWindow(obj)
            }
        }
    },
    watch: {

    },
    components: {
        'other': other,
        'custom': custom
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.addLowerCust{
    padding:20px 20px;
    .mailBox{
        padding:0 20px;
        max-height: 400px;
        padding-bottom:50px;
        overflow-y: auto;
        .contentsBox{
            .contents1{
                height: 40px;
                line-height:40px;
            }
            .contents2{
                height: 40px;
                line-height:40px;
                .content{
                    height: 40px;
                    line-height:40px;
                }
            }
        }
    }
    .dialogFooter{
        height: 80px;
    }
}
</style>
