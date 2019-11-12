<template>
    <div id="app">
    </div>
</template>

<script>

export default {
    name: 'app',
}
</script>

<style lang="less">
/* @rem
当页面宽度为375px时候，设置375px为正确的大小。
保证 375 * @rem = 375，iphone6的时候正好window.devicePixelRatio = 2
-> @rem = 1px -> 当前页面宽为375时，除以25得到15px赋值给html的fontSize -> 1rem = 15px
-> @rem = 1/15rem = 1px
*/
// @rem: 1/15rem;
// #app {
//     width: 360 * @rem;
//     // width: 360px;
//     // width: 310px;
//     height: 60px;
//     background: pink;
// }

/*
rem 当页面宽度为375px时候，目标设置3.75rem为正确的大小。那就把html的fontSize搞到100px
document.documentElement.style.fontSize = html.clientWidth / 3.75 + 'px';
*/
#app {
    width: 3.6rem;
    height: 60px;
    background: pink;
}
</style>
