/*
 * Discription:社交媒体
 * -----
 * Created Date: Tuesday, 26th March 2019 2:18:43 pm
 * Author: 郭兵 (guobing93@163.com)
 * -----
 * Last Modified: Tuesday, 26th March 2019 4:00:50 pm
 * Modified By: name (email)
 */

<template>
    <div class="SocialMedia">
        <p class="navTitle">
            社交媒体
        </p>
        <ul v-if="!loading" class="SocialListBox clearfix">
            <li v-for="(item,key) in social" class="socialItem" :key="key">
                <div class="imgBox pull-left">
                    <a target="_blank" @click.prevent="openNewWindowTab(item.url)" :href="item.url">
                        <img v-imgsrc="item.img" data-initsrc="/static/images/initImg.png" />
                    </a>
                </div>
                <div class="socialInfo">
                    <p class="name ellipsis">
                        <a target="_blank" @click.prevent="openNewWindowTab(item.url)" :href="item.url">{{item.name}}</a>
                    </p>
                    <p class="sname">{{key}}</p>
                </div>
            </li>
        </ul>
        <loading v-if="loading"></loading>
        <no-data v-if="!loading&&Object.keys(social).length<=0" title="暂无社媒信息"></no-data>
    </div>
</template>

<script>
import NoData from '@/basecomponents/NoData'
import Loading from '@/basecomponents/Loading'
export default {
    name: 'SocialMedia',
    props: {
        detailItem: {
            type: Object,
            default: () => ({})
        },
        /*   isDeep: {
              type: Boolean,
              default: false
          }, */
        loading: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        social() {
            let t = this.detailItem.social_info || '{}'
            return JSON.parse(t)
            // if (this.isDeep) {
            //    let t = this.detailItem.social_info || '{}'
            //    return JSON.parse(t)
            // } else {
            //    return this.fakeData
            // }
        }
    },
    data() {
        return {
            // fakeData: {
            //     FakeData0: { name: 'fumasoft', url: 'www.fuammx.com', img: '/static/images/avatar.png' },
            //     FakeData1: { name: 'fumasoft', url: 'www.fuammx.com', img: '/static/images/avatar.png' },
            //     FakeData2: { name: 'fumasoft', url: 'www.fuammx.com', img: '/static/images/avatar.png' }
            // }
        }
    },
    methods: {

    },
    components: {
        'no-data': NoData,
        'loading': Loading
    }
}
</script>
<style lang='less' rel='stylesheet/less' scoped>
@import "../common.less";
@import "./zh-cn.less";
@import "./en.less";
</style>
