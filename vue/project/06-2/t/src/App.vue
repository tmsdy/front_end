<template>
    <div id="app">

        <router-view></router-view>

    </div>
</template>

<script>
export default {
    name: 'App',
    created() {
        this.$store.dispatch('verify');
        this.$store.dispatch('getCarts');
    }
}
</script>
