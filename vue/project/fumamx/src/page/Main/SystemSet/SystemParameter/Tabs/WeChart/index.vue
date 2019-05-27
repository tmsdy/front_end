<template>
    <div class="WeChart">
        <div class="scan">
            <img :src="getQRCode" />
            请微信扫码体验
        </div>
    </div>
</template>

<script>
export default {
    name: 'WeChart',
    props: {
    },
    data() {
        return {
        }
    },
    created() {

    },
    computed: {
        // 根据环境不同设置不同二维码
        getQRCode() {
            return window.runtime === 'prod' ? 'https://sf.fumamx.com/img/300x300/4,2cb5ae7199f8' : 'https://sf.fumamx.com/img/300x300/4,2cad624fac95'
        }
    },
    methods: {

    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.WeChart {
    // border: 1px solid red;
    padding: 15px 28px 25px;
    .scan {
        // border:1px solid red;
        width: 220px;
        text-align: center;
        img {
            width: 100%;
            margin-bottom: 10px;
        }
    }
}
</style>
