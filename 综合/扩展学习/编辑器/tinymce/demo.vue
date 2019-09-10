<template>
    <div class="">
        <editor api-key="API_KEY" :init="{plugins: 'wordcount'}"></editor>
    </div>
</template>

<script>
import Editor from './tinymce-vue';
// var Editor = require('@tinymce/tinymce-vue').default;

export default {
    name: 'demo',
    data() {
        return {
            msg: 'hello feifei'
        }
    },
    methods: {

    },
    components: {
        'editor': Editor
    },
}
</script>
<style>
</style>

