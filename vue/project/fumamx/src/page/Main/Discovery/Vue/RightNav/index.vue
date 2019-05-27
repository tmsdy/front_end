<template>
    <div class="RightNav">
        <ul class="navBox">
            <template v-for="(item ,index) in list">
                <router-link v-if="item.moduleCode=='DS005'" :to="item.uRI" tag="li" class="navItem special" :key="index">
                    <img class="Icon imageIcon" src="/static/images/find/hot.png" alt="">
                    <span>{{item.display}}</span>
                    <p class="tag">
                        <span class="text">推荐</span>
                    </p>
                </router-link>
                <router-link v-else :to="item.uRI" tag="li" class="navItem" :key="index">
                    <i class="Icon iconfont " :class="item.iconURI"></i>
                    <span>{{item.display}}</span>
                </router-link>
            </template>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'RightNav',
    props: ['list'],
    data() {
        return {

        }
    },
    methods: {

    },
    mounted() {

    },
    components: {

    }
}
</script>
<style lang='less' rel='stylesheet/less' scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
