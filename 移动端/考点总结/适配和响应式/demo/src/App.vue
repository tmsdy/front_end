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
/* 1.@rem：为了 375 * @rem = 375px
当页面宽度为375px时候，设置375px为正确的大小。
-> 把html的fontSize即 1rem = 15px -> @rem = 1/15rem = 1px
document.documentElement.style.fontSize = html.clientWidth / 25 + 'px';
*/
@rem: 1rem/15;
#app {
    width: 375 * @rem;
    // width: 360px;
    // width: 310px;
    height: 60px;
    background: pink;
}

/* 2.rem：为了3.75rem = 375px
把html的fontSize搞到100px
document.documentElement.style.fontSize = html.clientWidth / 3.75 + 'px';
*/
// #app {
//     width: 3.6rem;
//     height: 60px;
//     background: pink;
// }
</style>
