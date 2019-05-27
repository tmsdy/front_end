<template>
    <el-dropdown class="DropSearch" @command="selectToggle" :menu-align="menuAlign" :trigger="trigger" @visible-change="changeShow">
        <slot>
            <div class="ShowBox">
                <input class="inputShow" type="text" :placeholder="placeholder" autocomplete="off" readonly="readonly" :value="selectedItem?selectedItem[labelKey]:''">
                <i class="arrow iconfont icon-page-up" :class="{'show':isShow}"></i>
            </div>
        </slot>
        <el-dropdown-menu class="Menu" slot="dropdown">
            <div class="InputBox">
                <i class="searchIcon iconfont icon-search"></i>
                <input v-model="keywords" class="search-text" ref="InputBox" @keyup='handleSearch($event)' :placeholder="searchPlaceholder" type="text">
                <i v-if="keywords.length>0" @click="clearKeyword()" class="clearBtn"></i>
            </div>
            <div v-show="!isLoading&&showList.length > 0" ref="scrollList" class="ItemBox MXscroll">
                <el-dropdown-item v-for="(item,index) in showList" :command="item" :disabled="isDisabled(item)" :key="index">{{item[labelKey]}}</el-dropdown-item>
                <loading v-if="isLoadingMore" title="" />
            </div>
            <loading v-if="isLoading" />
            <div class="tip-nodata" v-show="!isLoading&&needSearch&&showList.length == 0">{{nodataText}}</div>
        </el-dropdown-menu>
    </el-dropdown>
</template>

<script>
import { toPinyin } from '@/libs/utils.js'
import Loading from '@/basecomponents/Loading'
export default {
    name: 'DropSearch',
    model: {
        prop: 'value',
        event: 'change'
    },
    props: {
        trigger: {
            type: String,
            default: 'click'
        },
        menuAlign: {
            type: String,
            default: 'start'
        },
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
    mounted() {
        this.dealList()
    },
    methods: {
        changeShow(visible) {
            this.isShow = visible
            if (visible) {
                this.$nextTick(() => {
                    this.$refs.InputBox.focus()
                })
            }
        },
        clearKeyword() {
            this.keywords = ''
            this.handleSearch(null, true)
        },
        isDisabled(item) {
            return this.getDisabled(item)
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
        'loading': Loading
    }
}
</script>
<style lang='less' rel='stylesheet/less' scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
