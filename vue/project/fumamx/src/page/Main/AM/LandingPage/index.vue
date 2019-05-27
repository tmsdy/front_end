<template>
    <div class="LandingPage">
        <page-list v-if="tabData==1" @changeTabData="changeTabData" @basicForm="getbasicform"></page-list>
        <add-chioce v-if="tabData==2" @changeTabData="changeTabData" @basicForm="getbasicform"></add-chioce>
        <add-page v-if="tabData==3" @changeTabData="changeTabData" :formdata="addForm" @createFromData="getCreateForm"></add-page>
        <detail-page v-if="tabData==4" @changeTabData="changeTabData" :setFormData='createForm'></detail-page>
    </div>
</template>

<script>

import List from './List/index'
import addPage from './addPage'
import addChioce from './addChioce'
import detailPage from './detailPage'
export default {
    name: 'LandingPage',
    data() {
        return {
            tabData: '1',
            addForm: Object,
            createForm: Object
        }
    },
    mounted() { },
    methods: {
        changeTabData(n) {
            this.tabData = n
        },
        getbasicform(data) {
            this.addForm = data
        },
        getCreateForm(data) {
            this.createForm = data
        }
    },
    components: {
        'page-list': List,
        'add-page': addPage,
        'add-chioce': addChioce,
        'detail-page': detailPage
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
