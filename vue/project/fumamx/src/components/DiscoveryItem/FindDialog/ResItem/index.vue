<template>
    <div class="ResItem">
        <div class="leftBox">
            <div class="clearfix">
                <p class="title pull-left" ref="title" v-html="title"></p>
                <i v-if="isSocial" @click="$emit('lookInfo')" class="infoIcon iconfont icon-personal-data"></i>
            </div>
            <div class="description" ref="description" v-html="item.description"></div>
            <p class="link">
                <a :href="item.link" @click.prevent="openNewWindowTab(item.link)" target="_blank ">{{item.link}}</a>
            </p>
        </div>
        <div v-if="item.is_deep==3&&item.deepName" class="deepFlag">
            {{item.deepName}}&nbsp;已挖
        </div>
        <div v-else class="deepFlag selBtn " @click="$emit('selClick')" :class="{'active':selected}">
            <i v-if="selected" class="iconfont icon-correct"></i>
            {{selected?'':'选择'}}
        </div>
    </div>
</template>

<script>
export default {
    name: 'ResItem',
    props: {
        item: {
            type: Object,
            default: () => ({})
        },
        pageType: {
            type: String,
            default: ''
        },
        isAdmin: {
            type: Boolean,
            default: false
        },
        isSocial: {
            type: Boolean,
            default: false
        },
        selected: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {

        }
    },
    computed: {
        title() {
            return this.item.title ? this.item.title.replace('- Home | Facebook', '').replace('| LinkedIn', '') : ''
        }
    },
    mounted() {
        this.setClamp()
    },
    methods: {
        setClamp() {
            $clamp(this.$refs.title, {
                clamp: 1
            })
            $clamp(this.$refs.description, {
                clamp: 2
            })
        }
    },
    components: {

    }
}
</script>
<style lang='less' rel='stylesheet/less' scoped>
@import "./en.less";
@import "./zh-cn.less";
</style>
