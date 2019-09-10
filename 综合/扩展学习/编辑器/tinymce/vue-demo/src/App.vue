<template>
    <div id="app">
        <!-- <full-featured></full-featured> -->
        <custom-toolbar></custom-toolbar>
    </div>
</template>

<script>
import FullFeatured from './FullFeatured'
import CustomToolbar from './CustomToolbar'
export default {
    name: 'app',
    data() {
        return {

        }
    },
    methods: {
    },
    components: {
        'full-featured': FullFeatured,
        'custom-toolbar': CustomToolbar
    }
}
</script>

<style>
#app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
.tox-notifications-container {
    display: none;
}
</style>
