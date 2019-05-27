<template>
    <div class="MailSet">
        <keep-alive>
            <router-view></router-view>
        </keep-alive>
    </div>
</template>

<script>
export default {
  name: 'MailSet'
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.MailSet{
    width: 100%;
    height: 100%;
    overflow: auto;
    position: relative;
}
</style>
