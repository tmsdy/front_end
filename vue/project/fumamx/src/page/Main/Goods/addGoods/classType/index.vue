<template>
<!-- 选择商品分类 -->
    <el-dialog :title="$t('mxpcweb.PP001.PP001List.1540348093513')" v-dialogDrag :visible.sync="dialog" :closeOnClickModal="false" custom-class="width720" class="dialog" :modal-append-to-body="false">
        <div class="title" v-if="type && classTypeInUseList.length > 0">
            <!-- 最近使用： -->
            <span class="labelTitle">{{$t('mxpcweb.PP001.PP001List.1543302085668')}}</span>
            <span class="lable hoverRed ellipsis" :class="checkList == item.value?'lable1':'lable2'"
                v-for="item in classTypeInUseList.slice(classTypeInUseList.length - 3 > 0 ? classTypeInUseList.length - 3 : 0, classTypeInUseList.length)"
                :key="item.value" @click="insideUpdata(item.value)">
                {{item.label}}
            </span>
        </div>
        <div @click="hidePanel">
            <div class="search">
                <el-input class="searchValue" @click.stop v-model="searchValue" size="large" icon="search" @keyup.enter.native="getListData" @blur="getListData" :on-icon-click="getListData"></el-input>
                <!-- 快速搜索分类 -->
                <div class="searchClick hover" @click.stop="getListData">{{$t('mxpcweb.PP001.PP001List.1540348100729')}}</div>
                <div class="listBox MXscroll" id="myPanel" v-if="showList">
                    <template v-if="dataList.length > 0">
                        <div class="list text-hover" v-for="(item, index) in dataList" :key="index" @click="checkSearch(item.value)">{{item.label}}</div>
                    </template>
                    <!-- 未找到数据 -->
                    <div v-else class="nodata">{{$t('mxpcweb.PP001.PP001List.1543302086356')}}</div>
                </div>
            </div>
            <div class="contentBox">
                <list-vue ref="listVue1" :list="list1" @check="check" type="1"></list-vue>
                <list-vue ref="listVue2" :list="list2" @check="check" type="2"></list-vue>
            </div>
            <div class="footer">
                <!-- 确定 -->
                <el-button type="primary" @click="submit()" :loading="subLoading">{{$t('mxpcweb.PP001.PP001List.1543302086532')}}</el-button>
                <!-- 取消 -->
                <el-button @click="dialog = false">{{$t('mxpcweb.PP001.PP001List.1540347902374')}}</el-button>
            </div>
        </div>
    </el-dialog>
</template>

<script>
import listVue from './listVue/index'
export default {
    name: 'addSP',
    props: {
        classTypeInUseList: {
            type: Array,
            default: function () {
                return []
            }
        },
        classTypeList: {
            type: Array,
            default: function () {
                return []
            }
        },
        type: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            dialog: false,
            searchValue: '',
            dataList: [],
            listBase: [],
            list1: [],
            list2: [],
            list3: [],
            showList: false,
            checkList: '',
            subLoading: false
        }
    },
    mounted() {
    },
    created() {
    },
    methods: {
        checkSearch(value) {
            let _this = this
            if (value.length > 0) {
                if (this.$refs.listVue1) {
                    this.$refs.listVue1.updata(value[0])
                }
            }
            if (value.length > 1) {
                if (this.$refs.listVue2) {
                    setTimeout(function() {
                        _this.$refs.listVue2.updata(value[1])
                    }, 100)
                }
            }
            this.showList = false
        },
        getListData() {
            this.showList = true
            this.dataList = this.returnValue(this.searchValue)
        },
        returnValue(value) {
            if (value && value != '') {
                let list = []
                this.listBase.forEach(item1 => {
                    if (item1.display.indexOf(this.searchValue) != -1) {
                        let obj = {
                            label: [],
                            value: []
                        }
                        obj.label.push(item1.display)
                        obj.value.push(item1.catgId)
                        obj.label = obj.label.join('/')
                        list.push(obj)
                    }
                    if (item1.categoryList) {
                        item1.categoryList.forEach(item2 => {
                            if (item2.display.indexOf(this.searchValue) != -1) {
                                let obj = {
                                    label: [],
                                    value: []
                                }
                                obj.label.push(item1.display)
                                obj.label.push(item2.display)
                                obj.value.push(item1.catgId)
                                obj.value.push(item2.catgId)
                                obj.label = obj.label.join('/')
                                list.push(obj)
                            }
                            if (item2.categoryList) {
                                item2.categoryList.forEach(item3 => {
                                    if (item3.display.indexOf(this.searchValue) != -1) {
                                        let obj = {
                                            label: [],
                                            value: []
                                        }
                                        obj.label.push(item1.display)
                                        obj.label.push(item2.display)
                                        obj.label.push(item3.display)
                                        obj.value.push(item1.catgId)
                                        obj.value.push(item2.catgId)
                                        obj.value.push(item3.catgId)
                                        obj.label = obj.label.join('/')
                                        list.push(obj)
                                    }
                                })
                            }
                        })
                    }
                })
                return list
            } else {
                return []
            }
        },
        returnValue1(value) {
            if (value && value != '') {
                let list = []
                this.listBase.forEach(item1 => {
                    if (item1.catgId == value) {
                        list.push(item1.catgId)
                    } else if (item1.categoryList) {
                        item1.categoryList.forEach(item2 => {
                            if (item2.catgId == value) {
                                list.push(item1.catgId)
                                list.push(item2.catgId)
                            } else if (item2.categoryList) {
                                item2.categoryList.forEach(item3 => {
                                    if (item3.catgId == value) {
                                        list.push(item1.catgId)
                                        list.push(item2.catgId)
                                        list.push(item3.catgId)
                                    }
                                })
                            }
                        })
                    }
                })
                return list
            } else {
                return []
            }
        },
        hidePanel(event) {
            if (!this.showList) {
                return false
            }
            let sp = document.getElementById('myPanel')
            if (sp) {
                if (!sp.contains(event.target)) {
                    this.showList = false
                }
            }
        },
        submit () {
            let check1 = this.$refs.listVue1.submit()
            let check2 = this.$refs.listVue2.submit()
            let check = ''
            if (check2 != '') {
                this.listBase.forEach(element => {
                    element.categoryList.forEach(item => {
                        if (item.catgId == check2) {
                            if (item.categoryList && item.categoryList.length > 0) {
                                // 未选中最后一级大类属性
                                this.$message(this.$t('mxpcweb.PP001.PP001List.1543302119948'))
                                return false
                            } else {
                                check = check2
                            }
                        }
                    })
                })
            } else if (check1 != '') {
                this.listBase.forEach(element => {
                    if (element.catgId == check1) {
                        if (element.categoryList && element.categoryList.length > 0) {
                            // 未选中最后一级大类属性
                            this.$message(this.$t('mxpcweb.PP001.PP001List.1543302119948'))
                            return false
                        } else {
                            check = check1
                        }
                    }
                })
            }
            if (check != '') {
                if (this.type) {
                    this.$emit('selectType', check)
                    this.dialog = false
                } else {
                    this.subLoading = true
                    let _this = this
                    this.$emit('selectType', check, function() {
                        _this.subLoading = false
                        _this.dialog = false
                    })
                }
            }
        },
        insideUpdata(catgId) {
            this.checkList = catgId
            let list = this.returnValue1(this.checkList)
            this.checkSearch(list)
        },
        updata (catgId) {
            this.checkList = catgId
        },
        openWindow() {
            this.showList = false
            this.dialog = true
            let list = this.returnValue1(this.checkList)
            let _this = this
            setTimeout(function() {
                _this.checkSearch(list)
            }, 100)
        },
        check(type, list) {
            if (type == '1') {
                this.list2 = list
            }
            if (type == '2') {
                this.list3 = list
            }
            this.checkTitle()
        },
        checkTitle() {
            let check1 = this.$refs.listVue1.submit()
            let check2 = this.$refs.listVue2.submit()
            let check = ''
            if (check2 != '') {
                this.listBase.forEach(element => {
                    element.categoryList.forEach(item => {
                        if (item.catgId == check2) {
                            if (item.categoryList && item.categoryList.length > 0) {
                                return false
                            } else {
                                check = check2
                            }
                        }
                    })
                })
            } else if (check1 != '') {
                this.listBase.forEach(element => {
                    if (element.catgId == check1) {
                        if (element.categoryList && element.categoryList.length > 0) {
                            return false
                        } else {
                            check = check1
                        }
                    }
                })
            }
            if (check != '') {
                this.checkList = check
            }
        }
    },
    watch: {
        classTypeList() {
            let list = []
            this.classTypeList.forEach(item => {
                list.push(item)
            })
            this.listBase = list
            this.list1 = list
        }
    },
    components: {
        'list-vue': listVue
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
