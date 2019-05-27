
<template>
    <el-select clearable ref="input" :disabled="itemData.disabled" v-model="ruleForm.input" @input="doThis" @visible-change="click" :placeholder="itemData.cnFieldHint" :maxlength="itemData.fieldLength" :size="size" :style="{width: rightWidth}">
        <div class="allBox" :style="{width: rightWidth}">
            <div class="searchBox">
                <el-input v-model="keyWords" ref="searchInput" autofocus @change="handleSearch()" @blur="handleSearch()" :size="size">
                </el-input>
                <i v-if="keyWords != ''" class="clearItem iconfont icon-close text-hover" style="font-size: 12px;" @click.stop="clearData()"></i>
            </div>
            <div class="listBox MXscroll">
                <div v-show="false">
                    <el-option label="" value=""></el-option>
                </div>
                <div class="nodata" v-show="loading">
                <loading></loading>
                </div>
                <div v-show="!loading">
                    <template v-if="showListLength">
                        <div v-for="(item, index) in showList" v-show="(inUse ? item.inUse=='1' : true) && item.isShow"  :key="index">
                            <el-option :label="item[labelKey]" :value="item[valueKey]+''"></el-option>
                        </div>
                    </template>
                    <div class="nodata" v-else>
                        未找到结果
                    </div>
                </div>
            </div>
        </div>
    </el-select>
</template>
<script>
import { toPinyin } from '@/libs/utils.js'
import Loading from '@/basecomponents/Loading'
export default {
    name: 'Dropdown',
    model: {
        prop: 'value',
        event: 'change'
    },
    props: {
        ruleForm: {
            type: Object,
            default: () => {
                return {
                    input: ''
                }
            }
        },
        rightWidth: {
            type: String,
            default: '160px'
        },
        size: {
            type: String,
            default: 'small'
        },
        itemData: {
            type: Object,
            default: () => {
                return {}
            }
        },
        list: {
            type: Array,
            default: () => {
                return []
            }
        },
        labelKey: {
            type: String,
            default: ''
        },
        valueKey: {
            type: String,
            default: 'value'
        },
        inUse: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            showListLength: false,
            loading: false,
            keyWords: '',
            showList: []
        }
    },
    created() {
    },
    mounted() {
        this.dealList()
    },
    methods: {
        iconClick() {
            this.keyWords = ''
        },
        clearData() {
            this.keyWords = ''
            this.handleSearch()
        },
        click(val) {
            if (val) {
                this.$nextTick(() => {
                    if (this.$refs.searchInput) {
                        this.$refs.searchInput.$el.children[0].focus()
                    }
                })
            }
        },
        handleSearch() {
            this.showListLength = false
            let list = JSON.parse(JSON.stringify(this.baseList))
            list.forEach((item) => {
                if (item.alias.toLowerCase().replace(/\s+/g, '').indexOf(this.keyWords.toLowerCase().replace(/\s+/g, '')) != -1) {
                    item.isShow = true
                    this.showListLength = true
                } else {
                    item.isShow = false
                }
            })
            this.showList = list
        },
        doThis() {
            this.$emit('change')
        },
        dealList() {
            if (this.list.length <= 0) {
                this.baseList = []
                this.showList = []
                this.showListLength = false
            } else {
                let list = JSON.parse(JSON.stringify(this.list))
                list.forEach(element => {
                    if (!element[this.labelKey]) {
                        element[this.labelKey] = ''
                    }
                })
                this.baseList = toPinyin([].concat(list), { usekey: this.labelKey })
                this.baseList.forEach(element => {
                    element.isShow = true
                })
                this.showList = JSON.parse(JSON.stringify(this.baseList))
                this.showListLength = true
            }
        }
    },
    watch: {
        list() {
            this.dealList()
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
