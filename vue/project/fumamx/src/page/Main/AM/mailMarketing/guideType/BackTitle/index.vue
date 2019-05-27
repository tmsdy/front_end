<template>
    <div class="BackTitle">
        <span class="back pd" @click="$emit('toList')"> <i class="iconfont icon-page-left"></i></span>
        <span class="back" @click="$emit('toList')">返回</span>
        <span>新建任务</span>

    </div>
</template>

<script>
export default {
    name: 'BackTitle',
    props: {

    },
    data() {
        return {

        }
    },
    created() {
        // let { display, iconURI } = this.getRoute()
        // this.icon = this.iconfont || iconURI
        // this.display = this.title || display
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.BackTitle {
    //   border:1px solid yellow;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    //   z-index: 1;
    font-size: 14px;
    height: 52px;
    line-height: 52px;
    color: #d0021b;
    border-bottom: 1px solid #eaeaea;
    background: #fff;
    text-align: center;
    font-weight: 400;
    .back {
        float: left;
        color: #606266;
    }
    .pd {
        margin-left: 15px;
    }
}
</style>
