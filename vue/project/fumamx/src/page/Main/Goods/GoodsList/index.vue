<template>
    <div class="GoodsList">
        <list v-show="pageTab == '0'" :activeId="activeId" ref="list" @pageClick="pageClick" :classTypeList="classTypeList" :classTypeInUseList="classTypeInUseList"></list>
        <add-goods :pageTab="pageTab" v-show="pageTab == '1'" ref="addGoods" @pageClick="pageClick" :classTypeList="classTypeList" :classTypeInUseList="classTypeInUseList"></add-goods>
        <edit-goods :pageTab="pageTab" v-show="pageTab == '2'" ref="editGoods" :itemData="itemData" @pageClick="pageClick" :classTypeList="classTypeList"></edit-goods>
    </div>
</template>

<script>
import list from './List/index'
import addGoods from '../addGoods/index'
import editGoods from '../editGoods/index'
export default {
    name: 'GoodsList',
    props: {
        activeId: {
            type: String,
            default: ''
        },
        rootData: {
            type: Array,
            default: function () {
                return []
            }
        }
    },
    data() {
        return {
            pageTab: '0',
            classTypeList: [],
            pageUrl: '',
            classTypeInUseList: [],
            itemData: {}
        }
    },
    created() {
        this.pageUrl = this.$route.path
        this.getTypeList()
    },
    mounted() {
        this.returnOptions()
    },
    methods: {
        returnOptions() {
            if (this.rootData.length > 0) {
                this.classTypeInUseList = this.transData(this.rootData)
            }
        },
        transData(dataList) {
            let list = []
            dataList.forEach(item1 => {
                if (item1.categoryList && item1.categoryList.length > 0) {
                    item1.categoryList.forEach(item2 => {
                        if (item2.categoryList && item2.categoryList.length > 0) {
                            item2.categoryList.forEach(item3 => {
                                let obj = {
                                    label: [],
                                    value: ''
                                }
                                obj.label.push(item1.display)
                                obj.label.push(item2.display)
                                obj.label.push(item3.display)
                                obj.value = item3.catgId + ''
                                obj.label = obj.label.join('/')
                                list.push(obj)
                            })
                        } else {
                            let obj = {
                                label: [],
                                value: ''
                            }
                            obj.label.push(item1.display)
                            obj.label.push(item2.display)
                            obj.value = item2.catgId + ''
                            obj.label = obj.label.join('/')
                            list.push(obj)
                        }
                    })
                } else {
                    let obj = {
                        label: [],
                        value: ''
                    }
                    obj.label.push(item1.display)
                    obj.value = item1.catgId + ''
                    obj.label = obj.label.join('/')
                    list.push(obj)
                }
            })
            return list
        },
        getTypeList() {
            let _this = this
            _this.$http.get(
                this.Global.baseURL + this.Global.api.v2.document_product_category,
                { params: { type: 'configList' } }
            ).then((res) => {
                    if (res.body.code.toString() == _this.Global.RES_OK) {
                        _this.classTypeList = res.body.data.list
                    } else {
                        _this.$message.error(_this.msg(res.body))
                    }
            }, (res) => {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },
        pageClick(index, item) {
            this.pageTab = index
            if (index == '1') {
                this.$refs.addGoods.clearData()
                if (item) {
                    this.$refs.addGoods.open(item)
                }
            }
            if (index == '2') {
                this.$refs.editGoods.open(item)
            }
            if (index == '0') {
                this.$refs.list.getListData()
            }
        }
    },
    watch: {
        $route(val, old) {
            if (val.path === this.pageUrl) {
                this.pageTab = '0'
            }
        },
        rootData() {
            this.returnOptions()
        }
    },
    components: {
        'list': list,
        'add-goods': addGoods,
        'edit-goods': editGoods
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
