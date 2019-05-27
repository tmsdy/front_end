<template>
    <div class="StartPage">
        <img class="bgImg" src="/static/images/find/customs_bg.jpg" alt="">
        <div class="mainBox">
            <p class="title">孚盟国际贸易大数据
                <span class="attach">及时、精准、海量</span>
            </p>
            <p class="description">
                覆盖37个国家进口数据和23国出口数据
                <br>
                包含200个国家，3亿条贸易数据，3000多万采购商和供应商
            </p>
            <div class="searchBox">
                <ul class="tabBox clearfix">
                    <li v-for="(item,key) in typeList" class="pull-left tabItem" @click="setSearchType(key)" :class="{'active':key==searchType}" :key="key">
                        <i class="iconfont" :class="item.icon"></i>
                        {{item.label}}
                    </li>
                </ul>
                <div class="searchBar clearfix">
                    <i class="iconfont icon-search"></i>
                    <input class="pull-left input" @keyup.enter="toSearch()" :placeholder="typeList[searchType].placeholder" type="text" v-model="keywords">

                    <div @click="toSearch()" class="pull-right btn">Search</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: 'StartPage',
    model: {
        prop: 'searchType',
        event: 'typeChange'
    },
    props: {
        searchType: {
            type: String,
            default: ''
        },
        typeList: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            keywords: ''
        }
    },
    methods: {
        setSearchType(type) {
            this.$emit('typeChange', type)
        },
        toSearch() {
            if (!this.keywords) return
            this.$emit('search', this.keywords)
        }
    },
    components: {

    }
}
</script>
<style lang='less' rel='stylesheet/less' scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
