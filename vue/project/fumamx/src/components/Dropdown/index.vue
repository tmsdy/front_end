/*
 * Discription: 自定义带搜索的下拉框
 * -----
 * Created Date: Tuesday, 26th February 2019 2:48:01 pm
 * Author: 郭兵 (guobing93@163.com)
 * -----
 * Last Modified: Tuesday, 26th February 2019 4:08:56 pm
 * Modified By: name (email)
 */

<template>

    <div class="Dropdown">
        <div class="inputBox">
            <input class="inputShow" type="text" @click="showToggle()" :placeholder="placeholder" autocomplete="off" readonly="readonly" :value="selectedItem?selectedItem[labelKey]:''">
            <i class="arrow iconfont icon-page-up" @click="showToggle()" :class="{'show':isShow}"></i>
        </div>
        <div class="list-and-search" :class="isShow?'on':''">
            <div class="search-module clearfix" v-show="needSearch||querySearchAsync">
                <i class="searchIcon iconfont icon-search"></i>
                <input ref="input" class="search-text" v-model="keywords" @keyup='handleSearch($event)' :placeholder="searchPlaceholder" />
                <i v-if="keywords.length>0" @click="clearKeyword()" class="clearBtn"></i>
            </div>
            <div v-show="!isLoading" ref="scrollList" class="list-module MXscroll">
                <!--  <div v-for="(item,index) in showList" @click="selectToggle(item)" class="ellipsis list-item" :class="{'active':selectedItem&&selectedItem[valueKey]==item[valueKey],'disabled':isDisabled(item)}" :key="index">
                    <span class="list-item-text">{{item[labelKey]}}</span>
                </div> -->
                <item v-for="(item,index) in showList" @select="selectToggle(item)" :key='index' :label="item[labelKey]" :value="item[valueKey]" :selectedValue="selectedItem[valueKey]" :disabled="isDisabled(item) " />
                <loading v-if="isLoadingMore" title="">
                </loading>
            </div>
            <loading v-if="isLoading"></loading>
            <div class="tip-nodata" v-show="!isLoading&&needSearch && showList.length == 0">{{nodataText}}</div>
        </div>
    </div>
</template>
<script>
import { toPinyin } from '@/libs/utils.js'
import Loading from '@/basecomponents/Loading'
import Item from './Item'
export default {
    name: 'Dropdown',
    model: {
        prop: 'value',
        event: 'change'
    },
    props: {
        value: {
            type: [Number, String, Object],
            defaul: ''
        },
        usePinyin: {
            type: Boolean,
            default: true
        },
        list: {
            type: Array,
            default: () => []
        },
        labelKey: {
            type: String,
            default: 'label'
        },
        valueKey: {
            type: String,
            default: 'value'
        },
        placeholder: {
            type: String,
            defalut: '请选择'
        },
        searchPlaceholder: {
            type: String,
            defalut: '搜索'
        },
        preLoad: {
            type: Boolean,
            default: false
        },
        querySearchAsync: {
            type: Function,
            default: null
        },
        needSearch: {
            type: Boolean,
            default: false
        },
        nodataText: {
            type: String,
            default: '未找到结果'
        },
        getDisabled: {
            type: Function,
            default: () => false
        }
    },
    data() {
        return {
            keywords: '',
            datalist: [],
            showList: [],
            selectedItem: '',
            isShow: false,
            isLoading: false,
            isLoadingMore: false,
            hasMore: false,
            isLoaded: false
        }
    },
    created() {
        /*  点击组件以外的地方，收起 */
        document.addEventListener('click', (e) => {
            if (!this.$el.contains(e.target)) {
                this.isShow = false
            }
        }, false)
        // if (this.preLoad) {
        //    this.handleSearch(null, true)
        // }
    },
    mounted() {
        this.dealList()
    },
    methods: {
        isDisabled(item) {
            return this.getDisabled(item)
        },
        clearKeyword() {
            this.keywords = ''
            this.handleSearch(null, true)
        },
        listenScroll() {
            let scrollList = this.$refs.scrollList
            scrollList.addEventListener('scroll', () => {
                let h = scrollList.offsetHeight
                let sh = scrollList.scrollHeight
                let st = scrollList.scrollTop
                if (h + st >= sh) {
                    if (!this.isLoadingMore && this.hasMore) {
                        this.toLoadMore()
                    }
                }
            })
        },
        toLoadMore() {
            if (this.querySearchAsync && typeof this.querySearchAsync === 'function') {
                this.isLoadingMore = true
                let res = {
                    keywords: this.keywords,
                    callback: (result, hasMore = false) => {
                        this.isLoadingMore = false
                        this.hasMore = hasMore
                        this.showList = result
                    },
                    isLoadMore: true
                }
                this.querySearchAsync(res)
            }
        },
        showToggle() {
            this.isShow = !this.isShow
            if (this.isShow) {
                this.$nextTick(() => {
                    this.$refs.input.focus()
                })
            }
        },
        selectToggle(data) {
            this.selectedItem = data
            this.isShow = false
            this.$emit('change', typeof this.value == 'object' ? data : data[this.valueKey])
        },
        handleSearch(e, isPreLoad) {
            if (this.querySearchAsync && typeof this.querySearchAsync === 'function') {
                if ((e && e.key !== 'Enter') || (!e && !isPreLoad)) { return }
                this.isLoaded = true
                this.isLoading = true
                let res = {
                    keywords: this.keywords,
                    callback: (result, hasMore = false) => {
                        this.isLoading = false
                        this.hasMore = hasMore
                        this.showList = result
                        hasMore && this.listenScroll()
                    },
                    isLoadMore: false
                }
                this.querySearchAsync(res)
            } else {
                this.showList = this.datalist.filter((item) => {
                    return item.alias.toLowerCase().replace(/\s+/g, '').indexOf(this.keywords.toLowerCase().replace(/\s+/g, '')) != -1
                })
            }
        },
        dealList() {
            if (this.list.length <= 0) {
                this.showList = this.datalist = []
            } else {
                this.showList = this.datalist = toPinyin([].concat(this.list), { usekey: this.labelKey })
            }
            this.setSelectItem()
        },
        setSelectItem() {
            if (typeof this.value == 'object') {
                this.selectedItem = Object.assign({}, this.value)
                return
            };
            for (let index = 0; index < this.showList.length; index++) {
                let item = this.showList[index]
                if (item[this.valueKey] == this.value) {
                    this.selectedItem = item
                    break
                }
            }
        }
    },
    watch: {
        list() {
            this.dealList()
        },
        value() {
            this.setSelectItem()
        },
        isShow() {
            if (this.isShow) {
                this.keywords = ''
                if (this.isLoaded) { return }
                this.handleSearch(null, true)
            }
        }
    },
    components: {
        'loading': Loading,
        'item': Item
    }
}
</script>
<style lang='less' rel='stylesheet/less' scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
