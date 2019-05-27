<template>
    <div class="PageTitle">
        <!-- <i class="iconfont" :class="icon"></i> -->
        <span>{{showTitle?display:''}}</span>
    </div>
</template>

<script>
export default {
    name: 'PageTitle',
    props: {
        title: {
            type: String,
            default: ''
        },
        iconfont: {
            type: String,
            default: ''
        },
        showTitle: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            icon: '',
            display: ''
        }
    },
    created() {
        let { display, iconURI } = this.getRoute()
        this.icon = this.iconfont || iconURI
        this.display = this.title || display
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.PageTitle {
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
}
</style>
